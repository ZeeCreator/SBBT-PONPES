import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const studentId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const db = getDatabase()

  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  const violation = {
    studentId,
    type: body.type,
    category: body.category,
    description: body.description,
    date: body.date || new Date().toISOString().split('T')[0],
    points: body.points || -10,
    reportedBy: body.reportedBy || 'System',
    createdAt: new Date().toISOString(),
  }

  await db.ref(`students/${studentId}/violations/${id}`).set(violation)
  await db.ref(`violations/${id}`).set(violation)

  const snap = await db.ref(`students/${studentId}/disciplineScore`).once('value')
  const currentScore = snap.val() || 100
  const newScore = Math.max(0, currentScore + (violation.points || -10))
  await db.ref(`students/${studentId}/disciplineScore`).set(newScore)

  try {
    const snap2 = await db.ref(`students/${studentId}`).once('value')
    const student = snap2.val()
    await logActivity(event, 'Laporkan Pelanggaran', `${student?.name || 'Santri'}: ${body.description}`, 'gavel', '#ba1a1a')
  } catch {}
  return { id, ...violation, disciplineScore: newScore }
})
