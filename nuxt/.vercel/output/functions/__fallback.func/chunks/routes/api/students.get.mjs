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

const students_get = defineEventHandler(async (event) => {
  const q = getQuery(event);
  const db = getDatabase();
  const snap = await db.ref("students").once("value");
  const data = snap.val() || {};
  let students = Object.entries(data).map(([id, val]) => ({ id, ...val }));
  if (q.class) students = students.filter((s) => s.class === q.class);
  if (q.status) students = students.filter((s) => s.status === q.status);
  students.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return students;
});

export { students_get as default };
//# sourceMappingURL=students.get.mjs.map
