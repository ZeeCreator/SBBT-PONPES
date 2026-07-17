import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('iktibar')
  if (query.kelas) items = items.filter((i: any) => i.kelas === query.kelas)
  if (query.santri) items = items.filter((i: any) => i.santri === query.santri)
  if (query.date) items = items.filter((i: any) => i.date === query.date)
  return items
})
