import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('psbRegistrations')
  if (query.status) items = items.filter(i => i.status === query.status)
  return items
})
