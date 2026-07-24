import { defineComponent, ref, computed, watch, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
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
    const loading = ref(true);
    const errorS = ref("");
    const permits = ref([]);
    const filterStatus = ref("");
    const showModal = ref(false);
    const editingId = ref(null);
    const filteredPermits = computed(
      () => !filterStatus.value ? permits.value : permits.value.filter((p) => p.status === filterStatus.value)
    );
    const stats = computed(() => {
      const pending = permits.value.filter((p) => p.status === "Pending").length;
      const approved = permits.value.filter((p) => p.status === "Disetujui").length;
      return [
        { label: "Pending Approval", icon: "hourglass_top", bg: "bg-amber-100", iconColor: "text-amber-600", valueColor: "text-amber-700", value: pending.toString() },
        { label: "Disetujui", icon: "check_circle", bg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", value: approved.toString() },
        { label: "Ditolak", icon: "cancel", bg: "bg-red-100", iconColor: "text-red-600", valueColor: "text-red-700", value: permits.value.filter((p) => p.status === "Ditolak").length.toString() },
        { label: "Total Izin", icon: "description", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: permits.value.length.toString() }
      ];
    });
    async function fetchData() {
      loading.value = true;
      errorS.value = "";
      try {
        const params = {};
        if (filterStatus.value) params.status = filterStatus.value;
        const qs = new URLSearchParams(params).toString();
        permits.value = await $fetch(`/api/izin${qs ? "?" + qs : ""}`) || [];
      } catch (e) {
        errorS.value = e.message || "Gagal memuat data";
      } finally {
        loading.value = false;
      }
    }
    watch(filterStatus, () => fetchData());
    const defaultForm = () => ({
      id: 0,
      santri: "",
      jenis: "",
      tglMulai: "",
      tglSelesai: "",
      keterangan: "",
      status: "Pending"
    });
    const form = reactive(defaultForm());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Izin Santri</h2><p class="text-on-surface-variant text-body-md">Kelola izin pulang, izin dokter, dan izin khusus santri.</p></div>`);
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
        _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-6 border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-4"><div class="flex items-center gap-4"><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "") : ssrLooseEqual(unref(filterStatus), "")) ? " selected" : ""}>Semua Status</option><option value="Pending"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Pending") : ssrLooseEqual(unref(filterStatus), "Pending")) ? " selected" : ""}>Pending</option><option value="Disetujui"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Disetujui") : ssrLooseEqual(unref(filterStatus), "Disetujui")) ? " selected" : ""}>Disetujui</option><option value="Ditolak"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Ditolak") : ssrLooseEqual(unref(filterStatus), "Ditolak")) ? " selected" : ""}>Ditolak</option></select></div><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Tambah Izin </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Santri</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Jenis Izin</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal Mulai</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal Selesai</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Keterangan</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(filteredPermits), (item) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4 text-label-md font-medium">${ssrInterpolate(item.santri)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full", item.jenis === "Izin Pulang" ? "bg-blue-100 text-blue-700" : item.jenis === "Izin Dokter" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"])}">${ssrInterpolate(item.jenis)}</span></td><td class="px-6 py-4 text-label-sm text-on-surface-variant">${ssrInterpolate(item.tglMulai)}</td><td class="px-6 py-4 text-label-sm text-on-surface-variant">${ssrInterpolate(item.tglSelesai)}</td><td class="px-6 py-4 text-label-sm text-on-surface-variant max-w-[200px] truncate">${ssrInterpolate(item.keterangan)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full", item.status === "Pending" ? "bg-amber-100 text-amber-700" : item.status === "Disetujui" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"])}">${ssrInterpolate(item.status)}</span></td><td class="px-6 py-4"><div class="flex items-center gap-2">`);
          if (item.status === "Pending") {
            _push(`<button class="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors" title="Setujui"><span class="material-symbols-outlined text-sm">check_circle</span></button>`);
          } else {
            _push(`<!---->`);
          }
          if (item.status === "Pending") {
            _push(`<button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Tolak"><span class="material-symbols-outlined text-sm">cancel</span></button>`);
          } else {
            _push(`<!---->`);
          }
          if (item.status === "Disetujui") {
            _push(`<button class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Cetak Surat"><span class="material-symbols-outlined text-sm">print</span></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button></div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredPermits).length === 0) {
          _push(`<tr><td colspan="7" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data izin.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter"><div class="px-gutter py-stack-md border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(unref(editingId) ? "Edit Izin" : "Tambah Izin")}</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, "") : ssrLooseEqual(unref(form).santri, "")) ? " selected" : ""}>Pilih Santri</option><!--[-->`);
          ssrRenderList(unref(students), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, s.name) : ssrLooseEqual(unref(form).santri, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jenis Izin</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "") : ssrLooseEqual(unref(form).jenis, "")) ? " selected" : ""}>Pilih Jenis</option><option value="Izin Pulang"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Izin Pulang") : ssrLooseEqual(unref(form).jenis, "Izin Pulang")) ? " selected" : ""}>Izin Pulang</option><option value="Izin Dokter"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Izin Dokter") : ssrLooseEqual(unref(form).jenis, "Izin Dokter")) ? " selected" : ""}>Izin Dokter</option><option value="Izin Khusus"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Izin Khusus") : ssrLooseEqual(unref(form).jenis, "Izin Khusus")) ? " selected" : ""}>Izin Khusus</option></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal Mulai</label><input${ssrRenderAttr("value", unref(form).tglMulai)} type="date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal Selesai</label><input${ssrRenderAttr("value", unref(form).tglSelesai)} type="date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Keterangan</label><textarea rows="3" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none min-h-[80px]" placeholder="Alasan izin">${ssrInterpolate(unref(form).keterangan)}</textarea></div></div><div class="px-gutter py-stack-md border-t border-outline-variant/20 flex justify-end gap-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all">Simpan</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/izin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-yvcZYq2s.mjs.map
