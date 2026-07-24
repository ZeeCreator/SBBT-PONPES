import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { a as rtdbAdd, l as logActivity } from '../../_/firebase.mjs';
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

const payments_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const data = {
    ...body,
    status: "paid",
    paidAt: (/* @__PURE__ */ new Date()).toISOString(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const result = await rtdbAdd("payments", data);
  await logActivity(event, "Proses Pembayaran SPP", `${body.invoiceCode || ""} - ${body.amount ? "Rp" + Number(body.amount).toLocaleString("id-ID") : ""}`, "credit_card", "#1a6bff");
  return result;
});

export { payments_post as default };
//# sourceMappingURL=payments.post.mjs.map
