import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { a as rtdbAdd, l as logActivity } from '../../_/firebase.mjs';
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
  const body = await readBody(event);
  const data = { ...body, status: "pending", createdAt: (/* @__PURE__ */ new Date()).toISOString() };
  const result = await rtdbAdd("izin", data);
  await logActivity(event, "Ajukan Izin", `${body.santri || ""} - ${body.jenis || ""}`, "logout", "#1a6bff");
  return result;
});

export { index_post as default };
//# sourceMappingURL=index6.post.mjs.map
