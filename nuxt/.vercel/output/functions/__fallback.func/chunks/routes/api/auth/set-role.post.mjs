import { d as defineEventHandler, r as readBody, a as getDatabase } from '../../../_/nitro.mjs';
import { v as verifyFirebaseToken } from '../../../_/firebase.mjs';
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

const setRole_post = defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get("authorization"));
  const body = await readBody(event);
  const db = getDatabase();
  await db.ref(`roles/${body.uid}`).set({
    role: body.role,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  return { message: "Role updated", uid: body.uid, role: body.role };
});

export { setRole_post as default };
//# sourceMappingURL=set-role.post.mjs.map
