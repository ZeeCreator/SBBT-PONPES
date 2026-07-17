import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  let items = await rtdbGetList('curriculum')
  if (q.dept) items = items.filter(i => i.dept === q.dept)
  items.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  return items
})
