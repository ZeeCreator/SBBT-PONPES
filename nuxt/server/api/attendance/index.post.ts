import { rtdbAdd } from '../../utils/firebase'
import { verifyFirebaseToken } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get('authorization'))
  const body = await readBody(event)

  const record = await rtdbAdd('attendance', {
    date: body.date,
    class: body.class,
    records: body.records || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  return record
})
