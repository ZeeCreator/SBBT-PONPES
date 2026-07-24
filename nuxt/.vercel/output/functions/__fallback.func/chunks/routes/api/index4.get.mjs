import { d as defineEventHandler } from '../../_/nitro.mjs';
import { l as listBackupFiles } from '../../_/backup.mjs';
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

const index_get = defineEventHandler(async () => {
  return listBackupFiles();
});

export { index_get as default };
//# sourceMappingURL=index4.get.mjs.map
