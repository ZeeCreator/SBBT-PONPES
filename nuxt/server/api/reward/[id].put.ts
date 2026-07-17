import { rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  await rtdbUpdate('reward', id, { ...body, updatedAt: new Date().toISOString() })
  return { id, ...body }
})
