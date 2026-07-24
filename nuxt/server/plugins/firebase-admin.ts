import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'

export default defineNitroPlugin(() => {
  if (!getApps().length) {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    const databaseURL = process.env.NUXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://alfatahsppt-default-rtdb.firebaseio.com'
    let firebaseConfig: any

    if (serviceAccountBase64) {
      try {
        const serviceAccount = JSON.parse(
          Buffer.from(serviceAccountBase64, 'base64').toString('utf-8')
        )
        firebaseConfig = {
          credential: cert(serviceAccount),
          databaseURL,
        }
      } catch (e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e.message)
        // Fallback to application default credentials (will work only in GC environments)
        firebaseConfig = { databaseURL }
      }
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not set, using default credentials')
      firebaseConfig = { databaseURL }
    }

    initializeApp(firebaseConfig)
  }

  const rtdb = getDatabase()
  const auth = getAuth()

  console.log('Firebase Admin initialized for Nitro server (RTDB + Auth)')
})