import { defineComponent, ref, computed, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "academic-years",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const items = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const showDeleteModal = ref(false);
    const deleteTarget = ref(null);
    const stats = computed(() => [
      { label: "Total Tahun Ajaran", icon: "calendar_month", iconColor: "text-primary", valueColor: "text-primary", value: String(items.value.length) },
      { label: "Semester Ganjil", icon: "looks_one", iconColor: "text-secondary", valueColor: "text-secondary", value: String(items.value.filter((a) => a.semester === "Ganjil").length) },
      { label: "Semester Genap", icon: "looks_two", iconColor: "text-primary-container", valueColor: "text-on-background", value: String(items.value.filter((a) => a.semester === "Genap").length) },
      { label: "Aktif", icon: "check_circle", iconColor: "text-tertiary", valueColor: "text-on-background", value: String(items.value.filter((a) => a.isActive).length) }
    ]);
    const defaultForm = () => ({
      id: 0,
      name: "",
      semester: "",
      startDate: "",
      endDate: "",
      isActive: false
    });
    const form = reactive(defaultForm());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Manajemen Tahun Ajaran</h2><p class="text-on-surface-variant text-body-md">Kelola tahun ajaran dan semester untuk kegiatan akademik.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm"><div class="flex items-center justify-between mb-2"><span class="text-on-surface-variant text-label-md">${ssrInterpolate(stat.label)}</span><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p></div>`);
      });
      _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><h3 class="font-display text-title-lg text-primary">Daftar Tahun Ajaran</h3><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Tambah Tahun Ajaran </button></div>`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center text-on-surface-variant text-label-md">Memuat data...</div>`);
      } else if (unref(error)) {
        _push(`<div class="p-8 text-center text-red-500 text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Tahun Ajaran</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Semester</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Mulai</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Selesai</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(items), (item) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4 text-label-md text-on-surface font-medium">${ssrInterpolate(item.name)}</td><td class="px-6 py-4"><span class="bg-surface-container-low px-2 py-1 rounded text-label-sm text-on-surface-variant">${ssrInterpolate(item.semester)}</span></td><td class="px-6 py-4 text-label-sm text-on-surface-variant">${ssrInterpolate(item.startDate)}</td><td class="px-6 py-4 text-label-sm text-on-surface-variant">${ssrInterpolate(item.endDate)}</td><td class="px-6 py-4"><button class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider border-0 cursor-pointer transition-all", item.isActive ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container text-on-surface-variant"])}">${ssrInterpolate(item.isActive ? "Aktif" : "Nonaktif")}</button></td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button><button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(items).length === 0) {
          _push(`<tr><td colspan="6" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data tahun ajaran. Klik &quot;Tambah Tahun Ajaran&quot; untuk menambahkan.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div>`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        var _a, _b;
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter"><div class="p-6 border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(unref(isEditing) ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran")}</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-6 space-y-4"><div><label class="text-label-sm text-on-surface-variant block mb-1">Nama Tahun Ajaran</label><input${ssrRenderAttr("value", unref(form).name)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Contoh: 2024/2025"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Semester</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).semester) ? ssrLooseContain(unref(form).semester, "") : ssrLooseEqual(unref(form).semester, "")) ? " selected" : ""}>Pilih Semester</option><option value="Ganjil"${ssrIncludeBooleanAttr(Array.isArray(unref(form).semester) ? ssrLooseContain(unref(form).semester, "Ganjil") : ssrLooseEqual(unref(form).semester, "Ganjil")) ? " selected" : ""}>Ganjil</option><option value="Genap"${ssrIncludeBooleanAttr(Array.isArray(unref(form).semester) ? ssrLooseContain(unref(form).semester, "Genap") : ssrLooseEqual(unref(form).semester, "Genap")) ? " selected" : ""}>Genap</option></select></div><div class="grid grid-cols-2 gap-4"><div><label class="text-label-sm text-on-surface-variant block mb-1">Tanggal Mulai</label><input${ssrRenderAttr("value", unref(form).startDate)} type="date" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Tanggal Selesai</label><input${ssrRenderAttr("value", unref(form).endDate)} type="date" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"></div></div><div class="flex items-center gap-3"><label class="text-label-sm text-on-surface-variant">Set sebagai aktif</label><button class="${ssrRenderClass(["w-10 h-5 rounded-full transition-colors relative", unref(form).isActive ? "bg-primary" : "bg-surface-container-highest"])}"><span class="${ssrRenderClass(["absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform", unref(form).isActive ? "translate-x-5" : "translate-x-0.5"])}"></span></button></div></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Simpan</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showDeleteModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter"><div class="p-6 text-center"><div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-red-500 text-3xl">warning</span></div><h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Tahun Ajaran</h3><p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus tahun ajaran berikut?</p><p class="font-bold text-on-surface text-body-md">${ssrInterpolate((_a = unref(deleteTarget)) == null ? void 0 : _a.name)} - ${ssrInterpolate((_b = unref(deleteTarget)) == null ? void 0 : _b.semester)}</p></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Hapus</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/master-data/academic-years.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=academic-years-iOs6Posw.mjs.map
