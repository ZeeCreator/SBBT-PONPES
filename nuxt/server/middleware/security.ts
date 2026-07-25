const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_WINDOW = 60_000
const RATE_LIMIT_MAX = 60
const LOGIN_RATE_LIMIT_MAX = 10

function getClientIp(event: any): string {
  return getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    || getHeader(event, 'x-real-ip')
    || event.node?.req?.socket?.remoteAddress
    || 'unknown'
}

export default defineEventHandler(async (event) => {
  const path = (event.path || event.node?.req?.url || '') as string
  const isLoginRoute = path.startsWith('/api/auth/login') || path.startsWith('/api/auth/nis-login')

  setHeaders(event, {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy':
      "default-src 'self'; "
      + "script-src 'self' 'unsafe-inline'; "
      + "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
      + "font-src 'self' https://fonts.gstatic.com; "
      + "img-src 'self' data: blob:; "
      + "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com; "
      + "frame-src 'self' https://*.firebaseapp.com; "
      + "object-src 'none'; "
      + "base-uri 'self';",
  })

  if (process.env.NODE_ENV === 'production') {
    setHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  if (!path.startsWith('/api/')) return

  const ip = getClientIp(event)
  const now = Date.now()
  const maxRequests = isLoginRoute ? LOGIN_RATE_LIMIT_MAX : RATE_LIMIT_MAX
  const window = isLoginRoute ? RATE_LIMIT_WINDOW : RATE_LIMIT_WINDOW

  const entry = rateLimitStore.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + window })
    setHeader(event, 'X-RateLimit-Limit', String(maxRequests))
    setHeader(event, 'X-RateLimit-Remaining', String(maxRequests - 1))
    setHeader(event, 'X-RateLimit-Reset', String(entry?.resetAt || now + window))
    return
  }

  entry.count++
  setHeader(event, 'X-RateLimit-Limit', String(maxRequests))
  setHeader(event, 'X-RateLimit-Remaining', String(Math.max(0, maxRequests - entry.count)))
  setHeader(event, 'X-RateLimit-Reset', String(entry.resetAt))

  if (entry.count > maxRequests) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
    })
  }
})
