import { defineComponent, ref, reactive, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "tests",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const showModal = ref(false);
    ref(null);
    const form = reactive({
      name: "",
      academic: 0,
      btq: 0,
      memorization: 0
    });
    const items = ref([]);
    const stats = computed(() => {
      const len = items.value.length;
      const avgFn = (key) => len ? (items.value.reduce((acc, t) => acc + (Number(t[key]) || 0), 0) / len).toFixed(1) : "0";
      return [
        { label: "Total Tes", icon: "assignment", value: len, subtext: "Calon santri dites", iconColor: "text-primary", valueColor: "text-primary" },
        { label: "Rata Akademik", icon: "psychology", value: avgFn("academic"), subtext: "Nilai rata-rata", iconColor: "text-secondary", valueColor: "text-secondary" },
        { label: "Rata BTQ", icon: "book", value: avgFn("btq"), subtext: "Baca Tulis Quran", iconColor: "text-tertiary-container", valueColor: "text-on-background" },
        { label: "Lulus Seleksi", icon: "fact_check", value: items.value.filter((t) => (t.average || 0) >= 70).length, subtext: "Dari " + len + " peserta", iconColor: "text-primary", valueColor: "text-primary" }
      ];
    });
    function avgColor(val) {
      if (val >= 85) return "text-primary";
      if (val >= 70) return "text-secondary";
      return "text-error";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary">sync</span><span class="ml-2 text-on-surface-variant">Memuat data...</span></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-error-container text-on-error-container p-stack-md rounded-xl mb-stack-lg">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
        ssrRenderList(unref(stats), (stat) => {
          _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm"><div class="flex items-center justify-between mb-2"><span class="text-on-surface-variant text-label-md">${ssrInterpolate(stat.label)}</span><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><div class="flex items-center gap-1 mt-1"><span class="text-on-surface-variant text-[10px]">${ssrInterpolate(stat.subtext)}</span></div></div>`);
        });
        _push(`<!--]--></div><div class="flex flex-col md:flex-row md:items-center justify-between gap-stack-md mb-stack-md"><div><h2 class="font-display text-headline-md text-primary">Tes &amp; Seleksi Masuk</h2><p class="text-on-surface-variant text-body-md">Kelola hasil tes akademik, BTQ, dan hafalan calon santri.</p></div><div class="flex items-center gap-stack-sm"><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md transition-all shadow-md active:scale-95"><span class="material-symbols-outlined text-sm">add</span> Tambah Nilai </button></div></div><div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Nama</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Nilai Akademik</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Nilai BTQ</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Nilai Hafalan</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Rata-rata</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-surface-variant/30"><!--[-->`);
        ssrRenderList(_ctx.tests, (t) => {
          _push(`<tr class="hover:bg-primary-container/5 transition-colors"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-bold">${ssrInterpolate(t.initials)}</div><p class="text-label-md text-on-surface">${ssrInterpolate(t.name)}</p></div></td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(t.academic)}</td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(t.btq)}</td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(t.memorization)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["font-bold", avgColor(t.average)])}">${ssrInterpolate(t.average)}</span></td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", t.average >= 70 ? "bg-primary-fixed text-on-primary-fixed" : "bg-error-container text-on-error-container"])}">${ssrInterpolate(t.average >= 70 ? "Lulus" : "Tidak")}</span></td><td class="px-6 py-4"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div>`);
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(showModal)) {
            _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary-container px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">Tambah Nilai Tes</h2><p class="text-[11px] text-on-primary-container uppercase tracking-widest">PSB Module \u2022 Tes Seleksi</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Calon Santri</label><input${ssrRenderAttr("value", unref(form).name)} class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required></div><div class="grid grid-cols-3 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Akademik</label><input${ssrRenderAttr("value", unref(form).academic)} type="number" min="0" max="100" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">BTQ</label><input${ssrRenderAttr("value", unref(form).btq)} type="number" min="0" max="100" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Hafalan</label><input${ssrRenderAttr("value", unref(form).memorization)} type="number" min="0" max="100" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required></div></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/psb/tests.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=tests-BCsVihC0.mjs.map
