import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const db = getDatabase()

  const clean: Record<string, any> = {}
  for (const [k, v] of Object.entries(body)) {
    if (v !== undefined && v !== null) clean[k] = k === 'title' ? String(v).trim() : v
  }
  clean.updatedAt = new Date().toISOString()

  await db.ref(`todos/${id}`).update(clean)
  return { id, ...clean }
})
