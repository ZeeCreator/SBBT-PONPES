import { rtdbRemove } from '../../utils/firebase'
import { verifyFirebaseToken } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get('authorization'))
  const id = getRouterParam(event, 'id')!
  await rtdbRemove('guru', id)
  return { success: true }
})
