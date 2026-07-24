import { d as defineEventHandler, b as getRouterParam, c as createError } from '../../../../_/nitro.mjs';
import { d as rtdbGetById } from '../../../../_/firebase.mjs';
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
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Missing id" });
  const exam = await rtdbGetById("imtihan", id);
  if (!exam) throw createError({ statusCode: 404, message: "Exam not found" });
  return exam;
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
