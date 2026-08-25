import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth?.uid) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (auth.role !== 'super_admin' && auth.role !== 'kesantrian') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const q = getQuery(event)
  const all = await rtdbGetList('attendance_program_pm')
  const items = all.filter((a: any) => {
    if (q.month && a.monthId !== q.month) return false
    if (q.class && a.class !== q.class) return false
    return true
  })

  return items
})
