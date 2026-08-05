import { rtdbUpdate } from '../../../utils/firebase'
import { verifyFirebaseToken } from '../../../utils/firebase'

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get('authorization'))
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  await rtdbUpdate('attendance_monthly', id, {
    monthId: body.monthId,
    year: body.year,
    month: body.month,
    class: body.class,
    records: body.records || [],
    updatedAt: new Date().toISOString(),
  })
  return { id, ...body }
})
