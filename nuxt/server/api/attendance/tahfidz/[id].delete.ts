import { rtdbRemove } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth?.uid) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (auth.role !== 'super_admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const id = getRouterParam(event, 'id')!
  await rtdbRemove('attendance_tahfidz', id)
  return { success: true }
})
