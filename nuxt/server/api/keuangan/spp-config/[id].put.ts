import { rtdbGetById, rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  await rtdbUpdate('keuangan/spp-config', id!, { ...body, updatedAt: new Date().toISOString() })
  return rtdbGetById('keuangan/spp-config', id!)
})
