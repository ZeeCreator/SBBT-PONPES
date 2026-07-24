import { d as defineEventHandler, e as getRouterParams, a as getQuery, c as createError } from '../../../../_/nitro.mjs';
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
