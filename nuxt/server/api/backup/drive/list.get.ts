import { listDriveFiles } from '../../../utils/drive'

export default defineEventHandler(async () => {
  try {
    return await listDriveFiles()
  } catch (e: any) {
    throw createError({ statusCode: 502, statusMessage: e.message || 'Gagal terhubung ke Google Drive' })
  }
})
