import { getDatabase } from 'firebase-admin/database'
import { getAuth } from 'firebase-admin/auth'

export function useFirebaseAdmin() {
  const rtdb = getDatabase()
  const auth = getAuth()
  return { rtdb, auth }
}

export async function verifyFirebaseToken(authHeader?: string) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const idToken = authHeader.split('Bearer ')[1]
  const auth = getAuth()
  try {
    const decoded = await auth.verifyIdToken(idToken)
    return decoded
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
}

// ── Helper untuk generate ID unik ──────────────────────────────

export function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// ── Helper CRUD untuk RTDB (firebase-admin style) ─────────────

export async function rtdbGetList(path: string): Promise<any[]> {
  const db = getDatabase()
  const snap = await db.ref(path).once('value')
  const data = snap.val() || {}
  return Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))
}

export async function rtdbGetById(path: string, id: string): Promise<any | null> {
  const db = getDatabase()
  const snap = await db.ref(`${path}/${id}`).once('value')
  if (!snap.exists()) return null
  return { id, ...snap.val() }
}

export async function rtdbAdd(path: string, data: any): Promise<{ id: string } & any> {
  const db = getDatabase()
  const id = generateId()
  await db.ref(`${path}/${id}`).set(data)
  return { id, ...data }
}

export async function rtdbAddWithId(path: string, id: string, data: any): Promise<{ id: string } & any> {
  const db = getDatabase()
  await db.ref(`${path}/${id}`).set(data)
  return { id, ...data }
}

export async function rtdbUpdate(path: string, id: string, data: any): Promise<void> {
  const db = getDatabase()
  await db.ref(`${path}/${id}`).update(data)
}

export async function rtdbRemove(path: string, id: string): Promise<void> {
  const db = getDatabase()
  await db.ref(`${path}/${id}`).remove()
}

// ── Activity Logging ──────────────────────────────────────────

export async function logActivity(event: any, action: string, description: string, icon: string, color?: string) {
  try {
    const db = getDatabase()
    const id = generateId()
    let userName = 'System'
    try {
      if (event.context?.auth?.name) {
        userName = event.context.auth.name
      } else if (event.context?.auth?.email) {
        userName = event.context.auth.email
      } else {
        const authHeader = event.headers?.get?.('authorization')
        if (authHeader) {
          const decoded = await verifyFirebaseToken(authHeader)
          userName = decoded.name || decoded.email || 'System'
        }
      }
    } catch {}
    await db.ref(`activity_logs/${id}`).set({
      action,
      description,
      icon,
      color: color || '#1a6bff',
      userName,
      timestamp: new Date().toISOString(),
    })
  } catch {}
}

export async function rtdbQueryEqual(path: string, field: string, value: any): Promise<any[]> {
  const db = getDatabase()
  const snap = await db.ref(path).orderByChild(field).equalTo(value).once('value')
  const data = snap.val() || {}
  return Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))
}
