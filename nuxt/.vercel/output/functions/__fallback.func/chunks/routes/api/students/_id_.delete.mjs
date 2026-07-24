import { d as defineEventHandler, c as getRouterParam, a as getDatabase } from '../../../_/nitro.mjs';
import { l as logActivity } from '../../../_/firebase.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  const id = getRouterParam(event, "id");
  const db = getDatabase();
  let name = "";
  try {
    const snap = await db.ref(`students/${id}`).once("value");
    name = ((_a = snap.val()) == null ? void 0 : _a.name) || "";
  } catch {
  }
  await db.ref(`students/${id}`).remove();
  await logActivity(event, "Hapus Santri", `${name || id}`, "person_remove", "#ba1a1a");
  return { message: "deleted", id };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
