import { deleteBackupFile } from '../../utils/backup'

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  if (!name) throw createError({ statusCode: 400, statusMessage: 'Nama file diperlukan' })
  const ok = deleteBackupFile(name)
  if (!ok) throw createError({ statusCode: 404, statusMessage: 'File tidak ditemukan' })
  await logActivity(event, 'Hapus Backup', `Backup ${name} dihapus`, 'delete', '#dc2626')
  return { success: true }
})
