import { d as defineEventHandler, c as createError } from '../../../../_/nitro.mjs';
import { l as listDriveFiles } from '../../../../_/drive.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'firebase-admin/app';
import 'firebase-admin/auth';
import 'firebase-admin/database';
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
