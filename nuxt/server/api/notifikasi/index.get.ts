import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('notifikasi')
  if (query.type) items = items.filter(i => (i as any).type === query.type)
  return items
})
