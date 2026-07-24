import { defineComponent, ref, reactive, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("stok");
    const filterStok = ref("");
    const filterTransaksi = ref("");
    const filterTransaksiDate = ref("");
    const showModal = ref(false);
    const modalType = ref("barang");
    const modalTitle = ref("");
    const loading = ref(true);
    const errorS = ref("");
    const form = reactive({
      nama: "",
      harga: 0,
      stok: 0,
      santri: "",
      studentId: null,
      barang: "",
      jumlah: 1,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
    const tabs = [
      { key: "stok", label: "Stok Barang" },
      { key: "transaksi", label: "Transaksi" }
    ];
    useAuth();
    const students = ref([]);
    const stokBarang = ref([]);
    const transaksi = ref([]);
    watch(() => form.santri, (val) => {
      var _a;
      const match = students.value.find((s) => s.name === val);
      form.studentId = (_a = match == null ? void 0 : match.id) != null ? _a : null;
    });
    const stats = computed(() => {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const transToday = transaksi.value.filter((t) => t.date === today);
      const habis = stokBarang.value.filter((b) => b.stok <= 5);
      const totalSaldo = transaksi.value.reduce((s, t) => s + t.total, 0);
      return [
        { label: "Total Barang", icon: "inventory_2", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: stokBarang.value.length.toString() },
        { label: "Total Transaksi Hari Ini", icon: "receipt_long", bg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", value: transToday.length.toString() },
        { label: "Barang Habis", icon: "warning", bg: "bg-red-100", iconColor: "text-red-600", valueColor: "text-red-700", value: habis.length.toString() },
        { label: "Saldo Koperasi", icon: "account_balance", bg: "bg-amber-100", iconColor: "text-amber-600", valueColor: "text-amber-700", value: `Rp ${totalSaldo.toLocaleString()}` }
      ];
    });
    const filteredStok = computed(() => stokBarang.value.filter((b) => !filterStok.value || b.nama.toLowerCase().includes(filterStok.value.toLowerCase())));
    const filteredTransaksi = computed(() => transaksi.value.filter((t) => (!filterTransaksi.value || t.santri.toLowerCase().includes(filterTransaksi.value.toLowerCase())) && (!filterTransaksiDate.value || t.date === filterTransaksiDate.value)));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Koperasi Pondok</h2><p class="text-on-surface-variant text-body-md">Manajemen stok barang dan transaksi penjualan koperasi.</p></div>`);
      if (unref(errorS)) {
        _push(`<div class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">${ssrInterpolate(unref(errorS))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span></div>`);
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
        ssrRenderList(unref(stats), (stat) => {
          _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm text-center"><div class="${ssrRenderClass([stat.bg, "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"])}"><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(stat.label)}</p></div>`);
        });
        _push(`<!--]--></div><div class="flex gap-2 mb-stack-md border-b border-outline-variant/20"><!--[-->`);
        ssrRenderList(tabs, (tab) => {
          _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.key ? "text-primary" : "text-on-surface-variant hover:text-on-surface", "px-5 py-3 text-label-md font-medium transition-colors relative"])}">${ssrInterpolate(tab.label)} `);
          if (unref(activeTab) === tab.key) {
            _push(`<span class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div>`);
        if (unref(activeTab) === "stok") {
          _push(`<div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterStok))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari barang..."></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Tambah Barang </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama Barang</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Harga</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Stok</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Terjual</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
          ssrRenderList(unref(filteredStok), (item) => {
            _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(item.nama)}</td><td class="px-4 py-3 text-label-md text-primary font-bold">Rp ${ssrInterpolate(item.harga.toLocaleString())}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", item.stok > 5 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"])}">${ssrInterpolate(item.stok)}</span></td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.terjual)}</td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
          });
          _push(`<!--]-->`);
          if (unref(filteredStok).length === 0) {
            _push(`<tr><td colspan="5" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</tbody></table></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "transaksi") {
          _push(`<div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterTransaksi))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari santri..."></div><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">calendar_today</span><input type="date"${ssrRenderAttr("value", unref(filterTransaksiDate))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"></div></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Catat Transaksi </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Barang</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Jumlah</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Total</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
          ssrRenderList(unref(filteredTransaksi), (item) => {
            _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(item.santri)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.barang)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.jumlah)}</td><td class="px-4 py-3 text-label-md text-primary font-bold">Rp ${ssrInterpolate(item.total.toLocaleString())}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.date)}</td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
          });
          _push(`<!--]-->`);
          if (unref(filteredTransaksi).length === 0) {
            _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</tbody></table></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">${ssrInterpolate(unref(modalTitle))}</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Koperasi Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md">`);
          if (unref(modalType) === "barang") {
            _push2(`<div><div class="space-y-1 mb-stack-md"><label class="text-label-md text-on-surface-variant">Nama Barang</label><input${ssrRenderAttr("value", unref(form).nama)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Harga (Rp)</label><input type="number"${ssrRenderAttr("value", unref(form).harga)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" min="0" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Stok</label><input type="number"${ssrRenderAttr("value", unref(form).stok)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" min="0" required></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(modalType) === "transaksi") {
            _push2(`<div><div class="space-y-1 mb-stack-md"><label class="text-label-md text-on-surface-variant">Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, "") : ssrLooseEqual(unref(form).santri, "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
            ssrRenderList(unref(students), (s) => {
              _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, s.name) : ssrLooseEqual(unref(form).santri, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)} (${ssrInterpolate(s.nis || "-")})</option>`);
            });
            _push2(`<!--]--></select></div><div class="space-y-1 mb-stack-md"><label class="text-label-md text-on-surface-variant">Barang</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><!--[-->`);
            ssrRenderList(unref(stokBarang), (b) => {
              _push2(`<option${ssrRenderAttr("value", b.nama)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).barang) ? ssrLooseContain(unref(form).barang, b.nama) : ssrLooseEqual(unref(form).barang, b.nama)) ? " selected" : ""}>${ssrInterpolate(b.nama)} (Stok: ${ssrInterpolate(b.stok)})</option>`);
            });
            _push2(`<!--]--></select></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jumlah</label><input type="number"${ssrRenderAttr("value", unref(form).jumlah)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" min="1" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input type="date"${ssrRenderAttr("value", unref(form).date)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/koperasi/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CZyuKyD-.mjs.map
