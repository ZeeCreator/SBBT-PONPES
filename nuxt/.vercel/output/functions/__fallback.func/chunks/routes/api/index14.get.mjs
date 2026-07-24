import { d as defineEventHandler, a as getQuery } from '../../_/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const { q } = getQuery(event);
  if (!q || String(q).trim().length < 1) {
    return { students: [], teachers: [] };
  }
  const query = String(q).trim().toLowerCase();
  const db = getDatabase();
  const [studentSnap, teacherSnap] = await Promise.all([
    db.ref("students").once("value"),
    db.ref("guru").once("value")
  ]);
  const studentsData = studentSnap.val() || {};
  const teachersData = teacherSnap.val() || {};
  const students = Object.entries(studentsData).map(([id, val]) => ({ id, ...val })).filter((s) => {
    const name = (s.name || "").toLowerCase();
    const nis = (s.nis || "").toLowerCase();
    return name.includes(query) || nis.includes(query);
  }).slice(0, 10);
  const teachers = Object.entries(teachersData).map(([id, val]) => ({ id, ...val })).filter((t) => {
    const name = (t.name || "").toLowerCase();
    const nuptk = (t.nuptk || "").toLowerCase();
    return name.includes(query) || nuptk.includes(query);
  }).slice(0, 10);
  return { students, teachers };
});

export { index_get as default };
//# sourceMappingURL=index14.get.mjs.map
