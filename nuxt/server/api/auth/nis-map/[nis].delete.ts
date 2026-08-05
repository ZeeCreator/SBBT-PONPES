import { getDatabase } from 'firebase-admin/database'
import { getAuth } from 'firebase-admin/auth'

export default defineEventHandler(async (event) => {
  const nis = String(getRouterParam(event, 'nis') || '').trim()
  if (!nis) throw createError({ statusCode: 400, statusMessage: 'NIS diperlukan' })

  const db = getDatabase()
  const snap = await db.ref(`nis_map/${nis}`).once('value')
  if (!snap.exists()) throw createError({ statusCode: 404, statusMessage: 'NIS tidak terdaftar' })

  const data = snap.val()
  const uid = data.uid

  // Delete Firebase Auth user
  try {
    await getAuth().deleteUser(uid)
  } catch (e: any) {
    if (e.code !== 'auth/user-not-found') throw e
  }

  // Remove nis_map and roles entries
  await db.ref(`nis_map/${nis}`).remove()
  await db.ref(`roles/${uid}`).remove()

  await logActivity(event, 'Hapus Wali Santri', `NIS ${nis} - ${data.parentName || data.studentName}`, 'person_remove', '#dc2626')

  return { success: true, nis, email: data.email }
})
