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

const activityLogs_get = defineEventHandler(async () => {
  const db = getDatabase();
  const snap = await db.ref("activity_logs").once("value");
  const data = snap.val() || {};
  const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
  list.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
  return list;
});

export { activityLogs_get as default };
//# sourceMappingURL=activity-logs.get.mjs.map
