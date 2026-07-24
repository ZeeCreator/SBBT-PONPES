import { d as defineEventHandler, c as getRouterParam, r as readBody, a as getDatabase } from '../../../../_/nitro.mjs';
import { l as logActivity } from '../../../../_/firebase.mjs';
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

const violations_post = defineEventHandler(async (event) => {
  const studentId = getRouterParam(event, "id");
  const body = await readBody(event);
  const db = getDatabase();
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const violation = {
    studentId,
    type: body.type,
    category: body.category,
    description: body.description,
    date: body.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    points: body.points || -10,
    reportedBy: body.reportedBy || "System",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.ref(`students/${studentId}/violations/${id}`).set(violation);
  await db.ref(`violations/${id}`).set(violation);
  const snap = await db.ref(`students/${studentId}/disciplineScore`).once("value");
  const currentScore = snap.val() || 100;
  const newScore = Math.max(0, currentScore + (violation.points || -10));
  await db.ref(`students/${studentId}/disciplineScore`).set(newScore);
  try {
    const snap2 = await db.ref(`students/${studentId}`).once("value");
    const student = snap2.val();
    await logActivity(event, "Laporkan Pelanggaran", `${(student == null ? void 0 : student.name) || "Santri"}: ${body.description}`, "gavel", "#ba1a1a");
  } catch {
  }
  return { id, ...violation, disciplineScore: newScore };
});

export { violations_post as default };
//# sourceMappingURL=violations.post.mjs.map
