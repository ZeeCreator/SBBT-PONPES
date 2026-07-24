import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { getDatabase } from 'firebase-admin/database';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'firebase-admin/app';
import 'firebase-admin/auth';
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
