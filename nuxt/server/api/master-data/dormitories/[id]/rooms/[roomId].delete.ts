import { rtdbRemove } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const { id, roomId } = getRouterParams(event)
  await rtdbRemove(`dormitories/${id}/rooms`, roomId)
  return { success: true }
})
