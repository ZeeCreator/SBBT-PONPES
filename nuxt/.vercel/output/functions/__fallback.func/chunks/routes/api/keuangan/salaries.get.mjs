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

const salaries_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  let items = await rtdbGetList("keuangan/salaries");
  if (query.teacherId) items = items.filter((i) => i.teacherId === query.teacherId);
  if (query.month) items = items.filter((i) => i.month === query.month);
  return items;
});

export { salaries_get as default };
//# sourceMappingURL=salaries.get.mjs.map
