import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const db = getDatabase()
  const snap = await db.ref('payments').once('value')
  const data = snap.val() || {}
  let payments = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))
  if (q.invoiceId) payments = payments.filter(p => (p as any).invoiceId === q.invoiceId)
  if (q.studentId) payments = payments.filter(p => (p as any).studentId === q.studentId)
  payments.sort((a: any, b: any) => new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime())
  return payments
})
