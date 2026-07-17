import { rtdbRemove } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing id' })
  await rtdbRemove('jadwal', id)
  return { message: 'Deleted' }
})
