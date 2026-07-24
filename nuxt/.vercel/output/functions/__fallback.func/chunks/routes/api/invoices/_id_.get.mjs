import { d as defineEventHandler, f as getRouterParams, e as createError } from '../../../_/nitro.mjs';
import { d as rtdbGetById } from '../../../_/firebase.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const invoice = await rtdbGetById("invoices", id);
  if (!invoice) {
    throw createError({
      statusCode: 404,
      statusMessage: "Invoice not found"
    });
  }
  return invoice;
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
