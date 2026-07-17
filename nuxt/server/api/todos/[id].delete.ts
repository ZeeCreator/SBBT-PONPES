import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID diperlukan' })

  const db = getDatabase()
  await db.ref(`todos/${id}`).remove()
  await logActivity(event, 'Hapus Todo', `Todo ${id}`, 'delete', '#dc2626')
  return { success: true }
})
