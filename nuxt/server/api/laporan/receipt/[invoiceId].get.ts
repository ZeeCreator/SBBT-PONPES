import { defineEventHandler, getRouterParams } from 'h3'
import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const { invoiceId } = getRouterParams(event)

  const db = getDatabase()

  const [invoiceSnap, paymentsSnap] = await Promise.all([
    db.ref('invoices/' + invoiceId).once('value'),
    db.ref('payments').orderByChild('invoiceId').equalTo(invoiceId).once('value')
  ])

  if (!invoiceSnap.exists()) {
    throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  }

  const invoice = { id: invoiceId, ...invoiceSnap.val() }
  const paymentsData = paymentsSnap.val() || {}
  const payments = Object.entries(paymentsData).map(([id, val]) => ({ id, ...(val as object) }))

  return {
    invoice,
    payments,
    receiptType: 'pembayaran-spp',
    generatedAt: new Date().toISOString()
  }
})

