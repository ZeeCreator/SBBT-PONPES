import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = getDatabase()
  const snap = await db.ref('jadwal').once('value')
  const data = snap.val() || {}
  let items = Object.entries(data).map(([key, val]: [string, any]) => {
    const { id: _stored, ...rest } = val || {}
    return { id: key, ...rest }
  })
  if (query.kelas) items = items.filter(i => (i as any).kelas === query.kelas)
  if (query.hari) items = items.filter(i => (i as any).hari === query.hari)
  if (query.guru) items = items.filter(i => (i as any).guru === query.guru)
  return items
})
