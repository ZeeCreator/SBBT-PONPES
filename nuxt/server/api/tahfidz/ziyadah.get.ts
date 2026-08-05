import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('tahfidz/ziyadah')
  if (query.studentId) items = items.filter(i => (i as any).studentId === query.studentId)
  return items
})
