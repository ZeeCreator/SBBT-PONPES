import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { a as rtdbAdd, l as logActivity } from '../../_/firebase.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const data = { ...body, status: "pending", createdAt: (/* @__PURE__ */ new Date()).toISOString() };
  const result = await rtdbAdd("izin", data);
  await logActivity(event, "Ajukan Izin", `${body.santri || ""} - ${body.jenis || ""}`, "logout", "#1a6bff");
  return result;
});

export { index_post as default };
//# sourceMappingURL=index6.post.mjs.map
