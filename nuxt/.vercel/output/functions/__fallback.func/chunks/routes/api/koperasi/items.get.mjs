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

const items_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  let items = await rtdbGetList("koperasi/items");
  if (query.category) items = items.filter((i) => i.category === query.category);
  return items;
});

export { items_get as default };
//# sourceMappingURL=items.get.mjs.map
