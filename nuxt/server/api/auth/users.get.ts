import { getDatabase } from 'firebase-admin/database'
import { getAuth } from 'firebase-admin/auth'

export default defineEventHandler(async (event) => {
  if (!event.context.auth?.uid) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const auth = getAuth()
  const db = getDatabase()
  const rolesSnap = await db.ref('roles').once('value')
  const rolesMap = rolesSnap.val() || {}
  const result = await auth.listUsers(100)
  return result.users.map(u => ({
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    role: rolesMap[u.uid]?.role || 'wali_santri',
    disabled: u.disabled,
  }))
})
