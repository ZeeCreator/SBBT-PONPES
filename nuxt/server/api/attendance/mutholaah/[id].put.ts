import { rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth?.uid) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (auth.role !== 'super_admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  await rtdbUpdate('attendance_mutholaah', id, {
    monthId: body.monthId,
    year: body.year,
    month: body.month,
    class: body.class,
    records: body.records || [],
    updatedAt: new Date().toISOString(),
  })
  return { id, ...body }
})
