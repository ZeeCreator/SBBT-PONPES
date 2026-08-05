import { rtdbRemove } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await rtdbRemove('keuangan/spp-config', id!)
  return { message: 'Deleted' }
})
