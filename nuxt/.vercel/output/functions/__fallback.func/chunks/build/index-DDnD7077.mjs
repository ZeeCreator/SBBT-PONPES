import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport } from 'vue/server-renderer';
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
    const loading = ref(true);
    const error = ref("");
    const items = ref([]);
    const showModal = ref(false);
    const editingId = ref(null);
    const filterJenis = ref("");
    const newJenis = ref("");
    const jenisList = ref(["Pramuka", "Pencak Silat", "Hadroh", "Seni", "Media", "Public Speaking"]);
    ref([]);
    const teachers = ref([]);
    useAuth();
    const form = reactive({ nama: "", jenis: "", pembina: "", anggota: 20, jadwal: "", guruId: "" });
    const filteredItems = computed(() => items.value.filter((k) => {
      if (filterJenis.value && k.jenis !== filterJenis.value) return false;
      return true;
    }));
    const stats = computed(() => {
      const total = items.value.length;
      const totalAnggota = items.value.reduce((sum, k) => sum + (Number(k.anggota) || 0), 0);
      const pembinaSet = new Set(items.value.map((k) => k.pembina));
      const jenisCount = new Set(items.value.map((k) => k.jenis)).size;
      return [
        { label: "Total Kegiatan", icon: "fitness_center", iconColor: "text-primary", valueColor: "text-primary", value: String(total), subtext: `${jenisCount} jenis ekstrakurikuler` },
        { label: "Total Anggota", icon: "people", iconColor: "text-secondary", valueColor: "text-secondary", value: String(totalAnggota), subtext: "Seluruh kegiatan" },
        { label: "Pembina Aktif", icon: "school", iconColor: "text-primary-container", valueColor: "text-on-background", value: String(pembinaSet.size), subtext: "Terdaftar" },
        { label: "Jenis Ekstra", icon: "category", iconColor: "text-tertiary", valueColor: "text-on-background", value: String(jenisCount), subtext: "Bisa ditambah sendiri" }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Ekstrakurikuler</h2><p class="text-on-surface-variant text-body-md">Kelola kegiatan ekstrakurikuler, pembina, dan anggota.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm"><div class="flex items-center justify-between mb-2"><span class="text-on-surface-variant text-label-md">${ssrInterpolate(stat.label)}</span><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-[11px] text-on-surface-variant mt-1">${ssrInterpolate(stat.subtext)}</p></div>`);
      });
      _push(`<!--]--><div class="glass-card rounded-xl shadow-sm overflow-hidden mb-stack-lg p-4"><div class="flex items-center gap-4"><span class="material-symbols-outlined text-primary">add_circle</span><input${ssrRenderAttr("value", unref(newJenis))} class="flex-1 bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary" placeholder="Tambah jenis ekstrakurikuler baru..."><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110">Tambah Jenis</button><button class="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher">Reset</button></div>`);
      if (unref(jenisList).length > 0) {
        _push(`<div class="flex flex-wrap gap-2 mt-3"><!--[-->`);
        ssrRenderList(unref(jenisList), (j) => {
          _push(`<span class="inline-flex items-center gap-1 bg-primary-fixed/20 text-primary px-3 py-1 rounded-full text-label-sm">${ssrInterpolate(j)} <button class="hover:text-red-500">\xD7</button></span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Jenis:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterJenis)) ? ssrLooseContain(unref(filterJenis), "") : ssrLooseEqual(unref(filterJenis), "")) ? " selected" : ""}>Semua</option><!--[-->`);
      ssrRenderList(unref(jenisList), (j) => {
        _push(`<option${ssrRenderAttr("value", j)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterJenis)) ? ssrLooseContain(unref(filterJenis), j) : ssrLooseEqual(unref(filterJenis), j)) ? " selected" : ""}>${ssrInterpolate(j)}</option>`);
      });
      _push(`<!--]--></select></div></div><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Tambah Kegiatan </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Kegiatan</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Jenis</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Pembina</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Anggota</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Jadwal</th><th class="px-6 py-4 text-label-md text-on-surface-variant"></th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
      ssrRenderList(unref(filteredItems), (k) => {
        _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4 text-label-md font-medium text-on-surface">${ssrInterpolate(k.nama)}</td><td class="px-6 py-4"><span class="bg-surface-container-low px-2 py-1 rounded text-label-sm text-on-surface-variant">${ssrInterpolate(k.jenis)}</span></td><td class="px-6 py-4 text-label-md">${ssrInterpolate(k.pembina)}</td><td class="px-6 py-4 text-label-md">${ssrInterpolate(k.anggota)} santri</td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(k.jadwal)}</td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined">edit</span></button><button class="text-on-surface-variant hover:text-error transition-colors"><span class="material-symbols-outlined">delete</span></button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(filteredItems).length === 0) {
        _push(`<tr><td colspan="7" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Tidak ada kegiatan ditemukan</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div><div class="p-4 border-t border-outline-variant/20 flex items-center justify-between"><span class="text-on-surface-variant text-label-md">Menampilkan ${ssrInterpolate(unref(filteredItems).length)} dari ${ssrInterpolate(unref(items).length)} kegiatan</span><div class="flex gap-2"><button class="p-2 border border-outline-variant/30 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"><span class="material-symbols-outlined">chevron_left</span></button><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md">1</button><button class="p-2 border border-outline-variant/30 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"><span class="material-symbols-outlined">chevron_right</span></button></div></div></div>`);
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
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">${ssrInterpolate(unref(editingId) ? "Edit Kegiatan" : "Tambah Kegiatan")}</h2><p class="text-[11px] text-on-primary/80 uppercase tracking-widest">Ekstrakurikuler</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Kegiatan</label><input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3"${ssrRenderAttr("value", unref(form).nama)} required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jenis Ekstrakurikuler</label><div class="flex gap-2"><input class="flex-1 bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3"${ssrRenderAttr("value", unref(form).jenis)} list="jenis-datalist" required placeholder="Ketik atau pilih jenis..."><datalist id="jenis-datalist"><!--[-->`);
          ssrRenderList(unref(jenisList), (j) => {
            _push2(`<option${ssrRenderAttr("value", j)}></option>`);
          });
          _push2(`<!--]--></datalist></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Pembina</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).pembina) ? ssrLooseContain(unref(form).pembina, "") : ssrLooseEqual(unref(form).pembina, "")) ? " selected" : ""}>Pilih Pembina</option><!--[-->`);
          ssrRenderList(unref(teachers), (t) => {
            _push2(`<option${ssrRenderAttr("value", t.nama)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).pembina) ? ssrLooseContain(unref(form).pembina, t.nama) : ssrLooseEqual(unref(form).pembina, t.nama)) ? " selected" : ""}>${ssrInterpolate(t.nama)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jumlah Anggota</label><input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" type="number"${ssrRenderAttr("value", unref(form).anggota)} required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jadwal</label><input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3"${ssrRenderAttr("value", unref(form).jadwal)} required></div></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/extracurricular/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DDnD7077.mjs.map
