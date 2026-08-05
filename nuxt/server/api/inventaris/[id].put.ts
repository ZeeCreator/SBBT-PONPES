import { rtdbGetById, rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  await rtdbUpdate('inventaris', id!, { ...body, updatedAt: new Date().toISOString() })
  return rtdbGetById('inventaris', id!)
})
