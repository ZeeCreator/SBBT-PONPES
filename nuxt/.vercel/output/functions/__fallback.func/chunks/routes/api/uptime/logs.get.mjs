import { d as defineEventHandler, b as getQuery, a as getDatabase } from '../../../_/nitro.mjs';
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

const logs_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Math.min(Math.max(parseInt(String(query.limit || "20")), 1), 100);
  const db = getDatabase();
  const snap = await db.ref("uptime_logs").once("value");
  if (!snap.exists()) return [];
  const entries = Object.entries(snap.val()).map(([id, val]) => ({ id, ...val }));
  entries.sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
  return entries.slice(0, limit);
});

export { logs_get as default };
//# sourceMappingURL=logs.get.mjs.map
