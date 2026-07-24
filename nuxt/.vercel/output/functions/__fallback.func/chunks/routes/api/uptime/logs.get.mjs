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
