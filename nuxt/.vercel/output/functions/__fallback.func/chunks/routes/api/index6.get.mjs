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
  let items = await rtdbGetList("inventaris");
  if (query.category) items = items.filter((i) => i.category === query.category);
  if (query.status) items = items.filter((i) => i.status === query.status);
  return items;
});

export { index_get as default };
//# sourceMappingURL=index6.get.mjs.map
