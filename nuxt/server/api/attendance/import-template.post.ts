import { rtdbGetList, rtdbAdd, rtdbUpdate } from '~/server/utils/firebase'

function normalizeName(name: string) {
  return String(name || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth?.uid) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (auth.role !== 'super_admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const body = await readBody(event)
  const monthId: string = body.monthId
  const names: string[] = body.names || []
  if (!monthId || !/^\d{4}-\d{2}$/.test(monthId)) {
    throw createError({ statusCode: 400, statusMessage: 'monthId wajib format YYYY-MM' })
  }
  if (!Array.isArray(names) || names.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'names wajib diisi' })
  }

  const [year, month] = monthId.split('-').map(Number)
  const totalDays = Math.min(daysInMonth(year, month), 31)

  const students = await rtdbGetList('students')
  const byNorm = new Map<string, any>()
  for (const s of students) byNorm.set(normalizeName(s.name), s)

  const matched: any[] = []
  const unmatched: string[] = []
  for (const rawName of names) {
    const norm = normalizeName(rawName)
    let found = byNorm.get(norm) || null
    if (!found) {
      for (const [key, s] of byNorm) {
        if (key.startsWith(norm) || norm.startsWith(key)) { found = s; break }
      }
    }
    if (found) matched.push(found)
    else unmatched.push(rawName)
  }

  const records = matched.map(s => {
    const marks: Record<string, string> = {}
    for (let d = 1; d <= totalDays; d++) marks[String(d)] = ''
    return {
      studentId: s.id,
      name: s.name,
      nis: s.nis || '',
      class: s.class || '',
      marks,
    }
  })

  const now = new Date().toISOString()
  const results: Record<string, string> = {}

  for (const [path, label] of [['attendance_tahfidz', 'tahfidz'], ['attendance_mutholaah', 'mutholaah']] as const) {
    const existingList = await rtdbGetList(path)
    const existing = existingList.find((a: any) => a.monthId === monthId)
    if (existing) {
      await rtdbUpdate(path, existing.id, {
        year,
        month,
        class: 'Semua',
        records,
        updatedAt: now,
      })
      results[label] = `updated:${existing.id}`
    } else {
      const created = await rtdbAdd(path, {
        monthId,
        year,
        month,
        class: 'Semua',
        records,
        createdAt: now,
        updatedAt: now,
      })
      results[label] = `created:${created.id}`
    }
  }

  return {
    monthId,
    matchedCount: matched.length,
    unmatched,
    matchedNames: matched.map(s => ({ id: s.id, name: s.name })),
    results,
  }
})
