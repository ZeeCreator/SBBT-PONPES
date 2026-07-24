import { d as defineEventHandler, a as getQuery } from '../../../_/nitro.mjs';
import { getDatabase } from 'firebase-admin/database';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'firebase-admin/app';
import 'firebase-admin/auth';
import 'jose';

const financial_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const startDate = query.startDate;
  const endDate = query.endDate;
  const db = getDatabase();
  const [invoicesSnap, paymentsSnap] = await Promise.all([
    db.ref("invoices").once("value"),
    db.ref("payments").once("value")
  ]);
  const invoicesData = invoicesSnap.val() || {};
  const paymentsData = paymentsSnap.val() || {};
  const invoices = Object.entries(invoicesData).map(([id, val]) => ({ id, ...val }));
  const payments = Object.entries(paymentsData).map(([id, val]) => ({ id, ...val }));
  let paidInvoices = invoices.filter((inv) => inv.status === "paid" || inv.status === "lunas");
  if (startDate) {
    paidInvoices = paidInvoices.filter((inv) => {
      const d = inv.paidAt || inv.createdAt;
      return d && d >= startDate;
    });
  }
  if (endDate) {
    paidInvoices = paidInvoices.filter((inv) => {
      const d = inv.paidAt || inv.createdAt;
      return d && d <= endDate;
    });
  }
  let filteredPayments = payments;
  if (startDate) {
    filteredPayments = filteredPayments.filter((p) => {
      const d = p.paidAt || p.createdAt;
      return d && d >= startDate;
    });
  }
  if (endDate) {
    filteredPayments = filteredPayments.filter((p) => {
      const d = p.paidAt || p.createdAt;
      return d && d <= endDate;
    });
  }
  const invoiceIncome = paidInvoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const paymentIncome = filteredPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  return {
    period: startDate + " to " + endDate,
    totalInvoiceIncome: invoiceIncome,
    totalPaymentIncome: paymentIncome,
    totalTransactions: paidInvoices.length + filteredPayments.length,
    invoices: paidInvoices,
    payments: filteredPayments
  };
});

export { financial_get as default };
//# sourceMappingURL=financial.get.mjs.map
