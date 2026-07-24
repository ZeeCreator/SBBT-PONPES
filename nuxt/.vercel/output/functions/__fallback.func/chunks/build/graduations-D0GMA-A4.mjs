import { defineComponent, ref, reactive, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "graduations",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const showModal = ref(false);
    ref(null);
    const form = reactive({
      name: "",
      date: "",
      juz: 1,
      certificateNumber: ""
    });
    const items = ref([]);
    const stats = computed(() => {
      const totalJuz = items.value.reduce((acc, g) => acc + (g.juz || 0), 0);
      return [
        { label: "Total Wisuda", icon: "workspace_premium", value: items.value.length, subtext: "Santri diwisuda", iconColor: "text-primary", valueColor: "text-primary" },
        { label: "Total Juz", icon: "menu_book", value: totalJuz, subtext: "Rata-rata " + (items.value.length ? (totalJuz / items.value.length).toFixed(1) : "0") + " juz/santri", iconColor: "text-secondary", valueColor: "text-secondary" },
        { label: "Wisuda 2026", icon: "celebration", value: items.value.filter((g) => {
          var _a;
          return (_a = g.date) == null ? void 0 : _a.startsWith("2026");
        }).length, subtext: "Tahun berjalan", iconColor: "text-tertiary-container", valueColor: "text-on-background" }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary">sync</span><span class="ml-2 text-on-surface-variant">Memuat data...</span></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-error-container text-on-error-container p-stack-md rounded-xl mb-stack-lg">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg"><!--[-->`);
        ssrRenderList(unref(stats), (stat) => {
          _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm"><div class="flex items-center justify-between mb-2"><span class="text-on-surface-variant text-label-md">${ssrInterpolate(stat.label)}</span><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><div class="flex items-center gap-1 mt-1"><span class="text-on-surface-variant text-[10px]">${ssrInterpolate(stat.subtext)}</span></div></div>`);
        });
        _push(`<!--]--></div><div class="flex flex-col md:flex-row md:items-center justify-between gap-stack-md mb-stack-md"><div><h2 class="font-display text-headline-md text-primary">Wisuda &amp; Kelulusan</h2><p class="text-on-surface-variant text-body-md">Tracking data wisuda dan kelulusan santri.</p></div><div class="flex items-center gap-stack-sm"><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md transition-all shadow-md active:scale-95"><span class="material-symbols-outlined text-sm">add</span> Tambah Data Wisuda </button></div></div><div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Santri</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal Wisuda</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Juz Tahfidz</th><th class="px-6 py-4 text-label-md text-on-surface-variant">No. Sertifikat</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-surface-variant/30"><!--[-->`);
        ssrRenderList(_ctx.graduations, (g) => {
          _push(`<tr class="hover:bg-primary-container/5 transition-colors"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-bold">${ssrInterpolate(g.initials)}</div><p class="text-label-md text-on-surface">${ssrInterpolate(g.name)}</p></div></td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(g.date)}</td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(g.juz)} Juz</td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(g.certificateNumber)}</td><td class="px-6 py-4"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div>`);
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(showModal)) {
            _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary-container px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">Tambah Data Wisuda</h2><p class="text-[11px] text-on-primary-container uppercase tracking-widest">Alumni Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Santri</label><input${ssrRenderAttr("value", unref(form).name)} class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal Wisuda</label><input${ssrRenderAttr("value", unref(form).date)} type="date" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Juz Tahfidz</label><input${ssrRenderAttr("value", unref(form).juz)} type="number" min="1" max="30" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">No. Sertifikat</label><input${ssrRenderAttr("value", unref(form).certificateNumber)} class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/alumni/graduations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=graduations-D0GMA-A4.mjs.map
