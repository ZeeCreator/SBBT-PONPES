import { d as defineEventHandler, b as getRouterParam, c as createError } from '../../../../_/nitro.mjs';
import { l as logActivity } from '../../../../_/firebase.mjs';
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

const _nis__delete = defineEventHandler(async (event) => {
  const nis = String(getRouterParam(event, "nis") || "").trim();
  if (!nis) throw createError({ statusCode: 400, statusMessage: "NIS diperlukan" });
  const db = getDatabase();
  const snap = await db.ref(`nis_map/${nis}`).once("value");
  if (!snap.exists()) throw createError({ statusCode: 404, statusMessage: "NIS tidak terdaftar" });
  const data = snap.val();
  const uid = data.uid;
  try {
    await getAuth().deleteUser(uid);
  } catch (e) {
    if (e.code !== "auth/user-not-found") throw e;
  }
  await db.ref(`nis_map/${nis}`).remove();
  await db.ref(`roles/${uid}`).remove();
  await logActivity(event, "Hapus Wali Santri", `NIS ${nis} - ${data.parentName || data.studentName}`, "person_remove", "#dc2626");
  return { success: true, nis, email: data.email };
});

export { _nis__delete as default };
//# sourceMappingURL=_nis_.delete.mjs.map
