import { getDatabase } from 'firebase-admin/database'
import { generateId } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = getDatabase()
  const id = generateId()
  const data = {
    guruId: body.guruId || '',
    nama: body.nama || '',
    jenis: body.jenis || '',
    tglMulai: body.tglMulai || '',
    tglSelesai: body.tglSelesai || '',
    keterangan: body.keterangan || '',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  }
  await db.ref(`guru_izin/${id}`).set(data)
  await logActivity(event, 'Ajukan Izin Guru', `${data.nama} - ${data.jenis}`, 'logout', '#9b4500')
  return { id, ...data }
})
