import { d as defineEventHandler, e as getRouterParams, r as readBody } from '../../../../_/nitro.mjs';
import { c as rtdbUpdate } from '../../../../_/firebase.mjs';
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

const _id__patch = defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const body = await readBody(event);
  await rtdbUpdate("psbResults", id, body);
  return { id, ...body };
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
