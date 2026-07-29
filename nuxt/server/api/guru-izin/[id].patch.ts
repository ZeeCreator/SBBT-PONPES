import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const db = getDatabase()
  const snap = await db.ref(`guru_izin/${id}`).once('value')
  if (!snap.exists()) throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' })

  await db.ref(`guru_izin/${id}`).update({ ...body, updatedAt: new Date().toISOString() })
  const updated = { id, ...snap.val(), ...body, updatedAt: new Date().toISOString() }

  if (body.status === 'Disetujui') {
    await logActivity(event, 'Setujui Izin Guru', `${updated.nama} - ${updated.jenis}`, 'check_circle', '#2e7d32')
  } else if (body.status === 'Ditolak') {
    await logActivity(event, 'Tolak Izin Guru', `${updated.nama} - ${updated.jenis}`, 'cancel', '#ba1a1a')
  }
  return updated
})
