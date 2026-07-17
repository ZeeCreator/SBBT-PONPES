import { getDatabase } from 'firebase-admin/database'
import { getAuth } from 'firebase-admin/auth'
import { createSessionToken } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const nis = String(body.nis || '').trim()
  if (!nis) throw createError({ statusCode: 400, statusMessage: 'NIS diperlukan' })

  const db = getDatabase()

  // Check wali_santri first
  const nisMapSnap = await db.ref(`nis_map/${nis}`).once('value')
  if (nisMapSnap.exists()) {
    const data = nisMapSnap.val()
    const uid = data.uid
    const name = data.parentName || data.studentName || `Wali Santri ${nis}`
    const email = data.email

    // Ensure role entry
    const roleSnap = await db.ref(`roles/${uid}`).once('value')
    if (!roleSnap.exists()) {
      await db.ref(`roles/${uid}`).set({ role: 'wali_santri', email, displayName: name, nis, updatedAt: new Date().toISOString() })
    } else {
      const existing = roleSnap.val()
      if (existing.role !== 'wali_santri') {
        await db.ref(`roles/${uid}/role`).set('wali_santri')
      }
    }

    // Generate custom token for client-side Firebase SDK
    const auth = getAuth()
    const customToken = await auth.createCustomToken(uid, { role: 'wali_santri' })

    // Create session cookie
    const sessionToken = await createSessionToken({ uid, role: 'wali_santri', nis, name, email })
    setCookie(event, '__session', sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    await logActivity(event, 'Login Wali Santri', `${name} (NIS: ${nis})`, 'login', '#1a6bff')

    return { uid, role: 'wali_santri', customToken, name, nis, email }
  }

  // Check student data (santri → mapped to wali_santri)
  const studentsSnap = await db.ref('students').orderByChild('nis').equalTo(nis).once('value')
  if (!studentsSnap.exists()) {
    throw createError({ statusCode: 404, statusMessage: 'NIS tidak ditemukan' })
  }

  const entries = studentsSnap.val()
  const entry = Object.entries(entries)[0]
  const [studentId, studentData]: any = entry

  const uid = `santri_${nis}`
  const name = studentData.name || `Santri ${nis}`
  const email = `santri-${nis}@alfatah.sch.id`

  // Ensure role entry
  const roleSnap = await db.ref(`roles/${uid}`).once('value')
  if (!roleSnap.exists()) {
    await db.ref(`roles/${uid}`).set({
      role: 'wali_santri',
      displayName: name,
      email,
      nis,
      studentId,
      updatedAt: new Date().toISOString(),
    })
  }

  // Generate custom token
  const auth = getAuth()
  const customToken = await auth.createCustomToken(uid, { role: 'wali_santri' })

  // Create session cookie
  const sessionToken = await createSessionToken({ uid, role: 'wali_santri', nis, name, email })
  setCookie(event, '__session', sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  await logActivity(event, 'Login Santri (via NIS)', `${name} (NIS: ${nis})`, 'login', '#16a34a')

  return { uid, role: 'wali_santri', customToken, name, nis, email }
})
