import { d as defineEventHandler, r as readBody, c as createError } from '../../_/nitro.mjs';
import { a as rtdbAdd, d as rtdbGetById, l as logActivity } from '../../_/firebase.mjs';
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
  if (body.tipe === "Pindah Pondok Al-Fatah Pusat") {
    if (!body.studentId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Student ID is required for Pindah Pondok Al-Fatah Pusat"
      });
    }
    const mutasiData = { ...body, status: "pending", createdAt: (/* @__PURE__ */ new Date()).toISOString() };
    const mutasiResult = await rtdbAdd("mutasi", mutasiData);
    const studentSnapshot = await rtdbGetById("students", body.studentId);
    if (!studentSnapshot) {
      throw createError({
        statusCode: 404,
        statusMessage: "Student not found"
      });
    }
    const studentData = { id: body.studentId, ...studentSnapshot };
    const studentName = studentData.nama || studentData.name || "Unknown";
    const studentNis = studentData.nis || "No NIS";
    const logMessage2 = studentName + " (NIS: " + studentNis + ") - " + (body.tipe || "");
    await logActivity(event, "Ajukan Mutasi Pindah Pondok", logMessage2, "swap_horiz", "#1a6bff");
    return {
      mutasi: mutasiResult,
      student: studentData
    };
  }
  const data = { ...body, status: "pending", createdAt: (/* @__PURE__ */ new Date()).toISOString() };
  const result = await rtdbAdd("mutasi", data);
  const logMessage = (body.santri || "") + " - " + (body.tipe || "");
  await logActivity(event, "Ajukan Mutasi", logMessage, "swap_horiz", "#1a6bff");
  return result;
});

export { index_post as default };
//# sourceMappingURL=index9.post.mjs.map
