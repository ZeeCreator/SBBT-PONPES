import { d as defineEventHandler } from '../../../_/nitro.mjs';
import { r as rtdbGetList } from '../../../_/firebase.mjs';
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

function normalizeRooms(rooms) {
  if (!rooms) return [];
  if (Array.isArray(rooms)) return rooms;
  return Object.entries(rooms).map(([id, val]) => ({ id, ...typeof val === "string" ? { name: val } : val }));
}
const dormitories_get = defineEventHandler(async () => {
  const items = await rtdbGetList("dormitories");
  return items.map((item) => ({ ...item, rooms: normalizeRooms(item.rooms) }));
});

export { dormitories_get as default };
//# sourceMappingURL=dormitories.get.mjs.map
