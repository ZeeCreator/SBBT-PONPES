import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
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
  __name: "sanitation",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const filterKegiatan = ref("");
    const filterDate = ref((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const showAddModal = ref(false);
    ref(null);
    const kegiatanOptions = ["Fogging", "Kebersihan MCK", "Inspeksi Sanitasi", "Pengecekan Air", "Pembersihan Lingkungan"];
    const form = reactive({
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      location: "",
      kegiatan: "Kebersihan MCK",
      officer: "",
      status: "Terjadwal"
    });
    const items = ref([]);
    const teachers = ref([]);
    useAuth();
    const stats = computed(() => {
      const month = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
      const bulanIni = items.value.filter((r) => {
        var _a;
        return (_a = r.date) == null ? void 0 : _a.startsWith(month);
      });
      const selesai = items.value.filter((r) => r.status === "Selesai");
      const dalamProses = items.value.filter((r) => r.status === "Dalam Proses");
      return [
        { label: "Inspeksi Bulan Ini", icon: "assignment_turned_in", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: bulanIni.length },
        { label: "Lokasi Terjadwal", icon: "location_on", bg: "bg-blue-100", iconColor: "text-blue-600", valueColor: "text-blue-700", value: items.value.filter((r) => r.status === "Terjadwal").length },
        { label: "Selesai", icon: "check_circle", bg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", value: selesai.length },
        { label: "Dalam Proses", icon: "sync", bg: "bg-amber-100", iconColor: "text-amber-600", valueColor: "text-amber-700", value: dalamProses.length }
      ];
    });
    const filteredRecords = computed(() => {
      return items.value.filter((r) => {
        const matchKegiatan = !filterKegiatan.value || r.kegiatan === filterKegiatan.value;
        return matchKegiatan;
      });
    });
    function kegiatanBadge(kegiatan) {
      switch (kegiatan) {
        case "Fogging":
          return "bg-purple-100 text-purple-700";
        case "Kebersihan MCK":
          return "bg-cyan-100 text-cyan-700";
        case "Inspeksi Sanitasi":
          return "bg-orange-100 text-orange-700";
        case "Pengecekan Air":
          return "bg-blue-100 text-blue-700";
        case "Pembersihan Lingkungan":
          return "bg-green-100 text-green-700";
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
        _push(`<!--[--><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Sanitasi &amp; Kebersihan</h2><p class="text-on-surface-variant text-body-md">Jadwal fogging, kebersihan MCK, dan inspeksi lingkungan.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
        ssrRenderList(unref(stats), (stat) => {
          _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm text-center"><div class="${ssrRenderClass([stat.bg, "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"])}"><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(stat.label)}</p></div>`);
        });
        _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">filter_alt</span><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterKegiatan)) ? ssrLooseContain(unref(filterKegiatan), "") : ssrLooseEqual(unref(filterKegiatan), "")) ? " selected" : ""}>Semua Kegiatan</option><!--[-->`);
        ssrRenderList(kegiatanOptions, (k) => {
          _push(`<option${ssrRenderAttr("value", k)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterKegiatan)) ? ssrLooseContain(unref(filterKegiatan), k) : ssrLooseEqual(unref(filterKegiatan), k)) ? " selected" : ""}>${ssrInterpolate(k)}</option>`);
        });
        _push(`<!--]--></select></div><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">calendar_today</span><input type="date"${ssrRenderAttr("value", unref(filterDate))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"></div></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Tambah Kegiatan </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Lokasi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Jenis Kegiatan</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Petugas</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(filteredRecords), (record) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(record.date)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(record.location)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2 py-0.5 rounded text-[11px] font-bold", kegiatanBadge(record.kegiatan)])}">${ssrInterpolate(record.kegiatan)}</span></td><td class="px-4 py-3 text-label-sm">${ssrInterpolate(record.officer)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2 py-1 text-[11px] font-bold rounded-full", record.status === "Selesai" ? "bg-green-100 text-green-700" : record.status === "Dalam Proses" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"])}">${ssrInterpolate(record.status)}</span></td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredRecords).length === 0) {
          _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div>`);
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(showAddModal)) {
            _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">Tambah Kegiatan</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Kesehatan Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input type="date"${ssrRenderAttr("value", unref(form).date)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Lokasi</label><input${ssrRenderAttr("value", unref(form).location)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Lokasi kegiatan" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jenis Kegiatan</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><!--[-->`);
            ssrRenderList(kegiatanOptions, (k) => {
              _push2(`<option${ssrRenderAttr("value", k)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).kegiatan) ? ssrLooseContain(unref(form).kegiatan, k) : ssrLooseEqual(unref(form).kegiatan, k)) ? " selected" : ""}>${ssrInterpolate(k)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Petugas</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).officer) ? ssrLooseContain(unref(form).officer, "") : ssrLooseEqual(unref(form).officer, "")) ? " selected" : ""}>-- Pilih Petugas --</option><!--[-->`);
            ssrRenderList(unref(teachers), (t) => {
              _push2(`<option${ssrRenderAttr("value", t.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).officer) ? ssrLooseContain(unref(form).officer, t.name) : ssrLooseEqual(unref(form).officer, t.name)) ? " selected" : ""}>${ssrInterpolate(t.name)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Status</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Selesai"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Selesai") : ssrLooseEqual(unref(form).status, "Selesai")) ? " selected" : ""}>Selesai</option><option value="Dalam Proses"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Dalam Proses") : ssrLooseEqual(unref(form).status, "Dalam Proses")) ? " selected" : ""}>Dalam Proses</option><option value="Terjadwal"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Terjadwal") : ssrLooseEqual(unref(form).status, "Terjadwal")) ? " selected" : ""}>Terjadwal</option></select></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kesehatan/sanitation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=sanitation-CzAH0Q4V.mjs.map
