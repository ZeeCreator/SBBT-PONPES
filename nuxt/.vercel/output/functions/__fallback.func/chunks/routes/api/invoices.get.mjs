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
