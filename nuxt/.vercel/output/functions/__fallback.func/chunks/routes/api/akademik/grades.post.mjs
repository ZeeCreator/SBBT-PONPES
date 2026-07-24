import { d as defineEventHandler, r as readBody } from '../../../_/nitro.mjs';
import { a as rtdbAdd } from '../../../_/firebase.mjs';
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

const grades_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const data = {
    studentId: body.studentId,
    studentName: body.studentName,
    subject: body.subject,
    score: body.score,
    semester: body.semester,
    academicYear: body.academicYear,
    class: body.class,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  return await rtdbAdd("grades", data);
});

export { grades_post as default };
//# sourceMappingURL=grades.post.mjs.map
