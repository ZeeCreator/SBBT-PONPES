import { d as defineEventHandler, r as readBody } from '../../../_/nitro.mjs';
import { a as rtdbAdd } from '../../../_/firebase.mjs';
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

const registrations_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const data = { ...body, status: "pending", createdAt: (/* @__PURE__ */ new Date()).toISOString() };
  return rtdbAdd("psbRegistrations", data);
});

export { registrations_post as default };
//# sourceMappingURL=registrations.post.mjs.map
