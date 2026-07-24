import { d as defineEventHandler, b as getQuery } from '../../_/nitro.mjs';
import { v as verifyFirebaseToken, r as rtdbGetList, e as rtdbQueryEqual } from '../../_/firebase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'fs';
import 'google-auth-library';
import 'fast-deep-equal';
import 'http';
import 'https';
import 'http2';
import 'url';
import 'events';
import '@fastify/busboy';
import 'zlib';
import 'jsonwebtoken';
import 'jwks-rsa';
import '@firebase/database-compat/standalone';
import 'path';
import 'jose';

function flattenAttendance(items) {
  const result = [];
  for (const item of items) {
    if (item.records && Array.isArray(item.records)) {
      for (const rec of item.records) {
        result.push({
          id: item.id,
          date: item.date,
          class: item.class,
          studentId: rec.studentId,
          name: rec.name,
          nis: rec.nis,
          morningPrayer: rec.morningPrayer || "present",
          classSession: rec.classSession || "present",
          asrPrayer: rec.asrPrayer || "present",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        });
      }
    } else if (item.studentId) {
      result.push(item);
    }
  }
  return result;
}
const index_get = defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get("authorization"));
  const q = getQuery(event);
  let items;
  if (q.date && q.class) {
    const all = await rtdbGetList("attendance");
    items = all.filter((a) => a.date === q.date && a.class === q.class);
    return items;
  }
  if (q.date) {
    items = await rtdbQueryEqual("attendance", "date", q.date);
  } else {
    items = await rtdbGetList("attendance");
  }
  if (q.studentId) {
    const flat = flattenAttendance(items);
    return flat.filter((r) => r.studentId === q.studentId);
  }
  return flattenAttendance(items);
});

export { index_get as default };
//# sourceMappingURL=index3.get.mjs.map
