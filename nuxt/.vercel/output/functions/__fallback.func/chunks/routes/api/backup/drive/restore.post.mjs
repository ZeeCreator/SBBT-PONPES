import { d as defineEventHandler, r as readBody, c as createError } from '../../../../_/nitro.mjs';
import { l as logActivity } from '../../../../_/firebase.mjs';
import { d as downloadFromDrive } from '../../../../_/drive.mjs';
import { a as restoreRTDB } from '../../../../_/backup.mjs';
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
import 'fs';
import 'path';

const restore_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.fileId || !body.confirm) {
    throw createError({ statusCode: 400, statusMessage: "File ID dan konfirmasi diperlukan" });
  }
  const data = await downloadFromDrive(body.fileId);
  await restoreRTDB(data);
  await logActivity(event, "Restore dari Drive", `Database dipulihkan dari Drive file ${body.fileId}`, "cloud_download", "#dc2626");
  return { success: true };
});

export { restore_post as default };
//# sourceMappingURL=restore.post.mjs.map
