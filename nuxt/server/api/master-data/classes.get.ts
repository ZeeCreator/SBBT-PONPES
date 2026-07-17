import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('classes')
  if (query.level) items = items.filter(i => i.level === query.level)
  return items
})
