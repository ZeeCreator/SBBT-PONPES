import { d as defineEventHandler, r as readBody, e as createError, a as getDatabase, h as getAuth, s as setCookie } from '../../../_/nitro.mjs';
import { l as logActivity } from '../../../_/firebase.mjs';
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

const login_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const email = String(body.email || "").trim();
  const password = String(body.password || "");
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: "Email dan password diperlukan" });
  }
  const apiKey = process.env.NUXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) throw createError({ statusCode: 500, statusMessage: "Firebase API Key tidak dikonfigurasi" });
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = ((_a = data.error) == null ? void 0 : _a.message) || "Email atau password salah";
    throw createError({ statusCode: 401, statusMessage: msg });
  }
  const uid = data.localId;
  const idToken = data.idToken;
  const db = getDatabase();
  const roleSnap = await db.ref(`roles/${uid}/role`).once("value");
  const role = roleSnap.val() || "";
  const auth = getAuth();
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: 7 * 24 * 60 * 60 * 1e3 });
  setCookie(event, "__session", sessionCookie, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  const displayName = data.displayName || email;
  await logActivity(event, "Login Sistem", `${displayName} - ${role || "Unknown"}`, "login", "#1a6bff");
  return { uid, role, email: data.email || email, name: displayName, idToken };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
