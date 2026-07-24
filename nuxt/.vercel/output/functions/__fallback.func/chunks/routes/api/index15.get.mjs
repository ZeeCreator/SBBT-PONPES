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

const index_get = defineEventHandler(async (event) => {
  const q = getQuery(event);
  const uid = String(q.uid || "");
  const db = getDatabase();
  let ref = db.ref("todos");
  if (uid) ref = ref.orderByChild("uid").equalTo(uid);
  const snap = await ref.once("value");
  const data = snap.val() || {};
  let list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
  if (uid) {
    list = list.filter((t) => t.uid === uid);
  }
  list.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (b.createdAt || "").localeCompare(a.createdAt || "");
  });
  return list;
});

export { index_get as default };
//# sourceMappingURL=index15.get.mjs.map
