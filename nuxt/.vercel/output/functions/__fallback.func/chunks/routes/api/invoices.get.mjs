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

const invoices_get = defineEventHandler(async (event) => {
  const q = getQuery(event);
  const db = getDatabase();
  const snap = await db.ref("invoices").once("value");
  const data = snap.val() || {};
  let invoices = Object.entries(data).map(([id, val]) => ({ id, ...val }));
  if (q.status) invoices = invoices.filter((inv) => inv.status === q.status);
  if (q.studentId) invoices = invoices.filter((inv) => inv.studentId === q.studentId);
  invoices.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return invoices;
});

export { invoices_get as default };
//# sourceMappingURL=invoices.get.mjs.map
