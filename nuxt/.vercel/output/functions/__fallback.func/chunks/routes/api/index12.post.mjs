import { d as defineEventHandler, r as readBody, e as createError, a as getDatabase } from '../../_/nitro.mjs';
import { l as logActivity } from '../../_/firebase.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.uid || !body.title) {
    throw createError({ statusCode: 400, statusMessage: "UID dan judul diperlukan" });
  }
  const db = getDatabase();
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 20; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  const todo = {
    uid: body.uid,
    title: body.title.trim(),
    description: body.description || "",
    priority: body.priority || "medium",
    done: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.ref(`todos/${id}`).set(todo);
  await logActivity(event, "Tambah Todo", todo.title, "checklist", "#1a6bff");
  return { id, ...todo };
});

export { index_post as default };
//# sourceMappingURL=index12.post.mjs.map
