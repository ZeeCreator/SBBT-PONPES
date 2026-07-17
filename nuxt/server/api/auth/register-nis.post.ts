import { getDatabase } from 'firebase-admin/database'
import { getAuth } from 'firebase-admin/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const nis = String(body.nis || '').trim()

  if (!nis) throw createError({ statusCode: 400, statusMessage: 'NIS diperlukan' })

  const db = getDatabase()
  const existing = await db.ref(`nis_map/${nis}`).once('value')
  if (existing.exists()) throw createError({ statusCode: 409, statusMessage: 'NIS sudah terdaftar' })

  // Lookup student by NIS
  const studentsSnap = await db.ref('students').orderByChild('nis').equalTo(nis).once('value')
  const students = studentsSnap.val()
  const studentEntry = students ? Object.entries(students)[0] : null
  const studentData: any = studentEntry ? studentEntry[1] : null
  const studentName = studentData?.name || 'Santri'
  const parentName = studentData?.parentName || `Wali ${studentName}`

  const email = `wali-${nis}@alfatah.sch.id`
  const uid = `wali_${nis}`

  try {
    const auth = getAuth()
    // Create user without password (uses custom token for sign-in)
    await auth.createUser({ uid, email, displayName: parentName })
  } catch (e: any) {
    if (e.code === 'auth/email-already-exists' || e.code === 'auth/uid-already-exists') {
      throw createError({ statusCode: 409, statusMessage: 'Akun wali untuk NIS ini sudah ada' })
    }
    throw createError({ statusCode: 500, statusMessage: e.message || 'Gagal membuat akun' })
  }

  await db.ref(`nis_map/${nis}`).set({ uid, email, studentName, parentName, createdAt: new Date().toISOString() })
  await db.ref(`roles/${uid}`).set({ role: 'wali_santri', email, displayName: parentName, updatedAt: new Date().toISOString() })

  await logActivity(event, 'Registrasi Wali Santri', `NIS ${nis} - ${parentName}`, 'person_add', '#1a6bff')

  return { uid, email, nis, parentName, studentName }
})
