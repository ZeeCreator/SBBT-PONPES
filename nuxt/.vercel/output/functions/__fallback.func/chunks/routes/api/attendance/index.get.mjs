import { d as defineEventHandler, a as getQuery } from '../../../_/nitro.mjs';
import { v as verifyFirebaseToken, r as rtdbGetList } from '../../../_/firebase.mjs';
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

const index_get = defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get("authorization"));
  const q = getQuery(event);
  const all = await rtdbGetList("attendance_monthly");
  const items = all.filter((a) => {
    if (q.month && a.monthId !== q.month) return false;
    if (q.class && a.class !== q.class) return false;
    return true;
  });
  return items;
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
