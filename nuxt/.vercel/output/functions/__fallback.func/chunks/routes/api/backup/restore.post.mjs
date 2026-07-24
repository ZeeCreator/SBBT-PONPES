import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
import { l as logActivity } from '../../../_/firebase.mjs';
import { a as restoreRTDB } from '../../../_/backup.mjs';
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
import 'fs';
import 'path';

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
