import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('keuangan/salaries')
  if (query.teacherId) items = items.filter(i => (i as any).teacherId === query.teacherId)
  if (query.month) items = items.filter(i => (i as any).month === query.month)
  return items
})
