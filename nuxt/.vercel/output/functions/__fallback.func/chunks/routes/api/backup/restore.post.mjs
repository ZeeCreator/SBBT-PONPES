import { d as defineEventHandler, r as readBody, e as createError } from '../../../_/nitro.mjs';
import { l as logActivity } from '../../../_/firebase.mjs';
import { a as restoreRTDB } from '../../../_/backup.mjs';
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

const restore_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.data || !body.confirm) {
    throw createError({ statusCode: 400, statusMessage: "Data backup dan konfirmasi diperlukan" });
  }
  await restoreRTDB(body.data);
  await logActivity(event, "Restore Backup", "Database dipulihkan dari backup", "restore", "#dc2626");
  return { success: true };
});

export { restore_post as default };
//# sourceMappingURL=restore.post.mjs.map
