import { downloadFromDrive } from '../../../utils/drive'
import { restoreRTDB } from '../../../utils/backup'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.fileId || !body.confirm) {
    throw createError({ statusCode: 400, statusMessage: 'File ID dan konfirmasi diperlukan' })
  }
  const data = await downloadFromDrive(body.fileId)
  await restoreRTDB(data)
  await logActivity(event, 'Restore dari Drive', `Database dipulihkan dari Drive file ${body.fileId}`, 'cloud_download', '#dc2626')
  return { success: true }
})
