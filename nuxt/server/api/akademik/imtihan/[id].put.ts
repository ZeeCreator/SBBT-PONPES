import { rtdbGetById, rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing id' })

  const existing = await rtdbGetById('imtihan', id)
  if (!existing) throw createError({ statusCode: 404, message: 'Exam not found' })

  const body = await readBody(event)

  const updateData: any = { ...body }
  delete updateData.id
  delete updateData.createdAt

  if (body.scores) {
    const scoreValues = Object.values(body.scores).map((s: any) => Number(s.score) || 0)
    const valid = scoreValues.filter(s => s > 0)
    updateData.averageScore = valid.length > 0
      ? Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10
      : 0
  }

  await rtdbUpdate('imtihan', id, updateData)
  return { id, ...existing, ...updateData }
})
