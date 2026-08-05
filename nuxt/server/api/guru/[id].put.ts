import { rtdbUpdate } from '../../utils/firebase'
import { verifyFirebaseToken } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get('authorization'))
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event) || {}

  const clean: Record<string, any> = {}
  for (const [k, v] of Object.entries(body)) {
    if (v !== undefined && v !== null) clean[k] = k === 'name' ? String(v).trim() : v
  }

  await rtdbUpdate('guru', id, clean)
  await logActivity(event, 'Update Data Guru', `${body.name || ''}`, 'badge', '#9b4500')
  return { id, ...body }
})
