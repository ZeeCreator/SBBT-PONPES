import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { a as useAuth } from './server.mjs';
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
  __name: "growth",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const filterStudent = ref("");
    const showAddModal = ref(false);
    ref(null);
    const form = reactive({
      name: "",
      studentId: "",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      height: 0,
      weight: 0
    });
    const items = ref([]);
    const students = ref([]);
    useAuth();
    const stats = computed(() => {
      const len = items.value.length;
      const avgHeight = len ? items.value.reduce((acc, r) => acc + (Number(r.height) || 0), 0) / len : 0;
      const avgWeight = len ? items.value.reduce((acc, r) => acc + (Number(r.weight) || 0), 0) / len : 0;
      const giziBaik = items.value.filter((r) => r.status === "Normal").length;
      return [
        { label: "Total Tercatat", icon: "monitoring", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: len },
        { label: "Rata-rata TB", icon: "height", bg: "bg-blue-100", iconColor: "text-blue-600", valueColor: "text-blue-700", value: avgHeight.toFixed(1) + " cm" },
        { label: "Rata-rata BB", icon: "monitor_weight", bg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", value: avgWeight.toFixed(1) + " kg" },
        { label: "Gizi Baik", icon: "check_circle", bg: "bg-teal-100", iconColor: "text-teal-600", valueColor: "text-teal-700", value: len ? Math.round(giziBaik / len * 100) + "%" : "0%" }
      ];
    });
    const filteredRecords = computed(() => {
      return items.value.filter((r) => {
        return !filterStudent.value || (r.name || "").toLowerCase().includes(filterStudent.value.toLowerCase());
      });
    });
    function nutritionBadge(status) {
      switch (status) {
        case "Normal":
          return "bg-green-100 text-green-700";
        case "Overweight":
          return "bg-orange-100 text-orange-700";
        case "Underweight":
          return "bg-amber-100 text-amber-700";
        case "Obesitas":
          return "bg-red-100 text-red-700";
        default:
          return "bg-surface-container text-on-surface-variant";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}>`);
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary">sync</span><span class="ml-2 text-on-surface-variant">Memuat data...</span></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-error-container text-on-error-container p-stack-md rounded-xl mb-stack-lg">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!--[--><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Stimulasi Tinggi &amp; Berat Badan</h2><p class="text-on-surface-variant text-body-md">Monitoring pertumbuhan TB/BB santri secara berkala.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
        ssrRenderList(unref(stats), (stat) => {
          _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm text-center"><div class="${ssrRenderClass([stat.bg, "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"])}"><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(stat.label)}</p></div>`);
        });
        _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterStudent))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari santri..."></div></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Tambah Pengukuran </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">TB (cm)</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">BB (kg)</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">IMT</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status Gizi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(filteredRecords), (record) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(record.name)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(record.date)}</td><td class="px-4 py-3 text-label-sm">${ssrInterpolate(record.height)}</td><td class="px-4 py-3 text-label-sm">${ssrInterpolate(record.weight)}</td><td class="px-4 py-3 text-label-sm">${ssrInterpolate(record.imt)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2 py-1 text-[11px] font-bold rounded-full", nutritionBadge(record.status)])}">${ssrInterpolate(record.status)}</span></td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredRecords).length === 0) {
          _push(`<tr><td colspan="7" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div>`);
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(showAddModal)) {
            _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">Tambah Pengukuran</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Kesehatan Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).name) ? ssrLooseContain(unref(form).name, "") : ssrLooseEqual(unref(form).name, "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
            ssrRenderList(unref(students), (s) => {
              _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).name) ? ssrLooseContain(unref(form).name, s.name) : ssrLooseEqual(unref(form).name, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input type="date"${ssrRenderAttr("value", unref(form).date)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tinggi Badan (cm)</label><input type="number"${ssrRenderAttr("value", unref(form).height)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="170" step="0.1" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Berat Badan (kg)</label><input type="number"${ssrRenderAttr("value", unref(form).weight)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="65" step="0.1" required></div></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kesehatan/growth.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=growth-BRqpHmRJ.mjs.map
