import { d as defineEventHandler, b as getRouterParam, r as readBody } from '../../../../_/nitro.mjs';
import { v as verifyFirebaseToken, c as rtdbUpdate } from '../../../../_/firebase.mjs';
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
  await verifyFirebaseToken(event.headers.get("authorization"));
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  await rtdbUpdate("attendance_monthly", id, {
    monthId: body.monthId,
    year: body.year,
    month: body.month,
    class: body.class,
    records: body.records || [],
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  return { id, ...body };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
