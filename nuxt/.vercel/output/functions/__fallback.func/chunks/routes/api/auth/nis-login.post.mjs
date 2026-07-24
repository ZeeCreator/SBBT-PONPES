import { d as defineEventHandler, r as readBody, c as createError, h as createSessionToken, s as setCookie } from '../../../_/nitro.mjs';
import { l as logActivity } from '../../../_/firebase.mjs';
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

const nisLogin_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const nis = String(body.nis || "").trim();
  if (!nis) throw createError({ statusCode: 400, statusMessage: "NIS diperlukan" });
  const db = getDatabase();
  const nisMapSnap = await db.ref(`nis_map/${nis}`).once("value");
  if (nisMapSnap.exists()) {
    const data = nisMapSnap.val();
    const uid2 = data.uid;
    const name2 = data.parentName || data.studentName || `Wali Santri ${nis}`;
    const email2 = data.email;
    const roleSnap2 = await db.ref(`roles/${uid2}`).once("value");
    if (!roleSnap2.exists()) {
      await db.ref(`roles/${uid2}`).set({ role: "wali_santri", email: email2, displayName: name2, nis, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
    } else {
      const existing = roleSnap2.val();
      if (existing.role !== "wali_santri") {
        await db.ref(`roles/${uid2}/role`).set("wali_santri");
      }
    }
    const auth2 = getAuth();
    const customToken2 = await auth2.createCustomToken(uid2, { role: "wali_santri" });
    const sessionToken2 = await createSessionToken({ uid: uid2, role: "wali_santri", nis, name: name2, email: email2 });
    setCookie(event, "__session", sessionToken2, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    await logActivity(event, "Login Wali Santri", `${name2} (NIS: ${nis})`, "login", "#1a6bff");
    return { uid: uid2, role: "wali_santri", customToken: customToken2, name: name2, nis, email: email2 };
  }
  const studentsSnap = await db.ref("students").orderByChild("nis").equalTo(nis).once("value");
  if (!studentsSnap.exists()) {
    throw createError({ statusCode: 404, statusMessage: "NIS tidak ditemukan" });
  }
  const entries = studentsSnap.val();
  const entry = Object.entries(entries)[0];
  const [studentId, studentData] = entry;
  const uid = `santri_${nis}`;
  const name = studentData.name || `Santri ${nis}`;
  const email = `santri-${nis}@alfatah.sch.id`;
  const roleSnap = await db.ref(`roles/${uid}`).once("value");
  if (!roleSnap.exists()) {
    await db.ref(`roles/${uid}`).set({
      role: "wali_santri",
      displayName: name,
      email,
      nis,
      studentId,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  const auth = getAuth();
  const customToken = await auth.createCustomToken(uid, { role: "wali_santri" });
  const sessionToken = await createSessionToken({ uid, role: "wali_santri", nis, name, email });
  setCookie(event, "__session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  await logActivity(event, "Login Santri (via NIS)", `${name} (NIS: ${nis})`, "login", "#16a34a");
  return { uid, role: "wali_santri", customToken, name, nis, email };
});

export { nisLogin_post as default };
//# sourceMappingURL=nis-login.post.mjs.map
