import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('medicalRecords')
  if (query.studentId) items = items.filter(i => i.studentId === query.studentId)
  return items
})
