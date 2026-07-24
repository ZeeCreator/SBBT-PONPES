import { d as defineEventHandler } from '../../_/nitro.mjs';
import { l as listBackupFiles } from '../../_/backup.mjs';
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

const index_get = defineEventHandler(async () => {
  return listBackupFiles();
});

export { index_get as default };
//# sourceMappingURL=index4.get.mjs.map
