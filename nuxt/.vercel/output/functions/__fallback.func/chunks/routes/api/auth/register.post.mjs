import { d as defineEventHandler, r as readBody, h as getAuth, a as getDatabase } from '../../../_/nitro.mjs';
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

const register_post = defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get("authorization"));
  const body = await readBody(event);
  const auth = getAuth();
  const userRecord = await auth.createUser({
    email: body.email,
    password: body.password,
    displayName: body.displayName
  });
  const assignedRole = body.role || "wali_santri";
  const db = getDatabase();
  await db.ref(`roles/${userRecord.uid}`).set({
    role: assignedRole,
    email: body.email,
    displayName: body.displayName,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  return { uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName, role: assignedRole };
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
