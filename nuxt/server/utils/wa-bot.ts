import { getDatabase } from 'firebase-admin/database'
import { sendWaMessage } from './wa-gateway'
import { rtdbGetList } from './firebase'

const QDRANT_URL = 'https://7253ae62-9eb9-464a-85b8-3d9c9bd03bfe.eu-central-1-0.aws.cloud.qdrant.io'
const QDRANT_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwic3ViamVjdCI6ImFwaS1rZXk6MjY3MDY3NjYtNDkwOC00ZDBkLTk4NTMtMjQ2OGNlZWMzZjM4In0.pJ-8AnVJ0zcQ80EodA8VZ6rU5wQMipZIPLsb81vmSP8'
const COLLECTION = '7253ae62-9eb9-464a-85b8-3d9c9bd03bfe'
const DEFAULT_AI_URL = 'https://apifreellm.com/api/v1/chat'
const DEFAULT_AI_KEY = 'apf_h6266kocollosiu76f469ryj'

async function getAiConfig(): Promise<{ url: string; key: string; model?: string; provider?: string }> {
  const db = getDatabase()
  const snap = await db.ref('wa_gateway/bot_settings/ai').once('value')
  if (snap.exists()) return snap.val()
  return { url: DEFAULT_AI_URL, key: DEFAULT_AI_KEY, model: '', provider: 'apifreellm' }
}

// ── Qdrant ──

export async function initQdrantCollection(): Promise<void> {
  const exists = await $fetch(`${QDRANT_URL}/collections/${COLLECTION}`, {
    method: 'GET',
    headers: { 'api-key': QDRANT_API_KEY },
  }).then(() => true).catch(() => false)

  if (exists) return

  await $fetch(`${QDRANT_URL}/collections/${COLLECTION}`, {
    method: 'PUT',
    headers: { 'api-key': QDRANT_API_KEY, 'Content-Type': 'application/json' },
    body: { vectors: { size: 384, distance: 'Cosine' } },
  })
}

export async function syncStudentsToQdrant(): Promise<number> {
  await initQdrantCollection()
  const students = await rtdbGetList('students')
  let count = 0

  for (const s of students) {
    const payload = {
      firebaseId: s.id,
      name: s.name || '',
      nis: s.nis || '',
      className: s.class || '',
      classId: s.classId || '',
      gender: s.gender || '',
      status: s.status || '',
      parentName: s.parentName || '',
      parentPhone: s.parentPhone || '',
    }

    await $fetch(`${QDRANT_URL}/collections/${COLLECTION}/points`, {
      method: 'PUT',
      headers: { 'api-key': QDRANT_API_KEY, 'Content-Type': 'application/json' },
      body: { points: [{ id: count + 1, vector: new Array(384).fill(0), payload }] },
    })
    count++
  }

  return count
}

// ── Firebase Student Search ──

async function searchStudentsFromFirebase(query: string): Promise<any[]> {
  const all = await rtdbGetList('students')
  const q = query.toLowerCase().trim()
  return all.filter((s: any) =>
    (s.name && s.name.toLowerCase().includes(q)) ||
    (s.nis && s.nis.toLowerCase().includes(q)) ||
    (s.parentName && s.parentName.toLowerCase().includes(q))
  ).slice(0, 5)
}

// ── Attendance from attendance_monthly ──

async function getAttendanceSummary(studentId: string, studentName: string): Promise<string> {
  const db = getDatabase()
  const snap = await db.ref('attendance_monthly').once('value')
  if (!snap.exists()) return 'Belum ada data absensi.'

  let totalHadir = 0, totalIzin = 0, totalSakit = 0, totalAlpha = 0
  let totalDays = 0

  for (const entry of Object.values(snap.val()) as any[]) {
    const records = entry.records || []
    const found = records.find((r: any) => r.studentId === studentId || r.name === studentName)
    if (!found || !found.marks) continue
    for (const day of Object.values(found.marks) as string[]) {
      totalDays++
      if (day === 'present') totalHadir++
      else if (day === 'permit') totalIzin++
      else if (day === 'sick') totalSakit++
      else if (day === 'absent') totalAlpha++
    }
  }

  if (totalDays === 0) return 'Belum ada data absensi.'
  return `Hadir ${totalHadir}, Izin ${totalIzin}, Sakit ${totalSakit}, Alpha ${totalAlpha} (dari ${totalDays} hari)`
}

// ── Grades from grades/ ──

async function getGradesSummary(studentId: string): Promise<string> {
  const db = getDatabase()
  const snap = await db.ref('grades').orderByChild('studentId').equalTo(studentId).once('value')
  if (!snap.exists()) return 'Belum ada data nilai.'

  const records = Object.values(snap.val()) as any[]
  const grouped: Record<string, { scores: number[]; semester: string; year: string }> = {}

  for (const r of records) {
    const key = `${r.subject || '?'}`
    if (!grouped[key]) grouped[key] = { scores: [], semester: r.semester || '', year: r.academicYear || '' }
    if (typeof r.score === 'number') grouped[key].scores.push(r.score)
  }

  const lines = Object.entries(grouped).map(([subject, data]) => {
    const avg = data.scores.length ? (data.scores.reduce((a, b) => a + b, 0) / data.scores.length).toFixed(0) : '-'
    return `${subject}: ${avg} (${data.semester} ${data.year})`
  })

  return lines.join('\n')
}

// ── AI ──

function buildDirectReply(message: string, students: any[]): string {
  if (students.length === 0) {
    return 'Maaf, tidak ditemukan data santri dengan nama/NIS tersebut. Ketik nama atau NIS untuk mencari.'
  }

  let reply = `Ditemukan ${students.length} santri:\n\n`
  for (const s of students) {
    reply += `• ${s.name} (NIS: ${s.nis})\n  Kelas: ${s.class || '-'}\n  Status: ${s.status || 'Active'}\n`
  }
  reply += '\nKetik nama lengkap untuk detail absensi dan nilai.'
  return reply
}

function buildDetailReply(students: any[], absensi: string, nilai: string): string {
  const s = students[0]
  let reply = `Data ${s.name} (NIS: ${s.nis}):\n\n`
  reply += `Absensi: ${absensi}\n\n`
  if (nilai && nilai !== 'Belum ada data nilai.') {
    reply += `Nilai:\n${nilai}`
  } else {
    reply += 'Nilai: Belum ada data.'
  }
  return reply
}

export async function callAI(message: string, context: string): Promise<string | null> {
  try {
    const ai = await getAiConfig()
    if (!ai.key || !ai.url) return null

    const prompt = context
      ? `Kamu adalah asisten pondok pesantren. Gunakan data berikut untuk menjawab:\n\n${context}\n\nPertanyaan: ${message}\n\nJawab dengan ramah dan informatif dalam Bahasa Indonesia. Jika data tidak ditemukan, beritahu user.`
      : `Kamu adalah asisten pondok pesantren. Jawab pertanyaan user dengan ramah dalam Bahasa Indonesia.\n\nPertanyaan: ${message}`

    const isOpenAI = ai.url.includes('openrouter') || ai.url.includes('openai') || ai.provider === 'openai' || ai.provider === 'openrouter'

    if (isOpenAI) {
      const url = ai.url.includes('/chat/completions') ? ai.url : `${ai.url.replace(/\/+$/, '')}/chat/completions`
      const res = await $fetch<{ choices?: { message?: { content?: string } }[]; error?: { message?: string } }>(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${ai.key}`, 'Content-Type': 'application/json' },
        body: { model: ai.model || 'google/gemma-4-26b-a4b-it:free', messages: [{ role: 'user', content: prompt }] },
        timeout: 20000,
      })
      const content = res.choices?.[0]?.message?.content
      if (content) return content
      console.error('[AI] OpenAI error:', res.error?.message)
      return null
    }

    const res = await $fetch<{ success: boolean; response?: string; error?: string }>(ai.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ai.key}`, 'Content-Type': 'application/json' },
      body: { message: prompt },
      timeout: 15000,
    })

    if (res.success && res.response) return res.response
    console.error('[AI] API error:', res.error)
    return null
  } catch (e: any) {
    console.error('[AI] request failed:', e.message)
    return null
  }
}

// ── Bot Handler ──

export async function handleBotMessage(phone: string, message: string): Promise<string> {
  const botSettings = await getBotSettings()
  if (!botSettings.enabled) return ''

  const students = await searchStudentsFromFirebase(message)

  if (students.length === 0) {
    const aiReply = await callAI(message, '')
    const reply = aiReply || 'Maaf, tidak ditemukan data santri dengan nama/NIS tersebut. Ketik nama atau NIS untuk mencari.'
    await saveConversation(phone, message, reply)
    return reply
  }

  if (message.toLowerCase().includes('detail') || students.length === 1) {
    const s = students[0]
    const absensi = await getAttendanceSummary(s.id, s.name)
    const nilai = await getGradesSummary(s.id)
    const directReply = buildDetailReply([s], absensi, nilai)

    const context = `Santri: ${s.name}\nNIS: ${s.nis}\nKelas: ${s.class || '-'}\nStatus: ${s.status || 'Active'}\nAbsensi: ${absensi}\nNilai:\n${nilai}`
    const aiReply = await callAI(message, `Gunakan data berikut untuk menjawab:\n\n${context}`)
    const reply = aiReply || directReply
    await saveConversation(phone, message, reply)
    return reply
  }

  const reply = buildDirectReply(message, students)
  await saveConversation(phone, message, reply)
  return reply
}

// ── Conversation Memory ──

async function saveConversation(phone: string, userMsg: string, botReply: string): Promise<void> {
  const db = getDatabase()
  const ref = db.ref(`wa_gateway/conversations/${phone.replace(/[^0-9]/g, '')}`)
  const snap = await ref.once('value')
  const existing = snap.val() || { messages: [] }
  existing.messages.push(
    { role: 'user', text: userMsg, time: new Date().toISOString() },
    { role: 'bot', text: botReply, time: new Date().toISOString() }
  )
  if (existing.messages.length > 50) existing.messages = existing.messages.slice(-50)
  await ref.set(existing)
}

export async function getConversations(): Promise<any[]> {
  const db = getDatabase()
  const snap = await db.ref('wa_gateway/conversations').once('value')
  if (!snap.exists()) return []
  return Object.entries(snap.val()).map(([phone, data]: [string, any]) => ({
    phone,
    messages: data.messages || [],
    lastMessage: data.messages?.[data.messages.length - 1]?.time || '',
  }))
}

export async function getBotSettings(): Promise<{ enabled: boolean; autoReply: boolean; welcomeMessage: string; ai?: { url: string; key: string } }> {
  const db = getDatabase()
  const snap = await db.ref('wa_gateway/bot_settings').once('value')
  if (snap.exists()) return snap.val()
  return { enabled: false, autoReply: true, welcomeMessage: 'Assalamualaikum, ketik nama santri untuk cek absensi dan program.' }
}

export async function saveBotSettings(data: { enabled?: boolean; autoReply?: boolean; welcomeMessage?: string; syncStudents?: boolean; ai?: { url: string; key: string } }): Promise<void> {
  const db = getDatabase()
  if (data.ai) {
    const existing = await getBotSettings()
    await db.ref('wa_gateway/bot_settings').update({ ...existing, ...data, ai: data.ai })
  } else {
    await db.ref('wa_gateway/bot_settings').update(data)
  }
}
