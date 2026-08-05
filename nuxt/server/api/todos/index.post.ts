import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.uid || !body.title) {
    throw createError({ statusCode: 400, statusMessage: 'UID dan judul diperlukan' })
  }

  const db = getDatabase()
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 20; i++) id += chars.charAt(Math.floor(Math.random() * chars.length))

  const todo = {
    uid: body.uid,
    title: body.title.trim(),
    description: body.description || '',
    priority: body.priority || 'medium',
    done: false,
    createdAt: new Date().toISOString(),
  }

  await db.ref(`todos/${id}`).set(todo)
  await logActivity(event, 'Tambah Todo', todo.title, 'checklist', '#1a6bff')
  return { id, ...todo }
})
