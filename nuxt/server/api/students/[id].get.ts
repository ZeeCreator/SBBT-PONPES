import { rtdbGetById } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const student = await rtdbGetById('students', id)
  
  if (!student) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found'
    })
  }
  
  return student
})
