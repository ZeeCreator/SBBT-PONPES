import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const db = getDatabase()

  const snap = await db.ref('students').once('value')
  const data = snap.val() || {}

  let students = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))

  if (q.class) students = students.filter(s => (s as any).class === q.class)
  if (q.classId) students = students.filter(s => (s as any).classId === q.classId)
  if (q.gender) students = students.filter(s => (s as any).gender === q.gender)
  if (q.status) students = students.filter(s => (s as any).status === q.status)
  if (q.dormitoryId) students = students.filter(s => (s as any).dormitoryId === q.dormitoryId)
  if (q.roomId) students = students.filter(s => (s as any).roomId === q.roomId)
  if (q.search) {
    const search = String(q.search).toLowerCase()
    students = students.filter(s => {
      const st = s as any
      return (st.name && st.name.toLowerCase().includes(search)) ||
             (st.nis && st.nis.includes(search))
    })
  }

  students.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))

  return students
})