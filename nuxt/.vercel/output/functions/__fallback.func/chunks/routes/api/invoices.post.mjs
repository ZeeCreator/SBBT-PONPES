import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { g as generateId, a as rtdbAdd, l as logActivity } from '../../_/firebase.mjs';
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

const invoices_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const data = {
    ...body,
    status: "pending",
    invoiceCode: "INV/" + (/* @__PURE__ */ new Date()).getFullYear() + "/" + String((/* @__PURE__ */ new Date()).getMonth() + 1).padStart(2, "0") + "/" + generateId().substring(0, 6).toUpperCase(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const result = await rtdbAdd("invoices", data);
  await logActivity(event, "Buat Tagihan Baru", `${body.studentName || "Santri"} - ${body.type || "SPP"}`, "receipt", "#1a6bff");
  return result;
});

export { invoices_post as default };
//# sourceMappingURL=invoices.post.mjs.map
