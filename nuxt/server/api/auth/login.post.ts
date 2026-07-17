import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'
import { createSessionToken } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = String(body.email || '').trim()
  const password = String(body.password || '')

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email dan password diperlukan' })
  }

  // Verify via Firebase REST API
  const apiKey = process.env.NUXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) throw createError({ statusCode: 500, statusMessage: 'Firebase API Key tidak dikonfigurasi' })

  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  })

  const data = await res.json()
  if (!res.ok) {
    const msg = data.error?.message || 'Email atau password salah'
    throw createError({ statusCode: 401, statusMessage: msg })
  }

  const uid = data.localId
  const idToken = data.idToken

  // Look up role
  const db = getDatabase()
  const roleSnap = await db.ref(`roles/${uid}/role`).once('value')
  const role: string = roleSnap.val() || ''

  // Create session cookie from Firebase ID token
  const auth = getAuth()
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: 7 * 24 * 60 * 60 * 1000 })

  setCookie(event, '__session', sessionCookie, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  const displayName = data.displayName || email

  await logActivity(event, 'Login Sistem', `${displayName} - ${role || 'Unknown'}`, 'login', '#1a6bff')

  return { uid, role, email: data.email || email, name: displayName, idToken }
})
