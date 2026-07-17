import { rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing id' })
  const body = await readBody(event)
  await rtdbUpdate('iktibar', id, body)
  return { success: true }
})
