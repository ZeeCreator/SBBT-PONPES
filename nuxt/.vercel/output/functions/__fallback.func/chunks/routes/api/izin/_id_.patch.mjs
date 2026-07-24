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
  await rtdbUpdate("izin", id, { ...body, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
  const updated = await rtdbGetById("izin", id);
  if (body.status === "Disetujui") {
    await logActivity(event, "Setujui Izin", `${(updated == null ? void 0 : updated.santri) || ""} - ${(updated == null ? void 0 : updated.jenis) || ""}`, "check_circle", "#2e7d32");
  } else if (body.status === "Ditolak") {
    await logActivity(event, "Tolak Izin", `${(updated == null ? void 0 : updated.santri) || ""} - ${(updated == null ? void 0 : updated.jenis) || ""}`, "cancel", "#ba1a1a");
  }
  return updated;
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
