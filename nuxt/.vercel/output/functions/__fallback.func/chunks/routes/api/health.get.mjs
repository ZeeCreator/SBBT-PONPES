import { d as defineEventHandler, a as getDatabase, h as getAuth } from '../../_/nitro.mjs';
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

const health_get = defineEventHandler(async () => {
  const results = {};
  let allOk = true;
  try {
    const db = getDatabase();
    const t0 = Date.now();
    await db.ref(".info/connected").once("value");
    results.rtdb = { status: "ok", latency: Date.now() - t0 + "ms" };
  } catch (e) {
    results.rtdb = { status: "error", message: e.message };
    allOk = false;
  }
  try {
    const auth = getAuth();
    const t0 = Date.now();
    await auth.listUsers(1);
    results.auth = { status: "ok", latency: Date.now() - t0 + "ms" };
  } catch (e) {
    results.auth = { status: "error", message: e.message };
    allOk = false;
  }
  return {
    status: allOk ? "healthy" : "degraded",
    uptime: process.uptime(),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    services: results
  };
});

export { health_get as default };
//# sourceMappingURL=health.get.mjs.map
