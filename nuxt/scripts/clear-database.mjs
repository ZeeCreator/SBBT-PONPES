// Clear Database — Hapus semua data kecuali roles & auth users
// Usage: cd nuxt && node scripts/clear-database.mjs

import admin from 'firebase-admin'
import { readFileSync } from 'fs'

const envContent = readFileSync(new URL('../../.env', import.meta.url), 'utf-8')
const saMatch = envContent.match(/FIREBASE_SERVICE_ACCOUNT_KEY=(.+)/)
const dbURLMatch = envContent.match(/FIREBASE_DATABASE_URL=(.+)/)
if (!saMatch) { console.error('ERROR: FIREBASE_SERVICE_ACCOUNT_KEY not found'); process.exit(1) }

const databaseURL = (dbURLMatch?.[1] || 'https://alfatahsppt-default-rtdb.firebaseio.com').trim()
const serviceAccount = JSON.parse(Buffer.from(saMatch[1].trim(), 'base64').toString('utf-8'))

admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL })
const rtdb = admin.database()

async function main() {
  console.log('🗑️  Membersihkan database...\n')

  // Path yang akan dihapus (kecuali roles)
  const pathsToClear = [
    'students', 'teachers', 'curriculum', 'violations',
    'invoices', 'payments', 'attendance', 'activity_logs',
    'seed_data',
  ]

  for (const p of pathsToClear) {
    const snap = await rtdb.ref(p).once('value')
    const count = Object.keys(snap.val() || {}).length
    if (count > 0) {
      await rtdb.ref(p).remove()
      console.log(`  ✅ ${p}: ${count} entry dihapus`)
    } else {
      console.log(`  - ${p}: sudah kosong`)
    }
  }

  // Cek roles masih ada
  const rolesSnap = await rtdb.ref('roles').once('value')
  const roles = rolesSnap.val() || {}
  console.log(`\n🔑 Roles: ${Object.keys(roles).length} user(s) dipertahankan`)
  for (const [uid, r] of Object.entries(roles)) {
    console.log(`   - ${r.email} : ${r.role}`)
  }

  console.log('\n✅ Database bersih!')
  await admin.app().delete()
  process.exit(0)
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })
