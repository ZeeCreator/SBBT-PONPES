import { d as defineEventHandler, b as getRouterParam, r as readBody } from '../../../_/nitro.mjs';
import { c as rtdbUpdate, d as rtdbGetById, l as logActivity } from '../../../_/firebase.mjs';
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

const _id__patch = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  await rtdbUpdate("mutasi", id, { ...body, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
  const updated = await rtdbGetById("mutasi", id);
  if (body.status === "disetujui") {
    await logActivity(event, "Setujui Mutasi", `${(updated == null ? void 0 : updated.santri) || ""} - ${(updated == null ? void 0 : updated.tipe) || ""}`, "check_circle", "#2e7d32");
  } else if (body.status === "ditolak") {
    await logActivity(event, "Tolak Mutasi", `${(updated == null ? void 0 : updated.santri) || ""} - ${(updated == null ? void 0 : updated.tipe) || ""}`, "cancel", "#ba1a1a");
  }
  return updated;
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
