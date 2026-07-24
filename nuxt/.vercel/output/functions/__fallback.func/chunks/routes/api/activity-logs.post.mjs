import { d as defineEventHandler, r as readBody, a as getDatabase } from '../../_/nitro.mjs';
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

const activityLogs_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const db = getDatabase();
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const log = {
    action: body.action,
    description: body.description || body.action,
    icon: body.icon || "info",
    color: body.color || "#1a6bff",
    userName: body.userName || "System",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.ref(`activity_logs/${id}`).set(log);
  return { id, ...log };
});

export { activityLogs_post as default };
//# sourceMappingURL=activity-logs.post.mjs.map
