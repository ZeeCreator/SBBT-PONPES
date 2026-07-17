import { rtdbGetById, rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  await rtdbUpdate('koperasi/items', id!, { ...body, updatedAt: new Date().toISOString() })
  return rtdbGetById('koperasi/items', id!)
})
