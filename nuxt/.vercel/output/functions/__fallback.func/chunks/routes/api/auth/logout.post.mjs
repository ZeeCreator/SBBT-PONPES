import { d as defineEventHandler, f as deleteCookie } from '../../../_/nitro.mjs';
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

const logout_post = defineEventHandler(async (event) => {
  deleteCookie(event, "__session", { path: "/" });
  return { success: true };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
