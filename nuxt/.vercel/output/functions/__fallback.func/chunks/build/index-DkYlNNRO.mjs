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
    const tabs = [
      { id: "ziyadah", label: "Ziyadah", icon: "add_circle" },
      { id: "murojaah", label: "Murojaah", icon: "autorenew" }
    ];
    const activeTab = ref("ziyadah");
    const filterSantri = ref("");
    const loading = ref(true);
    const errorS = ref("");
    const records = ref([]);
    const showModal = ref(false);
    const students = ref([]);
    useAuth();
    const filteredRecords = computed(
      () => records.value.filter(
        (r) => r.type === activeTab.value && (!filterSantri.value || r.santri === filterSantri.value)
      )
    );
    const stats = computed(() => {
      const setoran = records.value.filter((r) => r.type === "ziyadah").length;
      const totalSantri = new Set(records.value.map((r) => r.santri)).size;
      const lancar = records.value.filter((r) => r.type === "ziyadah" && r.status === "Lancar").length;
      return [
        { label: "Setoran Bulan Ini", icon: "trending_up", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: setoran.toString() },
        { label: "Total Setoran", icon: "auto_stories", bg: "bg-secondary-fixed", iconColor: "text-secondary", valueColor: "text-secondary", value: records.value.length.toString() },
        { label: "Progress Lancar", icon: "percent", bg: "bg-tertiary-fixed", iconColor: "text-tertiary", valueColor: "text-on-background", value: setoran > 0 ? `${Math.round(lancar / setoran * 100)}%` : "0%" },
        { label: "Santri Aktif", icon: "groups", bg: "bg-error-container", iconColor: "text-error", valueColor: "text-on-background", value: totalSantri.toString() }
      ];
    });
    async function fetchData() {
      loading.value = true;
      errorS.value = "";
      try {
        const promises = [];
        const params = filterSantri.value ? `?studentId=${encodeURIComponent(filterSantri.value)}` : "";
        if (activeTab.value === "ziyadah") {
          promises.push($fetch(`/api/tahfidz/ziyadah${params}`));
          const murojaah = await $fetch("/api/tahfidz/murojaah") || [];
          records.value = [...await promises[0] || [], ...murojaah.map((r) => ({ ...r, type: "murojaah" }))];
        } else {
          promises.push($fetch("/api/tahfidz/ziyadah"));
          const murojaahParams = filterSantri.value ? `?studentId=${encodeURIComponent(filterSantri.value)}` : "";
          const murojaah = await $fetch(`/api/tahfidz/murojaah${murojaahParams}`) || [];
          const ziyadah = await $fetch("/api/tahfidz/ziyadah") || [];
          records.value = [...ziyadah.map((r) => ({ ...r, type: "ziyadah" })), ...murojaah.map((r) => ({ ...r, type: "murojaah" }))];
        }
      } catch (e) {
        errorS.value = e.message || "Gagal memuat data";
      } finally {
        loading.value = false;
      }
    }
    watch(activeTab, () => fetchData());
    watch(filterSantri, () => fetchData());
    const defaultForm = () => ({
      id: 0,
      santri: "",
      surah: "",
      ayat: "",
      juz: "",
      halaman: "",
      status: "Lancar",
      tanggal: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      type: "ziyadah"
    });
    const form = reactive(defaultForm());
    watch(activeTab, () => {
      form.type = activeTab.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Tahfidzul Qur&#39;an</h2><p class="text-on-surface-variant text-body-md">Kelola hafalan Al-Qur&#39;an santri, ziyadah, dan murojaah.</p></div>`);
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
        _push(`<!--]--></div><div class="flex items-center gap-2 mb-4"><!--[-->`);
        ssrRenderList(tabs, (tab) => {
          _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.id ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-higher", "px-5 py-2 rounded-lg text-label-md font-medium transition-all"])}"><span class="material-symbols-outlined text-sm align-middle mr-1">${ssrInterpolate(tab.icon)}</span> ${ssrInterpolate(tab.label)}</button>`);
        });
        _push(`<!--]--></div><div class="flex items-center gap-4 mb-4"><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterSantri)) ? ssrLooseContain(unref(filterSantri), "") : ssrLooseEqual(unref(filterSantri), "")) ? " selected" : ""}>Semua Santri</option><!--[-->`);
        ssrRenderList(unref(students), (s) => {
          _push(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterSantri)) ? ssrLooseContain(unref(filterSantri), s.name) : ssrLooseEqual(unref(filterSantri), s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
        });
        _push(`<!--]--></select></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-6 border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-4"><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(unref(activeTab) === "ziyadah" ? "Ziyadah (Setoran Baru)" : "Murojaah (Mengulang)")}</h3><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Tambah ${ssrInterpolate(unref(activeTab) === "ziyadah" ? "Ziyadah" : "Murojaah")}</button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Santri</th>`);
        if (unref(activeTab) === "ziyadah") {
          _push(`<th class="px-6 py-4 text-label-md text-on-surface-variant">Surah</th>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "ziyadah") {
          _push(`<th class="px-6 py-4 text-label-md text-on-surface-variant">Ayat</th>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<th class="px-6 py-4 text-label-md text-on-surface-variant">Juz</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Halaman</th>`);
        if (unref(activeTab) === "ziyadah") {
          _push(`<th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(filteredRecords), (item) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4 text-label-md font-medium">${ssrInterpolate(item.santri)}</td>`);
          if (unref(activeTab) === "ziyadah") {
            _push(`<td class="px-6 py-4 text-label-md">${ssrInterpolate(item.surah || "-")}</td>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(activeTab) === "ziyadah") {
            _push(`<td class="px-6 py-4 text-label-sm text-on-surface-variant">${ssrInterpolate(item.ayat || "-")}</td>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<td class="px-6 py-4"><span class="bg-surface-container-low px-2 py-1 rounded text-label-sm text-on-surface-variant">${ssrInterpolate(item.juz)}</span></td><td class="px-6 py-4 text-label-sm text-on-surface-variant">${ssrInterpolate(item.halaman)}</td>`);
          if (unref(activeTab) === "ziyadah") {
            _push(`<td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full", item.status === "Lancar" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"])}">${ssrInterpolate(item.status)}</span></td>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<td class="px-6 py-4 text-label-sm text-on-surface-variant">${ssrInterpolate(item.tanggal)}</td><td class="px-6 py-4"><button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredRecords).length === 0) {
          _push(`<tr><td${ssrRenderAttr("colspan", unref(activeTab) === "ziyadah" ? 8 : 5)} class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter"><div class="px-gutter py-stack-md border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">Tambah ${ssrInterpolate(unref(activeTab) === "ziyadah" ? "Ziyadah" : "Murojaah")}</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, "") : ssrLooseEqual(unref(form).santri, "")) ? " selected" : ""}>Pilih Santri</option><!--[-->`);
          ssrRenderList(unref(students), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, s.name) : ssrLooseEqual(unref(form).santri, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
          });
          _push2(`<!--]--></select></div>`);
          if (unref(activeTab) === "ziyadah") {
            _push2(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">Surah</label><input${ssrRenderAttr("value", unref(form).surah)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Nama surah"></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(activeTab) === "ziyadah") {
            _push2(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">Ayat</label><input${ssrRenderAttr("value", unref(form).ayat)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="1-10"></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">Juz</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).juz) ? ssrLooseContain(unref(form).juz, "") : ssrLooseEqual(unref(form).juz, "")) ? " selected" : ""}>Pilih Juz</option><!--[-->`);
          ssrRenderList(30, (j) => {
            _push2(`<option${ssrRenderAttr("value", j)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).juz) ? ssrLooseContain(unref(form).juz, j) : ssrLooseEqual(unref(form).juz, j)) ? " selected" : ""}>Juz ${ssrInterpolate(j)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Halaman</label><input${ssrRenderAttr("value", unref(form).halaman)} type="number" min="1" max="604" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="1"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input${ssrRenderAttr("value", unref(form).tanggal)} type="date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"></div>`);
          if (unref(activeTab) === "ziyadah") {
            _push2(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">Status</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Lancar"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Lancar") : ssrLooseEqual(unref(form).status, "Lancar")) ? " selected" : ""}>Lancar</option><option value="Perlu Ulang"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Perlu Ulang") : ssrLooseEqual(unref(form).status, "Perlu Ulang")) ? " selected" : ""}>Perlu Ulang</option></select></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="px-gutter py-stack-md border-t border-outline-variant/20 flex justify-end gap-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all">Simpan</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tahfidz/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DkYlNNRO.mjs.map
