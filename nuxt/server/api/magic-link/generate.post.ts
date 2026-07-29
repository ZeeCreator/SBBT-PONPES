import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const uid = String(body.uid || '').trim()
  const role = String(body.role || '').trim()
  const nama = String(body.nama || '').trim()

  if (!uid || !role || !nama) {
    throw createError({ statusCode: 400, statusMessage: 'uid, role, dan nama diperlukan' })
  }

  const db = getDatabase()

  // Generate token using Firebase push() key
  const token = db.ref('magic_links').push().key
  if (!token) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal generate token' })
  }

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString() // 1 jam

  await db.ref(`magic_links/${token}`).set({
    uid,
    role,
    nama,
    createdAt: now.toISOString(),
    expiresAt,
    used: false,
  })

  await logActivity(event, 'Generate Magic Link', `${nama} (${role})`, 'link', '#6366f1')

  return { token, expiresAt }
})
