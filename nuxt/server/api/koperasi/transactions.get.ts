import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('koperasi/transactions')
  if (query.type) items = items.filter(i => (i as any).type === query.type)
  if (query.studentId) items = items.filter(i => (i as any).studentId === query.studentId)
  return items
})
