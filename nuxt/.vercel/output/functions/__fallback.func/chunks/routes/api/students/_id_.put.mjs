import { d as defineEventHandler, b as getRouterParam, r as readBody } from '../../../_/nitro.mjs';
import { l as logActivity } from '../../../_/firebase.mjs';
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
  const body = await readBody(event) || {};
  const db = getDatabase();
  const clean = {};
  for (const [k, v] of Object.entries(body)) {
    if (v !== void 0 && v !== null) clean[k] = k === "name" ? String(v).trim() : v;
  }
  await db.ref(`students/${id}`).update(clean);
  const snap = await db.ref(`students/${id}`).once("value");
  const student = snap.val();
  await logActivity(event, "Update Data Santri", `${(student == null ? void 0 : student.name) || ""}`, "person_edit", "#1a6bff");
  return { id, ...student };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
