import { rtdbAdd } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const body = await readBody(event)
  const data = { ...body, dormitoryId: id, createdAt: new Date().toISOString() }
  return rtdbAdd(`dormitories/${id}/rooms`, data)
})
