import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const key = event.headers.get('x-api-key') || event.headers.get('authorization')
  if (key !== 'AlfathByZR') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const { nis } = getRouterParams(event)
  const db = getDatabase()

  const snap = await db.ref('students').once('value')
  const data = snap.val() || {}

  const entry = Object.entries(data).find(([, val]: any) => val.nis === nis)

  if (!entry) {
    throw createError({
      statusCode: 404,
      statusMessage: `Santri dengan NIS ${nis} tidak ditemukan`,
    })
  }

  const [id, val] = entry
  return { id, ...(val as object) }
})