import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  let items = await rtdbGetList('grades')
  if (q.studentId) items = items.filter(i => i.studentId === q.studentId)
  if (q.semester) items = items.filter(i => i.semester === q.semester)
  if (q.academicYear) items = items.filter(i => i.academicYear === q.academicYear)
  items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return items
})
