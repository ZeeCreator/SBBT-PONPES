import { getDatabase } from 'firebase-admin/database'
import { generateId, rtdbGetList, rtdbAdd } from './firebase'

// ── Types ──

interface WaSettings {
  provider: string
  apiKey: string
  endpointUrl: string
  webhookSecret: string
  isActive: boolean
  senderName: string
  dailyLimit: number
  deviceId: string
  sessionId: string
  baseUrl: string
}

interface SendResult {
  success: boolean
  messageId?: string
  error?: string
}

interface ProviderSendParams {
  apiKey: string
  phone: string
  message: string
  senderName?: string
  baseUrl?: string
  deviceId?: string
  sessionId?: string
  mediaUrl?: string
  mediaType?: string
}

interface ProviderConfigField {
  key: string
  label: string
  type: 'text' | 'password' | 'url' | 'number'
  required: boolean
  placeholder?: string
  helpText?: string
}

interface WaProviderDef {
  id: string
  label: string
  description: string
  docsUrl?: string
  configFields: ProviderConfigField[]
  send(params: ProviderSendParams): Promise<SendResult>
}

// ── Provider Registry ──

const providers: Record<string, WaProviderDef> = {}

function defineProvider(p: WaProviderDef) {
  providers[p.id] = p
}

export function getProvider(id: string): WaProviderDef | null {
  return providers[id] || null
}

export function listProviders(): Omit<WaProviderDef, 'send'>[] {
  return Object.values(providers).map(({ send, ...rest }) => rest)
}

// ── Fonnte Provider ──

defineProvider({
  id: 'fonnte',
  label: 'Fonnte',
  description: 'WA Gateway populer di Indonesia, support serverless',
  docsUrl: 'https://docs.fonnte.com',
  configFields: [
    { key: 'apiKey', label: 'API Token', type: 'password', required: true, placeholder: 'Masukkan token dari dashboard Fonnte', helpText: 'Dapatkan dari menu Settings > Token di dashboard Fonnte' },
  ],
  async send({ apiKey, phone, message, mediaUrl }): Promise<SendResult> {
    try {
      const body: Record<string, string> = { target: phone, message, delay: '0' }
      if (mediaUrl) body.url = mediaUrl
      const res = await $fetch<{ status: boolean; id?: string; reason?: string }>('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(body).toString(),
      })
      if (res.status) return { success: true, messageId: res.id }
      return { success: false, error: res.reason || 'Gagal mengirim via Fonnte' }
    } catch (e: any) {
      return { success: false, error: e.message || 'Gagal mengirim via Fonnte' }
    }
  },
})

// ── Flowkirim Provider (session-based) ──

defineProvider({
  id: 'flowkirim',
  label: 'Flowkirim',
  description: 'WA Gateway session-based, scan QR via dashboard',
  docsUrl: 'https://flowkirim.com',
  configFields: [
    { key: 'apiKey', label: 'API Token (Bearer)', type: 'password', required: true, placeholder: 'Masukkan token dari dashboard Flowkirim', helpText: 'Dapatkan dari menu Settings > Token API' },
    { key: 'deviceId', label: 'Device ID', type: 'text', required: true, placeholder: 'flowkirim-xxxxxxxx', helpText: 'ID perangkat dari halaman Perangkat di dashboard Flowkirim' },
  ],
  async send({ apiKey, phone, message, deviceId, mediaUrl, mediaType }): Promise<SendResult> {
    try {
      if (!deviceId) return { success: false, error: 'Device ID belum dikonfigurasi' }

      const BASE = 'https://scan.flowkirim.com'
      const headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }

      // 1. Get session_id
      const sessionRes = await $fetch<{ success: boolean; data?: { session_id: string }; message?: string }>(
        `${BASE}/api/whatsapp/sessions/${deviceId}`,
        { method: 'GET', headers }
      )

      if (!sessionRes.success || !sessionRes.data?.session_id) {
        return { success: false, error: sessionRes.message || 'Gagal mendapatkan session Flowkirim. Pastikan perangkat sudah scan QR.' }
      }

      const sessionId = sessionRes.data.session_id
      const to = `${phone}@s.whatsapp.net`

      // 2. Send with media if provided
      if (mediaUrl) {
        const isImage = mediaType?.startsWith('image/')
        const isVideo = mediaType?.startsWith('video/')
        const endpoint = isImage ? 'image' : isVideo ? 'video' : 'file'
        const body: Record<string, string> = { session_id: sessionId, to }
        if (isImage || isVideo) {
          body.url = mediaUrl
          body.caption = message
        } else {
          body.url = mediaUrl
          body.caption = message
        }
        const sendRes = await $fetch<{ success: boolean; data?: { message_id: string }; message?: string }>(
          `${BASE}/api/whatsapp/messages/${endpoint}`,
          { method: 'POST', headers, body }
        )
        if (sendRes.success && sendRes.data?.message_id) {
          return { success: true, messageId: sendRes.data.message_id }
        }
        return { success: false, error: sendRes.message || 'Gagal mengirim media via Flowkirim' }
      }

      // 3. Send text message
      const sendRes = await $fetch<{ success: boolean; data?: { id: number; message_id: string; status: string }; message?: string }>(
        `${BASE}/api/whatsapp/messages/text`,
        {
          method: 'POST',
          headers,
          body: { session_id: sessionId, to, message },
        }
      )

      if (sendRes.success && sendRes.data?.message_id) {
        return { success: true, messageId: sendRes.data.message_id }
      }
      return { success: false, error: sendRes.message || 'Gagal mengirim via Flowkirim' }
    } catch (e: any) {
      return { success: false, error: e.message || 'Gagal mengirim via Flowkirim' }
    }
  },
})

// ── WhatsApp Cloud API Provider ──

defineProvider({
  id: 'whatsapp_cloud',
  label: 'WhatsApp Cloud API (Meta)',
  description: 'Official API dari Meta, memerlukan WhatsApp Business Account',
  docsUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
  configFields: [
    { key: 'apiKey', label: 'Access Token', type: 'password', required: true, placeholder: 'Permanent Access Token dari Meta', helpText: 'Buat di Meta Developers > WhatsApp > API Setup' },
    { key: 'endpointUrl', label: 'Phone Number ID URL', type: 'url', required: true, placeholder: 'https://graph.facebook.com/v22.0/PHONE_NUMBER_ID/messages', helpText: 'Ganti PHONE_NUMBER_ID dengan ID nomor WhatsApp Anda' },
  ],
  async send({ apiKey, phone, message, endpointUrl, mediaUrl, mediaType }): Promise<SendResult> {
    if (!endpointUrl) return { success: false, error: 'Phone Number ID URL belum dikonfigurasi' }
    try {
      const body: Record<string, any> = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
      }
      if (mediaUrl) {
        const isImage = mediaType?.startsWith('image/')
        const isVideo = mediaType?.startsWith('video/')
        const isDoc = !isImage && !isVideo
        if (isImage) {
          body.type = 'image'
          body.image = { link: mediaUrl, caption: message }
        } else if (isVideo) {
          body.type = 'video'
          body.video = { link: mediaUrl, caption: message }
        } else {
          const ext = mediaType?.split('/').pop() || 'unknown'
          const filename = `file.${ext === 'octet-stream' ? 'bin' : ext}`
          body.type = 'document'
          body.document = { link: mediaUrl, caption: message, filename }
        }
      } else {
        body.type = 'text'
        body.text = { body: message }
      }
      const res = await $fetch<{ error?: any; messages?: { id: string }[] }>(endpointUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body,
      })
      if (res.messages?.[0]?.id) return { success: true, messageId: res.messages[0].id }
      return { success: false, error: res.error?.message || 'Gagal mengirim via WhatsApp Cloud API' }
    } catch (e: any) {
      return { success: false, error: e.message || 'Gagal mengirim via WhatsApp Cloud API' }
    }
  },
})

// ── Custom / Generic Provider ──

defineProvider({
  id: 'custom',
  label: 'Custom / Lainnya',
  description: 'Provider WA Gateway kustom dengan endpoint sendiri',
  docsUrl: '',
  configFields: [
    { key: 'endpointUrl', label: 'Endpoint URL', type: 'url', required: true, placeholder: 'https://example.com/api/send-wa', helpText: 'URL endpoint untuk mengirim pesan' },
    { key: 'apiKey', label: 'API Key / Token', type: 'password', required: true, placeholder: 'API Key dari provider', helpText: 'Akan dikirim sebagai header Authorization: Bearer {token}' },
    { key: 'senderName', label: 'Nama Pengirim', type: 'text', required: false, placeholder: 'Opsional, sesuaikan dengan format provider' },
  ],
  async send({ apiKey, phone, message, senderName, endpointUrl, mediaUrl, mediaType }): Promise<SendResult> {
    if (!endpointUrl) return { success: false, error: 'Endpoint URL belum dikonfigurasi' }
    try {
      const body: Record<string, any> = {
        to: phone,
        number: phone,
        target: phone,
        phone,
        message,
        text: message,
        sender: senderName,
        ...(senderName ? { sender: senderName } : {}),
        ...(mediaUrl ? { media_url: mediaUrl, media_type: mediaType } : {}),
      }

      const res = await $fetch<Record<string, any>>(endpointUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body,
      })

      const messageId = res.message_id || res.id || res.data?.id || res.messageId || ''
      const err = res.error || res.reason || res.message || res.msg || ''
      const ok = res.status === true || res.success === true || res.status === 200 || res.code === 200 || !!messageId

      return ok
        ? { success: true, messageId: String(messageId) }
        : { success: false, error: err || 'Gagal mengirim via provider kustom' }
    } catch (e: any) {
      return { success: false, error: e.message || 'Gagal mengirim via provider kustom' }
    }
  },
})

// ── Zero Gateway Provider (OpenWA) ──

defineProvider({
  id: 'zerogateway',
  label: 'Zero Gateway (OpenWA)',
  description: 'Zero Gateway WhatsApp API berbasis OpenWA, menggunakan Session ID dan API Key',
  docsUrl: 'https://zero-gateway.zerowebsite.eu.org/api/docs',
  configFields: [
    { key: 'baseUrl', label: 'Base URL API', type: 'url', required: true, placeholder: 'https://zero-gateway.zerowebsite.eu.org/api', helpText: 'URL base Zero Gateway API' },
    { key: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'owa_k1_...', helpText: 'API key dari dashboard Zero Gateway' },
    { key: 'sessionId', label: 'Session ID', type: 'text', required: true, placeholder: '7ca4cbca-1718-439e-bb9b-ec2c07d36277', helpText: 'ID sesi WhatsApp yang aktif di Zero Gateway' },
  ],
  async send({ apiKey, phone, message, mediaUrl, mediaType, baseUrl, sessionId }): Promise<SendResult> {
    try {
      const gatewayBase = (baseUrl || '').replace(/\/+$/, '')
      if (!gatewayBase) return { success: false, error: 'Base URL belum dikonfigurasi' }
      if (!sessionId) return { success: false, error: 'Session ID belum dikonfigurasi' }

      const headers: Record<string, string> = {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      }

      const to = phone.startsWith('62') ? phone : phone.startsWith('+62') ? phone : `62${phone.replace(/^0/, '')}`

      if (mediaUrl) {
        const isImage = mediaType?.startsWith('image/')
        const isVideo = mediaType?.startsWith('video/')
        const endpoint = isImage ? 'send-image' : isVideo ? 'send-video' : 'send-document'
        const body: Record<string, any> = { chatId: `${to}@c.us`, url: mediaUrl }
        if (isImage || isVideo) body.caption = message
        else body.filename = message
        const res = await $fetch<{ success?: boolean; message?: string; data?: { id?: string } }>(
          `${gatewayBase}/sessions/${sessionId}/messages/${endpoint}`,
          { method: 'POST', headers, body }
        )
        if (res.success && res.data?.id) return { success: true, messageId: res.data.id }
        return { success: false, error: res.message || 'Gagal mengirim media via Zero Gateway' }
      }

      const res = await $fetch<{ success?: boolean; message?: string; data?: { id?: string } }>(
        `${gatewayBase}/sessions/${sessionId}/messages/send-text`,
        { method: 'POST', headers, body: { chatId: `${to}@c.us`, text: message } }
      )
      if (res.success && res.data?.id) return { success: true, messageId: res.data.id }
      return { success: false, error: res.message || 'Gagal mengirim via Zero Gateway' }
    } catch (e: any) {
      return { success: false, error: e.message || 'Gagal mengirim via Zero Gateway' }
    }
  },
})

// ── Core Functions ──

function normalizePhone(phone: string): string {
  let p = phone.replace(/[^0-9]/g, '')
  if (p.startsWith('0')) p = '62' + p.slice(1)
  if (p.startsWith('+')) p = p.slice(1)
  if (!p.startsWith('62')) p = '62' + p
  return p
}

export async function getWaSettings(): Promise<WaSettings> {
  const db = getDatabase()
  const snap = await db.ref('wa_gateway/settings').once('value')
  if (snap.exists()) return snap.val() as WaSettings
  return {
    provider: 'zerogateway',
    apiKey: '',
    endpointUrl: '',
    webhookSecret: '',
    isActive: false,
    senderName: 'PONPES SBBT',
    dailyLimit: 500,
    deviceId: '',
    sessionId: '',
    baseUrl: 'https://zero-gateway.zerowebsite.eu.org/api',
  }
}

export async function saveWaSettings(data: Partial<WaSettings>): Promise<void> {
  const db = getDatabase()
  await db.ref('wa_gateway/settings').update(data)
}

function getEffectiveApiKey(settings: WaSettings): string {
  return process.env.WA_GATEWAY_API_KEY || settings.apiKey || ''
}

export async function sendWaMessage(
  phone: string,
  message: string,
  options?: { delay?: number; mediaUrl?: string; mediaType?: string }
): Promise<SendResult> {
  const settings = await getWaSettings()
  if (!settings.isActive) return { success: false, error: 'WA Gateway tidak aktif' }

  const apiKey = getEffectiveApiKey(settings)
  if (!apiKey) return { success: false, error: 'API Key belum dikonfigurasi' }

  const phoneNormalized = normalizePhone(phone)
  if (phoneNormalized.length < 10) return { success: false, error: 'Nomor telepon tidak valid' }

  const provider = getProvider(settings.provider)
  if (!provider) return { success: false, error: `Provider "${settings.provider}" tidak dikenali` }

  return provider.send({
    apiKey,
    phone: phoneNormalized,
    message,
    senderName: settings.senderName,
    baseUrl: settings.baseUrl,
    deviceId: settings.deviceId,
    sessionId: settings.sessionId,
    mediaUrl: options?.mediaUrl,
    mediaType: options?.mediaType,
  })
}

export async function sendWaBulk(
  recipients: { phone: string; message: string; mediaUrl?: string; mediaType?: string }[],
  sentBy: { uid: string; name: string },
  options?: { delayMs?: number }
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0
  let failed = 0
  const errors: string[] = []
  const delay = options?.delayMs || 2000

  for (let i = 0; i < recipients.length; i++) {
    const r = recipients[i]
    const result = await sendWaMessage(r.phone, r.message, { mediaUrl: r.mediaUrl, mediaType: r.mediaType })
    if (result.success) {
      success++
      await logWaMessage({
        phone: r.phone,
        message: r.message,
        status: 'sent',
        type: 'broadcast',
        sentBy: sentBy.uid,
        sentByName: sentBy.name,
        messageId: result.messageId,
      })
    } else {
      failed++
      errors.push(`${r.phone}: ${result.error}`)
      await logWaMessage({
        phone: r.phone,
        message: r.message,
        status: 'failed',
        type: 'broadcast',
        sentBy: sentBy.uid,
        sentByName: sentBy.name,
        error: result.error,
      })
    }
    if (i < recipients.length - 1 && delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  return { success, failed, errors }
}

export async function logWaMessage(data: {
  phone: string
  message: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  type: 'single' | 'broadcast'
  sentBy: string
  sentByName: string
  messageId?: string
  error?: string
  templateId?: string
  templateName?: string
  mediaUrl?: string
  mediaType?: string
}): Promise<void> {
  const db = getDatabase()
  const id = generateId()
  await db.ref(`wa_gateway/messages/${id}`).set({
    ...data,
    createdAt: new Date().toISOString(),
  })
}

export async function getWaMessages(query?: {
  status?: string
  type?: string
  dateFrom?: string
  dateTo?: string
  phone?: string
}): Promise<any[]> {
  let items = await rtdbGetList('wa_gateway/messages')
  items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (query?.status) items = items.filter((i: any) => i.status === query.status)
  if (query?.type) items = items.filter((i: any) => i.type === query.type)
  if (query?.phone) items = items.filter((i: any) => i.phone?.includes(query.phone))
  if (query?.dateFrom) items = items.filter((i: any) => new Date(i.createdAt) >= new Date(query.dateFrom!))
  if (query?.dateTo) items = items.filter((i: any) => new Date(i.createdAt) <= new Date(query.dateTo!))

  return items
}

export async function getWaLogsFromGateway(query?: {
  status?: string
  type?: string
  dateFrom?: string
  dateTo?: string
  phone?: string
}): Promise<any[]> {
  const settings = await getWaSettings()
  if (!settings.sessionId || !settings.apiKey || !settings.baseUrl) return []

  const baseUrl = settings.baseUrl.replace(/\/+$/, '')
  const headers = { 'X-API-Key': settings.apiKey }

  try {
    const res = await $fetch<{ success?: boolean; data?: any[]; message?: string }>(
      `${baseUrl}/sessions/${settings.sessionId}/messages`,
      { headers }
    )
    if (!res.success || !res.data) return []

    let items = res.data as any[]

    if (query?.status) items = items.filter((i: any) => i.status === query.status)
    if (query?.type) items = items.filter((i: any) => i.type === query.type)
    if (query?.phone) items = items.filter((i: any) => i.phone?.includes(query.phone))
    if (query?.dateFrom) items = items.filter((i: any) => new Date(i.createdAt) >= new Date(query.dateFrom!))
    if (query?.dateTo) items = items.filter((i: any) => new Date(i.createdAt) <= new Date(query.dateTo!))

    return items
  } catch {
    return []
  }
}

export async function getWaTemplates(): Promise<any[]> {
  return rtdbGetList('wa_gateway/templates')
}

export async function saveWaTemplate(data: {
  name: string
  label: string
  category: string
  body: string
  variables: string[]
}): Promise<any> {
  return rtdbAdd('wa_gateway/templates', {
    ...data,
    createdAt: new Date().toISOString(),
  })
}

export async function updateWaTemplate(id: string, data: any): Promise<void> {
  const db = getDatabase()
  const { id: _storedId, ...clean } = data
  await db.ref(`wa_gateway/templates/${id}`).update(clean)
}

export async function deleteWaTemplate(id: string): Promise<void> {
  const db = getDatabase()
  await db.ref(`wa_gateway/templates/${id}`).remove()
}

export async function getWaStats(): Promise<{
  totalSent: number
  totalDelivered: number
  totalFailed: number
  todaySent: number
  activeTemplates: number
  provider: string
  isActive: boolean
}> {
  const settings = await getWaSettings()
  const messages = await rtdbGetList('wa_gateway/messages')
  const templates = await rtdbGetList('wa_gateway/templates')
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const totalSent = messages.filter((m: any) => m.status === 'sent' || m.status === 'delivered' || m.status === 'read').length
  const totalDelivered = messages.filter((m: any) => m.status === 'delivered' || m.status === 'read').length
  const totalFailed = messages.filter((m: any) => m.status === 'failed').length
  const todaySent = messages.filter((m: any) => new Date(m.createdAt) >= today).length
  const activeTemplates = templates.length

  return { totalSent, totalDelivered, totalFailed, todaySent, activeTemplates, provider: settings.provider, isActive: settings.isActive }
}

export async function getWaSessionInfo(): Promise<{ status: string; qr?: string; phone?: string; name?: string } | null> {
  const settings = await getWaSettings()
  if (!settings.sessionId || !settings.apiKey || !settings.baseUrl) return null

  const baseUrl = settings.baseUrl.replace(/\/+$/, '')
  const headers = { 'X-API-Key': settings.apiKey }

  try {
    const res = await $fetch<{ success?: boolean; data?: any; message?: string }>(
      `${baseUrl}/sessions/${settings.sessionId}`,
      { headers }
    )
    if (res.success && res.data) {
      return {
        status: res.data.status || 'unknown',
        qr: res.data.qr || null,
        phone: res.data.phone || null,
        name: res.data.name || null,
      }
    }
    return null
  } catch {
    return null
  }
}

export async function processWaWebhook(body: any): Promise<void> {
  const db = getDatabase()
  const id = generateId()

  await db.ref(`wa_gateway/webhook_logs/${id}`).set({
    ...body,
    processed: true,
    createdAt: new Date().toISOString(),
  })

  if (body.id && body.status) {
    const messages = await rtdbGetList('wa_gateway/messages')
    const matched = messages.find((m: any) => m.messageId === body.id)
    if (matched) {
      await db.ref(`wa_gateway/messages/${matched.id}`).update({
        status: body.status,
        deliveredAt: new Date().toISOString(),
      })
    }
  }
}

export function parseTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/{{(\w+)}}/g, (_, key) => variables[key] || `{{${key}}}`)
}

export const WA_CATEGORIES = [
  { value: 'keuangan', label: 'Keuangan', icon: 'payments' },
  { value: 'akademik', label: 'Akademik', icon: 'school' },
  { value: 'absensi', label: 'Absensi', icon: 'calendar_month' },
  { value: 'tahfidz', label: 'Tahfidz', icon: 'menu_book' },
  { value: 'pengumuman', label: 'Pengumuman', icon: 'campaign' },
  { value: 'izin', label: 'Izin Santri', icon: 'passport' },
  { value: 'mutasi', label: 'Mutasi', icon: 'swap_horiz' },
  { value: 'kegiatan', label: 'Kegiatan', icon: 'sports_kabaddi' },
  { value: 'kesehatan', label: 'Kesehatan', icon: 'medical_services' },
  { value: 'lainnya', label: 'Lainnya', icon: 'more_horiz' },
]

export const DEFAULT_TEMPLATES = [
  {
    name: 'spp-tagihan',
    label: 'Tagihan SPP',
    category: 'keuangan',
    body: 'Yth. {{nama_wali}}\n\nAnanda {{nama_santri}} memiliki tagihan SPP bulan {{bulan}} sebesar Rp{{jumlah}}.\n\nSilakan melakukan pembayaran sebelum tanggal {{tanggal_jatuh_tempo}}.\n\nInformasi lebih lanjut hubungi bendahara.\n\nJazakumullah khairan.\n\n- {{nama_pondok}}',
    variables: ['nama_wali', 'nama_santri', 'bulan', 'jumlah', 'tanggal_jatuh_tempo', 'nama_pondok'],
  },
  {
    name: 'spp-lunas',
    label: 'Pembayaran SPP Lunas',
    category: 'keuangan',
    body: 'Yth. {{nama_wali}}\n\nPembayaran SPP bulan {{bulan}} atas nama {{nama_santri}} sebesar Rp{{jumlah}} telah kami terima.\n\nTerima kasih.\n\n- {{nama_pondok}}',
    variables: ['nama_wali', 'nama_santri', 'bulan', 'jumlah', 'nama_pondok'],
  },
  {
    name: 'izin-keluar',
    label: 'Izin Keluar Santri',
    category: 'izin',
    body: 'Yth. {{nama_wali}}\n\nAnanda {{nama_santri}} mengajukan izin keluar pondok pada:\nTanggal: {{tanggal}}\nJam: {{jam}}\nKeperluan: {{keperluan}}\n\nMohon konfirmasi jika ada perubahan.\n\n- {{nama_pondok}}',
    variables: ['nama_wali', 'nama_santri', 'tanggal', 'jam', 'keperluan', 'nama_pondok'],
  },
  {
    name: 'absensi-alpha',
    label: 'Notifikasi Absensi',
    category: 'absensi',
    body: 'Yth. {{nama_wali}}\n\nAnanda {{nama_santri}} tidak hadir pada kegiatan {{kegiatan}} hari {{hari}}, {{tanggal}}.\n\nMohon konfirmasi ke bagian kesantrian.\n\n- {{nama_pondok}}',
    variables: ['nama_wali', 'nama_santri', 'kegiatan', 'hari', 'tanggal', 'nama_pondok'],
  },
  {
    name: 'nilai-ujian',
    label: 'Hasil Ujian',
    category: 'akademik',
    body: 'Yth. {{nama_wali}}\n\nBerikut nilai ujian {{nama_ujian}} ananda {{nama_santri}}:\n{{daftar_nilai}}\n\nRata-rata: {{rata_rata}}\n\nTetap semangat!\n\n- {{nama_pondok}}',
    variables: ['nama_wali', 'nama_santri', 'nama_ujian', 'daftar_nilai', 'rata_rata', 'nama_pondok'],
  },
  {
    name: 'tahfidz-perkembangan',
    label: 'Perkembangan Tahfidz',
    category: 'tahfidz',
    body: 'Yth. {{nama_wali}}\n\nPerkembangan tahfidz ananda {{nama_santri}}:\nHafalan baru: {{hafalan_baru}}\nMurojaah: {{murojaah}}\nJuz: {{juz}}\n\nCatatan: {{catatan}}\n\n- {{nama_pondok}}',
    variables: ['nama_wali', 'nama_santri', 'hafalan_baru', 'murojaah', 'juz', 'catatan', 'nama_pondok'],
  },
  {
    name: 'pengumuman-umum',
    label: 'Pengumuman Umum',
    category: 'pengumuman',
    body: 'Yth. {{nama_wali}}\n\n{{isi_pengumuman}}\n\nDemikian informasi ini disampaikan.\n\n- {{nama_pondok}}',
    variables: ['nama_wali', 'isi_pengumuman', 'nama_pondok'],
  },
  {
    name: 'tagihan-lain',
    label: 'Tagihan Lainnya',
    category: 'keuangan',
    body: 'Yth. {{nama_wali}}\n\nAnanda {{nama_santri}} memiliki tagihan {{jenis_tagihan}} sebesar Rp{{jumlah}}.\n\nSilakan melakukan pembayaran sebelum {{tanggal_jatuh_tempo}}.\n\n- {{nama_pondok}}',
    variables: ['nama_wali', 'nama_santri', 'jenis_tagihan', 'jumlah', 'tanggal_jatuh_tempo', 'nama_pondok'],
  },
  {
    name: 'mutasi-kelas',
    label: 'Mutasi Kelas',
    category: 'mutasi',
    body: 'Yth. {{nama_wali}}\n\nDiberitahukan bahwa ananda {{nama_santri}} telah dimutasi dari kelas {{kelas_lama}} ke kelas {{kelas_baru}}.\n\nAlasan: {{alasan}}\n\n- {{nama_pondok}}',
    variables: ['nama_wali', 'nama_santri', 'kelas_lama', 'kelas_baru', 'alasan', 'nama_pondok'],
  },
  {
    name: 'kegiatan-ekstra',
    label: 'Informasi Kegiatan Ekstrakurikuler',
    category: 'kegiatan',
    body: 'Yth. {{nama_wali}}\n\nAnanda {{nama_santri}} akan mengikuti kegiatan {{nama_kegiatan}} pada:\nHari: {{hari}}\nJam: {{jam}}\nTempat: {{tempat}}\n\nMohon dukungannya.\n\n- {{nama_pondok}}',
    variables: ['nama_wali', 'nama_santri', 'nama_kegiatan', 'hari', 'jam', 'tempat', 'nama_pondok'],
  },
]

export async function seedDefaultTemplates(): Promise<void> {
  const existing = await getWaTemplates()
  if (existing.length > 0) return

  for (const tpl of DEFAULT_TEMPLATES) {
    await saveWaTemplate(tpl)
  }
}
