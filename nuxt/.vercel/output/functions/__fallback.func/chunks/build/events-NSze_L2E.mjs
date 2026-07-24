import { defineComponent, ref, reactive, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "events",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const filterType = ref("");
    const showModal = ref(false);
    ref(null);
    const form = reactive({
      name: "",
      date: "",
      type: "Reuni",
      location: "",
      notes: ""
    });
    const items = ref([]);
    const stats = computed(() => [
      { label: "Total Acara", icon: "event", value: items.value.length, subtext: "Semua acara alumni", iconColor: "text-primary", valueColor: "text-primary" },
      { label: "Akan Datang", icon: "upcoming", value: items.value.filter((e) => new Date(e.date) > /* @__PURE__ */ new Date()).length, subtext: "Acara mendatang", iconColor: "text-secondary", valueColor: "text-secondary" },
      { label: "Tahun Ini", icon: "calendar_month", value: items.value.filter((e) => {
        var _a;
        return (_a = e.date) == null ? void 0 : _a.startsWith("2026");
      }).length, subtext: "Sepanjang 2026", iconColor: "text-tertiary-container", valueColor: "text-on-background" }
    ]);
    const filteredEvents = computed(
      () => !filterType.value ? items.value : items.value.filter((e) => e.type === filterType.value)
    );
    function typeClass(type) {
      const map = {
        "Reuni": "bg-primary-fixed text-on-primary-fixed",
        "Halal Bihalal": "bg-secondary-fixed text-on-secondary-fixed",
        "Kajian": "bg-tertiary-fixed text-on-tertiary-fixed",
        "Bakti Sosial": "bg-surface-container text-on-surface-variant"
      };
      return map[type] || "bg-surface-container text-on-surface-variant";
    }
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
        _push(`<!--]--></div><div class="flex flex-col md:flex-row md:items-center justify-between gap-stack-md mb-stack-md"><div><h2 class="font-display text-headline-md text-primary">Forum Alumni &amp; Acara</h2><p class="text-on-surface-variant text-body-md">Kelola acara alumni seperti reuni, halal bihalal, dan kajian.</p></div><div class="flex items-center gap-stack-sm"><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md transition-all shadow-md active:scale-95"><span class="material-symbols-outlined text-sm">add</span> Tambah Acara </button></div></div><div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50"><div class="p-stack-md border-b border-surface-variant/30 flex flex-wrap items-center gap-stack-md"><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Tipe:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "") : ssrLooseEqual(unref(filterType), "")) ? " selected" : ""}>Semua</option><option value="Reuni"${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "Reuni") : ssrLooseEqual(unref(filterType), "Reuni")) ? " selected" : ""}>Reuni</option><option value="Halal Bihalal"${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "Halal Bihalal") : ssrLooseEqual(unref(filterType), "Halal Bihalal")) ? " selected" : ""}>Halal Bihalal</option><option value="Kajian"${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "Kajian") : ssrLooseEqual(unref(filterType), "Kajian")) ? " selected" : ""}>Kajian</option><option value="Bakti Sosial"${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "Bakti Sosial") : ssrLooseEqual(unref(filterType), "Bakti Sosial")) ? " selected" : ""}>Bakti Sosial</option></select></div><div class="ml-auto flex items-center gap-2"><span class="text-on-surface-variant text-[12px] italic flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span> ${ssrInterpolate(unref(filteredEvents).length)} acara </span></div></div><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Acara</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Tipe</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Lokasi</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Keterangan</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-surface-variant/30"><!--[-->`);
        ssrRenderList(unref(filteredEvents), (e) => {
          _push(`<tr class="hover:bg-primary-container/5 transition-colors"><td class="px-6 py-4"><p class="text-label-md text-on-surface">${ssrInterpolate(e.name)}</p></td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(e.date)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", typeClass(e.type)])}">${ssrInterpolate(e.type)}</span></td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(e.location)}</td><td class="px-6 py-4 text-label-md text-on-surface-variant max-w-[200px] truncate">${ssrInterpolate(e.notes)}</td><td class="px-6 py-4"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div>`);
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(showModal)) {
            _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary-container px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">Tambah Acara</h2><p class="text-[11px] text-on-primary-container uppercase tracking-widest">Alumni Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Acara</label><input${ssrRenderAttr("value", unref(form).name)} class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input${ssrRenderAttr("value", unref(form).date)} type="date" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tipe</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Reuni"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "Reuni") : ssrLooseEqual(unref(form).type, "Reuni")) ? " selected" : ""}>Reuni</option><option value="Halal Bihalal"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "Halal Bihalal") : ssrLooseEqual(unref(form).type, "Halal Bihalal")) ? " selected" : ""}>Halal Bihalal</option><option value="Kajian"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "Kajian") : ssrLooseEqual(unref(form).type, "Kajian")) ? " selected" : ""}>Kajian</option><option value="Bakti Sosial"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "Bakti Sosial") : ssrLooseEqual(unref(form).type, "Bakti Sosial")) ? " selected" : ""}>Bakti Sosial</option></select></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Lokasi</label><input${ssrRenderAttr("value", unref(form).location)} class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Keterangan</label><textarea class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" rows="3">${ssrInterpolate(unref(form).notes)}</textarea></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/alumni/events.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=events-NSze_L2E.mjs.map
