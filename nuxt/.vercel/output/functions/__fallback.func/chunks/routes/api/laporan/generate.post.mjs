import { d as defineEventHandler, r as readBody } from '../../../_/nitro.mjs';
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

const generate_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("Generate report:", body);
  return { message: "Report generation started", reportId: body.reportId };
});

export { generate_post as default };
//# sourceMappingURL=generate.post.mjs.map
