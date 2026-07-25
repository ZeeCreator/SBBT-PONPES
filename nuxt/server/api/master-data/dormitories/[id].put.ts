import { rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const body = await readBody(event)
  const { rooms, ...data } = body
  await rtdbUpdate('dormitories', id, data)
  return { id, ...data }
})
