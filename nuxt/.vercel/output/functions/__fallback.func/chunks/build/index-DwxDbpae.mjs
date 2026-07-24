import { _ as __nuxt_component_0 } from './nuxt-link-Ck3s51Pu.mjs';
import { defineComponent, ref, computed, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderTeleport } from 'vue/server-renderer';
import { c as useRouter, b as useRoute } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useRoute();
    const loading = ref(true);
    const error = ref("");
    const success = ref("");
    const searchQuery = ref("");
    const filterType = ref("");
    const students = ref([]);
    const teachers = ref([]);
    const selectedStudent = ref(null);
    const showDeleteModal = ref(false);
    const deleteTarget = ref(null);
    ref("student");
    const attendance = ref([]);
    const violations = ref([]);
    const grades = ref([]);
    const loadingAttendance = ref(false);
    const loadingViolations = ref(false);
    const loadingGrades = ref(false);
    const filteredStudents = computed(() => {
      let result = students.value;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter((s) => (s.name || "").toLowerCase().includes(q) || (s.nis || "").toLowerCase().includes(q));
      }
      return result;
    });
    const filteredTeachers = computed(() => {
      let result = teachers.value;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter((t) => (t.name || "").toLowerCase().includes(q) || (t.nuptk || "").toLowerCase().includes(q));
      }
      return result;
    });
    function getInitials(name) {
      return (name || "A").split(" ").map((n) => n[0]).filter(Boolean).join("").substring(0, 2).toUpperCase();
    }
    function formatDate(ts) {
      if (!ts) return "-";
      return ts.split("T")[0];
    }
    function dayClass(status) {
      const map = {
        present: "bg-green-100 text-green-700",
        sick: "bg-amber-100 text-amber-700",
        permit: "bg-blue-100 text-blue-700",
        absent: "bg-red-100 text-red-700"
      };
      return map[status] || "bg-surface-container-low text-on-surface-variant";
    }
    function dayLabel(status) {
      const map = {
        present: "\u2713",
        sick: "S",
        permit: "I",
        absent: "A"
      };
      return map[status] || "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
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
      if (!unref(selectedStudent)) {
        _push(`<!--[--><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Pusat Informasi &amp; Data</h2><p class="text-on-surface-variant text-body-md">Cari dan kelola data santri, ustadz, dan guru dari satu tempat.</p></div><div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50 mb-stack-lg"><div class="p-stack-md border-b border-surface-variant/30 flex flex-wrap items-center gap-stack-md"><div class="flex items-center gap-2 flex-1 min-w-[200px]"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Cari nama, NIS, NUPTK..." class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary outline-none flex-1"></div><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Tipe:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "") : ssrLooseEqual(unref(filterType), "")) ? " selected" : ""}>Semua</option><option value="students"${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "students") : ssrLooseEqual(unref(filterType), "students")) ? " selected" : ""}>Santri</option><option value="teachers"${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "teachers") : ssrLooseEqual(unref(filterType), "teachers")) ? " selected" : ""}>Ustadz/Guru</option></select></div><button class="p-2 hover:bg-surface-container-high rounded-lg transition-colors" title="Refresh"><span class="${ssrRenderClass([{ "animate-spin": unref(loading) }, "material-symbols-outlined text-on-surface-variant"])}">refresh</span></button></div></div>`);
        if (unref(loading)) {
          _push(`<div class="text-center py-16"><span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span><p class="text-label-sm text-on-surface-variant mt-2">Memuat data...</p></div>`);
        } else {
          _push(`<!--[-->`);
          if (unref(filteredStudents).length > 0 && (unref(filterType) === "" || unref(filterType) === "students")) {
            _push(`<div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50 mb-stack-lg"><div class="p-stack-md border-b border-surface-variant/30 flex items-center justify-between"><h3 class="font-display text-title-lg text-primary flex items-center gap-2"><span class="material-symbols-outlined text-primary">groups</span> Santri <span class="text-label-sm text-on-surface-variant font-normal">(${ssrInterpolate(unref(filteredStudents).length)})</span></h3>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/kesantrian/students",
              class: "text-label-sm text-primary hover:underline"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`Kelola Santri`);
                } else {
                  return [
                    createTextVNode("Kelola Santri")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`</div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant w-10">#</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">NIS</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Kelas</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Gender</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-surface-variant/30"><!--[-->`);
            ssrRenderList(unref(filteredStudents), (s, i) => {
              _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(i + 1)}</td><td class="px-4 py-3"><div class="flex items-center gap-3">`);
              if (s.photo) {
                _push(`<div class="w-8 h-8 rounded-full overflow-hidden shrink-0"><img${ssrRenderAttr("src", s.photo)} alt="" class="w-full h-full object-cover"></div>`);
              } else {
                _push(`<div class="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-[11px]">${ssrInterpolate(getInitials(s.name))}</div>`);
              }
              _push(`<p class="text-label-md font-medium cursor-pointer hover:text-primary">${ssrInterpolate(s.name)}</p></div></td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(s.nis || "-")}</td><td class="px-4 py-3"><span class="bg-surface-container-low px-2 py-0.5 rounded text-label-sm">${ssrInterpolate(s.class || "-")}</span></td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(s.gender || "-")}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2 py-0.5 text-[10px] font-bold rounded-full", s.status === "Active" ? "bg-primary-fixed text-on-primary-fixed" : s.status === "On Leave" ? "bg-amber-100 text-amber-700" : "bg-surface-container text-on-surface-variant"])}">${ssrInterpolate(s.status)}</span></td><td class="px-4 py-3"><div class="flex items-center gap-1"><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Detail"><span class="material-symbols-outlined text-sm">visibility</span></button><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button><button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
            });
            _push(`<!--]--></tbody></table></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(filteredTeachers).length > 0 && (unref(filterType) === "" || unref(filterType) === "teachers")) {
            _push(`<div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50 mb-stack-lg"><div class="p-stack-md border-b border-surface-variant/30 flex items-center justify-between"><h3 class="font-display text-title-lg text-primary flex items-center gap-2"><span class="material-symbols-outlined text-secondary">badge</span> Ustadz / Guru <span class="text-label-sm text-on-surface-variant font-normal">(${ssrInterpolate(unref(filteredTeachers).length)})</span></h3>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/settings/teachers",
              class: "text-label-sm text-primary hover:underline"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`Kelola Guru`);
                } else {
                  return [
                    createTextVNode("Kelola Guru")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`</div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant w-10">#</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">NUPTK</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Spesialisasi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-surface-variant/30"><!--[-->`);
            ssrRenderList(unref(filteredTeachers), (t, i) => {
              _push(`<tr class="hover:bg-secondary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(i + 1)}</td><td class="px-4 py-3"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold text-[11px]">${ssrInterpolate(getInitials(t.name))}</div><div><p class="text-label-md font-medium">${ssrInterpolate(t.name)}</p>`);
              if (t.email) {
                _push(`<p class="text-[10px] text-on-surface-variant">${ssrInterpolate(t.email)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div></td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(t.nuptk || "-")}</td><td class="px-4 py-3"><span class="bg-surface-container-low px-2 py-0.5 rounded text-label-sm">${ssrInterpolate(t.specialization || "-")}</span></td><td class="px-4 py-3"><span class="${ssrRenderClass([t.status === "active" ? "text-green-600" : t.status === "resigned" ? "text-error" : "text-on-surface-variant", "flex items-center gap-1 text-label-sm"])}"><span class="${ssrRenderClass([t.status === "active" ? "bg-green-500" : t.status === "resigned" ? "bg-error" : "bg-outline", "w-1.5 h-1.5 rounded-full"])}"></span> ${ssrInterpolate(t.status)}</span></td><td class="px-4 py-3"><div class="flex items-center gap-1"><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button><button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
            });
            _push(`<!--]--></tbody></table></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (!unref(loading) && unref(filteredStudents).length === 0 && unref(filteredTeachers).length === 0) {
            _push(`<div class="text-center py-16 text-on-surface-variant"><span class="material-symbols-outlined text-4xl mb-3">search_off</span><p class="text-label-md">Tidak ada data ditemukan</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedStudent)) {
        _push(`<!--[--><button class="flex items-center gap-1 text-label-sm text-primary hover:underline mb-stack-md"><span class="material-symbols-outlined text-sm">arrow_back</span> Kembali </button><div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg"><div class="lg:col-span-2 glass-card rounded-2xl p-6"><div class="flex flex-col md:flex-row gap-6">`);
        if (unref(selectedStudent).photo) {
          _push(`<div class="w-full md:w-48 aspect-[4/5] rounded-xl overflow-hidden shadow-md"><img${ssrRenderAttr("src", unref(selectedStudent).photo)} alt="" class="w-full h-full object-cover"></div>`);
        } else {
          _push(`<div class="w-full md:w-48 aspect-[4/5] rounded-xl bg-primary-fixed/20 flex items-center justify-center"><span class="material-symbols-outlined text-6xl text-primary">person</span></div>`);
        }
        _push(`<div class="flex-1 space-y-4"><div><h2 class="font-display text-headline-md text-primary">${ssrInterpolate(unref(selectedStudent).name)}</h2><p class="text-on-surface-variant text-label-md">NIS: ${ssrInterpolate(unref(selectedStudent).nis || "-")} \u2022 ${ssrInterpolate(unref(selectedStudent).class || "-")}</p></div><div class="grid grid-cols-2 gap-3"><div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Gender</p><p class="text-title-sm font-bold">${ssrInterpolate(unref(selectedStudent).gender || "-")}</p></div><div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Kota</p><p class="text-title-sm font-bold">${ssrInterpolate(unref(selectedStudent).city || "-")}</p></div><div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Kamar</p><p class="text-title-sm font-bold">${ssrInterpolate(unref(selectedStudent).roomName || unref(selectedStudent).dormitoryName || "-")}</p></div><div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Status</p><p class="text-title-sm font-bold">${ssrInterpolate(unref(selectedStudent).status || "-")}</p></div><div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Skor Disiplin</p><p class="${ssrRenderClass([((_a = unref(selectedStudent).disciplineScore) != null ? _a : 100) >= 80 ? "text-green-600" : ((_b = unref(selectedStudent).disciplineScore) != null ? _b : 100) >= 60 ? "text-amber-600" : "text-red-600", "text-title-sm font-bold"])}">${ssrInterpolate((_c = unref(selectedStudent).disciplineScore) != null ? _c : 100)}</p></div></div><div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold mb-1">Alamat</p><p class="text-label-md">${ssrInterpolate(unref(selectedStudent).address || "-")}</p></div><div class="grid grid-cols-2 gap-3"><div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Orang Tua</p><p class="text-label-md font-bold">${ssrInterpolate(unref(selectedStudent).parentName || "-")}</p></div><div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">No. HP Orang Tua</p><p class="text-label-md font-bold">${ssrInterpolate(unref(selectedStudent).parentPhone || "-")}</p></div></div></div></div></div><div class="glass-card rounded-2xl p-6 space-y-3"><h3 class="font-display text-title-lg text-on-background">Aksi</h3><button class="w-full flex items-center gap-3 px-4 py-3 bg-primary text-on-primary rounded-xl text-label-md hover:brightness-110 transition-all"><span class="material-symbols-outlined text-sm">print</span> Cetak Biodata </button><button class="w-full flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-xl text-label-md hover:brightness-110 transition-all"><span class="material-symbols-outlined text-sm">grade</span> Cetak Nilai </button><button class="w-full flex items-center gap-3 px-4 py-3 bg-surface-container-high text-on-surface rounded-xl text-label-md hover:brightness-110 transition-all"><span class="material-symbols-outlined text-sm">history</span> Cetak All Riwayat </button><button class="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl text-label-md hover:brightness-110 transition-all border border-amber-200"><span class="material-symbols-outlined text-sm">swap_horiz</span> Cetak Surat Pindah </button><hr class="border-outline-variant/20 my-2"><button class="w-full flex items-center gap-3 px-4 py-3 bg-primary-fixed/30 text-primary rounded-xl text-label-md hover:bg-primary-fixed/50 transition-all"><span class="material-symbols-outlined text-sm">edit</span> Edit Santri </button><button class="w-full flex items-center gap-3 px-4 py-3 bg-error-container/30 text-error rounded-xl text-label-md hover:bg-error-container/50 transition-all"><span class="material-symbols-outlined text-sm">delete</span> Hapus Santri </button></div></div><div class="glass-card rounded-2xl overflow-hidden mb-stack-lg"><div class="p-stack-md border-b border-outline-variant/20 flex items-center justify-between"><h3 class="font-display text-title-lg text-primary flex items-center gap-2"><span class="material-symbols-outlined text-primary">calendar_month</span> Riwayat Absensi Bulanan </h3><span class="text-label-sm text-on-surface-variant">${ssrInterpolate(unref(attendance).length)} bulan</span></div>`);
        if (unref(loadingAttendance)) {
          _push(`<div class="p-6 text-center text-on-surface-variant text-label-sm">Memuat...</div>`);
        } else if (unref(attendance).length === 0) {
          _push(`<div class="p-6 text-center text-on-surface-variant text-label-sm">Belum ada data absensi</div>`);
        } else {
          _push(`<div class="space-y-4 p-4"><!--[-->`);
          ssrRenderList(unref(attendance), (month) => {
            _push(`<div class="border border-outline-variant/20 rounded-xl overflow-hidden"><div class="bg-surface-container-low px-4 py-2 flex items-center justify-between"><span class="text-label-sm font-bold">${ssrInterpolate(month.monthLabel)}</span><span class="text-label-xs text-on-surface-variant">Kelas: ${ssrInterpolate(month.className)}</span></div><div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="bg-surface-container-lowest"><th class="px-2 py-1 text-[10px] text-on-surface-variant w-24">Nama</th><!--[-->`);
            ssrRenderList(31, (d) => {
              _push(`<th class="px-0.5 py-1 text-[9px] text-on-surface-variant text-center" style="${ssrRenderStyle({ "min-width": "22px" })}">${ssrInterpolate(d)}</th>`);
            });
            _push(`<!--]--><th class="px-2 py-1 text-[10px] text-on-surface-variant text-center w-16">Hadir</th><th class="px-2 py-1 text-[10px] text-on-surface-variant text-center w-12">S/I/A</th></tr></thead><tbody><tr class="divide-x divide-outline-variant/10"><td class="px-2 py-1 text-label-xs font-medium">${ssrInterpolate(month.student.name)}</td><!--[-->`);
            ssrRenderList(31, (d) => {
              var _a2, _b2;
              _push(`<td class="px-0.5 py-1 text-center"><span class="${ssrRenderClass(["inline-block w-5 h-5 rounded text-[9px] font-bold leading-5", dayClass((_a2 = month.student.marks) == null ? void 0 : _a2[String(d)])])}">${ssrInterpolate(dayLabel((_b2 = month.student.marks) == null ? void 0 : _b2[String(d)]))}</span></td>`);
            });
            _push(`<!--]--><td class="px-2 py-1 text-center text-label-xs font-bold text-green-600">${ssrInterpolate(month.stats.hadir)}</td><td class="px-2 py-1 text-center text-label-xs"><span class="text-amber-600">${ssrInterpolate(month.stats.sakit)}</span>/ <span class="text-blue-600">${ssrInterpolate(month.stats.izin)}</span>/ <span class="text-red-600">${ssrInterpolate(month.stats.alpa)}</span></td></tr></tbody></table></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div><div class="glass-card rounded-2xl overflow-hidden mb-stack-lg"><div class="p-stack-md border-b border-outline-variant/20 flex items-center justify-between"><h3 class="font-display text-title-lg text-primary flex items-center gap-2"><span class="material-symbols-outlined text-error">gavel</span> Pelanggaran </h3><span class="text-label-sm text-on-surface-variant">${ssrInterpolate(unref(violations).length)} record</span></div>`);
        if (unref(loadingViolations)) {
          _push(`<div class="p-6 text-center text-on-surface-variant text-label-sm">Memuat...</div>`);
        } else if (unref(violations).length === 0) {
          _push(`<div class="p-6 text-center text-on-surface-variant text-label-sm">Tidak ada pelanggaran</div>`);
        } else {
          _push(`<div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Kategori</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Deskripsi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Poin</th></tr></thead><tbody class="divide-y divide-surface-variant/30"><!--[-->`);
          ssrRenderList(unref(violations), (v) => {
            _push(`<tr class="hover:bg-red-50/30"><td class="px-4 py-3 text-label-md">${ssrInterpolate(formatDate(v.timestamp))}</td><td class="px-4 py-3"><span class="bg-surface-container-low px-2 py-0.5 rounded text-label-sm">${ssrInterpolate(v.category || v.type || "-")}</span></td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(v.description || "-")}</td><td class="px-4 py-3"><span class="text-label-md font-bold text-error">-${ssrInterpolate(v.pointsDeducted || 0)}</span></td></tr>`);
          });
          _push(`<!--]--></tbody></table></div>`);
        }
        _push(`</div><div class="glass-card rounded-2xl overflow-hidden mb-stack-lg"><div class="p-stack-md border-b border-outline-variant/20 flex items-center justify-between"><h3 class="font-display text-title-lg text-primary flex items-center gap-2"><span class="material-symbols-outlined text-secondary">school</span> Nilai Akademik </h3><span class="text-label-sm text-on-surface-variant">${ssrInterpolate(unref(grades).length)} record</span></div>`);
        if (unref(loadingGrades)) {
          _push(`<div class="p-6 text-center text-on-surface-variant text-label-sm">Memuat...</div>`);
        } else if (unref(grades).length === 0) {
          _push(`<div class="p-6 text-center text-on-surface-variant text-label-sm">Belum ada nilai</div>`);
        } else {
          _push(`<div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Sesi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Mata Pelajaran</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Nilai</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Keterangan</th></tr></thead><tbody class="divide-y divide-surface-variant/30"><!--[-->`);
          ssrRenderList(unref(grades), (g) => {
            var _a2;
            _push(`<tr class="hover:bg-primary-fixed/5"><td class="px-4 py-3 text-label-sm text-on-surface-variant text-center font-semibold">${ssrInterpolate(g.sesi ? `Imtihan ${g.sesi}` : "-")}</td><td class="px-4 py-3 text-label-md">${ssrInterpolate(g.subject || "-")}</td><td class="px-4 py-3"><span class="text-label-md font-bold">${ssrInterpolate((_a2 = g.score) != null ? _a2 : "-")}</span></td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(g.date || "-")}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(g.notes || "-")}</td></tr>`);
          });
          _push(`<!--]--></tbody></table></div>`);
        }
        _push(`</div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        var _a2;
        if (unref(showDeleteModal)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-modal-enter p-6 text-center"><div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-red-500 text-3xl">warning</span></div><h3 class="font-display text-title-lg mb-2">Konfirmasi Hapus</h3><p class="text-label-md text-on-surface-variant mb-1">Yakin ingin menghapus?</p><p class="font-bold text-body-md">${ssrInterpolate((_a2 = unref(deleteTarget)) == null ? void 0 : _a2.name)}</p><div class="flex gap-3 mt-6"><button class="flex-1 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md">Batal</button><button class="flex-1 py-2 bg-error text-on-error rounded-lg text-label-md">Hapus</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kesantrian/information-vector/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DwxDbpae.mjs.map
