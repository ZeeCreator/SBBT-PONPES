import { d as defineEventHandler, b as getRouterParam } from '../../../../_/nitro.mjs';
import { v as verifyFirebaseToken, b as rtdbRemove } from '../../../../_/firebase.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get("authorization"));
  const id = getRouterParam(event, "id");
  await rtdbRemove("attendance_monthly", id);
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
