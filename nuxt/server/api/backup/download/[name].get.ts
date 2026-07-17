import { readBackupFile, listBackupFiles } from '../../../utils/backup'

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  if (!name) throw createError({ statusCode: 400, statusMessage: 'Nama file diperlukan' })
  const data = readBackupFile(name)
  if (!data) throw createError({ statusCode: 404, statusMessage: 'File tidak ditemukan' })
  return data
})
