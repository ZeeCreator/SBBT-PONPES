import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { v as verifyFirebaseToken, a as rtdbAdd, l as logActivity } from '../../_/firebase.mjs';
import { g as generateNUPTK } from '../../_/id-generator.mjs';
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

const index_post = defineEventHandler(async (event) => {
  var _a;
  await verifyFirebaseToken(event.headers.get("authorization"));
  const body = await readBody(event) || {};
  const teacher = await rtdbAdd("guru", {
    name: ((_a = body.name) == null ? void 0 : _a.trim()) || "",
    email: body.email,
    phone: body.phone || "",
    nuptk: body.nuptk || generateNUPTK(),
    specialization: body.specialization || "Umum",
    subjects: body.subjects || [],
    status: body.status || "active",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  await logActivity(event, "Tambah Guru Baru", `${body.name}`, "badge", "#9b4500");
  return teacher;
});

export { index_post as default };
//# sourceMappingURL=index4.post.mjs.map
