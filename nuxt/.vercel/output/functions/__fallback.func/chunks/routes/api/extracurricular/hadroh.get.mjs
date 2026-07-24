import { d as defineEventHandler } from '../../../_/nitro.mjs';
import { r as rtdbGetList } from '../../../_/firebase.mjs';
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

const hadroh_get = defineEventHandler(async () => {
  return rtdbGetList("hadroh");
});

export { hadroh_get as default };
//# sourceMappingURL=hadroh.get.mjs.map
