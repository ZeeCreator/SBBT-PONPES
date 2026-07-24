import { d as defineEventHandler, a as getDatabase } from '../../_/nitro.mjs';
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
  const db = getDatabase();
  const subjectsSnap = await db.ref("curriculum").once("value");
  const gradesSnap = await db.ref("grades").once("value");
  const subjectsCount = subjectsSnap.exists() ? Object.keys(subjectsSnap.val() || {}).length : 0;
  const gradesCount = gradesSnap.exists() ? Object.keys(gradesSnap.val() || {}).length : 0;
  return {
    subjects: subjectsCount,
    grades: gradesCount,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
