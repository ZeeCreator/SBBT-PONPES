import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('keuangan/scholarships')
  if (query.studentId) items = items.filter(i => (i as any).studentId === query.studentId)
  if (query.status) items = items.filter(i => (i as any).status === query.status)
  return items
})
