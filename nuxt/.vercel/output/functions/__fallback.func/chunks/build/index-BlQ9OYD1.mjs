import { defineComponent, ref, reactive, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderTeleport } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const filterYear = ref("");
    const filterStatus = ref("");
    const showModal = ref(false);
    const editingId = ref(null);
    const form = reactive({
      name: "",
      graduationYear: 2026,
      status: "Kuliah",
      institution: "",
      contact: ""
    });
    const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
    const items = ref([]);
    const stats = computed(() => [
      { label: "Total Alumni", icon: "groups", value: items.value.length, subtext: "Tercatat semua angkatan", iconColor: "text-primary", valueColor: "text-primary" },
      { label: "Kuliah", icon: "school", value: items.value.filter((a) => a.status === "Kuliah").length, subtext: "Melanjutkan pendidikan", iconColor: "text-secondary", valueColor: "text-secondary" },
      { label: "Bekerja", icon: "work", value: items.value.filter((a) => a.status === "Kerja").length, subtext: "Sudah bekerja", iconColor: "text-tertiary-container", valueColor: "text-on-background" },
      { label: "Wirausaha", icon: "store", value: items.value.filter((a) => a.status === "Wirausaha").length, subtext: "Berwirausaha", iconColor: "text-error", valueColor: "text-on-background" }
    ]);
    const filteredAlumni = computed(
      () => items.value.filter(
        (a) => (!filterYear.value || a.graduationYear === Number(filterYear.value)) && (!filterStatus.value || a.status === filterStatus.value)
      )
    );
    function statusClass(status) {
      const map = {
        "Kuliah": "bg-primary-fixed text-on-primary-fixed",
        "Kerja": "bg-secondary-fixed text-on-secondary-fixed",
        "Wirausaha": "bg-tertiary-fixed text-on-tertiary-fixed",
        "Lainnya": "bg-surface-container text-on-surface-variant"
      };
      return map[status] || "bg-surface-container text-on-surface-variant";
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
        _push(`<!--]--></div><div class="flex flex-col md:flex-row md:items-center justify-between gap-stack-md mb-stack-md"><div><h2 class="font-display text-headline-md text-primary">Alumni Tracking</h2><p class="text-on-surface-variant text-body-md">Manage alumni data and track their post-graduation status.</p></div><div class="flex items-center gap-stack-sm"><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md transition-all shadow-md active:scale-95"><span class="material-symbols-outlined text-sm">add</span> Add Alumni </button></div></div><div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50"><div class="p-stack-md border-b border-surface-variant/30 flex flex-wrap items-center gap-stack-md"><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Tahun Lulus:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterYear)) ? ssrLooseContain(unref(filterYear), "") : ssrLooseEqual(unref(filterYear), "")) ? " selected" : ""}>Semua</option><!--[-->`);
        ssrRenderList(years, (y) => {
          _push(`<option${ssrRenderAttr("value", y)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterYear)) ? ssrLooseContain(unref(filterYear), y) : ssrLooseEqual(unref(filterYear), y)) ? " selected" : ""}>${ssrInterpolate(y)}</option>`);
        });
        _push(`<!--]--></select></div><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Status:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "") : ssrLooseEqual(unref(filterStatus), "")) ? " selected" : ""}>Semua</option><option value="Kuliah"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Kuliah") : ssrLooseEqual(unref(filterStatus), "Kuliah")) ? " selected" : ""}>Kuliah</option><option value="Kerja"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Kerja") : ssrLooseEqual(unref(filterStatus), "Kerja")) ? " selected" : ""}>Kerja</option><option value="Wirausaha"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Wirausaha") : ssrLooseEqual(unref(filterStatus), "Wirausaha")) ? " selected" : ""}>Wirausaha</option><option value="Lainnya"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Lainnya") : ssrLooseEqual(unref(filterStatus), "Lainnya")) ? " selected" : ""}>Lainnya</option></select></div><div class="ml-auto flex items-center gap-2"><span class="text-on-surface-variant text-[12px] italic flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span> ${ssrInterpolate(unref(filteredAlumni).length)} alumni </span></div></div><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Nama</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Tahun Lulus</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Institusi</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Kontak</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-surface-variant/30"><!--[-->`);
        ssrRenderList(unref(filteredAlumni), (a) => {
          _push(`<tr class="hover:bg-primary-container/5 transition-colors"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-bold">${ssrInterpolate(a.initials)}</div><p class="text-label-md text-on-surface">${ssrInterpolate(a.name)}</p></div></td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(a.graduationYear)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", statusClass(a.status)])}">${ssrInterpolate(a.status)}</span></td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(a.institution)}</td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(a.contact)}</td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined">edit</span></button><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div>`);
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(showModal)) {
            _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary-container px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">${ssrInterpolate(unref(editingId) ? "Edit" : "Tambah")} Alumni</h2><p class="text-[11px] text-on-primary-container uppercase tracking-widest">Alumni Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Lengkap</label><input${ssrRenderAttr("value", unref(form).name)} class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tahun Lulus</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><!--[-->`);
            ssrRenderList(years, (y) => {
              _push2(`<option${ssrRenderAttr("value", y)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).graduationYear) ? ssrLooseContain(unref(form).graduationYear, y) : ssrLooseEqual(unref(form).graduationYear, y)) ? " selected" : ""}>${ssrInterpolate(y)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Status</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Kuliah"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Kuliah") : ssrLooseEqual(unref(form).status, "Kuliah")) ? " selected" : ""}>Kuliah</option><option value="Kerja"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Kerja") : ssrLooseEqual(unref(form).status, "Kerja")) ? " selected" : ""}>Kerja</option><option value="Wirausaha"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Wirausaha") : ssrLooseEqual(unref(form).status, "Wirausaha")) ? " selected" : ""}>Wirausaha</option><option value="Lainnya"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Lainnya") : ssrLooseEqual(unref(form).status, "Lainnya")) ? " selected" : ""}>Lainnya</option></select></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Institusi / Perusahaan</label><input${ssrRenderAttr("value", unref(form).institution)} class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Kontak</label><input${ssrRenderAttr("value", unref(form).contact)} class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none"></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/alumni/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BlQ9OYD1.mjs.map
