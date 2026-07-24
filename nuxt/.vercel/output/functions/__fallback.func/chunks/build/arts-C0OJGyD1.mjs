import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
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
  __name: "arts",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const items = ref([]);
    const showModal = ref(false);
    const editingId = ref(null);
    const filterJenis = ref("");
    const filterLevel = ref("");
    const students = ref([]);
    const teachers = ref([]);
    useAuth();
    const form = reactive({ santri: "", jenis: "Qiroah", level: "Pemula", pelatih: "", jadwal: "", status: "Aktif", studentId: "", guruId: "" });
    const filteredItems = computed(() => items.value.filter((p) => {
      if (filterJenis.value && p.jenis !== filterJenis.value) return false;
      if (filterLevel.value && p.level !== filterLevel.value) return false;
      return true;
    }));
    const stats = computed(() => {
      const total = items.value.length;
      const qiroah = items.value.filter((p) => p.jenis === "Qiroah").length;
      const kaligrafi = items.value.filter((p) => p.jenis === "Kaligrafi").length;
      const pelatihSet = new Set(items.value.map((p) => p.pelatih));
      return [
        { label: "Total Peserta", icon: "music_note", iconColor: "text-primary", valueColor: "text-primary", value: String(total), subtext: "Qiroah & Kaligrafi" },
        { label: "Qiroah", icon: "mic", iconColor: "text-secondary", valueColor: "text-secondary", value: String(qiroah), subtext: "Santri aktif" },
        { label: "Kaligrafi", icon: "brush", iconColor: "text-primary-container", valueColor: "text-on-background", value: String(kaligrafi), subtext: "Santri aktif" },
        { label: "Pelatih", icon: "coach", iconColor: "text-tertiary", valueColor: "text-on-background", value: String(pelatihSet.size), subtext: "Bersertifikat" }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Qiroah &amp; Kaligrafi</h2><p class="text-on-surface-variant text-body-md">Kelola pelatihan qiroah dan kaligrafi untuk santri.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm"><div class="flex items-center justify-between mb-2"><span class="text-on-surface-variant text-label-md">${ssrInterpolate(stat.label)}</span><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-[11px] text-on-surface-variant mt-1">${ssrInterpolate(stat.subtext)}</p></div>`);
      });
      _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Jenis:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterJenis)) ? ssrLooseContain(unref(filterJenis), "") : ssrLooseEqual(unref(filterJenis), "")) ? " selected" : ""}>Semua</option><option value="Qiroah"${ssrIncludeBooleanAttr(Array.isArray(unref(filterJenis)) ? ssrLooseContain(unref(filterJenis), "Qiroah") : ssrLooseEqual(unref(filterJenis), "Qiroah")) ? " selected" : ""}>Qiroah</option><option value="Kaligrafi"${ssrIncludeBooleanAttr(Array.isArray(unref(filterJenis)) ? ssrLooseContain(unref(filterJenis), "Kaligrafi") : ssrLooseEqual(unref(filterJenis), "Kaligrafi")) ? " selected" : ""}>Kaligrafi</option></select></div><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Level:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterLevel)) ? ssrLooseContain(unref(filterLevel), "") : ssrLooseEqual(unref(filterLevel), "")) ? " selected" : ""}>Semua</option><option value="Pemula"${ssrIncludeBooleanAttr(Array.isArray(unref(filterLevel)) ? ssrLooseContain(unref(filterLevel), "Pemula") : ssrLooseEqual(unref(filterLevel), "Pemula")) ? " selected" : ""}>Pemula</option><option value="Menengah"${ssrIncludeBooleanAttr(Array.isArray(unref(filterLevel)) ? ssrLooseContain(unref(filterLevel), "Menengah") : ssrLooseEqual(unref(filterLevel), "Menengah")) ? " selected" : ""}>Menengah</option><option value="Mahir"${ssrIncludeBooleanAttr(Array.isArray(unref(filterLevel)) ? ssrLooseContain(unref(filterLevel), "Mahir") : ssrLooseEqual(unref(filterLevel), "Mahir")) ? " selected" : ""}>Mahir</option></select></div></div><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Tambah Peserta </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Santri</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Jenis</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Level</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Pelatih</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Jadwal</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th><th class="px-6 py-4 text-label-md text-on-surface-variant"></th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
      ssrRenderList(unref(filteredItems), (p) => {
        _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4 text-label-md font-medium text-on-surface">${ssrInterpolate(p.santri)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-2 py-1 rounded text-label-sm font-bold", p.jenis === "Qiroah" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"])}">${ssrInterpolate(p.jenis)}</span></td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", p.level === "Mahir" ? "bg-primary-fixed text-on-primary-fixed" : p.level === "Menengah" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-surface-container text-on-surface-variant"])}">${ssrInterpolate(p.level)}</span></td><td class="px-6 py-4 text-label-md">${ssrInterpolate(p.pelatih)}</td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(p.jadwal)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", p.status === "Aktif" ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container text-on-surface-variant"])}">${ssrInterpolate(p.status)}</span></td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined">edit</span></button><button class="text-on-surface-variant hover:text-error transition-colors"><span class="material-symbols-outlined">delete</span></button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(filteredItems).length === 0) {
        _push(`<tr><td colspan="7" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Tidak ada peserta ditemukan</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div><div class="p-4 border-t border-outline-variant/20 flex items-center justify-between"><span class="text-on-surface-variant text-label-md">Menampilkan ${ssrInterpolate(unref(filteredItems).length)} dari ${ssrInterpolate(unref(items).length)} peserta</span><div class="flex gap-2"><button class="p-2 border border-outline-variant/30 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"><span class="material-symbols-outlined">chevron_left</span></button><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md">1</button><button class="p-2 border border-outline-variant/30 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"><span class="material-symbols-outlined">chevron_right</span></button></div></div></div>`);
      if (unref(loading)) {
        _push(`<div class="flex justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(error)) {
        _push(`<div class="mt-4 p-4 bg-error-container text-on-error-container rounded-lg text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">${ssrInterpolate(unref(editingId) ? "Edit Peserta" : "Tambah Peserta")}</h2><p class="text-[11px] text-on-primary/80 uppercase tracking-widest">Ekstrakurikuler \u2022 Qiroah &amp; Kaligrafi</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, "") : ssrLooseEqual(unref(form).santri, "")) ? " selected" : ""}>Pilih Santri</option><!--[-->`);
          ssrRenderList(unref(students), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.nama)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, s.nama) : ssrLooseEqual(unref(form).santri, s.nama)) ? " selected" : ""}>${ssrInterpolate(s.nama)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jenis</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Qiroah"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Qiroah") : ssrLooseEqual(unref(form).jenis, "Qiroah")) ? " selected" : ""}>Qiroah</option><option value="Kaligrafi"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Kaligrafi") : ssrLooseEqual(unref(form).jenis, "Kaligrafi")) ? " selected" : ""}>Kaligrafi</option></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Level</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Pemula"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "Pemula") : ssrLooseEqual(unref(form).level, "Pemula")) ? " selected" : ""}>Pemula</option><option value="Menengah"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "Menengah") : ssrLooseEqual(unref(form).level, "Menengah")) ? " selected" : ""}>Menengah</option><option value="Mahir"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "Mahir") : ssrLooseEqual(unref(form).level, "Mahir")) ? " selected" : ""}>Mahir</option></select></div></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Pelatih</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).pelatih) ? ssrLooseContain(unref(form).pelatih, "") : ssrLooseEqual(unref(form).pelatih, "")) ? " selected" : ""}>Pilih Pelatih</option><!--[-->`);
          ssrRenderList(unref(teachers), (t) => {
            _push2(`<option${ssrRenderAttr("value", t.nama)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).pelatih) ? ssrLooseContain(unref(form).pelatih, t.nama) : ssrLooseEqual(unref(form).pelatih, t.nama)) ? " selected" : ""}>${ssrInterpolate(t.nama)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jadwal</label><input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3"${ssrRenderAttr("value", unref(form).jadwal)} required></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Status</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Aktif") : ssrLooseEqual(unref(form).status, "Aktif")) ? " selected" : ""}>Aktif</option><option value="Nonaktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Nonaktif") : ssrLooseEqual(unref(form).status, "Nonaktif")) ? " selected" : ""}>Nonaktif</option></select></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/extracurricular/arts.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=arts-C0OJGyD1.mjs.map
