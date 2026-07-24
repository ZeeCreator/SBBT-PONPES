import { d as defineEventHandler, b as getQuery, a as getDatabase } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'fs';
import 'google-auth-library';
import 'fast-deep-equal';
import 'http';
import 'https';
import 'http2';
import 'url';
import 'events';
import '@fastify/busboy';
import 'zlib';
import 'jsonwebtoken';
import 'jwks-rsa';
import '@firebase/database-compat/standalone';
import 'path';
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
