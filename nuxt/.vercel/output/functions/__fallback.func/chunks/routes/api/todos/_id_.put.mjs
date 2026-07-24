import { d as defineEventHandler, b as getRouterParam, r as readBody } from '../../../_/nitro.mjs';
import { getDatabase } from 'firebase-admin/database';
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

const _id__put = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const db = getDatabase();
  const clean = {};
  for (const [k, v] of Object.entries(body)) {
    if (v !== void 0 && v !== null) clean[k] = k === "title" ? String(v).trim() : v;
  }
  clean.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  await db.ref(`todos/${id}`).update(clean);
  return { id, ...clean };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
