import { d as defineEventHandler, e as createError } from '../../../../_/nitro.mjs';
import { l as listDriveFiles } from '../../../../_/drive.mjs';
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
import 'crypto';

const list_get = defineEventHandler(async () => {
  try {
    return await listDriveFiles();
  } catch (e) {
    throw createError({ statusCode: 502, statusMessage: e.message || "Gagal terhubung ke Google Drive" });
  }
});

export { list_get as default };
//# sourceMappingURL=list.get.mjs.map
