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

const ziyadah_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const data = { ...body, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
  return rtdbAdd("tahfidz/ziyadah", data);
});

export { ziyadah_post as default };
//# sourceMappingURL=ziyadah.post.mjs.map
