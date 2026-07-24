import { d as defineEventHandler, b as getQuery } from '../../_/nitro.mjs';
import { r as rtdbGetList } from '../../_/firebase.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const q = getQuery(event);
  let teachers = await rtdbGetList("guru");
  if (q.specialization) teachers = teachers.filter((t) => t.specialization === q.specialization);
  if (q.status) teachers = teachers.filter((t) => t.status === q.status);
  teachers.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return teachers;
});

export { index_get as default };
//# sourceMappingURL=index5.get.mjs.map
