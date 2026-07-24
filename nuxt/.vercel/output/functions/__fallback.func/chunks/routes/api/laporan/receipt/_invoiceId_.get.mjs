import { d as defineEventHandler, f as getRouterParams, a as getDatabase, e as createError } from '../../../../_/nitro.mjs';
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

const _invoiceId__get = defineEventHandler(async (event) => {
  const { invoiceId } = getRouterParams(event);
  const db = getDatabase();
  const [invoiceSnap, paymentsSnap] = await Promise.all([
    db.ref("invoices/" + invoiceId).once("value"),
    db.ref("payments").orderByChild("invoiceId").equalTo(invoiceId).once("value")
  ]);
  if (!invoiceSnap.exists()) {
    throw createError({ statusCode: 404, statusMessage: "Invoice not found" });
  }
  const invoice = { id: invoiceId, ...invoiceSnap.val() };
  const paymentsData = paymentsSnap.val() || {};
  const payments = Object.entries(paymentsData).map(([id, val]) => ({ id, ...val }));
  return {
    invoice,
    payments,
    receiptType: "pembayaran-spp",
    generatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
});

export { _invoiceId__get as default };
//# sourceMappingURL=_invoiceId_.get.mjs.map
