import { d as defineEventHandler, r as readBody } from '../../../_/nitro.mjs';
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
import 'firebase-admin/auth';
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
