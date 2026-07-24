import { defineComponent, ref, computed, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "classes",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const items = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const showDeleteModal = ref(false);
    const deleteTarget = ref(null);
    const stats = computed(() => {
      const total = items.value.length;
      const levels = new Set(items.value.map((i) => i.level)).size;
      return [
        { label: "Total Kelas", icon: "meeting_room", iconColor: "text-primary", valueColor: "text-primary", value: String(total) },
        { label: "Total Santri", icon: "groups", iconColor: "text-secondary", valueColor: "text-secondary", value: "-" },
        { label: "Tingkatan", icon: "layers", iconColor: "text-tertiary", valueColor: "text-on-background", value: String(levels) }
      ];
    });
    const defaultForm = () => ({
      id: 0,
      name: "",
      level: "",
      group: "",
      active: true
    });
    const form = reactive(defaultForm());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Manajemen Kelas &amp; Tingkatan</h2><p class="text-on-surface-variant text-body-md">Kelola data kelas dan tingkatan untuk santri.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm"><div class="flex items-center justify-between mb-2"><span class="text-on-surface-variant text-label-md">${ssrInterpolate(stat.label)}</span><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p></div>`);
      });
      _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><h3 class="font-display text-title-lg text-primary">Daftar Kelas</h3><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Tambah Kelas </button></div>`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center text-on-surface-variant text-label-md">Memuat data...</div>`);
      } else if (unref(error)) {
        _push(`<div class="p-8 text-center text-red-500 text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Kelas</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Tingkat</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Group</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(items), (item) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4 text-label-md text-on-surface font-medium">${ssrInterpolate(item.name)}</td><td class="px-6 py-4 text-label-sm text-on-surface-variant">${ssrInterpolate(item.level)}</td><td class="px-6 py-4"><span class="bg-surface-container-low px-2 py-1 rounded text-label-sm text-on-surface-variant">${ssrInterpolate(item.group)}</span></td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", item.active ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container text-on-surface-variant"])}">${ssrInterpolate(item.active ? "Aktif" : "Nonaktif")}</span></td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button><button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(items).length === 0) {
          _push(`<tr><td colspan="5" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data kelas. Klik &quot;Tambah Kelas&quot; untuk menambahkan.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div>`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        var _a;
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter"><div class="p-6 border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(unref(isEditing) ? "Edit Kelas" : "Tambah Kelas")}</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-6 space-y-4"><div><label class="text-label-sm text-on-surface-variant block mb-1">Nama Kelas</label><input${ssrRenderAttr("value", unref(form).name)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Contoh: 8A"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Tingkat</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "") : ssrLooseEqual(unref(form).level, "")) ? " selected" : ""}>Pilih Tingkat</option><option value="7"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "7") : ssrLooseEqual(unref(form).level, "7")) ? " selected" : ""}>7</option><option value="8"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "8") : ssrLooseEqual(unref(form).level, "8")) ? " selected" : ""}>8</option><option value="9"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "9") : ssrLooseEqual(unref(form).level, "9")) ? " selected" : ""}>9</option><option value="10"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "10") : ssrLooseEqual(unref(form).level, "10")) ? " selected" : ""}>10</option><option value="11"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "11") : ssrLooseEqual(unref(form).level, "11")) ? " selected" : ""}>11</option><option value="12"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "12") : ssrLooseEqual(unref(form).level, "12")) ? " selected" : ""}>12</option></select></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Group</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).group) ? ssrLooseContain(unref(form).group, "") : ssrLooseEqual(unref(form).group, "")) ? " selected" : ""}>Pilih Group</option><option value="A"${ssrIncludeBooleanAttr(Array.isArray(unref(form).group) ? ssrLooseContain(unref(form).group, "A") : ssrLooseEqual(unref(form).group, "A")) ? " selected" : ""}>A</option><option value="B"${ssrIncludeBooleanAttr(Array.isArray(unref(form).group) ? ssrLooseContain(unref(form).group, "B") : ssrLooseEqual(unref(form).group, "B")) ? " selected" : ""}>B</option><option value="C"${ssrIncludeBooleanAttr(Array.isArray(unref(form).group) ? ssrLooseContain(unref(form).group, "C") : ssrLooseEqual(unref(form).group, "C")) ? " selected" : ""}>C</option><option value="D"${ssrIncludeBooleanAttr(Array.isArray(unref(form).group) ? ssrLooseContain(unref(form).group, "D") : ssrLooseEqual(unref(form).group, "D")) ? " selected" : ""}>D</option></select></div><div class="flex items-center gap-3"><label class="text-label-sm text-on-surface-variant">Status Aktif</label><button class="${ssrRenderClass(["w-10 h-5 rounded-full transition-colors relative", unref(form).active ? "bg-primary" : "bg-surface-container-highest"])}"><span class="${ssrRenderClass(["absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform", unref(form).active ? "translate-x-5" : "translate-x-0.5"])}"></span></button></div></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Simpan</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showDeleteModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter"><div class="p-6 text-center"><div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-red-500 text-3xl">warning</span></div><h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Kelas</h3><p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus kelas berikut?</p><p class="font-bold text-on-surface text-body-md">${ssrInterpolate((_a = unref(deleteTarget)) == null ? void 0 : _a.name)}</p></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Hapus</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/master-data/classes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=classes-Dt4fm37U.mjs.map
