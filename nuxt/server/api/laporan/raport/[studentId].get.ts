import { defineEventHandler, getRouterParams, getQuery } from 'h3'
import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const { studentId } = getRouterParams(event)
  const query = getQuery(event)
  const semester = query.semester || 'Ganjil 2024/2025'

  const db = getDatabase()

  const [studentSnap, gradesSnap] = await Promise.all([
    db.ref('students/' + studentId).once('value'),
    db.ref('grades').orderByChild('studentId').equalTo(studentId).once('value')
  ])

  if (!studentSnap.exists()) {
    throw createError({ statusCode: 404, statusMessage: 'Student not found' })
  }

  const student = { id: studentId, ...studentSnap.val() }
  const gradesData = gradesSnap.val() || {}
  const grades = Object.entries(gradesData).map(([id, val]) => ({ id, ...(val as object) }))

  return {
    student,
    semester,
    grades,
    reportType: 'raport',
    generatedAt: new Date().toISOString()
  }
})

