import { defineEventHandler, getQuery } from 'h3'
import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const startDate = query.startDate
  const endDate = query.endDate

  const db = getDatabase()

  const [invoicesSnap, paymentsSnap] = await Promise.all([
    db.ref('invoices').once('value'),
    db.ref('payments').once('value')
  ])

  const invoicesData = invoicesSnap.val() || {}
  const paymentsData = paymentsSnap.val() || {}

  const invoices = Object.entries(invoicesData).map(([id, val]) => ({ id, ...(val as object) }))
  const payments = Object.entries(paymentsData).map(([id, val]) => ({ id, ...(val as object) }))

  let paidInvoices = invoices.filter((inv: any) => inv.status === 'paid' || inv.status === 'lunas')

  if (startDate) {
    paidInvoices = paidInvoices.filter((inv: any) => {
      const d = inv.paidAt || inv.createdAt
      return d && d >= startDate
    })
  }
  if (endDate) {
    paidInvoices = paidInvoices.filter((inv: any) => {
      const d = inv.paidAt || inv.createdAt
      return d && d <= endDate
    })
  }

  let filteredPayments = payments
  if (startDate) {
    filteredPayments = filteredPayments.filter((p: any) => {
      const d = p.paidAt || p.createdAt
      return d && d >= startDate
    })
  }
  if (endDate) {
    filteredPayments = filteredPayments.filter((p: any) => {
      const d = p.paidAt || p.createdAt
      return d && d <= endDate
    })
  }

  const invoiceIncome = paidInvoices.reduce((sum: number, inv: any) => sum + (Number(inv.amount) || 0), 0)
  const paymentIncome = filteredPayments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0)

  return {
    period: startDate + ' to ' + endDate,
    totalInvoiceIncome: invoiceIncome,
    totalPaymentIncome: paymentIncome,
    totalTransactions: paidInvoices.length + filteredPayments.length,
    invoices: paidInvoices,
    payments: filteredPayments
  }
})

