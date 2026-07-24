import { d as defineEventHandler, c as getRouterParam, e as createError } from '../../../../_/nitro.mjs';
import { r as readBackupFile } from '../../../../_/backup.mjs';
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

const _name__get = defineEventHandler(async (event) => {
  const name = getRouterParam(event, "name");
  if (!name) throw createError({ statusCode: 400, statusMessage: "Nama file diperlukan" });
  const data = readBackupFile(name);
  if (!data) throw createError({ statusCode: 404, statusMessage: "File tidak ditemukan" });
  return data;
});

export { _name__get as default };
//# sourceMappingURL=_name_.get.mjs.map
