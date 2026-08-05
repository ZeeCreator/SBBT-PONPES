import { getAuth } from 'firebase-admin/auth'
import { verifySessionToken } from '../utils/session'

const PUBLIC_ROUTES = ['/api/health', '/api/uptime/', '/api/auth/login', '/api/auth/nis-login', '/api/magic-link/']

export default defineEventHandler(async (event) => {
  const path = event.path || event.node?.req?.url || ''

  if (!path.startsWith('/api/')) return
  if (PUBLIC_ROUTES.some(r => path.startsWith(r))) return

  let auth: { uid: string; role: string; name: string; email: string; nis: string } = {
    uid: '', role: '', name: '', email: '', nis: '',
  }

  // 1. Try session cookie
  const sessionCookie = getCookie(event, '__session')
  if (sessionCookie) {
    try {
      const auth2 = getAuth()
      const decoded = await auth2.verifySessionCookie(sessionCookie, true)
      auth.uid = decoded.uid
      auth.email = decoded.email || ''
      auth.name = decoded.name || ''
    } catch {
      // Try our custom JWT session token
      const payload = await verifySessionToken(sessionCookie)
      if (payload) {
        auth.uid = payload.uid
        auth.role = payload.role
        auth.name = payload.name
        auth.email = payload.email
        auth.nis = payload.nis
      }
    }
  }

  // 2. Fallback: Bearer token
  if (!auth.uid) {
    const authHeader = getHeader(event, 'authorization')
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7)
        const auth2 = getAuth()
        const decoded = await auth2.verifyIdToken(token)
        auth.uid = decoded.uid
        auth.email = decoded.email || ''
        auth.role = (decoded as any).role || ''
      } catch {}
    }
  }

  // 3. Look up role from RTDB if not in cookie/token
  if (auth.uid && !auth.role) {
    try {
      const { getDatabase } = await import('firebase-admin/database')
      const db = getDatabase()
      const snap = await db.ref(`roles/${auth.uid}/role`).once('value')
      if (snap.exists()) auth.role = snap.val()
    } catch {}
  }

  event.context.auth = auth
})
