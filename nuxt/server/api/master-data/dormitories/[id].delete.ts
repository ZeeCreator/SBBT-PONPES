import { rtdbRemove } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  await rtdbRemove('dormitories', id)
  return { success: true }
})
