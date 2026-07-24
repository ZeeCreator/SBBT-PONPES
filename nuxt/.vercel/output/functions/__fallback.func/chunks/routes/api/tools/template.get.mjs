import { d as defineEventHandler, a as getQuery, i as setHeader } from '../../../_/nitro.mjs';
import { X as XLSX } from '../../../_/xlsx.mjs';
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

const template_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const type = query.type || "santri";
  const wb = XLSX.utils.book_new();
  if (type === "santri") {
    const data = [
      { NIS: "12345", Nama: "Ahmad Fauzi", Kelas: "10-A", Kamar: "1-A", Alamat: "Jakarta", NoHP: "08123456789" }
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [{ wch: 10 }, { wch: 25 }, { wch: 10 }, { wch: 10 }, { wch: 30 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, "Data Santri");
  } else if (type === "nilai") {
    const data = [
      { NIS: "12345", Nama: "Ahmad Fauzi", "Mata Pelajaran": "Bahasa Arab", "Nilai Tugas": 85, "Nilai UTS": 80, "Nilai UAS": 90 }
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [{ wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 12 }, { wch: 10 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws, "Nilai");
  } else if (type === "absensi") {
    const dates = [];
    for (let d = 1; d <= 31; d++) dates.push(`Tgl ${d}`);
    const header = { NIS: "NIS", Nama: "Nama Santri" };
    dates.forEach((d, i) => {
      header[d] = `${i + 1}`;
    });
    const data = [header];
    const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
    ws["!cols"] = [{ wch: 10 }, { wch: 25 }, ...dates.map(() => ({ wch: 6 }))];
    XLSX.utils.book_append_sheet(wb, ws, "Absensi Bulanan");
  }
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  setHeader(event, "Content-Disposition", `attachment; filename="template-${type}.xlsx"`);
  return buf;
});

export { template_get as default };
//# sourceMappingURL=template.get.mjs.map
