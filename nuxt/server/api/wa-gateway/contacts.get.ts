import { getDatabase } from 'firebase-admin/database'

const MONTHS_INDONESIAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth.uid) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const type = (query.type as string) || ''
  const db = getDatabase()
  const now = new Date()
  const bulan = MONTHS_INDONESIAN[now.getMonth()]
  const tahun = now.getFullYear()

  const settingsSnap = await db.ref('wa_gateway/settings').once('value')
  const settings = settingsSnap.val() || {}
  const namaPondok = (settings as any).senderName || 'PONPES SBBT'

  async function getActivePeriod(): Promise<{ startDate?: string; endDate?: string; name?: string }> {
    const snap = await db.ref('periods').once('value')
    const periods = snap.val() || {}
    for (const p of Object.values(periods) as any[]) {
      if (p.isActive) return p
    }
    return {}
  }

  const activePeriod = await getActivePeriod()

  if (type === 'walisantri') {
    const snap = await db.ref('students').once('value')
    const students = snap.val() || {}
    const contacts: any[] = []
    for (const [id, s] of Object.entries(students) as any[]) {
      if (s.parentPhone && s.status === 'Active') {
        contacts.push({
          id,
          name: s.parentName || s.name,
          phone: s.parentPhone,
          studentName: s.name,
          classId: s.classId || '',
          className: s.class || '',
          variables: {
            nama_wali: s.parentName || 'Wali Santri',
            nama_santri: s.name,
            bulan,
            tahun: String(tahun),
            nama_pondok: namaPondok,
            tanggal_jatuh_tempo: activePeriod?.endDate ? new Date(activePeriod.endDate).getDate().toString() : '',
          },
        })
      }
    }
    return contacts
  }

  if (type === 'guru') {
    const snap = await db.ref('guru').once('value')
    const teachers = snap.val() || {}
    const contacts: any[] = []
    for (const [id, g] of Object.entries(teachers) as any[]) {
      if ((g as any).phone && (g as any).status === 'active') {
        contacts.push({
          id,
          name: (g as any).name,
          phone: (g as any).phone,
          studentName: '',
          classId: '',
          className: '',
          variables: {
            nama_wali: (g as any).name,
            nama_santri: '',
            bulan,
            tahun: String(tahun),
            nama_pondok: namaPondok,
            tanggal_jatuh_tempo: '',
          },
        })
      }
    }
    return contacts
  }

  if (type === 'kelas') {
    const classId = query.classId as string
    if (!classId) {
      throw createError({ statusCode: 400, statusMessage: 'classId diperlukan' })
    }
    const snap = await db.ref('students').once('value')
    const students = snap.val() || {}
    const contacts: any[] = []
    for (const [id, s] of Object.entries(students) as any[]) {
      if (s.classId === classId && s.parentPhone && s.status === 'Active') {
        contacts.push({
          id,
          name: s.parentName || s.name,
          phone: s.parentPhone,
          studentName: s.name,
          classId: s.classId || '',
          className: s.class || '',
          variables: {
            nama_wali: s.parentName || 'Wali Santri',
            nama_santri: s.name,
            bulan,
            tahun: String(tahun),
            nama_pondok: namaPondok,
            tanggal_jatuh_tempo: activePeriod?.endDate ? new Date(activePeriod.endDate).getDate().toString() : '',
          },
        })
      }
    }
    return contacts
  }

  if (type === 'santri') {
    const studentId = query.studentId as string
    if (!studentId) {
      throw createError({ statusCode: 400, statusMessage: 'studentId diperlukan' })
    }
    const snap = await db.ref(`students/${studentId}`).once('value')
    if (!snap.exists()) {
      throw createError({ statusCode: 404, statusMessage: 'Santri tidak ditemukan' })
    }
    const s = snap.val() as any
    if (!s.phone) return []
    return [{
      id: studentId,
      name: s.name,
      phone: s.phone,
      studentName: s.name,
      classId: s.classId || '',
      className: s.class || '',
      variables: {
        nama_wali: s.parentName || 'Wali Santri',
        nama_santri: s.name,
        bulan,
        tahun: String(tahun),
        nama_pondok: namaPondok,
        tanggal_jatuh_tempo: '',
      },
    }]
  }

  if (type === 'guru-single') {
    const guruId = query.guruId as string
    if (!guruId) {
      throw createError({ statusCode: 400, statusMessage: 'guruId diperlukan' })
    }
    const snap = await db.ref(`guru/${guruId}`).once('value')
    if (!snap.exists()) {
      throw createError({ statusCode: 404, statusMessage: 'Guru tidak ditemukan' })
    }
    const g = snap.val() as any
    if (!g.phone) return []
    return [{
      id: guruId,
      name: g.name,
      phone: g.phone,
      studentName: '',
      classId: '',
      className: '',
      variables: {
        nama_wali: g.name,
        nama_santri: '',
        bulan,
        tahun: String(tahun),
        nama_pondok: namaPondok,
        tanggal_jatuh_tempo: '',
      },
    }]
  }

  if (type === 'classes') {
    const snap = await db.ref('classes').once('value')
    const classes = snap.val() || {}
    const result: any[] = []
    for (const [id, c] of Object.entries(classes) as any[]) {
      if (c.active !== false) {
        result.push({ id, name: c.name, level: c.level || '' })
      }
    }
    result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }

  if (type === 'guru-list') {
    const snap = await db.ref('guru').once('value')
    const teachers = snap.val() || {}
    const result: any[] = []
    for (const [id, g] of Object.entries(teachers) as any[]) {
      if ((g as any).status !== 'resigned') {
        result.push({ id, name: (g as any).name, phone: (g as any).phone || '' })
      }
    }
    result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }

  if (type === 'santri-list') {
    const snap = await db.ref('students').once('value')
    const students = snap.val() || {}
    const result: any[] = []
    for (const [id, s] of Object.entries(students) as any[]) {
      if (s.status === 'Active') {
        result.push({ id, name: s.name, phone: s.phone || '', parentName: s.parentName || '', parentPhone: s.parentPhone || '', className: s.class || '' })
      }
    }
    result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }

  throw createError({ statusCode: 400, statusMessage: `Tipe kontak "${type}" tidak dikenal` })
})
