import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const nis = String(q.nis || '').trim()
  const listAll = q.list === 'true' || nis === 'all'

  const db = getDatabase()

  if (listAll) {
    const snap = await db.ref('nis_map').once('value')
    if (!snap.exists()) return []
    const data = snap.val()
    return Object.entries(data).map(([nis, val]: any) => ({ nis, ...val }))
  }

  if (!nis) throw createError({ statusCode: 400, statusMessage: 'NIS diperlukan' })

  const snap = await db.ref(`nis_map/${nis}`).once('value')
  if (!snap.exists()) throw createError({ statusCode: 404, statusMessage: 'NIS tidak terdaftar' })

  return snap.val()
})
