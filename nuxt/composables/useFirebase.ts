import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth, signInWithEmailAndPassword, signInWithCustomToken, createUserWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getDatabase, ref as rtdbRef, get, type Database } from 'firebase/database'

let firebaseApp: FirebaseApp
let db: Firestore
let auth: Auth
let storage: FirebaseStorage
let rtdb: Database

function initFirebase() {
  if (firebaseApp) return

  const config = useRuntimeConfig()

  firebaseApp = initializeApp({
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    databaseURL: config.public.firebaseDatabaseUrl,
  })

  db = getFirestore(firebaseApp)
  auth = getAuth(firebaseApp)
  storage = getStorage(firebaseApp)
  rtdb = getDatabase(firebaseApp)
}

export function useFirebase() {
  if (import.meta.client) {
    initFirebase()
  }

  return { firebaseApp, db, auth, storage, rtdb }
}

async function fetchRoleFromRtdb(uid: string): Promise<string | null> {
  try {
    const snap = await get(rtdbRef(rtdb, `roles/${uid}/role`))
    if (snap.exists()) return snap.val()
  } catch {}
  return null
}

export function useAuth() {
  const { auth } = useFirebase()
  const user = useState<User | null>('auth-user', () => null)
  const role = useState<string | null>('auth-role', () => null)
  const loading = useState<boolean>('auth-loading', () => true)
  const authCookie = useCookie<boolean>('auth-logged-in', {
    default: () => false,
    sameSite: 'lax',
    path: '/',
  })

  function init() {
    if (import.meta.client) {
      onAuthStateChanged(auth, (u) => {
        user.value = u
        loading.value = false
        authCookie.value = !!u
      })
    }
  }

  async function login(email: string, password: string) {
    // Call server endpoint to get session cookie + verify credentials
    const res = await $fetch<{ uid: string; role: string; name: string; idToken: string }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })

    // Sign in with Firebase client SDK using the returned ID token
    // We use signInWithCustomToken with a workaround: import the ID token directly
    // Actually, on success the server already set the session cookie.
    // For Firebase SDK: we need the user signed in. The idToken can be used with signInWithCustomToken
    // but idToken != customToken. So we use the existing signInWithEmailAndPassword on the client too.
    // The server endpoint is primarily for setting the session cookie.
    if (auth.currentUser?.email !== email) {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      user.value = cred.user
    }
    authCookie.value = true
    role.value = res.role || null

    try {
      fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Login Sistem',
          description: `${res.name || email}`,
          icon: 'login',
          color: '#1a6bff',
          userName: res.name || email,
        }),
      })
    } catch {}
    return auth.currentUser
  }

  async function loginWithNis(nis: string) {
    const res = await $fetch<{ uid: string; role: string; customToken: string; name: string; nis: string; email: string }>('/api/auth/nis-login', {
      method: 'POST',
      body: { nis },
    })
    // Session cookie is set by the server automatically

    // Sign in with Firebase client SDK using custom token
    if (res.customToken) {
      const cred = await signInWithCustomToken(auth, res.customToken)
      user.value = cred.user
    }
    authCookie.value = true
    role.value = res.role || 'wali_santri'

    try {
      fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Login NIS',
          description: `${res.name} (NIS: ${nis})`,
          icon: 'login',
          color: '#16a34a',
          userName: res.name || nis,
        }),
      })
    } catch {}
    return auth.currentUser
  }

  async function refreshRole() {
    if (!user.value) {
      role.value = null
      return
    }
    const r = await fetchRoleFromRtdb(user.value.uid)
    if (r) {
      role.value = r
      return
    }
    try {
      const idTokenResult = await user.value.getIdTokenResult()
      const claimsRole = idTokenResult.claims.role
      if (typeof claimsRole === 'string') {
        role.value = claimsRole
        return
      }
    } catch {}
    role.value = null
  }

  async function register(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  async function logout() {
    await signOut(auth)
    user.value = null
    role.value = null
    authCookie.value = false
    // Clear session cookie
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
  }

  async function loginWithToken(customToken: string) {
    const cred = await signInWithCustomToken(auth, customToken)
    user.value = cred.user
    authCookie.value = true
    return cred.user
  }

  async function getIdToken(): Promise<string | null> {
    if (!auth.currentUser) return null
    return auth.currentUser.getIdToken()
  }

  return { user, role, loading, init, login, loginWithNis, loginWithToken, register, logout, getIdToken, refreshRole }
}
