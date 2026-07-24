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
  const q = getQuery(event);
  const uid = String(q.uid || "");
  const db = getDatabase();
  let ref = db.ref("todos");
  if (uid) ref = ref.orderByChild("uid").equalTo(uid);
  const snap = await ref.once("value");
  const data = snap.val() || {};
  let list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
  if (uid) {
    list = list.filter((t) => t.uid === uid);
  }
  list.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (b.createdAt || "").localeCompare(a.createdAt || "");
  });
  return list;
});

export { index_get as default };
//# sourceMappingURL=index15.get.mjs.map
