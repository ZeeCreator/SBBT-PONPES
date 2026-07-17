import { rtdbRemove } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await rtdbRemove('inventaris/loans', id!)
  return { message: 'Deleted' }
})
