import { dumpRTDB, saveBackupFile } from '../../utils/backup'

export default defineEventHandler(async (event) => {
  const data = await dumpRTDB()
  const file = saveBackupFile(data)
  await logActivity(event, 'Buat Backup', `Backup ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'backup', '#1a6bff')
  return { ...file, size: file.size }
})
