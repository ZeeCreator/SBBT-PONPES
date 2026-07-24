import { d as defineEventHandler } from '../../../_/nitro.mjs';
import { getDatabase } from 'firebase-admin/database';
import { getAuth } from 'firebase-admin/auth';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'firebase-admin/app';
import 'jose';

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
function genId() {
  let id = "";
  for (let i = 0; i < 20; i++) id += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  return id;
}
const check_get = defineEventHandler(async () => {
  const db = getDatabase();
  const auth = getAuth();
  const results = {};
  let allOk = true;
  try {
    const t0 = Date.now();
    await db.ref(".info/connected").once("value");
    results.rtdb = { status: "ok", latency: Date.now() - t0 + "ms" };
  } catch (e) {
    results.rtdb = { status: "error", message: e.message };
    allOk = false;
  }
  try {
    const t0 = Date.now();
    await auth.listUsers(1);
    results.auth = { status: "ok", latency: Date.now() - t0 + "ms" };
  } catch (e) {
    results.auth = { status: "error", message: e.message };
    allOk = false;
  }
  const status = allOk ? "healthy" : "degraded";
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const logId = genId();
  const logEntry = {
    status,
    timestamp,
    services: results,
    uptime: process.uptime()
  };
  await db.ref(`uptime_logs/${logId}`).set(logEntry);
  const allSnap = await db.ref("uptime_logs").once("value");
  if (allSnap.exists()) {
    const keys = Object.keys(allSnap.val()).sort();
    if (keys.length > 1e3) {
      const toRemove = keys.slice(0, keys.length - 1e3);
      await Promise.all(toRemove.map((k) => db.ref(`uptime_logs/${k}`).remove()));
    }
  }
  return { id: logId, ...logEntry };
});

export { check_get as default };
//# sourceMappingURL=check.get.mjs.map
