import { d as defineEventHandler, c as getRouterParam, e as createError, r as readBody } from '../../../../_/nitro.mjs';
import { d as rtdbGetById, c as rtdbUpdate } from '../../../../_/firebase.mjs';
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
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Missing id" });
  const existing = await rtdbGetById("imtihan", id);
  if (!existing) throw createError({ statusCode: 404, message: "Exam not found" });
  const body = await readBody(event);
  const updateData = { ...body };
  delete updateData.id;
  delete updateData.createdAt;
  if (body.scores) {
    const scoreValues = Object.values(body.scores).map((s) => Number(s.score) || 0);
    const valid = scoreValues.filter((s) => s > 0);
    updateData.averageScore = valid.length > 0 ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length * 10) / 10 : 0;
  }
  await rtdbUpdate("imtihan", id, updateData);
  return { id, ...existing, ...updateData };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
