import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const db = getDatabase()
  await db.ref(`guru_izin/${id}`).remove()
  return { message: 'Deleted' }
})
