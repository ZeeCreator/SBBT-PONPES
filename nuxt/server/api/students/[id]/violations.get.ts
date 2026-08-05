import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const studentId = getRouterParam(event, 'id')
  const db = getDatabase()

  const snap = await db.ref(`students/${studentId}/violations`).once('value')
  const data = snap.val() || {}

  const items = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))
  items.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())

  return items
})
