import { d as defineEventHandler, f as getRouterParams, r as readBody } from '../../../../_/nitro.mjs';
import { c as rtdbUpdate } from '../../../../_/firebase.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const body = await readBody(event);
  await rtdbUpdate("extracurricular", id, body);
  return { id, ...body };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
