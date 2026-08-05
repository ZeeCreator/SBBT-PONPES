import { rtdbAdd } from '../../utils/firebase'
import { verifyFirebaseToken } from '../../utils/firebase'
import { generateNUPTK } from '../../utils/id-generator'

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get('authorization'))
  const body = await readBody(event) || {}
  const teacher = await rtdbAdd('guru', {
    name: body.name?.trim() || '',
    email: body.email,
    phone: body.phone || '',
    nuptk: body.nuptk || generateNUPTK(),
    specialization: body.specialization || 'Umum',
    subjects: body.subjects || [],
    status: body.status || 'active',
    createdAt: new Date().toISOString(),
  })
  await logActivity(event, 'Tambah Guru Baru', `${body.name}`, 'badge', '#9b4500')
  return teacher
})
