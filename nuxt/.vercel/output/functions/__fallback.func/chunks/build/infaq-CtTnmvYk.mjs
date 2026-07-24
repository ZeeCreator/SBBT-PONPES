import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { a as useAuth } from './server.mjs';
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
  __name: "infaq",
  __ssrInlineRender: true,
  setup(__props) {
    ref(true);
    ref("");
    const filterSearch = ref("");
    const filterDate = ref("");
    const showAddModal = ref(false);
    const students = ref([]);
    useAuth();
    const form = reactive({
      name: "",
      studentId: "",
      amount: 0,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      keterangan: ""
    });
    const items = ref([]);
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const currentMonth = today.substring(0, 7);
    const totalAll = computed(() => items.value.reduce((sum, r) => sum + Number(r.amount), 0));
    const totalToday = computed(() => items.value.filter((r) => r.date === today).reduce((sum, r) => sum + Number(r.amount), 0));
    const totalMonth = computed(() => items.value.filter((r) => {
      var _a;
      return (_a = r.date) == null ? void 0 : _a.startsWith(currentMonth);
    }).reduce((sum, r) => sum + Number(r.amount), 0));
    const stats = computed(() => [
      { label: "Total Terkumpul", icon: "account_balance", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: `Rp ${totalAll.value.toLocaleString()}` },
      { label: "Hari Ini", icon: "today", bg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", value: `Rp ${totalToday.value.toLocaleString()}` },
      { label: "Bulan Ini", icon: "calendar_month", bg: "bg-blue-100", iconColor: "text-blue-600", valueColor: "text-blue-700", value: `Rp ${totalMonth.value.toLocaleString()}` },
      { label: "Total Transaksi", icon: "receipt_long", bg: "bg-amber-100", iconColor: "text-amber-600", valueColor: "text-amber-700", value: items.value.length.toString() }
    ]);
    const filteredRecords = computed(() => {
      return items.value.filter((r) => {
        const matchSearch = !filterSearch.value || r.name.toLowerCase().includes(filterSearch.value.toLowerCase());
        const matchDate = !filterDate.value || r.date === filterDate.value;
        return matchSearch && matchDate;
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Infaq &amp; Shodaqoh Harian</h2><p class="text-on-surface-variant text-body-md">Catatan infaq harian santri.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm text-center"><div class="${ssrRenderClass([stat.bg, "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"])}"><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(stat.label)}</p></div>`);
      });
      _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterSearch))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari santri..."></div><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">calendar_today</span><input type="date"${ssrRenderAttr("value", unref(filterDate))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"></div></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Catat Infaq </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama Santri</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Jumlah</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Keterangan</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
      ssrRenderList(unref(filteredRecords), (record) => {
        _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(record.name)}</td><td class="px-4 py-3 text-label-md font-bold text-primary">Rp ${ssrInterpolate(record.amount.toLocaleString())}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(record.date)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(record.keterangan || "-")}</td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
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
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">Catat Infaq &amp; Shodaqoh</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Ibadah Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).name) ? ssrLooseContain(unref(form).name, "") : ssrLooseEqual(unref(form).name, "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
          ssrRenderList(unref(students), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).name) ? ssrLooseContain(unref(form).name, s.name) : ssrLooseEqual(unref(form).name, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jumlah (Rp)</label><input type="number"${ssrRenderAttr("value", unref(form).amount)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="0" min="0" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input type="date"${ssrRenderAttr("value", unref(form).date)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Keterangan</label><textarea class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Opsional" rows="2">${ssrInterpolate(unref(form).keterangan)}</textarea></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ibadah/infaq.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=infaq-CtTnmvYk.mjs.map
