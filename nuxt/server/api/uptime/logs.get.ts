import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Math.max(parseInt(String(query.limit || '20')), 1), 100)

  const db = getDatabase()
  const snap = await db.ref('uptime_logs').once('value')
  if (!snap.exists()) return []

  const entries = Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as object) }))
  entries.sort((a: any, b: any) => (b.timestamp || '').localeCompare(a.timestamp || ''))

  return entries.slice(0, limit)
})
