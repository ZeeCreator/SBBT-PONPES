import { getDatabase } from 'firebase-admin/database'
import { verifyFirebaseToken } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get('authorization'))
  const body = await readBody(event)
  const db = getDatabase()
  await db.ref(`roles/${body.uid}`).set({
    role: body.role,
    updatedAt: new Date().toISOString(),
  })
  return { message: 'Role updated', uid: body.uid, role: body.role }
})
