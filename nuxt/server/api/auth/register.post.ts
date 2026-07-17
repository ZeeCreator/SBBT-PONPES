import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'
import { verifyFirebaseToken, generateId } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get('authorization'))
  const body = await readBody(event)
  const auth = getAuth()
  const userRecord = await auth.createUser({
    email: body.email,
    password: body.password,
    displayName: body.displayName,
  })
  const assignedRole = body.role || 'wali_santri'
  const db = getDatabase()
  await db.ref(`roles/${userRecord.uid}`).set({
    role: assignedRole,
    email: body.email,
    displayName: body.displayName,
    updatedAt: new Date().toISOString(),
  })
  return { uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName, role: assignedRole }
})
