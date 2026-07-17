import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const db = getDatabase()

  let name = ''
  try {
    const snap = await db.ref(`students/${id}`).once('value')
    name = snap.val()?.name || ''
  } catch {}
  await db.ref(`students/${id}`).remove()
  await logActivity(event, 'Hapus Santri', `${name || id}`, 'person_remove', '#ba1a1a')
  return { message: 'deleted', id }
})
