import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('imtihan')
  if (query.kelas) items = items.filter((i: any) => i.kelas === query.kelas)
  return items
})
