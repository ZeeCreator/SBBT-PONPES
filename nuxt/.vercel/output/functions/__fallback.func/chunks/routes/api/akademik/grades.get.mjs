import { d as defineEventHandler, b as getQuery } from '../../../_/nitro.mjs';
import { r as rtdbGetList } from '../../../_/firebase.mjs';
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
