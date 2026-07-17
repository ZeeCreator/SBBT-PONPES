import { rtdbRemove } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await rtdbRemove('keuangan/salaries', id!)
  return { message: 'Deleted' }
})
