import { d as defineEventHandler, e as getRouterParams, r as readBody } from '../../../../../_/nitro.mjs';
import { a as rtdbAdd } from '../../../../../_/firebase.mjs';
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

const rooms_post = defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const body = await readBody(event);
  const data = { ...body, dormitoryId: id, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
  return rtdbAdd(`dormitories/${id}/rooms`, data);
});

export { rooms_post as default };
//# sourceMappingURL=rooms.post.mjs.map
