import { rtdbAdd } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = {
    ...body,
    active: true,
    createdAt: new Date().toISOString(),
  }
  return await rtdbAdd('curriculum', data)
})
