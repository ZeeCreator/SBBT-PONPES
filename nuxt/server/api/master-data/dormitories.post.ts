import { rtdbAdd } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = { ...body, createdAt: new Date().toISOString() }
  return rtdbAdd('dormitories', data)
})
