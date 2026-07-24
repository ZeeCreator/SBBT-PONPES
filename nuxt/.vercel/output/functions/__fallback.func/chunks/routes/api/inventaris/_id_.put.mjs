import { d as defineEventHandler, b as getRouterParam, r as readBody } from '../../../_/nitro.mjs';
import { c as rtdbUpdate, d as rtdbGetById } from '../../../_/firebase.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  await rtdbUpdate("inventaris", id, { ...body, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
  return rtdbGetById("inventaris", id);
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
