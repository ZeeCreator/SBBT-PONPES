import { rtdbAdd } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = {
    studentId: body.studentId,
    studentName: body.studentName,
    subject: body.subject,
    score: body.score,
    semester: body.semester,
    academicYear: body.academicYear,
    class: body.class,
    createdAt: new Date().toISOString(),
  }
  return await rtdbAdd('grades', data)
})
