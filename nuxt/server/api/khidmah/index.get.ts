import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('khidmah')
  if (query.studentId) items = items.filter(i => (i as any).studentId === query.studentId)
  if (query.area) items = items.filter(i => (i as any).area === query.area)
  return items
})
