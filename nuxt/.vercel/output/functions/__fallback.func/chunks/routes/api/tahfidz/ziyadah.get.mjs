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

const ziyadah_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  let items = await rtdbGetList("tahfidz/ziyadah");
  if (query.studentId) items = items.filter((i) => i.studentId === query.studentId);
  return items;
});

export { ziyadah_get as default };
//# sourceMappingURL=ziyadah.get.mjs.map
