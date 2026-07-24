import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { d as defineEventHandler, k as setHeader, e as createError } from '../../_/nitro.mjs';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
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

const docs_get = defineEventHandler(async (event) => {
  const __filename = fileURLToPath(globalThis._importMeta_.url);
  const __dirname = dirname(__filename);
  let filePath = join(__dirname, "..", "..", "API.md");
  try {
    const contents = await readFile(filePath, "utf-8");
    setHeader(event, "content-type", "text/markdown; charset=utf-8");
    return contents;
  } catch (e) {
    const alt = join(__dirname, "..", "API.md");
    try {
      const contents = await readFile(alt, "utf-8");
      setHeader(event, "content-type", "text/markdown; charset=utf-8");
      return contents;
    } catch (e2) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to read API.md: ${e2.message}`
      });
    }
  }
});

export { docs_get as default };
//# sourceMappingURL=docs.get.mjs.map
