import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('koperasi/items')
  if (query.category) items = items.filter(i => (i as any).category === query.category)
  return items
})
