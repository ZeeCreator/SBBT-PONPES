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

const subjects_get = defineEventHandler(async (event) => {
  const q = getQuery(event);
  let items = await rtdbGetList("curriculum");
  if (q.dept) items = items.filter((i) => i.dept === q.dept);
  items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return items;
});

export { subjects_get as default };
//# sourceMappingURL=subjects.get.mjs.map
