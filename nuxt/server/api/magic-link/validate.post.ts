import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = String(body.token || '').trim()

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Token diperlukan' })
  }

  const db = getDatabase()
  const snap = await db.ref(`magic_links/${token}`).once('value')

  if (!snap.exists()) {
    return { valid: false, message: 'Token tidak ditemukan' }
  }

  const data = snap.val()

  if (data.used) {
    return { valid: false, message: 'Token sudah digunakan' }
  }

  if (new Date(data.expiresAt) < new Date()) {
    return { valid: false, message: 'Token sudah kedaluwarsa' }
  }

  // Mark as used
  await db.ref(`magic_links/${token}/used`).set(true)

  return {
    valid: true,
    uid: data.uid,
    role: data.role,
    nama: data.nama,
  }
})
