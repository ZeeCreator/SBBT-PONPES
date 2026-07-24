import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderTeleport } from 'vue/server-renderer';
import { a as useAuth, b as useRoute, c as useRouter } from './server.mjs';
import '../_/nitro.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'firebase/auth';
import 'firebase/database';

const MARK_MAP = {
  A: "absent",
  a: "absent",
  S: "sick",
  s: "sick",
  X: "absent",
  x: "absent",
  ".": "present",
  "\xB7": "present",
  "\u2022": "present",
  v: "present",
  V: "present",
  "\u2713": "present",
  "\u2714": "present",
  R: "present",
  r: "present",
  I: "permit",
  i: "permit",
  P: "permit",
  p: "permit"
};
const MARK_CHARS = new Set(Object.keys(MARK_MAP));
function normalize(n) {
  return n.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
}
function wordOverlap(ocrWords, nameWords) {
  const common = ocrWords.filter((w) => nameWords.includes(w)).length;
  if (common > 0) return 45 + common * 10;
  return 0;
}
function charOverlap(a, b) {
  if (a.length < 2 || b.length < 2) return 0;
  let match = 0;
  const seen = /* @__PURE__ */ new Set();
  for (const ca of a) {
    for (let j = 0; j < b.length; j++) {
      if (!seen.has(j) && ca === b[j]) {
        match++;
        seen.add(j);
        break;
      }
    }
  }
  const maxLen = Math.max(a.length, b.length);
  const score = match / maxLen;
  if (a.length <= 3 && score >= 0.5) return score * 0.8;
  return score;
}
function fuzzyWords(ocrWords, nameWords) {
  let best = 0;
  for (const ow of ocrWords) {
    for (const nw of nameWords) {
      const score = charOverlap(ow, nw);
      if (score > best) best = score;
    }
  }
  if (best > 0.35) return Math.round(best * 38);
  return 0;
}
function matchScore(ocrLine, studentName) {
  const nOcr = normalize(ocrLine);
  const nName = normalize(studentName);
  if (!nOcr || !nName) return 0;
  if (nOcr === nName) return 100;
  if (nOcr.includes(nName)) return 85;
  if (nName.includes(nOcr) && nOcr.length > 2) return 65;
  const nOcrWords = nOcr.split(" ");
  const nNameWords = nName.split(" ");
  const common = wordOverlap(nOcrWords, nNameWords);
  if (common > 0) return common;
  return fuzzyWords(nOcrWords, nNameWords);
}
function extractDateMarks(tanggalCell) {
  const marks = {};
  const pattern = /(\d{1,2})\s*[:=]\s*([A-Za-z.·•v✓✔])/g;
  let m;
  while ((m = pattern.exec(tanggalCell)) !== null) {
    const date = m[1];
    const char = m[2];
    if (MARK_MAP[char]) marks[date] = MARK_MAP[char];
  }
  return marks;
}
function extractAllMarksOnLine(line) {
  const cells = line.split("|").map((c) => c.trim());
  if (cells.length < 4) return null;
  const tanggalCell = cells[cells.length - 2] || "";
  const marks = extractDateMarks(tanggalCell);
  if (Object.keys(marks).length > 0) return marks;
  const allCells = [tanggalCell, cells[cells.length - 1] || ""];
  for (const cell of allCells) {
    const tokens = cell.split(/\s+/);
    for (const t of tokens) {
      if (t.length === 1 && MARK_CHARS.has(t)) {
        const status = MARK_MAP[t];
        for (let d = 1; d <= 31; d++) marks[String(d)] = status;
        return marks;
      }
    }
  }
  return null;
}
function parseOcrAttendance(ocrText, students) {
  const lines = ocrText.split("\n").map((l) => l.trim()).filter(Boolean);
  const out = {};
  const studentOrder = [];
  for (const student of students) {
    const nName = normalize(student.name);
    if (!nName) continue;
    let bestScore = 0;
    let bestIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      const score = matchScore(lines[i], student.name);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
    if (bestIdx >= 0 && bestScore >= 25) {
      studentOrder.push({ student, score: bestScore, idx: bestIdx });
    }
  }
  studentOrder.sort((a, b) => a.idx - b.idx);
  if (!studentOrder.length) return null;
  for (const so of studentOrder) {
    const s = so.student;
    const line = lines[so.idx];
    const marks = extractAllMarksOnLine(line);
    if (marks) {
      out[s.id] = marks;
    } else {
      const def = {};
      for (let d = 1; d <= 31; d++) def[String(d)] = "present";
      out[s.id] = def;
    }
  }
  return out;
}
const dayColWidth = 32;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { getIdToken } = useAuth();
    const route = useRoute();
    const router = useRouter();
    const now = /* @__PURE__ */ new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const selectedMonth = ref(route.query.month || currentMonth);
    const selectedClass = ref(route.query.class || "");
    const classes = ref([]);
    const students = ref([]);
    const loadingStudents = ref(false);
    const saving = ref(false);
    const editingId = ref("");
    const error = ref("");
    const success = ref("");
    const showDeleteConfirm = ref(false);
    ref(null);
    const attendanceData = ref({});
    const ocrLoading = ref(false);
    const ocrResult = ref("");
    const ocrProgress = ref(0);
    const showOcrModal = ref(false);
    const ocrImageBase64 = ref("");
    const ocrProcessedBase64 = ref("");
    const skipWatchReload = ref(false);
    const ocrParsedRows = computed(() => {
      if (!ocrResult.value || students.value.length === 0) return [];
      const parsed = parseOcrAttendance(ocrResult.value, students.value);
      if (!parsed) return [];
      return Object.entries(parsed).map(([id, marks]) => {
        const student = students.value.find((s) => s.id === id);
        const total = Object.keys(marks).length;
        const marked = Object.values(marks).filter((v) => v !== "present").length;
        return {
          id,
          name: (student == null ? void 0 : student.name) || id,
          markSummary: marked > 0 ? `${marked}/${total} tanggal terisi` : "Semua Hadir",
          marks
        };
      });
    });
    const summary = computed(() => {
      const daysInMonth = (/* @__PURE__ */ new Date(selectedMonth.value + "-01")).getMonth() + 1 === parseInt(selectedMonth.value.split("-")[1]) ? new Date(parseInt(selectedMonth.value.split("-")[0]), parseInt(selectedMonth.value.split("-")[1]), 0).getDate() : 30;
      const totalDays = Math.min(daysInMonth, 31);
      const total = students.value.length * totalDays;
      let hadir = 0, sakit = 0, izin = 0, alpa = 0;
      for (const s of students.value) {
        const d = attendanceData.value[s.id];
        if (!d) continue;
        for (let day = 1; day <= totalDays; day++) {
          const key = String(day);
          if (d[key] === "present") hadir++;
          else if (d[key] === "sick") sakit++;
          else if (d[key] === "permit") izin++;
          else if (d[key] === "absent") alpa++;
        }
      }
      const pct = (v) => total ? Math.round(v / total * 100) : 0;
      return [
        { label: "Hadir", count: hadir, total, percent: pct(hadir), bg: "bg-green-50", labelColor: "text-green-700", valueColor: "text-green-600", barColor: "bg-green-500" },
        { label: "Sakit", count: sakit, total, percent: pct(sakit), bg: "bg-amber-50", labelColor: "text-amber-700", valueColor: "text-amber-600", barColor: "bg-amber-500" },
        { label: "Izin", count: izin, total, percent: pct(izin), bg: "bg-blue-50", labelColor: "text-blue-700", valueColor: "text-blue-600", barColor: "bg-blue-500" },
        { label: "Alpa", count: alpa, total, percent: pct(alpa), bg: "bg-red-50", labelColor: "text-red-700", valueColor: "text-red-600", barColor: "bg-red-500" }
      ];
    });
    async function fetchClasses() {
      try {
        const token = await getIdToken();
        const res = await fetch("/api/master-data/classes", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) classes.value = await res.json();
      } catch (e) {
        console.error(e);
      }
    }
    async function loadStudents() {
      if (!selectedClass.value) {
        students.value = [];
        return;
      }
      loadingStudents.value = true;
      try {
        const token = await getIdToken();
        const res = await fetch(`/api/students?class=${encodeURIComponent(selectedClass.value)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) students.value = await res.json();
      } catch (e) {
        console.error(e);
      } finally {
        loadingStudents.value = false;
      }
    }
    function initAttendanceData() {
      const data = {};
      for (const s of students.value) {
        const marks = {};
        for (let d = 1; d <= 31; d++) marks[String(d)] = "present";
        data[s.id] = marks;
      }
      attendanceData.value = data;
    }
    async function loadSession() {
      var _a;
      if (!selectedMonth.value || !selectedClass.value) return;
      error.value = "";
      await loadStudents();
      if (students.value.length === 0) return;
      initAttendanceData();
      try {
        const token = await getIdToken();
        const res = await fetch(`/api/attendance/monthly?month=${encodeURIComponent(selectedMonth.value)}&class=${encodeURIComponent(selectedClass.value)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: "Gagal memuat data" }));
          error.value = err.message || "Gagal memuat data absensi";
          return;
        }
        const records = await res.json();
        if (records.length > 0) {
          const existing = records[0];
          editingId.value = existing.id;
          const recordMap = existing.records || [];
          const merged = {};
          for (const s of students.value) {
            const found = recordMap.find((r) => r.studentId === s.id);
            const marks = {};
            for (let d = 1; d <= 31; d++) marks[String(d)] = ((_a = found == null ? void 0 : found.marks) == null ? void 0 : _a[String(d)]) || "present";
            merged[s.id] = marks;
          }
          attendanceData.value = merged;
        } else {
          editingId.value = "";
        }
      } catch (e) {
        error.value = e.message || "Gagal memuat data absensi";
        console.error(e);
      }
    }
    function statusClass(val) {
      const map = {
        present: "border-green-300 text-green-700",
        sick: "border-amber-300 text-amber-700",
        permit: "border-blue-300 text-blue-700",
        absent: "border-red-300 text-red-700"
      };
      return map[val] || "";
    }
    watch([selectedMonth, selectedClass], ([month, cls]) => {
      if (skipWatchReload.value) {
        skipWatchReload.value = false;
        return;
      }
      router.replace({ query: { month, class: cls } });
      if (month && cls) loadSession();
    });
    fetchClasses();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}>`);
      if (unref(error)) {
        _push(`<div class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(success)) {
        _push(`<div class="mb-stack-lg p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-label-md">${ssrInterpolate(unref(success))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center justify-between mb-stack-lg flex-wrap gap-4"><div><h2 class="font-display text-headline-lg text-primary">Manajemen Absensi Bulanan</h2><p class="text-on-surface-variant text-body-md">Catat dan kelola kehadiran santri per bulan</p></div>`);
      if (unref(editingId)) {
        _push(`<button class="bg-error text-on-error px-4 py-2 rounded-xl text-label-sm hover:brightness-110 transition-all flex items-center gap-2"><span class="material-symbols-outlined text-sm">delete</span> Hapus Absensi Bulan Ini </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="glass-card rounded-xl shadow-sm overflow-hidden mb-stack-lg"><div class="p-4 border-b border-outline-variant/20 flex flex-wrap gap-4 items-end"><div class="space-y-1"><label class="text-label-xs text-on-surface-variant">Bulan</label><input${ssrRenderAttr("value", unref(selectedMonth))} type="month" class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-sm py-2 px-3 focus:ring-primary outline-none"></div><div class="space-y-1"><label class="text-label-xs text-on-surface-variant">Kelas</label><select class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-sm py-2 px-3 focus:ring-primary outline-none min-w-[160px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedClass)) ? ssrLooseContain(unref(selectedClass), "") : ssrLooseEqual(unref(selectedClass), "")) ? " selected" : ""}>-- Pilih Kelas --</option><!--[-->`);
      ssrRenderList(unref(classes), (cls) => {
        _push(`<option${ssrRenderAttr("value", cls.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedClass)) ? ssrLooseContain(unref(selectedClass), cls.name) : ssrLooseEqual(unref(selectedClass), cls.name)) ? " selected" : ""}>${ssrInterpolate(cls.name)}</option>`);
      });
      _push(`<!--]--></select></div><button class="bg-primary text-on-primary px-5 py-2 rounded-xl text-label-sm hover:brightness-110 transition-all flex items-center gap-2"><span class="material-symbols-outlined text-sm">search</span> Cari </button></div></div>`);
      if (Object.keys(unref(attendanceData)).length > 0) {
        _push(`<div class="glass-card rounded-xl shadow-sm overflow-hidden mb-stack-lg"><div class="p-stack-md border-b border-outline-variant/20"><h3 class="font-display text-title-lg text-primary flex items-center gap-2"><span class="material-symbols-outlined">bar_chart</span> Rekap Absensi ${ssrInterpolate(unref(selectedClass))} <span class="text-label-sm text-on-surface-variant font-normal">${ssrInterpolate(unref(selectedMonth))}</span></h3></div><div class="p-stack-md"><div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"><!--[-->`);
        ssrRenderList(unref(summary), (s) => {
          _push(`<div class="${ssrRenderClass([s.bg, "p-3 rounded-xl"])}"><p class="${ssrRenderClass([s.labelColor, "text-[10px] uppercase font-semibold"])}">${ssrInterpolate(s.label)}</p><p class="${ssrRenderClass([s.valueColor, "text-title-lg font-bold"])}">${ssrInterpolate(s.count)} <span class="text-label-sm font-normal">/ ${ssrInterpolate(s.total)}</span></p><div class="w-full h-1.5 bg-white/30 rounded-full mt-1 overflow-hidden"><div class="${ssrRenderClass([s.barColor, "h-full rounded-full transition-all"])}" style="${ssrRenderStyle({ width: s.percent + "%" })}"></div></div><p class="${ssrRenderClass([s.labelColor, "text-[11px] mt-0.5"])}">${ssrInterpolate(s.percent)}%</p></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(students).length > 0) {
        _push(`<div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="overflow-x-auto" id="print-area"><table class="w-full text-left" style="${ssrRenderStyle({ "min-width": "1400px" })}"><thead class="bg-surface-container-low"><tr><th class="px-2 py-2 text-label-xs text-on-surface-variant w-8 text-center">#</th><th class="px-2 py-2 text-label-xs text-on-surface-variant sticky left-0 bg-surface-container-low z-10" style="${ssrRenderStyle({ "min-width": "120px" })}">Nama Santri</th><th class="px-2 py-2 text-label-xs text-on-surface-variant" style="${ssrRenderStyle({ "min-width": "80px" })}">Alamat</th><!--[-->`);
        ssrRenderList(31, (d) => {
          _push(`<th class="px-0.5 py-2 text-label-xs text-on-surface-variant text-center" style="${ssrRenderStyle({ minWidth: dayColWidth + "px", width: dayColWidth + "px" })}">${ssrInterpolate(d)}</th>`);
        });
        _push(`<!--]--></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(students), (student, idx) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-2 py-1 text-label-xs text-on-surface-variant text-center">${ssrInterpolate(idx + 1)}</td><td class="px-2 py-1 text-label-xs font-medium sticky left-0 bg-surface z-10">${ssrInterpolate(student.name)}</td><td class="px-2 py-1 text-label-xs text-on-surface-variant">${ssrInterpolate(student.city || "-")}</td><!--[-->`);
          ssrRenderList(31, (d) => {
            _push(`<td class="px-0.5 py-1 text-center"><select class="${ssrRenderClass([statusClass(unref(attendanceData)[student.id][String(d)]), "bg-surface-container-low border rounded text-[10px] py-1 px-0.5 focus:ring-primary outline-none w-full"])}"><option value="present"${ssrIncludeBooleanAttr(Array.isArray(unref(attendanceData)[student.id][String(d)]) ? ssrLooseContain(unref(attendanceData)[student.id][String(d)], "present") : ssrLooseEqual(unref(attendanceData)[student.id][String(d)], "present")) ? " selected" : ""}>\u2713</option><option value="sick"${ssrIncludeBooleanAttr(Array.isArray(unref(attendanceData)[student.id][String(d)]) ? ssrLooseContain(unref(attendanceData)[student.id][String(d)], "sick") : ssrLooseEqual(unref(attendanceData)[student.id][String(d)], "sick")) ? " selected" : ""}>S</option><option value="permit"${ssrIncludeBooleanAttr(Array.isArray(unref(attendanceData)[student.id][String(d)]) ? ssrLooseContain(unref(attendanceData)[student.id][String(d)], "permit") : ssrLooseEqual(unref(attendanceData)[student.id][String(d)], "permit")) ? " selected" : ""}>I</option><option value="absent"${ssrIncludeBooleanAttr(Array.isArray(unref(attendanceData)[student.id][String(d)]) ? ssrLooseContain(unref(attendanceData)[student.id][String(d)], "absent") : ssrLooseEqual(unref(attendanceData)[student.id][String(d)], "absent")) ? " selected" : ""}>A</option></select></td>`);
          });
          _push(`<!--]--></tr>`);
        });
        _push(`<!--]--></tbody></table></div><div class="p-4 border-t border-outline-variant/20 flex flex-wrap justify-end gap-3"><button class="bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl text-label-sm hover:brightness-110 transition-all flex items-center gap-2"><span class="material-symbols-outlined text-sm">table_chart</span> Excel </button><button class="bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl text-label-sm hover:brightness-110 transition-all flex items-center gap-2"><span class="material-symbols-outlined text-sm">image</span> OCR </button><input type="file" accept="image/*" class="hidden"><button class="bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl text-label-sm">Reset</button><button class="bg-secondary-container text-on-secondary-container px-4 py-2.5 rounded-xl text-label-sm font-bold hover:brightness-110 transition-all flex items-center gap-2"><span class="material-symbols-outlined text-sm">print</span> Cetak </button><button${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="bg-primary text-on-primary px-4 py-2.5 rounded-xl text-label-sm font-bold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-60">`);
        if (unref(saving)) {
          _push(`<span class="material-symbols-outlined animate-spin text-sm">refresh</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(unref(saving) ? "Menyimpan..." : unref(editingId) ? "Update" : "Simpan")}</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedMonth) && unref(selectedClass) && unref(students).length === 0 && !unref(loadingStudents)) {
        _push(`<div class="glass-card rounded-xl shadow-sm p-8 text-center"><span class="material-symbols-outlined text-4xl text-on-surface-variant mb-3">people</span><p class="text-label-md text-on-surface-variant">Tidak ada santri di kelas <strong>${ssrInterpolate(unref(selectedClass))}</strong></p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loadingStudents)) {
        _push(`<div class="text-center py-12"><span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span><p class="text-label-sm text-on-surface-variant mt-2">Memuat data...</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(ocrLoading)) {
        _push(`<div class="glass-card rounded-xl shadow-sm p-6 mb-stack-lg text-center"><span class="material-symbols-outlined animate-spin text-primary text-3xl mb-3">image</span><p class="text-label-md text-primary font-semibold">Memproses OCR...</p><div class="w-full max-w-md mx-auto bg-surface-container-low rounded-full h-2 mt-3 overflow-hidden"><div class="h-full bg-primary rounded-full transition-all" style="${ssrRenderStyle({ width: unref(ocrProgress) + "%" })}"></div></div><p class="text-label-sm text-on-surface-variant mt-2">${ssrInterpolate(unref(ocrProgress))}%</p></div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showOcrModal)) {
          _push2(`<div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div class="bg-surface rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-4"><h3 class="font-display text-title-lg text-primary">Hasil OCR Absensi</h3><button class="text-on-surface-variant hover:text-primary"><span class="material-symbols-outlined">close</span></button></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"><div><p class="text-label-xs text-on-surface-variant mb-1">Gambar Asli</p><img${ssrRenderAttr("src", unref(ocrImageBase64))} alt="Original" class="w-full rounded-lg border border-outline-variant/30"></div><div><p class="text-label-xs text-on-surface-variant mb-1">Gambar Diproses</p><img${ssrRenderAttr("src", unref(ocrProcessedBase64) || unref(ocrImageBase64))} alt="Processed" class="w-full rounded-lg border border-outline-variant/30"></div><div><p class="text-label-xs text-on-surface-variant mb-1">Teks Terdeteksi</p><pre class="w-full h-48 overflow-y-auto bg-surface-container-low rounded-lg p-3 text-label-sm font-mono whitespace-pre-wrap border border-outline-variant/30">${ssrInterpolate(unref(ocrResult) || "Tidak ada teks terdeteksi")}</pre></div></div>`);
          if (unref(ocrParsedRows).length > 0) {
            _push2(`<div class="mb-4"><p class="text-label-xs text-on-surface-variant mb-2">Hasil Parsing (${ssrInterpolate(unref(ocrParsedRows).length)} santri):</p><div class="max-h-32 overflow-y-auto bg-surface-container-low rounded-lg border border-outline-variant/30 divide-y divide-outline-variant/10"><!--[-->`);
            ssrRenderList(unref(ocrParsedRows), (row) => {
              _push2(`<div class="flex items-center justify-between px-3 py-1.5 text-label-sm"><span class="font-medium truncate mr-2">${ssrInterpolate(row.name)}</span><span class="text-label-xs text-on-surface-variant">${ssrInterpolate(row.markSummary)}</span></div>`);
            });
            _push2(`<!--]--></div></div>`);
          } else if (unref(ocrResult) && !unref(ocrLoading)) {
            _push2(`<div class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-label-sm"> Teks OCR tidak dapat dicocokkan dengan data santri. Periksa format tabel atau coba gambar lain. </div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex justify-end gap-3"><button class="bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-label-sm">Tutup</button><button class="bg-primary text-on-primary px-4 py-2 rounded-xl text-label-sm font-bold"${ssrIncludeBooleanAttr(unref(ocrParsedRows).length === 0) ? " disabled" : ""}>Terapkan ke Absensi</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showDeleteConfirm)) {
          _push2(`<div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div class="bg-surface rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center"><div class="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-error text-3xl">delete</span></div><h3 class="font-display text-title-lg text-primary mb-2">Hapus Absensi Bulanan?</h3><p class="text-label-md text-on-surface-variant mb-6">Yakin ingin menghapus absensi bulan <strong>${ssrInterpolate(unref(selectedMonth))}</strong> kelas <strong>${ssrInterpolate(unref(selectedClass))}</strong>?</p><div class="flex gap-3"><button class="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl text-label-md">Batal</button><button class="flex-1 bg-error text-on-error py-3 rounded-xl text-label-md font-bold hover:brightness-110 transition-all">Hapus</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/attendance/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CV4R2jfH.mjs.map
