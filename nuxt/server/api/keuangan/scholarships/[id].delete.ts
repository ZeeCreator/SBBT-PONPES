import { rtdbRemove } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await rtdbRemove('keuangan/scholarships', id!)
  return { message: 'Deleted' }
})
