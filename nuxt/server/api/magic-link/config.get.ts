import { getDatabase } from 'firebase-admin/database'
import { verifyFirebaseToken } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  await verifyFirebaseToken(authHeader)

  const db = getDatabase()
  const snap = await db.ref('config/magic_link_download_url').once('value')
  const downloadUrl = snap.val() || ''

  return { downloadUrl }
})
