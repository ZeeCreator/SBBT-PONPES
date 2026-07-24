import { d as defineEventHandler, f as getRouterParams, b as getQuery, a as getDatabase, e as createError } from '../../../../_/nitro.mjs';
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

const _studentId__get = defineEventHandler(async (event) => {
  const { studentId } = getRouterParams(event);
  const query = getQuery(event);
  const semester = query.semester || "Ganjil 2024/2025";
  const db = getDatabase();
  const [studentSnap, gradesSnap] = await Promise.all([
    db.ref("students/" + studentId).once("value"),
    db.ref("grades").orderByChild("studentId").equalTo(studentId).once("value")
  ]);
  if (!studentSnap.exists()) {
    throw createError({ statusCode: 404, statusMessage: "Student not found" });
  }
  const student = { id: studentId, ...studentSnap.val() };
  const gradesData = gradesSnap.val() || {};
  const grades = Object.entries(gradesData).map(([id, val]) => ({ id, ...val }));
  return {
    student,
    semester,
    grades,
    reportType: "raport",
    generatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
});

export { _studentId__get as default };
//# sourceMappingURL=_studentId_.get.mjs.map
