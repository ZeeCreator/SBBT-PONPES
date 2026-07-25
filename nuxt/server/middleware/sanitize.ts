function sanitizeString(value: string): string {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/<[^>]*>/g, '')
}

function sanitizeValue(value: any): any {
  if (typeof value === 'string') return sanitizeString(value)
  if (Array.isArray(value)) return value.map(sanitizeValue)
  if (value && typeof value === 'object') {
    const clean: Record<string, any> = {}
    for (const [key, val] of Object.entries(value)) {
      clean[key] = sanitizeValue(val)
    }
    return clean
  }
  return value
}

export default defineEventHandler(async (event) => {
  const path = (event.path || event.node?.req?.url || '') as string
  if (!path.startsWith('/api/')) return

  const method = (event.method || event.node?.req?.method || '') as string
  if (!['POST', 'PUT', 'PATCH'].includes(method)) return

  // Skip login endpoints (passwords must not be modified)
  if (path.startsWith('/api/auth/login') || path.startsWith('/api/auth/nis-login')) return

  // Read body (cached in event.context._requestBody), sanitize, write back
  const body = await readBody(event)
  if (body && typeof body === 'object') {
    event.context._requestBody = sanitizeValue(body)
  }
})
