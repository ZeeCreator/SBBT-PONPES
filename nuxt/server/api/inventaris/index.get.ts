import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('inventaris')
  if (query.category) items = items.filter(i => (i as any).category === query.category)
  if (query.status) items = items.filter(i => (i as any).status === query.status)
  return items
})
