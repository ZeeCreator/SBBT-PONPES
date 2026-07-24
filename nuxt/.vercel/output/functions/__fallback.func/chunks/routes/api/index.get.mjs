import { d as defineEventHandler } from '../../_/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const db = getDatabase();
  const subjectsSnap = await db.ref("curriculum").once("value");
  const gradesSnap = await db.ref("grades").once("value");
  const subjectsCount = subjectsSnap.exists() ? Object.keys(subjectsSnap.val() || {}).length : 0;
  const gradesCount = gradesSnap.exists() ? Object.keys(gradesSnap.val() || {}).length : 0;
  return {
    subjects: subjectsCount,
    grades: gradesCount,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
