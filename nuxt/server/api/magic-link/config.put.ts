import { getDatabase } from 'firebase-admin/database'
import { verifyFirebaseToken } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const decoded = await verifyFirebaseToken(authHeader)

  const body = await readBody(event)
  const downloadUrl = String(body.downloadUrl || '').trim()

  if (!downloadUrl) {
    throw createError({ statusCode: 400, statusMessage: 'downloadUrl diperlukan' })
  }

  const db = getDatabase()
  await db.ref('config/magic_link_download_url').set(downloadUrl)

  await logActivity(event, 'Update Magic Link Config', `${decoded.email || decoded.uid} mengubah URL download`, 'settings', '#6366f1')

  return { downloadUrl }
})
