import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const mode = ref("global");
    const selectedSantri = ref("");
    const selectedPeriod = ref("");
    const generating = ref("");
    const reports = ref([]);
    const students = ref([]);
    const santriDetail = ref(null);
    const loading = ref(true);
    const error = ref("");
    const filteredReports = computed(() => {
      if (!selectedPeriod.value) return reports.value;
      return reports.value.filter((r) => {
        var _a;
        return (_a = r.period) == null ? void 0 : _a.toLowerCase().includes(selectedPeriod.value);
      });
    });
    const stats = computed(() => [
      { label: "Total Laporan", icon: "description", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: String(reports.value.length) },
      { label: "Santri Aktif", icon: "groups", bg: "bg-tertiary-fixed", iconColor: "text-tertiary", valueColor: "text-on-background", value: "- " },
      { label: "Cetak Tersedia", icon: "print", bg: "bg-secondary-fixed", iconColor: "text-secondary", valueColor: "text-secondary", value: String(reports.value.filter((r) => r.type === "PDF").length) },
      { label: "Periode Aktif", icon: "calendar_month", bg: "bg-error-container", iconColor: "text-error", valueColor: "text-on-background", value: "2024/2025" }
    ]);
    const santriReports = [
      { id: "rapor-individu", title: "Rapor Individu", icon: "menu_book" },
      { id: "absensi-individu", title: "Absensi", icon: "calendar_month" },
      { id: "tahfidz-individu", title: "Tahfidz", icon: "menu_book" },
      { id: "pelanggaran-individu", title: "Pelanggaran", icon: "gavel" }
    ];
    const santriStats = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return [
        { label: "Hadir", value: ((_b = (_a = santriDetail.value) == null ? void 0 : _a.attendance) == null ? void 0 : _b.present) || "-", color: "text-green-600" },
        { label: "Sakit", value: ((_d = (_c = santriDetail.value) == null ? void 0 : _c.attendance) == null ? void 0 : _d.sick) || "-", color: "text-amber-600" },
        { label: "Izin", value: ((_f = (_e = santriDetail.value) == null ? void 0 : _e.attendance) == null ? void 0 : _f.permit) || "-", color: "text-blue-600" },
        { label: "Alpa", value: ((_h = (_g = santriDetail.value) == null ? void 0 : _g.attendance) == null ? void 0 : _h.absent) || "-", color: "text-red-600" }
      ];
    });
    watch(selectedSantri, async (val) => {
      if (!val) {
        santriDetail.value = null;
        return;
      }
      try {
        santriDetail.value = await $fetch(`/api/students/${val}`);
      } catch {
        santriDetail.value = null;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Laporan &amp; Cetak</h2><p class="text-on-surface-variant text-body-md">Generate dan cetak berbagai laporan akademik dan non-akademik.</p></div><div class="glass-card rounded-xl p-stack-md shadow-sm mb-stack-lg"><div class="flex flex-wrap items-center gap-4"><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Mode:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value="global"${ssrIncludeBooleanAttr(Array.isArray(unref(mode)) ? ssrLooseContain(unref(mode), "global") : ssrLooseEqual(unref(mode), "global")) ? " selected" : ""}>Global</option><option value="per-santri"${ssrIncludeBooleanAttr(Array.isArray(unref(mode)) ? ssrLooseContain(unref(mode), "per-santri") : ssrLooseEqual(unref(mode), "per-santri")) ? " selected" : ""}>Per Santri</option></select></div>`);
      if (unref(mode) === "per-santri") {
        _push(`<div class="flex items-center gap-2 flex-1 max-w-xs"><span class="material-symbols-outlined text-on-surface-variant">search</span><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedSantri)) ? ssrLooseContain(unref(selectedSantri), "") : ssrLooseEqual(unref(selectedSantri), "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
        ssrRenderList(unref(students), (s) => {
          _push(`<option${ssrRenderAttr("value", s.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedSantri)) ? ssrLooseContain(unref(selectedSantri), s.id) : ssrLooseEqual(unref(selectedSantri), s.id)) ? " selected" : ""}>${ssrInterpolate(s.name)} (${ssrInterpolate(s.nis || "-")})</option>`);
        });
        _push(`<!--]--></select></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(mode) === "global") {
        _push(`<div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Periode:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedPeriod)) ? ssrLooseContain(unref(selectedPeriod), "") : ssrLooseEqual(unref(selectedPeriod), "")) ? " selected" : ""}>Semua</option><option value="bulanan"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedPeriod)) ? ssrLooseContain(unref(selectedPeriod), "bulanan") : ssrLooseEqual(unref(selectedPeriod), "bulanan")) ? " selected" : ""}>Bulanan</option><option value="semester"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedPeriod)) ? ssrLooseContain(unref(selectedPeriod), "semester") : ssrLooseEqual(unref(selectedPeriod), "semester")) ? " selected" : ""}>Semester</option><option value="tahunan"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedPeriod)) ? ssrLooseContain(unref(selectedPeriod), "tahunan") : ssrLooseEqual(unref(selectedPeriod), "tahunan")) ? " selected" : ""}>Tahunan</option></select></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center text-on-surface-variant py-12 text-label-md">Memuat data laporan...</div>`);
      } else if (unref(error)) {
        _push(`<div class="text-center text-error py-12 text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(mode) === "global") {
        _push(`<!--[--><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
        ssrRenderList(unref(stats), (stat) => {
          _push(`<div class="glass-card p-6 rounded-xl shadow-sm text-center"><div class="${ssrRenderClass([stat.bg, "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"])}"><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(stat.label)}</p></div>`);
        });
        _push(`<!--]--></div>`);
        if (unref(generating)) {
          _push(`<div class="mb-stack-lg glass-card rounded-xl p-6 shadow-sm bg-primary-fixed/10 border border-primary/20"><div class="flex items-center gap-4"><span class="material-symbols-outlined text-primary animate-spin">refresh</span><div><p class="text-label-md font-bold text-primary">Generating ${ssrInterpolate(unref(generating))}...</p><p class="text-label-sm text-on-surface-variant">Laporan akan tersedia setelah selesai diproses.</p></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"><!--[-->`);
        ssrRenderList(unref(filteredReports), (rpt) => {
          _push(`<div class="glass-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer"><div class="flex items-start justify-between mb-4"><div class="${ssrRenderClass([rpt.bg, "w-12 h-12 rounded-xl flex items-center justify-center"])}"><span class="${ssrRenderClass([rpt.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(rpt.icon)}</span></div><span class="text-label-sm text-on-surface-variant bg-surface-container-low px-2 py-1 rounded">${ssrInterpolate(rpt.type)}</span></div><h3 class="font-display text-title-lg text-primary mb-1">${ssrInterpolate(rpt.title)}</h3><p class="text-label-sm text-on-surface-variant mb-4">${ssrInterpolate(rpt.description)}</p><div class="flex items-center justify-between"><span class="text-label-sm text-on-surface-variant"><span class="material-symbols-outlined text-sm align-middle mr-1">calendar_today</span> ${ssrInterpolate(rpt.period)}</span><button class="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm text-sm"><span class="material-symbols-outlined text-sm">download</span> Generate </button></div></div>`);
        });
        _push(`<!--]--></div><!--]-->`);
      } else if (unref(selectedSantri)) {
        _push(`<div class="mb-stack-lg glass-card rounded-xl p-6 shadow-sm"><div class="flex items-center gap-4 mb-4"><div class="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center"><span class="material-symbols-outlined text-primary text-2xl">person</span></div><div><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(((_a = unref(santriDetail)) == null ? void 0 : _a.name) || "-")}</h3><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(((_b = unref(santriDetail)) == null ? void 0 : _b.nis) || "-")} | ${ssrInterpolate(((_c = unref(santriDetail)) == null ? void 0 : _c.kelas) || "-")} | ${ssrInterpolate(((_d = unref(santriDetail)) == null ? void 0 : _d.kamar) || "-")}</p></div></div><div class="grid grid-cols-2 md:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(unref(santriStats), (s) => {
          _push(`<div class="text-center p-3 bg-surface-container-low rounded-lg"><p class="${ssrRenderClass([s.color, "font-display text-headline-sm"])}">${ssrInterpolate(s.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(s.label)}</p></div>`);
        });
        _push(`<!--]--></div><div class="flex gap-3 mt-4"><!--[-->`);
        ssrRenderList(santriReports, (r) => {
          _push(`<button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all"><span class="material-symbols-outlined text-sm">${ssrInterpolate(r.icon)}</span> ${ssrInterpolate(r.title)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="text-center py-12 text-on-surface-variant text-label-md">Pilih santri untuk melihat laporan individu</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/laporan/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BxgYeZGM.mjs.map
