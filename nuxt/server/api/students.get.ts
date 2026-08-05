import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const db = getDatabase()

  const snap = await db.ref('students').once('value')
  const data = snap.val() || {}

  let students = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))

  if (q.class) students = students.filter(s => (s as any).class === q.class)
  if (q.status) students = students.filter(s => (s as any).status === q.status)

  students.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))

  return students
})
