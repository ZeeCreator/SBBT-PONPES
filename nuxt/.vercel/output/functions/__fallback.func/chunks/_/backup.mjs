import { a as getDatabase } from './nitro.mjs';
import { existsSync, rmSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';

const BACKUP_DIR = join(process.cwd(), ".output", "backups");
function ensureDir() {
  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
}
async function dumpRTDB() {
  const db = getDatabase();
  const snap = await db.ref("/").once("value");
  return snap.val() || {};
}
async function restoreRTDB(data) {
  const db = getDatabase();
  await db.ref("/").set(data);
}
function saveBackupFile(data) {
  ensureDir();
  const now = /* @__PURE__ */ new Date();
  const ts = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const name = `backup-${ts}.json`;
  const json = JSON.stringify(data, null, 2);
  writeFileSync(join(BACKUP_DIR, name), json, "utf-8");
  return { name, size: json.length, createdAt: now.toISOString() };
}
function listBackupFiles() {
  ensureDir();
  const files = readdirSync(BACKUP_DIR).filter((f) => f.endsWith(".json")).sort().reverse();
  return files.map((name) => {
    const stat = existsSync(join(BACKUP_DIR, name)) ? readFileSync(join(BACKUP_DIR, name), "utf-8") : "";
    return { name, size: stat.length, createdAt: name.replace("backup-", "").replace(".json", "").replace(/[-]/g, ":").replace("T", " ") || "-" };
  });
}
function readBackupFile(name) {
  const path = join(BACKUP_DIR, name);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8"));
}
function deleteBackupFile(name) {
  const path = join(BACKUP_DIR, name);
  if (!existsSync(path)) return false;
  rmSync(path);
  return true;
}

export { restoreRTDB as a, dumpRTDB as b, deleteBackupFile as d, listBackupFiles as l, readBackupFile as r, saveBackupFile as s };
//# sourceMappingURL=backup.mjs.map
