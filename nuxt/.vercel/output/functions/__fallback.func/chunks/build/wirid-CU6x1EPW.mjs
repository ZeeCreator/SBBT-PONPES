import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport } from 'vue/server-renderer';
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
  __name: "wirid",
  __ssrInlineRender: true,
  setup(__props) {
    ref(true);
    ref("");
    const filterSearch = ref("");
    const filterJenis = ref("");
    const showAddModal = ref(false);
    const students = ref([]);
    useAuth();
    const jenisWirid = ["Wirid Ba'da Sholat", "Ratib Al-Haddad", "Ratib Al-Athas", "Dzikir Pagi", "Dzikir Petang", "Istighfar 100x", "Sholawat 100x", "Tahlil"];
    const form = reactive({
      name: "",
      studentId: "",
      jenis: "Wirid Ba'da Sholat",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: "Setor"
    });
    const items = ref([]);
    const stats = computed(() => {
      const total = items.value.length;
      const setor = items.value.filter((i) => i.status === "Setor").length;
      const belumSetor = items.value.filter((i) => i.status === "Belum Setor").length;
      const tunggakan = items.value.filter((i) => i.status === "Tunggakan").length;
      return [
        { label: "Total Wirid", icon: "book", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: total.toString() },
        { label: "Sudah Setor", icon: "check_circle", bg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", value: setor.toString() },
        { label: "Belum Setor", icon: "cancel", bg: "bg-red-100", iconColor: "text-red-600", valueColor: "text-red-700", value: belumSetor.toString() },
        { label: "Tunggakan", icon: "warning", bg: "bg-amber-100", iconColor: "text-amber-600", valueColor: "text-amber-700", value: tunggakan.toString() }
      ];
    });
    const filteredRecords = computed(() => {
      return items.value.filter((r) => {
        const matchSearch = !filterSearch.value || r.name.toLowerCase().includes(filterSearch.value.toLowerCase());
        const matchJenis = !filterJenis.value || r.jenis === filterJenis.value;
        return matchSearch && matchJenis;
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Dzikir &amp; Wirid Harian</h2><p class="text-on-surface-variant text-body-md">Tracking setoran wirid harian santri.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm text-center"><div class="${ssrRenderClass([stat.bg, "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"])}"><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(stat.label)}</p></div>`);
      });
      _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterSearch))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari santri..."></div><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">filter_alt</span><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterJenis)) ? ssrLooseContain(unref(filterJenis), "") : ssrLooseEqual(unref(filterJenis), "")) ? " selected" : ""}>Semua Wirid</option><!--[-->`);
      ssrRenderList(jenisWirid, (j) => {
        _push(`<option${ssrRenderAttr("value", j)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterJenis)) ? ssrLooseContain(unref(filterJenis), j) : ssrLooseEqual(unref(filterJenis), j)) ? " selected" : ""}>${ssrInterpolate(j)}</option>`);
      });
      _push(`<!--]--></select></div></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Catat Wirid </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama Santri</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Jenis Wirid</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
      ssrRenderList(unref(filteredRecords), (record) => {
        _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(record.name)}</td><td class="px-4 py-3 text-label-sm">${ssrInterpolate(record.jenis)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2 py-1 text-[11px] font-bold rounded-full", record.status === "Setor" ? "bg-green-100 text-green-700" : record.status === "Belum Setor" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"])}">${ssrInterpolate(record.status)}</span></td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(record.date)}</td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(filteredRecords).length === 0) {
        _push(`<tr><td colspan="5" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showAddModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">Catat Wirid Harian</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Ibadah Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).name) ? ssrLooseContain(unref(form).name, "") : ssrLooseEqual(unref(form).name, "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
          ssrRenderList(unref(students), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).name) ? ssrLooseContain(unref(form).name, s.name) : ssrLooseEqual(unref(form).name, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jenis Wirid</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><!--[-->`);
          ssrRenderList(jenisWirid, (j) => {
            _push2(`<option${ssrRenderAttr("value", j)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, j) : ssrLooseEqual(unref(form).jenis, j)) ? " selected" : ""}>${ssrInterpolate(j)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input type="date"${ssrRenderAttr("value", unref(form).date)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Status</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Setor"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Setor") : ssrLooseEqual(unref(form).status, "Setor")) ? " selected" : ""}>Setor</option><option value="Belum Setor"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Belum Setor") : ssrLooseEqual(unref(form).status, "Belum Setor")) ? " selected" : ""}>Belum Setor</option><option value="Tunggakan"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Tunggakan") : ssrLooseEqual(unref(form).status, "Tunggakan")) ? " selected" : ""}>Tunggakan</option></select></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ibadah/wirid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=wirid-CU6x1EPW.mjs.map
