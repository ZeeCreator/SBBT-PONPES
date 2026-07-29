import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = getDatabase()
  const snap = await db.ref('guru_izin').once('value')
  const data = snap.val() || {}
  let items = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))

  if (query.status) items = items.filter(i => (i as any).status === query.status)
  if (query.guruId) items = items.filter(i => (i as any).guruId === query.guruId)

  items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return items
})
