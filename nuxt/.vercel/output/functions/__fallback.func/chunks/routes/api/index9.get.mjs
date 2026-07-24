import { d as defineEventHandler, a as getQuery } from '../../_/nitro.mjs';
import { r as rtdbGetList } from '../../_/firebase.mjs';
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
  const query = getQuery(event);
  let items = await rtdbGetList("khidmah");
  if (query.studentId) items = items.filter((i) => i.studentId === query.studentId);
  if (query.area) items = items.filter((i) => i.area === query.area);
  return items;
});

export { index_get as default };
//# sourceMappingURL=index9.get.mjs.map
