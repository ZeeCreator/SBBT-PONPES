import { d as defineEventHandler, a as getDatabase } from '../../_/nitro.mjs';
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

const defaultReports = [
  { id: "rapor", title: "Rapor Lengkap PDF", description: "Cetak rapor lengkap semua santri", icon: "menu_book", bg: "bg-blue-100", iconColor: "text-blue-600", type: "PDF", period: "Semester Ganjil 2024/2025" },
  { id: "transkrip", title: "Transkrip Hafalan Quran", description: "Laporan capaian hafalan Al-Qur'an", icon: "auto_stories", bg: "bg-green-100", iconColor: "text-green-600", type: "PDF", period: "Bulan Oktober 2024" },
  { id: "sholat", title: "Laporan Kehadiran Sholat", description: "Rekap kehadiran sholat fardhu", icon: "mosque", bg: "bg-purple-100", iconColor: "text-purple-600", type: "PDF", period: "Bulan Oktober 2024" },
  { id: "pelanggaran", title: "Laporan Pelanggaran Bulanan", description: "Data pelanggaran santri", icon: "gavel", bg: "bg-red-100", iconColor: "text-red-600", type: "PDF", period: "Bulan Oktober 2024" },
  { id: "keuangan", title: "Laporan Keuangan Bulanan", description: "Rekap pembayaran SPP", icon: "payments", bg: "bg-amber-100", iconColor: "text-amber-600", type: "PDF", period: "Bulan Oktober 2024" },
  { id: "perkembangan", title: "Laporan Perkembangan Santri", description: "Laporan komprehensif perkembangan santri", icon: "trending_up", bg: "bg-teal-100", iconColor: "text-teal-600", type: "PDF", period: "Semester Ganjil 2024/2025" }
];
const index_get = defineEventHandler(async (event) => {
  const db = getDatabase();
  const snap = await db.ref("reports").once("value");
  const reports = snap.val();
  if (reports) {
    return Object.entries(reports).map(([id, val]) => ({ id, ...val }));
  }
  return defaultReports;
});

export { index_get as default };
//# sourceMappingURL=index10.get.mjs.map
