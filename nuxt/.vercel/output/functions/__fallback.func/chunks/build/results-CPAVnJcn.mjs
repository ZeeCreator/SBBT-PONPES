import { defineComponent, ref, reactive, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "results",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const filterStatus = ref("");
    ref(false);
    ref(null);
    reactive({
      name: "",
      status: "Lulus",
      class: "",
      registerDate: ""
    });
    const items = ref([]);
    const stats = computed(() => {
      const len = items.value.length;
      const lulus = items.value.filter((r) => r.status === "Lulus").length;
      const tidak = items.value.filter((r) => r.status === "Tidak").length;
      const daftarUlang = items.value.filter((r) => r.registerDate).length;
      return [
        { label: "Total Peserta", icon: "group", value: len, subtext: "Semua peserta", iconColor: "text-primary", valueColor: "text-primary" },
        { label: "Lulus", icon: "check_circle", value: lulus, subtext: len ? Math.round(lulus / len * 100) + "% diterima" : "0%", iconColor: "text-primary", valueColor: "text-primary" },
        { label: "Tidak Lulus", icon: "cancel", value: tidak, subtext: len ? Math.round(tidak / len * 100) + "% ditolak" : "0%", iconColor: "text-error", valueColor: "text-error" },
        { label: "Daftar Ulang", icon: "how_to_reg", value: daftarUlang, subtext: lulus ? Math.round(daftarUlang / lulus * 100) + "% dari lulus" : "0%", iconColor: "text-secondary", valueColor: "text-secondary" }
      ];
    });
    const filteredResults = computed(
      () => !filterStatus.value ? items.value : items.value.filter((r) => r.status === filterStatus.value)
    );
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
        _push(`<!--]--></div><div class="flex flex-col md:flex-row md:items-center justify-between gap-stack-md mb-stack-md"><div><h2 class="font-display text-headline-md text-primary">Pengumuman &amp; Daftar Ulang</h2><p class="text-on-surface-variant text-body-md">Kelola hasil pengumuman kelulusan dan pendaftaran ulang.</p></div></div><div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50"><div class="p-stack-md border-b border-surface-variant/30 flex flex-wrap items-center gap-stack-md"><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Status:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "") : ssrLooseEqual(unref(filterStatus), "")) ? " selected" : ""}>Semua</option><option value="Lulus"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Lulus") : ssrLooseEqual(unref(filterStatus), "Lulus")) ? " selected" : ""}>Lulus</option><option value="Tidak"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Tidak") : ssrLooseEqual(unref(filterStatus), "Tidak")) ? " selected" : ""}>Tidak</option></select></div><div class="ml-auto flex items-center gap-2"><span class="text-on-surface-variant text-[12px] italic flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span> ${ssrInterpolate(unref(filteredResults).length)} hasil </span></div></div><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Nama</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Kelas</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal Daftar Ulang</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-surface-variant/30"><!--[-->`);
        ssrRenderList(unref(filteredResults), (r) => {
          _push(`<tr class="hover:bg-primary-container/5 transition-colors"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-bold">${ssrInterpolate(r.initials)}</div><p class="text-label-md text-on-surface">${ssrInterpolate(r.name)}</p></div></td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", r.status === "Lulus" ? "bg-primary-fixed text-on-primary-fixed" : "bg-error-container text-on-error-container"])}">${ssrInterpolate(r.status)}</span></td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(r.class || "-")}</td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(r.registerDate || "-")}</td><td class="px-6 py-4"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/psb/results.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=results-CPAVnJcn.mjs.map
