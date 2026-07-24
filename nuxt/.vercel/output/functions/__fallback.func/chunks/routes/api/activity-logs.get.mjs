import { d as defineEventHandler } from '../../_/nitro.mjs';
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
