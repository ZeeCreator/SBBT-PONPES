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

const classes_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  let items = await rtdbGetList("classes");
  if (query.level) items = items.filter((i) => i.level === query.level);
  return items;
});

export { classes_get as default };
//# sourceMappingURL=classes.get.mjs.map
