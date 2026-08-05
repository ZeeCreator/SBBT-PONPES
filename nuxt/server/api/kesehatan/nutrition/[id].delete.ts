import { rtdbRemove } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  await rtdbRemove('nutrition', id)
  return { success: true }
})
