import { rtdbGetList } from '../../../utils/firebase'
import { verifyFirebaseToken } from '../../../utils/firebase'

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get('authorization'))
  const q = getQuery(event)

  const all = await rtdbGetList('attendance_monthly')
  const items = all.filter((a: any) => {
    if (q.month && a.monthId !== q.month) return false
    if (q.class && a.class !== q.class) return false
    return true
  })

  return items
})
