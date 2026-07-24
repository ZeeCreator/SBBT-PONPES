import { defineComponent, ref, computed, watch, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderTeleport } from 'vue/server-renderer';
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
    const students = ref([]);
    useAuth();
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const loading = ref(true);
    const errorS = ref("");
    const rewards = ref([]);
    const filterMonth = ref("");
    const teladanPeriod = ref("Bulan Ini");
    const showModal = ref(false);
    const editingId = ref(null);
    const filteredRewards = computed(
      () => !filterMonth.value ? rewards.value : rewards.value.filter((r) => {
        const m = new Date(r.tanggal).getMonth();
        return months[m] === filterMonth.value;
      })
    );
    const teladanSantri = computed(() => {
      const sorted = [...rewards.value].reduce((acc, r) => {
        acc[r.santri] = (acc[r.santri] || 0) + r.poin;
        return acc;
      }, {});
      const entries = Object.entries(sorted).sort((a, b) => b[1] - a[1]).slice(0, 3);
      return entries.map(([nama, poin], i) => ({
        nama,
        poin,
        ket: i === 0 ? "Santri Teladan" : i === 1 ? "Santri Terbaik" : "Santri Berprestasi"
      }));
    });
    const stats = computed(() => {
      var _a;
      const totalPoin = rewards.value.reduce((s, r) => s + r.poin, 0);
      return [
        { label: "Total Reward", icon: "card_giftcard", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: rewards.value.length.toString() },
        { label: "Top Santri", icon: "stars", bg: "bg-amber-100", iconColor: "text-amber-600", valueColor: "text-amber-700", value: ((_a = teladanSantri.value[0]) == null ? void 0 : _a.nama) || "-" },
        { label: "Total Poin Diberikan", icon: "toll", bg: "bg-secondary-fixed", iconColor: "text-secondary", valueColor: "text-secondary", value: totalPoin.toString() },
        { label: "Santri Teladan", icon: "workspace_premium", bg: "bg-tertiary-fixed", iconColor: "text-tertiary", valueColor: "text-on-background", value: Math.min(3, teladanSantri.value.length).toString() }
      ];
    });
    async function fetchData() {
      loading.value = true;
      errorS.value = "";
      try {
        const params = {};
        if (filterMonth.value) params.month = filterMonth.value;
        const qs = new URLSearchParams(params).toString();
        rewards.value = await $fetch(`/api/reward${qs ? "?" + qs : ""}`) || [];
      } catch (e) {
        errorS.value = e.message || "Gagal memuat data";
      } finally {
        loading.value = false;
      }
    }
    watch(filterMonth, () => fetchData());
    const defaultForm = () => ({
      id: 0,
      santri: "",
      jenis: "",
      poin: 0,
      tanggal: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      keterangan: ""
    });
    const form = reactive(defaultForm());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Reward &amp; Santri Teladan</h2><p class="text-on-surface-variant text-body-md">Berikan penghargaan poin reward dan tentukan santri teladan.</p></div>`);
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
          _push(`<div class="glass-card p-6 rounded-xl shadow-sm text-center"><div class="${ssrRenderClass([stat.bg, "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"])}"><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(stat.label)}</p></div>`);
        });
        _push(`<!--]--></div><div class="mb-stack-lg glass-card rounded-xl p-6 shadow-sm"><div class="flex items-center justify-between mb-4"><h3 class="font-display text-title-lg text-primary">Santri Teladan</h3><div class="flex items-center gap-2"><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value="Bulan Ini"${ssrIncludeBooleanAttr(Array.isArray(unref(teladanPeriod)) ? ssrLooseContain(unref(teladanPeriod), "Bulan Ini") : ssrLooseEqual(unref(teladanPeriod), "Bulan Ini")) ? " selected" : ""}>Bulan Ini</option><option value="Tahun Ini"${ssrIncludeBooleanAttr(Array.isArray(unref(teladanPeriod)) ? ssrLooseContain(unref(teladanPeriod), "Tahun Ini") : ssrLooseEqual(unref(teladanPeriod), "Tahun Ini")) ? " selected" : ""}>Tahun Ini</option></select></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><!--[-->`);
        ssrRenderList(unref(teladanSantri), (s, i) => {
          _push(`<div class="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-white"><div class="${ssrRenderClass([i === 0 ? "bg-amber-500" : i === 1 ? "bg-slate-400" : "bg-amber-700", "w-12 h-12 rounded-full flex items-center justify-center text-on-primary font-bold text-title-lg"])}">`);
          if (i === 0) {
            _push(`<span class="material-symbols-outlined">workspace_premium</span>`);
          } else if (i === 1) {
            _push(`<span class="material-symbols-outlined">military_tech</span>`);
          } else {
            _push(`<span class="material-symbols-outlined">emoji_events</span>`);
          }
          _push(`</div><div><p class="text-label-md font-bold">${ssrInterpolate(s.nama)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(s.poin)} poin - ${ssrInterpolate(s.ket)}</p></div></div>`);
        });
        _push(`<!--]--></div></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-6 border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-4"><div class="flex items-center gap-4"><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterMonth)) ? ssrLooseContain(unref(filterMonth), "") : ssrLooseEqual(unref(filterMonth), "")) ? " selected" : ""}>Semua Bulan</option><!--[-->`);
        ssrRenderList(months, (m) => {
          _push(`<option${ssrRenderAttr("value", m)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterMonth)) ? ssrLooseContain(unref(filterMonth), m) : ssrLooseEqual(unref(filterMonth), m)) ? " selected" : ""}>${ssrInterpolate(m)}</option>`);
        });
        _push(`<!--]--></select></div><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Tambah Reward </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Santri</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Jenis Reward</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Poin</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Keterangan</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(filteredRewards), (item) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4 text-label-md font-medium">${ssrInterpolate(item.santri)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full", item.jenis === "Prestasi" ? "bg-blue-100 text-blue-700" : item.jenis === "Kebersihan" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"])}">${ssrInterpolate(item.jenis)}</span></td><td class="px-6 py-4 text-label-md font-bold text-primary">${ssrInterpolate(item.poin)}</td><td class="px-6 py-4 text-label-sm text-on-surface-variant">${ssrInterpolate(item.tanggal)}</td><td class="px-6 py-4 text-label-sm text-on-surface-variant max-w-[200px] truncate">${ssrInterpolate(item.keterangan)}</td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button><button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredRewards).length === 0) {
          _push(`<tr><td colspan="6" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data reward.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter"><div class="p-6 border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(unref(editingId) ? "Edit Reward" : "Tambah Reward")}</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-6 space-y-4"><div><label class="text-label-sm text-on-surface-variant block mb-1">Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, "") : ssrLooseEqual(unref(form).santri, "")) ? " selected" : ""}>Pilih Santri</option><!--[-->`);
          ssrRenderList(unref(students), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, s.name) : ssrLooseEqual(unref(form).santri, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Jenis Reward</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "") : ssrLooseEqual(unref(form).jenis, "")) ? " selected" : ""}>Pilih Jenis</option><option value="Prestasi"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Prestasi") : ssrLooseEqual(unref(form).jenis, "Prestasi")) ? " selected" : ""}>Prestasi</option><option value="Kebersihan"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Kebersihan") : ssrLooseEqual(unref(form).jenis, "Kebersihan")) ? " selected" : ""}>Kebersihan</option><option value="Ibadah"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Ibadah") : ssrLooseEqual(unref(form).jenis, "Ibadah")) ? " selected" : ""}>Ibadah</option></select></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Poin</label><input${ssrRenderAttr("value", unref(form).poin)} type="number" min="1" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="10"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Tanggal</label><input${ssrRenderAttr("value", unref(form).tanggal)} type="date" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Keterangan</label><textarea rows="3" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary resize-none" placeholder="Deskripsi reward">${ssrInterpolate(unref(form).keterangan)}</textarea></div></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Simpan</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reward/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DHb4sfXp.mjs.map
