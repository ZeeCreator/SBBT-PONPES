import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('keuangan/spp-config')
  if (query.class) items = items.filter(i => (i as any).class === query.class)
  if (query.year) items = items.filter(i => (i as any).year === query.year)
  return items
})
