import { d as defineEventHandler, b as getQuery, a as getDatabase, e as createError } from '../../../_/nitro.mjs';
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
