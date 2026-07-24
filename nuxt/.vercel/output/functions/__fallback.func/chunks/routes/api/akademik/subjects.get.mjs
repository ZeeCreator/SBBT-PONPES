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

const subjects_get = defineEventHandler(async (event) => {
  const q = getQuery(event);
  let items = await rtdbGetList("curriculum");
  if (q.dept) items = items.filter((i) => i.dept === q.dept);
  items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return items;
});

export { subjects_get as default };
//# sourceMappingURL=subjects.get.mjs.map
