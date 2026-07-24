import { d as defineEventHandler, a as getQuery } from '../../../_/nitro.mjs';
import { r as rtdbGetList } from '../../../_/firebase.mjs';
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

const grades_get = defineEventHandler(async (event) => {
  const q = getQuery(event);
  let items = await rtdbGetList("grades");
  if (q.studentId) items = items.filter((i) => i.studentId === q.studentId);
  if (q.semester) items = items.filter((i) => i.semester === q.semester);
  if (q.academicYear) items = items.filter((i) => i.academicYear === q.academicYear);
  items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return items;
});

export { grades_get as default };
//# sourceMappingURL=grades.get.mjs.map
