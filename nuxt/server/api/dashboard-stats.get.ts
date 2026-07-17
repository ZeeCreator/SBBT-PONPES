import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async () => {
  const db = getDatabase()

  const [studentsSnap, violationsSnap, invoicesSnap, attendanceSnap, logsSnap, guruSnap, classesSnap] =
    await Promise.all([
      db.ref('students').once('value'),
      db.ref('violations').once('value'),
      db.ref('invoices').once('value'),
      db.ref('attendance').once('value'),
      db.ref('activity_logs').once('value').catch(() => null),
      db.ref('guru').once('value'),
      db.ref('classes').once('value'),
    ])

  const students: Record<string, any> = studentsSnap.val() || {}
  const violations: Record<string, any> = violationsSnap.val() || {}
  const invoices: Record<string, any> = invoicesSnap.val() || {}
  const attendance: Record<string, any> = attendanceSnap.val() || {}
  const logs: Record<string, any> = logsSnap?.val() || {}
  const guru: Record<string, any> = guruSnap.val() || {}
  const rawClasses: Record<string, any> = classesSnap.val() || {}

  const studentList = Object.values(students) as any[]
  const violationList = Object.values(violations) as any[]
  const invoiceList = Object.values(invoices) as any[]
  const attendanceList = Object.values(attendance) as any[]
  const logList = Object.values(logs) as any[]
  const teacherList = Object.values(guru) as any[]
  const classList = Object.entries(rawClasses).map(([id, c]) => ({ id, ...(c as object) })) as any[]

  // ── Stats ──────────────────────────────────────────────────
  const totalStudents = studentList.length
  const activeStudents = studentList.filter(s => s.status === 'Active').length
  const alumniStudents = studentList.filter(s => s.status === 'Alumni').length
  const totalTeachers = teacherList.length

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const recentViolations = violationList.filter(v => v.timestamp >= weekAgo).length

  const paidInvoices = invoiceList.filter(inv => inv.status === 'paid').length
  const totalInvoices = invoiceList.length
  const financialHealth = totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 1000) / 10 : 0

  const presentToday = attendanceList.filter(a => a.status === 'present').length
  const totalAttendance = attendanceList.length
  const attendanceRate = totalAttendance > 0 ? Math.round((presentToday / totalAttendance) * 1000) / 10 : 0

  // ── Violation breakdown ────────────────────────────────────
  const berat = violationList.filter(v => v.type === 'Severe').length
  const ringan = violationList.filter(v => v.type === 'Minor' || v.type === 'Moderate').length

  // ── Activities (15 terbaru) ────────────────────────────────
  const activities = logList
    .sort((a: any, b: any) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
    .slice(0, 15)
    .map((log: any) => ({
      icon: log.icon || 'info',
      bg: log.color === '#ba1a1a' ? 'bg-error-container' :
          log.color === '#9b4500' ? 'bg-secondary-fixed' :
          'bg-primary-fixed',
      iconColor: log.color === '#ba1a1a' ? 'text-error' :
                log.color === '#9b4500' ? 'text-secondary' :
                'text-primary',
      title: `<span class="font-bold">${log.action}</span> — ${log.description}`,
      time: timeAgo(log.timestamp),
    }))

  // ── Class performance (hanya kelas dari master data) ──────
  // Map student to class by matching student.class === class.name
  const validClassNames = new Set(classList.map(c => c.name || c.nama || ''))

  // Group students by valid class name
  const studentClassMap: Record<string, any[]> = {}
  for (const s of studentList) {
    const clsName = s.class || ''
    if (!validClassNames.has(clsName)) continue
    if (!studentClassMap[clsName]) studentClassMap[clsName] = []
    studentClassMap[clsName].push(s)
  }

  // Ambil semua grades
  let allGrades: any[] = []
  try {
    const gradesSnap = await db.ref('grades').once('value')
    const gData = gradesSnap.val() || {}
    allGrades = Object.values(gData) as any[]
  } catch {}

  // Group grades by studentId
  const gradeByStudent: Record<string, number[]> = {}
  for (const g of allGrades) {
    const sid = g.studentId
    if (!sid) continue
    if (!gradeByStudent[sid]) gradeByStudent[sid] = []
    gradeByStudent[sid].push(Number(g.score) || 0)
  }

  // Group attendance by studentId
  const attendanceByStudent: Record<string, { present: number; total: number }> = {}
  for (const a of attendanceList) {
    const sid = a.studentId
    if (!sid) continue
    if (!attendanceByStudent[sid]) attendanceByStudent[sid] = { present: 0, total: 0 }
    attendanceByStudent[sid].total++
    if (a.status === 'present') attendanceByStudent[sid].present++
  }

  const classes = classList.map((cls) => {
    const clsName = cls.name || cls.nama || ''
    const studentsInClass = studentClassMap[clsName] || []
    const studentCount = studentsInClass.length

    // Rata-rata nilai dari semua siswa di kelas ini
    let totalScore = 0
    let scoreCount = 0
    for (const s of studentsInClass) {
      const scores = gradeByStudent[s.id || ''] || []
      for (const sc of scores) {
        totalScore += sc
        scoreCount++
      }
    }
    const avgGrade = scoreCount > 0 ? totalScore / scoreCount : 0

    // Absensi rata-rata kelas
    let totalAtt = 0
    let totalPresent = 0
    for (const s of studentsInClass) {
      const att = attendanceByStudent[s.id || '']
      if (att) {
        totalAtt += att.total
        totalPresent += att.present
      }
    }
    const attendancePct = totalAtt > 0 ? Math.round((totalPresent / totalAtt) * 1000) / 10 : 0

    return {
      name: clsName,
      avgGrade: avgGrade.toFixed(1),
      attendance: attendancePct + '%',
      progress: studentCount > 0 ? Math.min(Math.round(avgGrade * 10), 100) : 0,
    }
  })

  return {
    totalStudents,
    activeStudents,
    alumniStudents,
    totalTeachers,
    financialHealth,
    recentViolations,
    attendanceRate,
    totalPelanggaran: violationList.length,
    pelanggaranBerat: berat,
    pelanggaranRingan: ringan,
    ratioGuru: totalTeachers > 0 ? Math.round(totalStudents / totalTeachers) : 0,
    activities,
    classes,
  }
})

function timeAgo(timestamp: string): string {
  if (!timestamp) return ''
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diff = now - then
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  return `${days} hari lalu`
}
