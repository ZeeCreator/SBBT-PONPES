import { rtdbGetById } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing id' })
  const exam = await rtdbGetById('imtihan', id)
  if (!exam) throw createError({ statusCode: 404, message: 'Exam not found' })
  return exam
})
