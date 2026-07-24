import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
import { X as XLSX } from '../../../_/xlsx.mjs';
import { a as rtdbAdd } from '../../../_/firebase.mjs';
import { a as generateNIS } from '../../../_/id-generator.mjs';
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
import 'fs';
import 'stream';

const import_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const type = body.type || "santri";
  const base64 = body.file;
  if (!base64) throw createError({ statusCode: 400, statusMessage: "File tidak ditemukan" });
  const buf = Buffer.from(base64.split(",")[1] || base64, "base64");
  const wb = XLSX.read(buf, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);
  const results = { success: 0, failed: 0, errors: [] };
  for (const row of rows) {
    try {
      if (type === "santri") {
        const name = (row["Nama"] || "").trim();
        if (!name) {
          results.failed++;
          results.errors.push("Baris tanpa nama");
          continue;
        }
        await rtdbAdd("students", {
          nis: String(row["NIS"] || generateNIS()),
          name,
          kelas: row["Kelas"] || "",
          kamar: row["Kamar"] || "",
          alamat: row["Alamat"] || "",
          nohp: String(row["NoHP"] || "")
        });
      } else if (type === "nilai") {
        await rtdbAdd("grades", {
          nis: String(row["NIS"] || ""),
          name: row["Nama"] || "",
          subject: row["Mata Pelajaran"] || "",
          tugas: Number(row["Nilai Tugas"]) || 0,
          uts: Number(row["Nilai UTS"]) || 0,
          uas: Number(row["Nilai UAS"]) || 0
        });
      }
      results.success++;
    } catch (e) {
      results.failed++;
      results.errors.push(`${row["Nama"] || "unknown"}: ${e.message}`);
    }
  }
  return results;
});

export { import_post as default };
//# sourceMappingURL=import.post.mjs.map
