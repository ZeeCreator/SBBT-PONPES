import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async () => {
  const db = getDatabase()
  const snap = await db.ref('activity_logs').once('value')
  const data = snap.val() || {}
  const list = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))
  list.sort((a: any, b: any) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
  return list
})
