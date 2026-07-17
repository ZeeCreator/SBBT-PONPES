// One-time setup: Set admin role untuk user
// Usage: node scripts/setup-admin.mjs <UID> [role]
// Default role: super_admin
// Jalankan dari direktori nuxt/: cd nuxt && node scripts/setup-admin.mjs <UID>

import admin from 'firebase-admin'

const uid = process.argv[2] || 'YjTj0ZiMo5en1EfhgpOW4L8csJv1'
const role = process.argv[3] || 'super_admin'

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
if (!serviceAccountBase64) {
  console.error('ERROR: FIREBASE_SERVICE_ACCOUNT_KEY tidak ditemukan di environment.')
  console.error('')
  console.error('Cara mendapatkan Service Account Key:')
  console.error('1. Buka https://console.firebase.google.com/project/alfatahsppt/settings/serviceaccounts/adminsdk')
  console.error('2. Klik "Generate New Private Key"')
  console.error('3. Download file JSON-nya')
  console.error('4. Encode ke base64:')
  console.error('   - PowerShell:  [Convert]::ToBase64String([IO.File]::ReadAllBytes("path/to/key.json"))')
  console.error('   - Linux/Mac:   cat path/to/key.json | base64')
  console.error('5. Set environment variable:')
  console.error('   $env:FIREBASE_SERVICE_ACCOUNT_KEY="<base64_string>"')
  console.error('6. Jalankan script ini lagi')
  process.exit(1)
}

try {
  const serviceAccount = JSON.parse(
    Buffer.from(serviceAccountBase64, 'base64').toString('utf-8'),
  )

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://alfatahsppt-default-rtdb.firebaseio.com',
  })

  // Set custom claims (Firebase Auth)
  await admin.auth().setCustomUserClaims(uid, { role })

  // Set role di Realtime Database (dibaca oleh frontend)
  await admin.database().ref(`roles/${uid}`).set({
    role,
    email: '',
    displayName: '',
    updatedAt: new Date().toISOString(),
  })

  console.log(`✅ Role "${role}" berhasil diberikan ke user UID: ${uid}`)

  const user = await admin.auth().getUser(uid)
  console.log(`📧 Email: ${user.email}`)
  console.log(`👤 Name: ${user.displayName || '-'}`)
  console.log(`🎭 Role: ${user.customClaims?.role || 'none'}`)

  await admin.app().delete()
  process.exit(0)
} catch (err) {
  console.error('❌ Error:', err.message)
  process.exit(1)
}
