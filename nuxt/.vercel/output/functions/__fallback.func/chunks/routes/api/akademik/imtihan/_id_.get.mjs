import { d as defineEventHandler, c as getRouterParam, e as createError } from '../../../../_/nitro.mjs';
import { d as rtdbGetById } from '../../../../_/firebase.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Missing id" });
  const exam = await rtdbGetById("imtihan", id);
  if (!exam) throw createError({ statusCode: 404, message: "Exam not found" });
  return exam;
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
