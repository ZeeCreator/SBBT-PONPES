import { d as defineEventHandler, b as getRouterParam, c as createError } from '../../../_/nitro.mjs';
import { l as logActivity } from '../../../_/firebase.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "ID diperlukan" });
  const db = getDatabase();
  await db.ref(`todos/${id}`).remove();
  await logActivity(event, "Hapus Todo", `Todo ${id}`, "delete", "#dc2626");
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
