import { rtdbAdd } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth?.uid) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (auth.role !== 'super_admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const body = await readBody(event)
  const record = await rtdbAdd('attendance_program_pm', {
    monthId: body.monthId,
    year: body.year,
    month: body.month,
    class: body.class,
    records: body.records || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  return record
})
