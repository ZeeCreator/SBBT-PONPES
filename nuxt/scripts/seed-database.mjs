// Seed Database Script — SIM-PPT (Realtime Database)
// Usage: cd nuxt && node scripts/seed-database.mjs

import admin from 'firebase-admin'
import { readFileSync } from 'fs'

const envContent = readFileSync(new URL('../../.env', import.meta.url), 'utf-8')
const saMatch = envContent.match(/FIREBASE_SERVICE_ACCOUNT_KEY=(.+)/)
const dbURLMatch = envContent.match(/FIREBASE_DATABASE_URL=(.+)/)

if (!saMatch) {
  console.error('ERROR: FIREBASE_SERVICE_ACCOUNT_KEY tidak ditemukan di .env')
  process.exit(1)
}

const databaseURL = (dbURLMatch?.[1] || 'https://alfatahsppt-default-rtdb.firebaseio.com').trim()
const serviceAccount = JSON.parse(Buffer.from(saMatch[1].trim(), 'base64').toString('utf-8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL,
})

const rtdb = admin.database()
const auth = admin.auth()

// ─── DATA SAMPLE ───────────────────────────────────────────────

const mapel = [
  { code: 'QUR-101', name: "Al-Qur'an & Tajwid", dept: 'Tahfidz' },
  { code: 'TAH-101', name: 'Tahfidz Juz 30', dept: 'Tahfidz' },
  { code: 'FIQ-101', name: 'Fiqih Ibadah', dept: 'Diniyah' },
  { code: 'AQI-101', name: 'Akidah Akhlak', dept: 'Diniyah' },
  { code: 'BBA-101', name: 'Bahasa Arab', dept: 'Diniyah' },
  { code: 'MAT-101', name: 'Matematika', dept: 'Umum' },
  { code: 'BIN-101', name: 'Bahasa Indonesia', dept: 'Umum' },
  { code: 'IPA-101', name: 'IPA Terpadu', dept: 'Umum' },
]

const namaSantri = [
  'Ahmad Fauzan', 'Bilal Abdurrahman', 'Zaid Al-Bukhari', 'Umar Ibn Khattab',
  'Hafidz Al-Qurtubi', 'Ihsan Ramadhan', 'Muhammad Al-Fatih', 'Rafi Az-zahran',
  "Sa'd bin Abi Waqqas", 'Usman Affandi', 'Ali Zainal Abidin', 'Farhan Maulana',
  'Rizky Syahputra', 'Hamzah Al-Kahfi', 'Yusuf Al-Habsyi', 'Iqbal Darmawan',
  'Nabil Al-Ghifari', 'Ridho Al-Farisi', 'Syamil Al-Banjari', 'Thariq Aziz',
]

const namaGuru = [
  'KH. Ahmad Dahlan', 'Ust. Hasan Basri', 'Ust. Abdurrahman Wahid',
  'Ust. Muhammad Natsir', "Ust. Hasyim Asy'ari",
]

const jenisPelanggaran = [
  { type: 'Minor', cat: 'Terlambat Sholat', points: 5 },
  { type: 'Minor', cat: 'Seragam tidak rapi', points: 5 },
  { type: 'Moderate', cat: 'Meninggalkan kelas tanpa izin', points: 10 },
  { type: 'Moderate', cat: 'Tidak mengikuti sholat berjamaah', points: 10 },
  { type: 'Severe', cat: 'Merokok di lingkungan pondok', points: 20 },
  { type: 'Severe', cat: 'Membawa HP tanpa izin', points: 20 },
]

const kelas = [
  { name: 'Kelas 10 - Al-Azhar', level: '10', group: 'A', homeroomTeacher: 'KH. Ahmad Dahlan', active: true },
  { name: 'Kelas 10 - Madinah', level: '10', group: 'B', homeroomTeacher: 'Ust. Hasan Basri', active: true },
  { name: 'Kelas 11 - Al-Azhar', level: '11', group: 'A', homeroomTeacher: 'Ust. Abdurrahman Wahid', active: true },
  { name: 'Kelas 11 - Madinah', level: '11', group: 'B', homeroomTeacher: 'Ust. Muhammad Natsir', active: true },
  { name: 'Kelas 12 - Al-Azhar', level: '12', group: 'A', homeroomTeacher: 'Ust. Hasyim Asy\'ari', active: true },
  { name: 'Kelas 12 - Madinah', level: '12', group: 'B', homeroomTeacher: 'Ust. Hasyim Asy\'ari', active: true },
]

const bulanSPP = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 20; i++) id += chars.charAt(Math.floor(Math.random() * chars.length))
  return id
}

// ─── MAIN ──────────────────────────────────────────────────────

async function main() {
  console.log('🚀  Seeding Realtime Database SIM-PPT...\n')

  // 1. Role Admin
  console.log('👤  Menyiapkan admin...')
  let adminUid
  try {
    const user = await auth.getUserByEmail('admin@gmail.com')
    adminUid = user.uid
    console.log('  Admin ditemukan:', user.email)
  } catch {
    const user = await auth.createUser({
      email: 'admin@gmail.com', password: 'admin123', displayName: 'Admin SIM-PPT',
    })
    adminUid = user.uid
    console.log('  Admin dibuat:', user.email)
  }

  await rtdb.ref(`roles/${adminUid}`).set({
    role: 'super_admin', email: 'admin@gmail.com',
    displayName: 'Admin SIM-PPT', updatedAt: new Date().toISOString(),
  })
  await auth.setCustomUserClaims(adminUid, { role: 'super_admin' })
  console.log('  ✅  Role super_admin terpasang\n')

  // 2. Kurikulum
  console.log('📚  Menambahkan kurikulum...')
  const kurikulumData = mapel.map(m => ({
    code: m.code, name: m.name, department: m.dept,
    hours: Math.floor(Math.random() * 6) + 2,
    teacher: random(namaGuru), active: true,
    createdAt: new Date().toISOString(),
  }))
  const kurikulumRef = {}
  for (const k of kurikulumData) {
    kurikulumRef[generateId()] = k
  }
  await rtdb.ref('curriculum').set(kurikulumRef)
  console.log(`  ✅  ${kurikulumData.length} mata pelajaran\n`)

  // 3. Guru
  console.log('👨‍🏫  Menambahkan guru...')
  const guruRef = {}
  for (const g of namaGuru) {
    guruRef[generateId()] = {
      name: g,
      email: g.toLowerCase().replace(/[^a-z]/g, '.') + '@pesantren.sch.id',
      phone: '08' + String(Math.floor(Math.random() * 90000000000) + 10000000000),
      specialization: random(['Tahfidz', 'Kitab Kuning', 'Umum', 'Bahasa Arab', 'Mahir']),
      subjects: [],
      nuptk: String(Math.floor(Math.random() * 9000000000) + 1000000000),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
  await rtdb.ref('teachers').set(guruRef)
  console.log(`  ✅  ${namaGuru.length} guru\n`)

  // 4. Kelas
  console.log('🏫  Menambahkan kelas...')
  const classRef = {}
  const classMap = {} // name -> id
  for (const k of kelas) {
    const cid = generateId()
    classRef[cid] = { ...k, createdAt: new Date().toISOString() }
    classMap[k.name] = cid
  }
  await rtdb.ref('classes').set(classRef)
  console.log(`  ✅  ${kelas.length} kelas\n`)

  // 5. Dormitories
  console.log('🏠  Menambahkan gedung & kamar...')
  const dormRef = {}
  const dormList = [
    { name: 'Gedung A', gender: 'Laki-laki', rooms: ['Kamar 1A', 'Kamar 2A', 'Kamar 3A'] },
    { name: 'Gedung B', gender: 'Laki-laki', rooms: ['Kamar 1B', 'Kamar 2B', 'Kamar 3B'] },
    { name: 'Gedung C', gender: 'Perempuan', rooms: ['Kamar 1C', 'Kamar 2C', 'Kamar 3C'] },
  ]
  for (const d of dormList) {
    dormRef[generateId()] = { ...d, createdAt: new Date().toISOString() }
  }
  await rtdb.ref('dormitories').set(dormRef)
  console.log(`  ✅  ${dormList.length} gedung & kamar\n`)

  // 6. Santri
  console.log('👦  Menambahkan santri...')
  const santriRef = {}
  const studentIdList = []

  for (let i = 0; i < namaSantri.length; i++) {
    const sid = generateId()
    studentIdList.push(sid)
    const status = i < 16 ? 'Active' : (i < 18 ? 'On Leave' : 'Alumni')
    const cls = random(kelas)
    santriRef[sid] = {
      nis: String(2024000 + i + 1), name: namaSantri[i],
      city: random(['Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Bogor', 'Depok']),
      class: cls.name, classId: classMap[cls.name], grade: 10 + Math.floor(i / 6),
      gender: random(['Laki-laki', 'Laki-laki', 'Laki-laki', 'Laki-laki', 'Perempuan']),
      disciplineScore: 100 - (i * 3), status,
      createdAt: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString(),
    }
  }
  await rtdb.ref('students').set(santriRef)
  console.log(`  ✅  ${studentIdList.length} santri ditambahkan\n`)

  // 7. Nilai (grades)
  console.log('📝  Menambahkan nilai...')
  let totalGrade = 0
  for (const sid of studentIdList) {
    const gradesRef = {}
    for (const m of mapel) {
      const score = Math.floor(Math.random() * 31) + 70
      const grade = score >= 90 ? 'A' : score >= 85 ? 'A-' : score >= 80 ? 'B+' : score >= 75 ? 'B' : score >= 70 ? 'B-' : 'C'
      gradesRef[generateId()] = {
        studentId: sid, subject: m.name, score, grade,
        semester: 1, academicYear: '2024/2025',
        createdAt: new Date().toISOString(),
      }
      totalGrade++
    }
    await rtdb.ref(`students/${sid}/grades`).set(gradesRef)
  }
  console.log(`  ✅  ${totalGrade} nilai ditambahkan\n`)

  // 8. Pelanggaran (ditulis ke students/{sid}/violations DAN violations global)
  console.log('⚠️   Menambahkan pelanggaran...')
  let totalViolation = 0
  for (let i = 0; i < 8; i++) {
    const vid = generateId()
    const sid = random(studentIdList)
    const p = jenisPelanggaran[i % jenisPelanggaran.length]
    const violation = {
      studentId: sid, type: p.type, category: p.cat,
      description: `Santri melanggar: ${p.cat}`,
      pointsDeducted: p.points,
      reportedBy: random(namaGuru),
      timestamp: new Date(Date.now() - i * 3 * 86400000).toISOString(),
    }
    await rtdb.ref(`students/${sid}/violations/${vid}`).set(violation)
    await rtdb.ref(`violations/${vid}`).set(violation)
    totalViolation++
  }
  console.log(`  ✅  ${totalViolation} pelanggaran ditambahkan\n`)

  // 9. Absensi
  console.log('📋  Menambahkan absensi...')
  const statusAbsen = ['present', 'present', 'present', 'present', 'sick', 'permit', 'absent']
  let totalAbsensi = 0
  const absensiRef = {}
  for (const sid of studentIdList) {
    for (let d = 0; d < 10; d++) {
      const tgl = new Date(Date.now() - d * 86400000)
      if (tgl.getDay() === 0 || tgl.getDay() === 6) continue
      absensiRef[generateId()] = {
        studentId: sid, studentName: '', class: '',
        date: tgl.toISOString().split('T')[0],
        status: random(statusAbsen),
        activity: 'Pagi - Sholat Subuh Berjamaah',
        createdAt: new Date().toISOString(),
      }
      totalAbsensi++
    }
  }
  await rtdb.ref('attendance').set(absensiRef)
  console.log(`  ✅  ${totalAbsensi} absensi ditambahkan\n`)

  // 10. Invoice + Payment
  console.log('💰  Menambahkan invoice & pembayaran...')
  let totalInvoice = 0
  const invoiceRef = {}
  const paymentRef = {}

  for (const sid of studentIdList.slice(0, 10)) {
    for (let m = 0; m < 3; m++) {
      const monthIdx = (new Date().getMonth() - m + 12) % 12
      const amount = 300000
      const serviceFee = 2500
      const uniqueCode = Math.floor(Math.random() * 900) + 100
      const isPaid = m === 0 || m === 1
      const iid = generateId()

      invoiceRef[iid] = {
        studentId: sid, studentName: namaSantri[studentIdList.indexOf(sid)],
        month: bulanSPP[monthIdx], year: 2024,
        amount, serviceFee, uniqueCode,
        totalAmount: amount + serviceFee + uniqueCode,
        status: isPaid ? 'paid' : 'pending',
        dueDate: new Date(2024, monthIdx + 1, 15).toISOString(),
        createdAt: new Date(2024, monthIdx, 25).toISOString(),
      }
      if (isPaid) {
        invoiceRef[iid].paidAt = new Date(2024, monthIdx, 5).toISOString()
        invoiceRef[iid].paymentMethod = random(['bank_transfer', 'gopay', 'qris', 'credit_card'])
        invoiceRef[iid].transactionId = 'TRX-' + String(Math.floor(Math.random() * 90000000) + 10000000)

        paymentRef[generateId()] = {
          invoiceId: iid, amount: amount + serviceFee + uniqueCode,
          status: 'success',
          transactionId: invoiceRef[iid].transactionId,
          paymentMethod: invoiceRef[iid].paymentMethod,
          paidAt: invoiceRef[iid].paidAt,
        }
      }
      totalInvoice++
    }
  }
  await rtdb.ref('invoices').set(invoiceRef)
  await rtdb.ref('payments').set(paymentRef)
  console.log(`  ✅  ${totalInvoice} invoice + ${Object.keys(paymentRef).length} pembayaran\n`)

  // 11. Activity Logs
  console.log('📜  Menambahkan log aktivitas...')
  const logEntries = [
    { action: 'Login Sistem', icon: 'login', color: '#003527' },
    { action: 'Tambah Santri Baru', icon: 'person_add', color: '#003527' },
    { action: 'Proses Pembayaran SPP', icon: 'credit_card', color: '#9b4500' },
    { action: 'Laporkan Pelanggaran', icon: 'gavel', color: '#ba1a1a' },
    { action: 'Update Data Guru', icon: 'badge', color: '#003527' },
    { action: 'Generate Laporan', icon: 'description', color: '#2c2f30' },
  ]
  const logsRef = {}
  for (let i = 0; i < 15; i++) {
    const e = logEntries[i % logEntries.length]
    logsRef[generateId()] = {
      action: e.action,
      description: `${e.action} — ${new Date(Date.now() - i * 3600000).toLocaleString('id-ID')}`,
      user: 'Admin SIM-PPT',
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      icon: e.icon,
      color: e.color,
    }
  }
  await rtdb.ref('activity_logs').set(logsRef)
  console.log(`  ✅  15 log aktivitas\n`)

  // ── SELESAI ───────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════')
  console.log('🎉  SEEDING DATABASE SELESAI!')
  console.log('═══════════════════════════════════════════\n')
  console.log('📊  Ringkasan:')
  console.log(`   Santri      : ${studentIdList.length}`)
  console.log(`   Guru        : ${namaGuru.length}`)
  console.log(`   Mapel       : ${kurikulumData.length}`)
  console.log(`   Nilai       : ${totalGrade}`)
  console.log(`   Pelanggaran : ${totalViolation}`)
  console.log(`   Absensi     : ${totalAbsensi}`)
  console.log(`   Invoice     : ${totalInvoice}`)
  console.log(`   Pembayaran  : ${Object.keys(paymentRef).length}`)
  console.log(`   Log Aktivitas: 15\n`)
  console.log('👤  Login: admin@gmail.com / admin123 (role: super_admin)')

  await admin.app().delete()
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
