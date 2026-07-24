import { d as defineEventHandler } from '../../../../_/nitro.mjs';
import { l as logActivity } from '../../../../_/firebase.mjs';
import { b as dumpRTDB, s as saveBackupFile } from '../../../../_/backup.mjs';
import { u as uploadToDrive, l as listDriveFiles } from '../../../../_/drive.mjs';
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
import 'crypto';

const upload_post = defineEventHandler(async (event) => {
  const data = await dumpRTDB();
  const local = saveBackupFile(data);
  const fileId = await uploadToDrive(local.name, data);
  await logActivity(event, "Upload ke Drive", `Backup ${local.name} diupload ke Google Drive`, "cloud_upload", "#1a6bff");
  const files = await listDriveFiles();
  const uploaded = files.find((f) => f.id === fileId);
  return { success: true, fileId, driveFile: uploaded || { id: fileId, name: local.name } };
});

export { upload_post as default };
//# sourceMappingURL=upload.post.mjs.map
