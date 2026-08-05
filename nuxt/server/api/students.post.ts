import { getDatabase } from 'firebase-admin/database'
import { generateNIS } from '../utils/id-generator'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const db = getDatabase()

  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  const student = {
    name: body.name?.trim() || '',
    nis: body.nis || generateNIS(),
    class: body.class || '',
    classId: body.classId || '',
    city: body.city || '',
    gender: body.gender || 'Laki-laki',
    dormitoryId: body.dormitoryId || '',
    dormitoryName: body.dormitoryName || '',
    roomId: body.roomId || '',
    roomName: body.roomName || '',
    phone: body.phone || '',
    address: body.address || '',
    parentName: body.parentName || '',
    parentPhone: body.parentPhone || '',
    disciplineScore: 100,
    status: 'Active',
    createdAt: new Date().toISOString(),
  }

  await db.ref(`students/${id}`).set(student)
  await logActivity(event, 'Tambah Santri Baru', `${student.name} (${student.nis})`, 'person_add')
  return { id, ...student }
})
