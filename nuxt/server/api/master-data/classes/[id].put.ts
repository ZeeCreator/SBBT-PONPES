import { rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const body = await readBody(event)
  await rtdbUpdate('classes', id, body)
  return { id, ...body }
})
