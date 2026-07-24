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

const loans_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const data = { ...body, status: "dipinjam", createdAt: (/* @__PURE__ */ new Date()).toISOString() };
  return rtdbAdd("inventaris/loans", data);
});

export { loans_post as default };
//# sourceMappingURL=loans.post.mjs.map
