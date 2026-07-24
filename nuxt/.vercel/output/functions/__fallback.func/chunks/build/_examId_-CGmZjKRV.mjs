import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { b as useRoute } from './server.mjs';
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
  __name: "[examId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.kelas;
    route.params.examId;
    const loading = ref(true);
    const error = ref("");
    const success = ref("");
    const exam = ref(null);
    const className = ref("");
    const studentScores = ref([]);
    const average = computed(() => {
      const vals = studentScores.value.map((s) => Number(s.score) || 0).filter((v) => v > 0);
      return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "-";
    });
    const highest = computed(() => {
      const vals = studentScores.value.map((s) => Number(s.score) || 0).filter((v) => v > 0);
      return vals.length ? Math.max(...vals).toString() : "-";
    });
    const lowest = computed(() => {
      const vals = studentScores.value.map((s) => Number(s.score) || 0).filter((v) => v > 0);
      return vals.length ? Math.min(...vals).toString() : "-";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg flex flex-wrap items-center justify-between gap-stack-md"><div><button class="text-label-sm text-primary hover:underline mb-1 flex items-center gap-1"><span class="material-symbols-outlined text-sm">arrow_back</span> Kembali </button><h2 class="font-display text-headline-lg text-primary">Input Nilai ${ssrInterpolate((_a = unref(exam)) == null ? void 0 : _a.subject)}</h2><p class="text-on-surface-variant text-body-md">${ssrInterpolate(unref(className))} \u2014 ${ssrInterpolate((_b = unref(exam)) == null ? void 0 : _b.date)} (${ssrInterpolate((_c = unref(exam)) == null ? void 0 : _c.duration)} menit) ${ssrInterpolate(((_d = unref(exam)) == null ? void 0 : _d.sesi) ? `\u2014 Imtihan ${(_e = unref(exam)) == null ? void 0 : _e.sesi}` : "")}</p></div><div class="flex gap-3"><button class="flex items-center gap-2 px-6 py-2.5 bg-secondary text-on-secondary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">print</span> Cetak </button><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">save</span> Simpan Nilai </button></div></div>`);
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
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span></div>`);
      } else {
        _push(`<!--[--><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant w-12 text-center">No</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama Santri</th><th class="px-4 py-3 text-label-sm text-on-surface-variant w-24 text-center">Nilai</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Keterangan</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(studentScores), (s, i) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-sm text-on-surface-variant text-center">${ssrInterpolate(i + 1)}</td><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(s.name)}</td><td class="px-4 py-3 text-center"><input type="number" min="0" max="100"${ssrRenderAttr("value", s.score)} class="w-20 bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-md py-1.5 px-2 text-center focus:ring-primary"></td><td class="px-4 py-3"><input${ssrRenderAttr("value", s.notes)} class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-md py-1.5 px-2 focus:ring-primary" placeholder="\u2014"></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(studentScores).length === 0) {
          _push(`<tr><td colspan="4" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada santri di kelas ini</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div><div class="mt-stack-lg glass-card rounded-xl p-6 shadow-sm"><div class="flex items-center gap-6 text-label-md text-on-surface-variant"><span>Rata-rata: <strong class="text-primary text-title-md">${ssrInterpolate(unref(average))}</strong></span><span>Tertinggi: <strong class="text-green-600">${ssrInterpolate(unref(highest))}</strong></span><span>Terendah: <strong class="text-red-600">${ssrInterpolate(unref(lowest))}</strong></span><span>Jumlah Santri: <strong>${ssrInterpolate(unref(studentScores).length)}</strong></span></div></div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/akademik/imtihan/[kelas]/nilai/[examId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_examId_-CGmZjKRV.mjs.map
