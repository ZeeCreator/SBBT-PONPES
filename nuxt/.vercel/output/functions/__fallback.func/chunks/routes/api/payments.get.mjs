import { d as defineEventHandler, a as getQuery } from '../../_/nitro.mjs';
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

const payments_get = defineEventHandler(async (event) => {
  const q = getQuery(event);
  const db = getDatabase();
  const snap = await db.ref("payments").once("value");
  const data = snap.val() || {};
  let payments = Object.entries(data).map(([id, val]) => ({ id, ...val }));
  if (q.invoiceId) payments = payments.filter((p) => p.invoiceId === q.invoiceId);
  if (q.studentId) payments = payments.filter((p) => p.studentId === q.studentId);
  payments.sort((a, b) => new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime());
  return payments;
});

export { payments_get as default };
//# sourceMappingURL=payments.get.mjs.map
