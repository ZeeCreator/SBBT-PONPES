import { rtdbGetList } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  let teachers = await rtdbGetList('guru')

  if (q.specialization) teachers = teachers.filter(t => (t as any).specialization === q.specialization)
  if (q.status) teachers = teachers.filter(t => (t as any).status === q.status)

  teachers.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))
  return teachers
})
