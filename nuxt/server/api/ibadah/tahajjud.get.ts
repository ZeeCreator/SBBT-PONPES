import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('tahajjud')
  if (query.studentId) items = items.filter(i => i.studentId === query.studentId)
  if (query.date) items = items.filter(i => i.date === query.date)
  return items
})
