import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('reward')
  if (query.month) items = items.filter(i => (i as any).month === query.month)
  return items
})
