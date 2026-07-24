import { d as defineEventHandler, e as createError, h as getAuth, a as getDatabase } from '../../../_/nitro.mjs';
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

const users_get = defineEventHandler(async (event) => {
  var _a;
  if (!((_a = event.context.auth) == null ? void 0 : _a.uid)) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const auth = getAuth();
  const db = getDatabase();
  const rolesSnap = await db.ref("roles").once("value");
  const rolesMap = rolesSnap.val() || {};
  const result = await auth.listUsers(100);
  return result.users.map((u) => {
    var _a2;
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      role: ((_a2 = rolesMap[u.uid]) == null ? void 0 : _a2.role) || "wali_santri",
      disabled: u.disabled
    };
  });
});

export { users_get as default };
//# sourceMappingURL=users.get.mjs.map
