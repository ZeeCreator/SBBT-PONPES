import { d as defineEventHandler, r as readBody } from '../../../_/nitro.mjs';
import { v as verifyFirebaseToken, a as rtdbAdd } from '../../../_/firebase.mjs';
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

const index_post = defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get("authorization"));
  const body = await readBody(event);
  const record = await rtdbAdd("attendance_monthly", {
    monthId: body.monthId,
    year: body.year,
    month: body.month,
    class: body.class,
    records: body.records || [],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  return record;
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
