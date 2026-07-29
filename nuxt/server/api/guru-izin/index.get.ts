import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = getDatabase()
  const snap = await db.ref('izin').once('value')
  const data = snap.val() || {}
  let items = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))

  // Hanya data yang memiliki uid (milik guru/ustadz)
  items = items.filter(i => (i as any).uid)

  if (query.status) items = items.filter(i => (i as any).status === query.status)
  if (query.uid) items = items.filter(i => (i as any).uid === query.uid)

  items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return items
})
