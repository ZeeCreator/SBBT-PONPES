import { d as defineEventHandler, b as getRouterParam } from '../../../../_/nitro.mjs';
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

const violations_get = defineEventHandler(async (event) => {
  const studentId = getRouterParam(event, "id");
  const db = getDatabase();
  const snap = await db.ref(`students/${studentId}/violations`).once("value");
  const data = snap.val() || {};
  const items = Object.entries(data).map(([id, val]) => ({ id, ...val }));
  items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return items;
});

export { violations_get as default };
//# sourceMappingURL=violations.get.mjs.map
