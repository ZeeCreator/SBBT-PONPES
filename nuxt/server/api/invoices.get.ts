import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const db = getDatabase()

  const snap = await db.ref('invoices').once('value')
  const data = snap.val() || {}

  let invoices = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))

  if (q.status) invoices = invoices.filter(inv => (inv as any).status === q.status)
  if (q.studentId) invoices = invoices.filter(inv => (inv as any).studentId === q.studentId)

  invoices.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())

  return invoices
})
