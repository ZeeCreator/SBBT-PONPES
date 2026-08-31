import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const key = q.key || event.headers.get('x-api-key') || event.headers.get('authorization')
  if (key !== 'AlfathByZR') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const allMonths = await rtdbGetList('attendance_monthly')

  let months = allMonths
  if (q.monthId) months = months.filter((m: any) => m.monthId === q.monthId)
  if (q.class) months = months.filter((m: any) => m.class === q.class)

  const recapMap: Record<string, {
    studentId: string
    name: string
    nis: string
    class: string
    months: any[]
    total: { hadir: number; datang: number; bolos: number; alpa: number; sakit: number; izin: number; pulang: number; total: number }
  }> = {}

  for (const month of months) {
    if (!month.records || !Array.isArray(month.records)) continue

    for (const record of month.records) {
      if (q.studentId && record.studentId !== q.studentId && record.nis !== q.studentId) continue

      if (!recapMap[record.studentId]) {
        recapMap[record.studentId] = {
          studentId: record.studentId,
          name: record.name || 'Unknown',
          nis: record.nis || '',
          class: month.class,
          months: [],
          total: { hadir: 0, datang: 0, bolos: 0, alpa: 0, sakit: 0, izin: 0, pulang: 0, total: 0 },
        }
      }

      const canon = (s: string) => {
        const m: Record<string, string> = { present: 'hadir', absent: 'alpa', sick: 'sakit', permit: 'izin', hadir: 'hadir', datang: 'datang', bolos: 'bolos', alpa: 'alpa', sakit: 'sakit', izin: 'izin', pulang: 'pulang' }
        return m[String(s || '').toLowerCase()] || String(s || '').toLowerCase()
      }
      const marks = record.marks || {}
      let hadir = 0, datang = 0, bolos = 0, alpa = 0, sakit = 0, izin = 0, pulang = 0
      for (let d = 1; d <= 31; d++) {
        const v = canon(marks[String(d)])
        if (v === 'hadir') hadir++
        else if (v === 'datang') datang++
        else if (v === 'bolos') bolos++
        else if (v === 'alpa') alpa++
        else if (v === 'sakit') sakit++
        else if (v === 'izin') izin++
        else if (v === 'pulang') pulang++
        else if (v) hadir++ // fallback unknown -> hadir
      }

      recapMap[record.studentId].months.push({
        monthId: month.monthId,
        hadir, datang, bolos, alpa, sakit, izin, pulang,
        totalDays: hadir + datang + bolos + alpa + sakit + izin + pulang,
      })

      recapMap[record.studentId].total.hadir += hadir
      recapMap[record.studentId].total.datang += datang
      recapMap[record.studentId].total.bolos += bolos
      recapMap[record.studentId].total.alpa += alpa
      recapMap[record.studentId].total.sakit += sakit
      recapMap[record.studentId].total.izin += izin
      recapMap[record.studentId].total.pulang += pulang
      recapMap[record.studentId].total.total += hadir + datang + bolos + alpa + sakit + izin + pulang
    }
  }

  let result = Object.values(recapMap)

  if (q.sort === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (q.sort === 'alpa') {
    result.sort((a, b) => b.total.alpa - a.total.alpa)
  } else {
    result.sort((a, b) => a.name.localeCompare(b.name))
  }

  return result
})