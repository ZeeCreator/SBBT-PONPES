import { rtdbGetById, rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { id: _unused, ...clean } = body
  await rtdbUpdate('jadwal', id!, { ...clean, updatedAt: new Date().toISOString() })
  return rtdbGetById('jadwal', id!)
})
