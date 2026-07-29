import { getDatabase } from 'firebase-admin/database'
import { generateId } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = getDatabase()
  const id = generateId()
  const data = {
    uid: body.uid || '',
    nama: body.nama || '',
    alasan: body.alasan || '',
    tanggal: body.tanggal || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  await db.ref(`izin/${id}`).set(data)
  await logActivity(event, 'Ajukan Izin Guru', `${data.nama} - ${data.alasan}`, 'logout', '#9b4500')
  return { id, ...data }
})
