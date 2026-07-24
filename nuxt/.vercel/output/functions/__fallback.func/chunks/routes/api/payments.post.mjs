import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { a as rtdbAdd, l as logActivity } from '../../_/firebase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'fs';
import 'google-auth-library';
import 'fast-deep-equal';
import 'http';
import 'https';
import 'http2';
import 'url';
import 'events';
import '@fastify/busboy';
import 'zlib';
import 'jsonwebtoken';
import 'jwks-rsa';
import '@firebase/database-compat/standalone';
import 'path';
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
