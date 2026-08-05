import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let items = await rtdbGetList('izin')
  if (query.status) items = items.filter(i => (i as any).status === query.status)
  if (query.studentId) items = items.filter(i => (i as any).studentId === query.studentId)
  return items
})
