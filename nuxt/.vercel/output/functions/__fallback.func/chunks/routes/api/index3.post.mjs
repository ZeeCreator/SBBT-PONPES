import { d as defineEventHandler } from '../../_/nitro.mjs';
import { l as logActivity } from '../../_/firebase.mjs';
import { b as dumpRTDB, s as saveBackupFile } from '../../_/backup.mjs';
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
  const data = await dumpRTDB();
  const file = saveBackupFile(data);
  await logActivity(event, "Buat Backup", `Backup ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, "backup", "#1a6bff");
  return { ...file, size: file.size };
});

export { index_post as default };
//# sourceMappingURL=index3.post.mjs.map
