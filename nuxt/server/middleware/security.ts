export default defineEventHandler(async (event) => {
  setHeaders(event, {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  })

  if (process.env.NODE_ENV === 'production') {
    setHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  setHeader(event, 'X-RateLimit-Limit', '100')
  setHeader(event, 'X-RateLimit-Remaining', '99')
})
