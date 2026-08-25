// Import absensi Tahfidz & Mutholaah dari template absen kelas
// Usage (dari direktori nuxt/): node scripts/import-absen-kelas5.mjs [bulan YYYY-MM]
// Default bulan: agustus 2026 (2026-08)
// Nilai absensi dikosongkan (template cetak sebelum data dimasukkan).
// Santri dicocokkan dari database berdasarkan nama (tidak membuat santri baru).

import fs from 'fs'
import path from 'path'
import admin from 'firebase-admin'

const MONTH = process.argv[2] || '2026-08'
const DATABASE_URL = process.env.FIREBASE_DATABASE_URL || 'https://alfatahsppt-default-rtdb.firebaseio.com'

const SANTRI_KELAS_5 = [
  'AKMAL',
  'AZIZ',
  'BINTANG',
  'FAZILAH',
  'HABIBURRAHMAN',
  'IQBAL',
  'LUTFI',
  'MUHAMMAD AL-FATIH',
  'MUHAMMAD RAKA ANANTA',
  'MUHAMMAD RAMEZA FAREL',
  'MUHAMMAD UMAIR ABDUL HAFIZ',
  'RAHMAT',
  'REHAN',
  'RUSDI',
  'YUSUF',
]

function getServiceAccount() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (b64) return JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'))
  const candidates = [
    path.resolve(process.cwd(), '../serviceacc.json'),
    path.resolve(process.cwd(), 'serviceacc.json'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      console.log(`Menggunakan service account: ${p}`)
      return JSON.parse(fs.readFileSync(p, 'utf-8'))
    }
  }
  console.error('ERROR: Service account tidak ditemukan.')
  console.error('Set FIREBASE_SERVICE_ACCOUNT_KEY (base64) atau letakkan serviceacc.json di root proyek.')
  process.exit(1)
}

function normalizeName(name) {
  return String(name || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
}

function emptyMarks(daysInMonth) {
  const marks = {}
  for (let d = 1; d <= daysInMonth; d++) marks[String(d)] = ''
  return marks
}

async function main() {
  const serviceAccount = getServiceAccount()
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL: DATABASE_URL })
  const db = admin.database()

  const [year, month] = MONTH.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  const monthId = MONTH

  // 1. Ambil semua santri dari database
  const snap = await db.ref('students').once('value')
  const studentsRaw = snap.val() || {}
  const students = Object.entries(studentsRaw).map(([id, val]) => ({ id, ...val }))
  console.log(`Total santri di database: ${students.length}`)

  // 2. Cocokkan nama template dengan database (exact lalu partial)
  const byNorm = new Map()
  for (const s of students) byNorm.set(normalizeName(s.name), s)

  const matched = []
  const unmatched = []
  for (const rawName of SANTRI_KELAS_5) {
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

  console.log(`\nCocok: ${matched.length}, Tidak cocok: ${unmatched.length}`)
  for (const m of matched) console.log(`  ✓ ${m.name} (${m.class || '-'}) [${m.id}]`)
  for (const u of unmatched) console.log(`  ✗ ${u} (TIDAK DITEMUKAN di database)`)

  if (matched.length === 0) {
    console.log('\nTidak ada santri yang cocok. Tidak ada record dibuat.')
    await admin.app().delete()
    process.exit(0)
  }

  const records = matched.map(s => ({
    studentId: s.id,
    name: s.name,
    nis: s.nis || '',
    class: s.class || '',
    marks: emptyMarks(daysInMonth),
  }))

  // 3. Insert/update untuk kedua modul (hindari duplikat bulan yang sama)
  for (const [path, label] of [['attendance_tahfidz', 'Tahfidz'], ['attendance_mutholaah', "Muthola'ah"]]) {
    const listSnap = await db.ref(path).orderByChild('monthId').equalTo(monthId).once('value')
    const existing = listSnap.val()
    const now = new Date().toISOString()

    if (existing && Object.keys(existing).length > 0) {
      const key = Object.keys(existing)[0]
      await db.ref(`${path}/${key}`).update({
        records,
        year,
        month,
        class: 'Semua',
        updatedAt: now,
      })
      console.log(`\n✅ ${label}: record bulan ${monthId} diperbarui (${key}) — ${records.length} santri, nilai dikosongkan`)
    } else {
      const ref = await db.ref(path).push({
        monthId,
        year,
        month,
        class: 'Semua',
        records,
        createdAt: now,
        updatedAt: now,
      })
      console.log(`\n✅ ${label}: record baru dibuat (${ref.key}) — ${records.length} santri, nilai dikosongkan`)
    }
  }

  await admin.app().delete()
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
