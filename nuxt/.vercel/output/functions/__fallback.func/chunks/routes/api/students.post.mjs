import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { l as logActivity } from '../../_/firebase.mjs';
import { getDatabase } from 'firebase-admin/database';
import { a as generateNIS } from '../../_/id-generator.mjs';
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

const students_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event) || {};
  const db = getDatabase();
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const student = {
    name: ((_a = body.name) == null ? void 0 : _a.trim()) || "",
    nis: body.nis || generateNIS(),
    class: body.class || "",
    classId: body.classId || "",
    city: body.city || "",
    gender: body.gender || "Laki-laki",
    dormitoryId: body.dormitoryId || "",
    dormitoryName: body.dormitoryName || "",
    roomId: body.roomId || "",
    roomName: body.roomName || "",
    phone: body.phone || "",
    address: body.address || "",
    parentName: body.parentName || "",
    parentPhone: body.parentPhone || "",
    disciplineScore: 100,
    status: "Active",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.ref(`students/${id}`).set(student);
  await logActivity(event, "Tambah Santri Baru", `${student.name} (${student.nis})`, "person_add");
  return { id, ...student };
});

export { students_post as default };
//# sourceMappingURL=students.post.mjs.map
