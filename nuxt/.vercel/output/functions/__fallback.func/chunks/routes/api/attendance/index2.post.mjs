import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
import { v as verifyFirebaseToken } from '../../../_/firebase.mjs';
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

const index_post = defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get("authorization"));
  const body = await readBody(event);
  if (!body || !body.image) throw createError({ statusCode: 400, statusMessage: "Base64 image required" });
  const { image, ocrText, date, class: className } = body;
  const db = getDatabase();
  const id = "ocr_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  await db.ref(`attendance_ocr/${id}`).set({
    date: date || "",
    class: className || "",
    image,
    ocrText: ocrText || "",
    imageSize: image.length,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  return { id, message: "OCR result stored" };
});

export { index_post as default };
//# sourceMappingURL=index2.post.mjs.map
