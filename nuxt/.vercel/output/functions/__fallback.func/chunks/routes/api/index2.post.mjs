import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { v as verifyFirebaseToken, a as rtdbAdd } from '../../_/firebase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'firebase-admin/app';
import 'firebase-admin/auth';
import 'firebase-admin/database';
import 'jose';

const index_post = defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get("authorization"));
  const body = await readBody(event);
  const record = await rtdbAdd("attendance", {
    date: body.date,
    class: body.class,
    records: body.records || [],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  return record;
});

export { index_post as default };
//# sourceMappingURL=index2.post.mjs.map
