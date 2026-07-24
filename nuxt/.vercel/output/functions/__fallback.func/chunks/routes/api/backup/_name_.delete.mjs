import { d as defineEventHandler, c as getRouterParam, e as createError } from '../../../_/nitro.mjs';
import { l as logActivity } from '../../../_/firebase.mjs';
import { d as deleteBackupFile } from '../../../_/backup.mjs';
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

const _name__delete = defineEventHandler(async (event) => {
  const name = getRouterParam(event, "name");
  if (!name) throw createError({ statusCode: 400, statusMessage: "Nama file diperlukan" });
  const ok = deleteBackupFile(name);
  if (!ok) throw createError({ statusCode: 404, statusMessage: "File tidak ditemukan" });
  await logActivity(event, "Hapus Backup", `Backup ${name} dihapus`, "delete", "#dc2626");
  return { success: true };
});

export { _name__delete as default };
//# sourceMappingURL=_name_.delete.mjs.map
