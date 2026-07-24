import { a as getDatabase, e as createError, h as getAuth } from './nitro.mjs';

async function verifyFirebaseToken(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const idToken = authHeader.split("Bearer ")[1];
  const auth = getAuth();
  try {
    const decoded = await auth.verifyIdToken(idToken);
    return decoded;
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" });
  }
}
function generateId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
async function rtdbGetList(path) {
  const db = getDatabase();
  const snap = await db.ref(path).once("value");
  const data = snap.val() || {};
  return Object.entries(data).map(([id, val]) => ({ id, ...val }));
}
async function rtdbGetById(path, id) {
  const db = getDatabase();
  const snap = await db.ref(`${path}/${id}`).once("value");
  if (!snap.exists()) return null;
  return { id, ...snap.val() };
}
async function rtdbAdd(path, data) {
  const db = getDatabase();
  const id = generateId();
  await db.ref(`${path}/${id}`).set(data);
  return { id, ...data };
}
async function rtdbUpdate(path, id, data) {
  const db = getDatabase();
  await db.ref(`${path}/${id}`).update(data);
}
async function rtdbRemove(path, id) {
  const db = getDatabase();
  await db.ref(`${path}/${id}`).remove();
}
async function logActivity(event, action, description, icon, color) {
  var _a, _b, _c, _d, _e, _f;
  try {
    const db = getDatabase();
    const id = generateId();
    let userName = "System";
    try {
      if ((_b = (_a = event.context) == null ? void 0 : _a.auth) == null ? void 0 : _b.name) {
        userName = event.context.auth.name;
      } else if ((_d = (_c = event.context) == null ? void 0 : _c.auth) == null ? void 0 : _d.email) {
        userName = event.context.auth.email;
      } else {
        const authHeader = (_f = (_e = event.headers) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, "authorization");
        if (authHeader) {
          const decoded = await verifyFirebaseToken(authHeader);
          userName = decoded.name || decoded.email || "System";
        }
      }
    } catch {
    }
    await db.ref(`activity_logs/${id}`).set({
      action,
      description,
      icon,
      color: color || "#1a6bff",
      userName,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch {
  }
}
async function rtdbQueryEqual(path, field, value) {
  const db = getDatabase();
  const snap = await db.ref(path).orderByChild(field).equalTo(value).once("value");
  const data = snap.val() || {};
  return Object.entries(data).map(([id, val]) => ({ id, ...val }));
}

export { rtdbAdd as a, rtdbRemove as b, rtdbUpdate as c, rtdbGetById as d, rtdbQueryEqual as e, generateId as g, logActivity as l, rtdbGetList as r, verifyFirebaseToken as v };
//# sourceMappingURL=firebase.mjs.map
