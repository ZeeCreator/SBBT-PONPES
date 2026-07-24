import { d as defineEventHandler, a as getQuery, c as createError } from '../../../_/nitro.mjs';
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

const nisMap_get = defineEventHandler(async (event) => {
  const q = getQuery(event);
  const nis = String(q.nis || "").trim();
  const listAll = q.list === "true" || nis === "all";
  const db = getDatabase();
  if (listAll) {
    const snap2 = await db.ref("nis_map").once("value");
    if (!snap2.exists()) return [];
    const data = snap2.val();
    return Object.entries(data).map(([nis2, val]) => ({ nis: nis2, ...val }));
  }
  if (!nis) throw createError({ statusCode: 400, statusMessage: "NIS diperlukan" });
  const snap = await db.ref(`nis_map/${nis}`).once("value");
  if (!snap.exists()) throw createError({ statusCode: 404, statusMessage: "NIS tidak terdaftar" });
  return snap.val();
});

export { nisMap_get as default };
//# sourceMappingURL=nis-map.get.mjs.map
