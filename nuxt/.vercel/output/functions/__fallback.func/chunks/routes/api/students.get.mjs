import { d as defineEventHandler, a as getQuery } from '../../_/nitro.mjs';
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

const students_get = defineEventHandler(async (event) => {
  const q = getQuery(event);
  const db = getDatabase();
  const snap = await db.ref("students").once("value");
  const data = snap.val() || {};
  let students = Object.entries(data).map(([id, val]) => ({ id, ...val }));
  if (q.class) students = students.filter((s) => s.class === q.class);
  if (q.status) students = students.filter((s) => s.status === q.status);
  students.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return students;
});

export { students_get as default };
//# sourceMappingURL=students.get.mjs.map
