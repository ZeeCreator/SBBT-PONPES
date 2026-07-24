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
    useAuth();
    const filterSearch = ref("");
    const filterTugas = ref("");
    const filterShift = ref("");
    const showModal = ref(false);
    const loading = ref(true);
    const errorS = ref("");
    const editingId = ref(null);
    const khidmah = ref([]);
    const students = ref([]);
    const form = reactive({
      santri: "",
      studentId: "",
      tugas: "Kebersihan",
      shift: "Pagi",
      jam: "06:00",
      hari: "Senin",
      status: "Aktif"
    });
    const tugasList = ["Kebersihan", "Keamanan", "Koperasi", "Dapur", "Taman", "Perpustakaan", "Kantin"];
    const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"];
    const stats = computed(() => {
      const aktif = khidmah.value.filter((k) => k.status === "Aktif");
      return [
        { label: "Total Santri Bertugas", icon: "groups", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: aktif.length.toString() },
        { label: "Shift Pagi Ini", icon: "wb_sunny", bg: "bg-amber-100", iconColor: "text-amber-600", valueColor: "text-amber-700", value: aktif.filter((k) => k.shift === "Pagi").length.toString() },
        { label: "Kebersihan", icon: "cleaning_services", bg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", value: aktif.filter((k) => k.tugas === "Kebersihan").length.toString() },
        { label: "Keamanan", icon: "shield", bg: "bg-blue-100", iconColor: "text-blue-600", valueColor: "text-blue-700", value: aktif.filter((k) => k.tugas === "Keamanan").length.toString() }
      ];
    });
    const filteredKhidmah = computed(() => khidmah.value.filter(
      (k) => (!filterSearch.value || k.santri.toLowerCase().includes(filterSearch.value.toLowerCase())) && (!filterTugas.value || k.tugas === filterTugas.value) && (!filterShift.value || k.shift === filterShift.value)
    ));
    function tugasClass(tugas) {
      const map = {
        "Kebersihan": "bg-green-100 text-green-700",
        "Keamanan": "bg-blue-100 text-blue-700",
        "Koperasi": "bg-amber-100 text-amber-700",
        "Dapur": "bg-orange-100 text-orange-700",
        "Taman": "bg-emerald-100 text-emerald-700",
        "Perpustakaan": "bg-purple-100 text-purple-700",
        "Kantin": "bg-pink-100 text-pink-700"
      };
      return map[tugas] || "bg-surface-container text-on-surface-variant";
    }
    async function fetchData() {
      loading.value = true;
      errorS.value = "";
      try {
        const params = {};
        if (filterSearch.value) params.search = filterSearch.value;
        if (filterTugas.value) params.tugas = filterTugas.value;
        if (filterShift.value) params.shift = filterShift.value;
        const qs = new URLSearchParams(params).toString();
        khidmah.value = await $fetch(`/api/khidmah${qs ? "?" + qs : ""}`) || [];
      } catch (e) {
        errorS.value = e.message || "Gagal memuat data";
      } finally {
        loading.value = false;
      }
    }
    watch([filterSearch, filterTugas, filterShift], () => fetchData());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Pengabdian &amp; Khidmah Santri</h2><p class="text-on-surface-variant text-body-md">Kelola tugas khidmah, pembagian shift, dan jadwal pengabdian santri.</p></div>`);
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
        _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterSearch))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari santri..."></div><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterTugas)) ? ssrLooseContain(unref(filterTugas), "") : ssrLooseEqual(unref(filterTugas), "")) ? " selected" : ""}>Semua Tugas</option><!--[-->`);
        ssrRenderList(tugasList, (t) => {
          _push(`<option${ssrRenderAttr("value", t)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterTugas)) ? ssrLooseContain(unref(filterTugas), t) : ssrLooseEqual(unref(filterTugas), t)) ? " selected" : ""}>${ssrInterpolate(t)}</option>`);
        });
        _push(`<!--]--></select><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterShift)) ? ssrLooseContain(unref(filterShift), "") : ssrLooseEqual(unref(filterShift), "")) ? " selected" : ""}>Semua Shift</option><option value="Pagi"${ssrIncludeBooleanAttr(Array.isArray(unref(filterShift)) ? ssrLooseContain(unref(filterShift), "Pagi") : ssrLooseEqual(unref(filterShift), "Pagi")) ? " selected" : ""}>Pagi</option><option value="Siang"${ssrIncludeBooleanAttr(Array.isArray(unref(filterShift)) ? ssrLooseContain(unref(filterShift), "Siang") : ssrLooseEqual(unref(filterShift), "Siang")) ? " selected" : ""}>Siang</option><option value="Sore"${ssrIncludeBooleanAttr(Array.isArray(unref(filterShift)) ? ssrLooseContain(unref(filterShift), "Sore") : ssrLooseEqual(unref(filterShift), "Sore")) ? " selected" : ""}>Sore</option><option value="Malam"${ssrIncludeBooleanAttr(Array.isArray(unref(filterShift)) ? ssrLooseContain(unref(filterShift), "Malam") : ssrLooseEqual(unref(filterShift), "Malam")) ? " selected" : ""}>Malam</option></select></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Assign Khidmah </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tugas</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Shift</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Jam</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Hari</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(filteredKhidmah), (item) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(item.santri)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", tugasClass(item.tugas)])}">${ssrInterpolate(item.tugas)}</span></td><td class="px-4 py-3"><span class="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-surface-container-low text-on-surface-variant">${ssrInterpolate(item.shift)}</span></td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.jam)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.hari)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", item.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"])}">${ssrInterpolate(item.status)}</span></td><td class="px-4 py-3 text-center"><div class="flex items-center justify-center gap-2"><button class="text-primary hover:text-blue-700 transition-colors"><span class="material-symbols-outlined text-sm">edit</span></button><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredKhidmah).length === 0) {
          _push(`<tr><td colspan="7" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">${ssrInterpolate(unref(editingId) ? "Edit Tugas Khidmah" : "Assign Tugas Khidmah")}</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Khidmah Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, "") : ssrLooseEqual(unref(form).santri, "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
          ssrRenderList(unref(students), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, s.name) : ssrLooseEqual(unref(form).santri, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tugas Khidmah</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><!--[-->`);
          ssrRenderList(tugasList, (t) => {
            _push2(`<option${ssrRenderAttr("value", t)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).tugas) ? ssrLooseContain(unref(form).tugas, t) : ssrLooseEqual(unref(form).tugas, t)) ? " selected" : ""}>${ssrInterpolate(t)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Shift</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Pagi"${ssrIncludeBooleanAttr(Array.isArray(unref(form).shift) ? ssrLooseContain(unref(form).shift, "Pagi") : ssrLooseEqual(unref(form).shift, "Pagi")) ? " selected" : ""}>Pagi</option><option value="Siang"${ssrIncludeBooleanAttr(Array.isArray(unref(form).shift) ? ssrLooseContain(unref(form).shift, "Siang") : ssrLooseEqual(unref(form).shift, "Siang")) ? " selected" : ""}>Siang</option><option value="Sore"${ssrIncludeBooleanAttr(Array.isArray(unref(form).shift) ? ssrLooseContain(unref(form).shift, "Sore") : ssrLooseEqual(unref(form).shift, "Sore")) ? " selected" : ""}>Sore</option><option value="Malam"${ssrIncludeBooleanAttr(Array.isArray(unref(form).shift) ? ssrLooseContain(unref(form).shift, "Malam") : ssrLooseEqual(unref(form).shift, "Malam")) ? " selected" : ""}>Malam</option></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jam</label><input type="time"${ssrRenderAttr("value", unref(form).jam)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Hari</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><!--[-->`);
          ssrRenderList(hariList, (h) => {
            _push2(`<option${ssrRenderAttr("value", h)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).hari) ? ssrLooseContain(unref(form).hari, h) : ssrLooseEqual(unref(form).hari, h)) ? " selected" : ""}>${ssrInterpolate(h)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Status</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Aktif") : ssrLooseEqual(unref(form).status, "Aktif")) ? " selected" : ""}>Aktif</option><option value="Nonaktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Nonaktif") : ssrLooseEqual(unref(form).status, "Nonaktif")) ? " selected" : ""}>Nonaktif</option></select></div></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/khidmah/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cwd3rlYo.mjs.map
