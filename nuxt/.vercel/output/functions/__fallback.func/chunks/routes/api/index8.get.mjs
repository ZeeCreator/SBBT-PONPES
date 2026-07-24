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

const index_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const db = getDatabase();
  const snap = await db.ref("jadwal").once("value");
  const data = snap.val() || {};
  let items = Object.entries(data).map(([key, val]) => {
    const { id: _stored, ...rest } = val || {};
    return { id: key, ...rest };
  });
  if (query.kelas) items = items.filter((i) => i.kelas === query.kelas);
  if (query.hari) items = items.filter((i) => i.hari === query.hari);
  if (query.guru) items = items.filter((i) => i.guru === query.guru);
  return items;
});

export { index_get as default };
//# sourceMappingURL=index8.get.mjs.map
