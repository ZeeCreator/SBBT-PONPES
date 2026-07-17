import { rtdbAdd } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id: _unused, ...clean } = body
  const data = { ...clean, createdAt: new Date().toISOString() }
  return rtdbAdd('jadwal', data)
})
