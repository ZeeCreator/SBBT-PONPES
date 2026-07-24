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

const registrations_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  let items = await rtdbGetList("psbRegistrations");
  if (query.status) items = items.filter((i) => i.status === query.status);
  return items;
});

export { registrations_get as default };
//# sourceMappingURL=registrations.get.mjs.map
