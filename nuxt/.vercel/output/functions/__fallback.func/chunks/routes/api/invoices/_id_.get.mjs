import { d as defineEventHandler, e as getRouterParams, c as createError } from '../../../_/nitro.mjs';
import { d as rtdbGetById } from '../../../_/firebase.mjs';
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
