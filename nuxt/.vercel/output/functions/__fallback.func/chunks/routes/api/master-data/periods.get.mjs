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

const periods_get = defineEventHandler(async () => {
  return rtdbGetList("periods");
});

export { periods_get as default };
//# sourceMappingURL=periods.get.mjs.map
