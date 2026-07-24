import { d as defineEventHandler, r as readBody } from '../../../_/nitro.mjs';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { v as verifyFirebaseToken } from '../../../_/firebase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'firebase-admin/app';
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
