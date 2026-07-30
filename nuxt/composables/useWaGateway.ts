export function useWaGateway() {
  const { getIdToken } = useAuth()
  const loading = ref(false)
  const error = ref('')

  async function getHeaders(): Promise<Record<string, string>> {
    const token = await getIdToken()
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  async function fetchApi(url: string, options?: RequestInit) {
    const headers = await getHeaders()
    const res = await fetch(url, { ...options, headers: { ...headers, ...options?.headers } })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(err.message || err.statusMessage || `HTTP ${res.status}`)
    }
    return res.json()
  }

  async function getDashboard() {
    return fetchApi('/api/wa-gateway')
  }

  async function getSettings() {
    return fetchApi('/api/wa-gateway/settings')
  }

  async function updateSettings(data: any) {
    return fetchApi('/api/wa-gateway/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async function getProviders() {
    return fetchApi('/api/wa-gateway/providers')
  }

  async function sendMessage(phone: string, message: string, options?: { delay?: number; templateId?: string; templateName?: string; mediaUrl?: string; mediaType?: string }) {
    return fetchApi('/api/wa-gateway/send', {
      method: 'POST',
      body: JSON.stringify({ phone, message, ...options }),
    })
  }

  async function sendText(chatId: string, text: string) {
    return fetchApi('/api/whatsapp/send-text', {
      method: 'POST',
      body: JSON.stringify({ chatId, text }),
    })
  }

  async function sendBroadcast(recipients: { phone: string; message: string; mediaUrl?: string; mediaType?: string }[], delayMs?: number) {
    return fetchApi('/api/wa-gateway/broadcast', {
      method: 'POST',
      body: JSON.stringify({ recipients, delayMs: delayMs || 2000 }),
    })
  }

  async function uploadMedia(file: File): Promise<{ url: string; type: string }> {
    const settings = await getSettings()
    const baseUrl = settings.baseUrl || 'https://zero-gateway.zerowebsite.eu.org/api'
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/upload`, {
      method: 'POST',
      headers: { 'X-API-Key': settings.apiKey || '' },
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Upload gagal' }))
      throw new Error(err.message || err.statusMessage || `HTTP ${res.status}`)
    }
    const data = await res.json()
    return { url: data.url || data.data?.url || '', type: file.type }
  }

  async function getContacts(type: string, params?: Record<string, string>) {
    const query = new URLSearchParams({ type, ...params })
    return fetchApi(`/api/wa-gateway/contacts?${query}`)
  }

  async function getTemplates() {
    return fetchApi('/api/wa-gateway/templates')
  }

  async function createTemplate(data: any) {
    return fetchApi('/api/wa-gateway/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async function updateTemplate(id: string, data: any) {
    return fetchApi(`/api/wa-gateway/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async function deleteTemplate(id: string) {
    return fetchApi(`/api/wa-gateway/templates/${id}`, {
      method: 'DELETE',
    })
  }

  async function getLogs(query?: Record<string, string>) {
    const params = query ? '?' + new URLSearchParams(query).toString() : ''
    return fetchApi(`/api/wa-gateway/logs${params}`)
  }

  async function getSessionInfo() {
    return fetchApi('/api/wa-gateway')
  }

  return {
    loading,
    error,
    getDashboard,
    getSettings,
    updateSettings,
    getProviders,
    sendMessage,
    sendText,
    sendBroadcast,
    getContacts,
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getLogs,
    uploadMedia,
    getSessionInfo,
  }
}
