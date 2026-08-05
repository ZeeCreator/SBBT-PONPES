import { listBackupFiles } from '../../utils/backup'

export default defineEventHandler(async () => {
  return listBackupFiles()
})
