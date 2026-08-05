import { restoreRTDB } from '../../utils/backup'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.data || !body.confirm) {
    throw createError({ statusCode: 400, statusMessage: 'Data backup dan konfirmasi diperlukan' })
  }
  await restoreRTDB(body.data)
  await logActivity(event, 'Restore Backup', 'Database dipulihkan dari backup', 'restore', '#dc2626')
  return { success: true }
})
