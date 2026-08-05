import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)
  if (!q || String(q).trim().length < 1) {
    return { students: [], teachers: [] }
  }

  const query = String(q).trim().toLowerCase()
  const db = getDatabase()

  const [studentSnap, teacherSnap] = await Promise.all([
    db.ref('students').once('value'),
    db.ref('guru').once('value'),
  ])

  const studentsData = studentSnap.val() || {}
  const teachersData = teacherSnap.val() || {}

  const students = Object.entries(studentsData)
    .map(([id, val]) => ({ id, ...(val as object) }))
    .filter((s: any) => {
      const name = (s.name || '').toLowerCase()
      const nis = (s.nis || '').toLowerCase()
      return name.includes(query) || nis.includes(query)
    })
    .slice(0, 10)

  const teachers = Object.entries(teachersData)
    .map(([id, val]) => ({ id, ...(val as object) }))
    .filter((t: any) => {
      const name = (t.name || '').toLowerCase()
      const nuptk = (t.nuptk || '').toLowerCase()
      return name.includes(query) || nuptk.includes(query)
    })
    .slice(0, 10)

  return { students, teachers }
})
