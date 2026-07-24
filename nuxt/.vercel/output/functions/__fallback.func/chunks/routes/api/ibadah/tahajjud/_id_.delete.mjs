import { d as defineEventHandler, f as getRouterParams } from '../../../../_/nitro.mjs';
import { b as rtdbRemove } from '../../../../_/firebase.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  await rtdbRemove("tahajjud", id);
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
