import { rtdbGetList, rtdbQueryEqual } from '../../utils/firebase'
import { verifyFirebaseToken } from '../../utils/firebase'

function flattenAttendance(items: any[]): any[] {
  const result: any[] = []
  for (const item of items) {
    if (item.records && Array.isArray(item.records)) {
      for (const rec of item.records) {
        result.push({
          id: item.id,
          date: item.date,
          class: item.class,
          studentId: rec.studentId,
          name: rec.name,
          nis: rec.nis,
          morningPrayer: rec.morningPrayer || 'present',
          classSession: rec.classSession || 'present',
          asrPrayer: rec.asrPrayer || 'present',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })
      }
    } else if (item.studentId) {
      result.push(item)
    }
  }
  return result
}

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get('authorization'))
  const q = getQuery(event)

  let items: any[]

  if (q.date && q.class) {
    const all = await rtdbGetList('attendance')
    items = all.filter(a => (a as any).date === q.date && (a as any).class === q.class)
    return items
  }

  if (q.date) {
    items = await rtdbQueryEqual('attendance', 'date', q.date)
  } else {
    items = await rtdbGetList('attendance')
  }

  if (q.studentId) {
    const flat = flattenAttendance(items)
    return flat.filter(r => r.studentId === q.studentId)
  }

  return flattenAttendance(items)
})
