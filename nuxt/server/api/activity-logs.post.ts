import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = getDatabase()

  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  const log = {
    action: body.action,
    description: body.description || body.action,
    icon: body.icon || 'info',
    color: body.color || '#1a6bff',
    userName: body.userName || 'System',
    timestamp: new Date().toISOString(),
  }

  await db.ref(`activity_logs/${id}`).set(log)
  return { id, ...log }
})
