import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const filterSearch = ref("");
    const filterTipe = ref("");
    const filterStatus = ref("");
    const showModal = ref(false);
    const loading = ref(true);
    const errorS = ref("");
    const mutasi = ref([]);
    const students = ref([]);
    useAuth();
    const form = reactive({
      santri: "",
      studentId: "",
      tipe: "Kamar",
      dari: "",
      ke: "",
      keterangan: "",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
    const stats = computed(() => [
      { label: "Total Mutasi Bulan Ini", icon: "swap_horiz", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: mutasi.value.length.toString() },
      { label: "Pending Approvals", icon: "hourglass", bg: "bg-amber-100", iconColor: "text-amber-600", valueColor: "text-amber-700", value: mutasi.value.filter((m) => m.status === "pending").length.toString() },
      { label: "Disetujui", icon: "check_circle", bg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", value: mutasi.value.filter((m) => m.status === "disetujui").length.toString() },
      { label: "Ditolak", icon: "cancel", bg: "bg-red-100", iconColor: "text-red-600", valueColor: "text-red-700", value: mutasi.value.filter((m) => m.status === "ditolak").length.toString() }
    ]);
    const filteredMutasi = computed(() => mutasi.value.filter(
      (m) => (!filterSearch.value || m.santri.toLowerCase().includes(filterSearch.value.toLowerCase())) && (!filterTipe.value || m.tipe === filterTipe.value) && (!filterStatus.value || m.status === filterStatus.value)
    ));
    function tipeBadge(tipe) {
      const map = {
        "Kamar": "bg-blue-100 text-blue-700",
        "Kelas": "bg-purple-100 text-purple-700",
        "Boyong": "bg-orange-100 text-orange-700",
        "Halaqoh": "bg-teal-100 text-teal-700",
        "Pindah Pondok Al-Fatah Pusat": "bg-rose-100 text-rose-700"
      };
      return map[tipe] || "bg-surface-container text-on-surface-variant";
    }
    function statusClass(status) {
      const map = { "pending": "bg-amber-100 text-amber-700", "disetujui": "bg-green-100 text-green-700", "ditolak": "bg-red-100 text-red-700" };
      return map[status] || "bg-surface-container text-on-surface-variant";
    }
    function statusLabel(status) {
      const map = { "pending": "Pending", "disetujui": "Disetujui", "ditolak": "Ditolak" };
      return map[status] || status;
    }
    async function fetchData() {
      loading.value = true;
      errorS.value = "";
      try {
        const params = {};
        if (filterSearch.value) params.search = filterSearch.value;
        if (filterTipe.value) params.tipe = filterTipe.value;
        if (filterStatus.value) params.status = filterStatus.value;
        const qs = new URLSearchParams(params).toString();
        mutasi.value = await $fetch(`/api/mutasi${qs ? "?" + qs : ""}`) || [];
      } catch (e) {
        errorS.value = e.message || "Gagal memuat data";
      } finally {
        loading.value = false;
      }
    }
    watch([filterSearch, filterTipe, filterStatus], () => fetchData());
    watch(() => form.tipe, (val) => {
      if (val === "Pindah Pondok Al-Fatah Pusat") {
        if (!form.dari) form.dari = "Pondok Al-Fatah Panekan";
        if (!form.ke) form.ke = "Pondok Al-Fatah Pusat";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Mutasi Kamar, Kelas, Boyong, Halaqoh &amp; Pindah Pondok</h2><p class="text-on-surface-variant text-body-md">Kelola permintaan mutasi/pindah kamar, kelas, boyong (pulang), pindah halaqoh, dan pindah pondok santri.</p></div>`);
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
        _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterSearch))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari santri..."></div><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterTipe)) ? ssrLooseContain(unref(filterTipe), "") : ssrLooseEqual(unref(filterTipe), "")) ? " selected" : ""}>Semua Tipe</option><option value="Kamar"${ssrIncludeBooleanAttr(Array.isArray(unref(filterTipe)) ? ssrLooseContain(unref(filterTipe), "Kamar") : ssrLooseEqual(unref(filterTipe), "Kamar")) ? " selected" : ""}>Kamar</option><option value="Kelas"${ssrIncludeBooleanAttr(Array.isArray(unref(filterTipe)) ? ssrLooseContain(unref(filterTipe), "Kelas") : ssrLooseEqual(unref(filterTipe), "Kelas")) ? " selected" : ""}>Kelas</option><option value="Boyong"${ssrIncludeBooleanAttr(Array.isArray(unref(filterTipe)) ? ssrLooseContain(unref(filterTipe), "Boyong") : ssrLooseEqual(unref(filterTipe), "Boyong")) ? " selected" : ""}>Boyong</option><option value="Halaqoh"${ssrIncludeBooleanAttr(Array.isArray(unref(filterTipe)) ? ssrLooseContain(unref(filterTipe), "Halaqoh") : ssrLooseEqual(unref(filterTipe), "Halaqoh")) ? " selected" : ""}>Halaqoh</option><option value="Pindah Pondok Al-Fatah Pusat"${ssrIncludeBooleanAttr(Array.isArray(unref(filterTipe)) ? ssrLooseContain(unref(filterTipe), "Pindah Pondok Al-Fatah Pusat") : ssrLooseEqual(unref(filterTipe), "Pindah Pondok Al-Fatah Pusat")) ? " selected" : ""}>Pindah Pondok Al-Fatah Pusat</option></select><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "") : ssrLooseEqual(unref(filterStatus), "")) ? " selected" : ""}>Semua Status</option><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "pending") : ssrLooseEqual(unref(filterStatus), "pending")) ? " selected" : ""}>Pending</option><option value="disetujui"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "disetujui") : ssrLooseEqual(unref(filterStatus), "disetujui")) ? " selected" : ""}>Disetujui</option><option value="ditolak"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "ditolak") : ssrLooseEqual(unref(filterStatus), "ditolak")) ? " selected" : ""}>Ditolak</option></select></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Ajukan Mutasi </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tipe Mutasi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Dari</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Ke</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Keterangan</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(filteredMutasi), (item) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(item.santri)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", tipeBadge(item.tipe)])}">${ssrInterpolate(item.tipe)}</span></td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.dari || "-")}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.ke || "-")}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.keterangan || "-")}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.date)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", statusClass(item.status)])}">${ssrInterpolate(statusLabel(item.status))}</span></td><td class="px-4 py-3 text-center">`);
          if (item.status === "pending") {
            _push(`<button class="text-green-600 hover:text-green-800 mr-2 transition-colors"><span class="material-symbols-outlined">check_circle</span></button>`);
          } else {
            _push(`<!---->`);
          }
          if (item.status === "pending") {
            _push(`<button class="text-red-600 hover:text-red-800 mr-2 transition-colors"><span class="material-symbols-outlined">cancel</span></button>`);
          } else {
            _push(`<!---->`);
          }
          if (item.status === "disetujui" && item.tipe === "Boyong") {
            _push(`<button class="text-blue-600 hover:text-blue-800 mr-2 transition-colors" title="Cetak Surat Boyong"><span class="material-symbols-outlined">print</span></button>`);
          } else {
            _push(`<!---->`);
          }
          if (item.status === "disetujui" && item.tipe === "Pindah Pondok Al-Fatah Pusat") {
            _push(`<button class="text-blue-600 hover:text-blue-800 mr-2 transition-colors" title="Cetak Surat Pindah"><span class="material-symbols-outlined">print</span></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredMutasi).length === 0) {
          _push(`<tr><td colspan="8" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">Ajukan Mutasi</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Mutasi Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, "") : ssrLooseEqual(unref(form).santri, "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
          ssrRenderList(unref(students), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, s.name) : ssrLooseEqual(unref(form).santri, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)} (${ssrInterpolate(s.nis || "-")})</option>`);
          });
          _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tipe Mutasi</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Kamar"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "Kamar") : ssrLooseEqual(unref(form).tipe, "Kamar")) ? " selected" : ""}>Kamar</option><option value="Kelas"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "Kelas") : ssrLooseEqual(unref(form).tipe, "Kelas")) ? " selected" : ""}>Kelas</option><option value="Boyong"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "Boyong") : ssrLooseEqual(unref(form).tipe, "Boyong")) ? " selected" : ""}>Boyong (Pulang)</option><option value="Halaqoh"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "Halaqoh") : ssrLooseEqual(unref(form).tipe, "Halaqoh")) ? " selected" : ""}>Halaqoh</option><option value="Pindah Pondok Al-Fatah Pusat"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "Pindah Pondok Al-Fatah Pusat") : ssrLooseEqual(unref(form).tipe, "Pindah Pondok Al-Fatah Pusat")) ? " selected" : ""}>Pindah Pondok Al-Fatah Pusat</option></select></div>`);
          if (unref(form).tipe === "Kamar" || unref(form).tipe === "Kelas") {
            _push2(`<div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Dari</label><input${ssrRenderAttr("value", unref(form).dari)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"${ssrRenderAttr("placeholder", unref(form).tipe === "Kamar" ? "Kamar 1-A" : "Kelas 10-A")} required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Ke</label><input${ssrRenderAttr("value", unref(form).ke)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"${ssrRenderAttr("placeholder", unref(form).tipe === "Kamar" ? "Kamar 2-B" : "Kelas 11-A")} required></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(form).tipe === "Boyong") {
            _push2(`<!--[--><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Keterangan / Alasan Boyong</label><textarea class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none min-h-[80px]" placeholder="Alasan boyong/pulang..." required>${ssrInterpolate(unref(form).keterangan)}</textarea></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Dari Kamar</label><input${ssrRenderAttr("value", unref(form).dari)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Kamar sebelumnya"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Dari Kelas</label><input${ssrRenderAttr("value", unref(form).ke)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Kelas sebelumnya"></div></div><!--]-->`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(form).tipe === "Halaqoh") {
            _push2(`<!--[--><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Dari Halaqoh</label><input${ssrRenderAttr("value", unref(form).dari)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Halaqoh A" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Ke Halaqoh</label><input${ssrRenderAttr("value", unref(form).ke)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Halaqoh B" required></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Keterangan</label><textarea class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none min-h-[60px]" placeholder="Alasan pindah halaqoh...">${ssrInterpolate(unref(form).keterangan)}</textarea></div><!--]-->`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(form).tipe === "Pindah Pondok Al-Fatah Pusat") {
            _push2(`<div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Dari</label><input${ssrRenderAttr("value", unref(form).dari)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Pondok Al-Fatah Panekan"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Ke</label><input${ssrRenderAttr("value", unref(form).ke)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Pondok Al-Fatah Pusat"></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input type="date"${ssrRenderAttr("value", unref(form).date)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Ajukan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/mutasi/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BslENfot.mjs.map
