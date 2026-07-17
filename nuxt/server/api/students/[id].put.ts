import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event) || {}
  const db = getDatabase()

  const clean: Record<string, any> = {}
  for (const [k, v] of Object.entries(body)) {
    if (v !== undefined && v !== null) clean[k] = k === 'name' ? String(v).trim() : v
  }

  await db.ref(`students/${id}`).update(clean)
  const snap = await db.ref(`students/${id}`).once('value')
  const student = snap.val()
  await logActivity(event, 'Update Data Santri', `${student?.name || ''}`, 'person_edit', '#1a6bff')
  return { id, ...student }
})
