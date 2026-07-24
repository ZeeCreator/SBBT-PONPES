import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
import { b as useRoute } from './server.mjs';
import '../_/nitro.mjs';
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
  __name: "[type]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.kelas;
    const type = route.params.type;
    const loading = ref(true);
    const error = ref("");
    const className = ref("");
    const exams = ref([]);
    const iktibarList = ref([]);
    const students = ref([]);
    const subjects = ref([]);
    const selectedStudentId = ref("");
    const showAddModal = ref(false);
    const examForm = reactive({ sesi: "", subject: "", date: "", duration: 90 });
    const iktibarDate = ref((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const iktibarSearch = ref("");
    const iktibarForm = reactive({ santri: "", catatan: "", date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] });
    const examStats = computed(() => [
      { label: "Total Ujian", value: exams.value.length.toString(), color: "text-primary" },
      { label: "Rata-rata Nilai", value: exams.value.length ? (exams.value.reduce((s, e) => s + (Number(e.averageScore) || 0), 0) / exams.value.length).toFixed(1) : "-", color: "text-secondary" },
      { label: "Mata Pelajaran", value: [...new Set(exams.value.map((e) => e.subject))].length.toString(), color: "text-tertiary" },
      { label: "Nilai Tertinggi", value: exams.value.length ? Math.max(...exams.value.map((e) => Number(e.averageScore) || 0)).toString() : "-", color: "text-green-600" }
    ]);
    const filteredIktibar = computed(() => iktibarList.value.filter(
      (i) => (!iktibarSearch.value || i.santri.toLowerCase().includes(iktibarSearch.value.toLowerCase())) && (!iktibarDate.value || i.date === iktibarDate.value)
    ));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg flex flex-wrap items-center justify-between gap-stack-md"><div><button class="text-label-sm text-primary hover:underline mb-1 flex items-center gap-1"><span class="material-symbols-outlined text-sm">arrow_back</span> Kembali </button><h2 class="font-display text-headline-lg text-primary capitalize">${ssrInterpolate(unref(type))} - ${ssrInterpolate(unref(className))}</h2><p class="text-on-surface-variant text-body-md">${ssrInterpolate(unref(type) === "imtihan" ? "Kelola jadwal dan nilai ujian" : "Catatan iktibar harian santri")}</p></div>`);
      if (unref(type) === "imtihan") {
        _push(`<div class="flex flex-wrap items-center gap-3"><div class="flex items-center gap-2"><select class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary max-w-[200px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStudentId)) ? ssrLooseContain(unref(selectedStudentId), "") : ssrLooseEqual(unref(selectedStudentId), "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
        ssrRenderList(unref(students), (s) => {
          _push(`<option${ssrRenderAttr("value", s.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStudentId)) ? ssrLooseContain(unref(selectedStudentId), s.id) : ssrLooseEqual(unref(selectedStudentId), s.id)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
        });
        _push(`<!--]--></select><button class="flex items-center gap-2 px-4 py-2 bg-tertiary text-on-tertiary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"${ssrIncludeBooleanAttr(!unref(selectedStudentId)) ? " disabled" : ""}><span class="material-symbols-outlined text-sm">badge</span> Cetak Nilai </button></div><button class="flex items-center gap-2 px-6 py-2.5 bg-secondary text-on-secondary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">print</span> Cetak Nilai &amp; Ranking </button><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Tambah Ujian </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(error)) {
        _push(`<div class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span></div>`);
      } else if (unref(type) === "imtihan") {
        _push(`<!--[--><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
        ssrRenderList(unref(examStats), (s) => {
          _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm text-center"><p class="${ssrRenderClass([s.color, "font-display text-headline-md"])}">${ssrInterpolate(s.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(s.label)}</p></div>`);
        });
        _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Sesi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Mata Pelajaran</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Durasi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Nilai Rata-rata</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(exams), (exam) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-sm text-on-surface-variant text-center font-semibold">Imtihan ${ssrInterpolate(exam.sesi || "-")}</td><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(exam.subject)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(exam.date)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(exam.duration)} menit</td><td class="px-4 py-3 text-label-md">${ssrInterpolate(exam.averageScore || "-")}</td><td class="px-4 py-3 text-center"><button class="text-primary hover:text-primary-fixed mr-2 transition-colors"><span class="material-symbols-outlined">visibility</span></button><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(exams).length === 0) {
          _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Belum ada data ujian</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div><!--]-->`);
      } else {
        _push(`<!--[--><div class="mb-stack-lg flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">calendar_today</span><input type="date"${ssrRenderAttr("value", unref(iktibarDate))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"></div><input${ssrRenderAttr("value", unref(iktibarSearch))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary flex-1 max-w-xs" placeholder="Cari santri..."></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Catatan Iktibar</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(filteredIktibar), (item) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(item.santri)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant max-w-xs truncate">${ssrInterpolate(item.catatan)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.date)}</td><td class="px-4 py-3 text-center"><button class="text-primary hover:text-primary-fixed mr-2 transition-colors"><span class="material-symbols-outlined">edit</span></button><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredIktibar).length === 0) {
          _push(`<tr><td colspan="4" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Belum ada catatan iktibar</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div><div class="mt-stack-lg glass-card rounded-xl p-6 shadow-sm"><h3 class="font-display text-title-md text-primary mb-4">Tambah Catatan Iktibar</h3><form class="grid grid-cols-1 md:grid-cols-3 gap-stack-md"><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(iktibarForm).santri) ? ssrLooseContain(unref(iktibarForm).santri, "") : ssrLooseEqual(unref(iktibarForm).santri, "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
        ssrRenderList(unref(students), (s) => {
          _push(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(iktibarForm).santri) ? ssrLooseContain(unref(iktibarForm).santri, s.name) : ssrLooseEqual(unref(iktibarForm).santri, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
        });
        _push(`<!--]--></select><input type="date"${ssrRenderAttr("value", unref(iktibarForm).date)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><button class="px-6 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button><div class="md:col-span-3"><textarea class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none min-h-[80px]" placeholder="Catatan iktibar..." required>${ssrInterpolate(unref(iktibarForm).catatan)}</textarea></div></form></div><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showAddModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><h2 class="font-display text-headline-md text-on-primary">Tambah Ujian</h2><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Sesi</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(examForm).sesi) ? ssrLooseContain(unref(examForm).sesi, "") : ssrLooseEqual(unref(examForm).sesi, "")) ? " selected" : ""}>-- Pilih Sesi --</option><!--[-->`);
          ssrRenderList(4, (n) => {
            _push2(`<option${ssrRenderAttr("value", n)}${ssrIncludeBooleanAttr(Array.isArray(unref(examForm).sesi) ? ssrLooseContain(unref(examForm).sesi, n) : ssrLooseEqual(unref(examForm).sesi, n)) ? " selected" : ""}>Imtihan ${ssrInterpolate(n)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Mata Pelajaran</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(examForm).subject) ? ssrLooseContain(unref(examForm).subject, "") : ssrLooseEqual(unref(examForm).subject, "")) ? " selected" : ""}>-- Pilih Mata Pelajaran --</option><!--[-->`);
          ssrRenderList(unref(subjects), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(examForm).subject) ? ssrLooseContain(unref(examForm).subject, s.name) : ssrLooseEqual(unref(examForm).subject, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input type="date"${ssrRenderAttr("value", unref(examForm).date)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Durasi (menit)</label><input type="number"${ssrRenderAttr("value", unref(examForm).duration)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/akademik/imtihan/[kelas]/[type].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_type_-EZnVoXp8.mjs.map
