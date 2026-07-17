import { dumpRTDB, saveBackupFile } from '../../../utils/backup'
import { uploadToDrive, listDriveFiles } from '../../../utils/drive'

export default defineEventHandler(async (event) => {
  const data = await dumpRTDB()
  const local = saveBackupFile(data)
  const fileId = await uploadToDrive(local.name, data)
  await logActivity(event, 'Upload ke Drive', `Backup ${local.name} diupload ke Google Drive`, 'cloud_upload', '#1a6bff')
  const files = await listDriveFiles()
  const uploaded = files.find(f => f.id === fileId)
  return { success: true, fileId, driveFile: uploaded || { id: fileId, name: local.name } }
})
