import { getDatabase } from 'firebase-admin/database'
import { getAuth } from 'firebase-admin/auth'

export default defineEventHandler(async () => {
  const start = Date.now()
  const results: Record<string, any> = {}
  let allOk = true

  // Firebase RTDB check
  try {
    const db = getDatabase()
    const t0 = Date.now()
    await db.ref('.info/connected').once('value')
    results.rtdb = { status: 'ok', latency: Date.now() - t0 + 'ms' }
  } catch (e: any) {
    results.rtdb = { status: 'error', message: e.message }
    allOk = false
  }

  // Firebase Auth check
  try {
    const auth = getAuth()
    const t0 = Date.now()
    await auth.listUsers(1)
    results.auth = { status: 'ok', latency: Date.now() - t0 + 'ms' }
  } catch (e: any) {
    results.auth = { status: 'error', message: e.message }
    allOk = false
  }

  return {
    status: allOk ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: results,
  }
})
