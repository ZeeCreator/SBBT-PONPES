import { getDatabase } from 'firebase-admin/database'
import { getAuth } from 'firebase-admin/auth'

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'
function genId(): string {
  let id = ''
  for (let i = 0; i < 20; i++) id += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  return id
}

export default defineEventHandler(async () => {
  const db = getDatabase()
  const auth = getAuth()
  const results: Record<string, any> = {}
  let allOk = true

  // Firebase RTDB ping
  try {
    const t0 = Date.now()
    await db.ref('.info/connected').once('value')
    results.rtdb = { status: 'ok', latency: Date.now() - t0 + 'ms' }
  } catch (e: any) {
    results.rtdb = { status: 'error', message: e.message }
    allOk = false
  }

  // Firebase Auth ping
  try {
    const t0 = Date.now()
    await auth.listUsers(1)
    results.auth = { status: 'ok', latency: Date.now() - t0 + 'ms' }
  } catch (e: any) {
    results.auth = { status: 'error', message: e.message }
    allOk = false
  }

  const status = allOk ? 'healthy' : 'degraded'
  const timestamp = new Date().toISOString()
  const logId = genId()

  // Write to uptime_logs in RTDB
  const logEntry = {
    status,
    timestamp,
    services: results,
    uptime: process.uptime(),
  }
  await db.ref(`uptime_logs/${logId}`).set(logEntry)

  // Keep only last 1000 logs
  const allSnap = await db.ref('uptime_logs').once('value')
  if (allSnap.exists()) {
    const keys = Object.keys(allSnap.val()).sort()
    if (keys.length > 1000) {
      const toRemove = keys.slice(0, keys.length - 1000)
      await Promise.all(toRemove.map(k => db.ref(`uptime_logs/${k}`).remove()))
    }
  }

  return { id: logId, ...logEntry }
})
