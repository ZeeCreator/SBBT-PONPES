import { defineComponent, ref, computed, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "scholarships",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const errorS = ref("");
    const scholarships = ref([]);
    const availableStudents = [
      { id: 1, name: "Ahmad Zaki", nis: "20241001", class: "8A" },
      { id: 2, name: "Budi Prasetyo", nis: "20241002", class: "8A" },
      { id: 3, name: "Citra Dewi", nis: "20241003", class: "8B" },
      { id: 4, name: "Dimas Ardian", nis: "20241004", class: "9A" },
      { id: 5, name: "Eka Putri", nis: "20241005", class: "9A" },
      { id: 6, name: "Fajar Hidayat", nis: "20241006", class: "7A" },
      { id: 7, name: "Gita Nurul", nis: "20241007", class: "7B" },
      { id: 8, name: "Hadi Firmansyah", nis: "20241008", class: "10A" }
    ];
    const stats = computed(() => [
      { label: "Total Beasiswa", icon: "school", iconColor: "text-primary", valueColor: "text-primary", value: scholarships.value.length },
      { label: "Total Penerima", icon: "group", iconColor: "text-secondary", valueColor: "text-secondary", value: scholarships.value.reduce((a, b) => a + b.recipients, 0) },
      { label: "Diskon Tertinggi", icon: "trending_up", iconColor: "text-primary-container", valueColor: "text-on-background", value: scholarships.value.length > 0 ? `${Math.max(...scholarships.value.map((s) => s.discount))}%` : "0%" },
      { label: "Tipe Beasiswa", icon: "category", iconColor: "text-tertiary", valueColor: "text-on-background", value: `${new Set(scholarships.value.map((s) => s.type)).size} jenis` }
    ]);
    function typeClass(type) {
      const map = {
        "yatim": "bg-secondary-fixed text-on-secondary-fixed",
        "tahfidz": "bg-tertiary-container text-on-tertiary-container",
        "prestasi": "bg-primary-fixed text-on-primary-fixed"
      };
      return map[type] || "bg-surface-container text-on-surface-variant";
    }
    const showModal = ref(false);
    const isEditing = ref(false);
    const showDeleteModal = ref(false);
    const deleteTarget = ref(null);
    const showAssignModal = ref(false);
    const assignTarget = ref(null);
    const assignedStudents = ref([]);
    const defaultForm = () => ({
      id: 0,
      name: "",
      type: "yatim",
      typeLabel: "Yatim",
      discount: 0,
      terms: "",
      recipients: 0
    });
    const form = reactive(defaultForm());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "bg-mesh min-h-screen",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="px-gutter max-w-container-max mx-auto"><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary mb-2">Beasiswa &amp; Diskon SPP</h2><p class="text-on-surface-variant text-body-md">Kelola jenis beasiswa, diskon SPP, dan penugasan penerima beasiswa.</p></div>`);
      if (unref(errorS)) {
        _push(`<div class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">${ssrInterpolate(unref(errorS))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span></div>`);
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
        ssrRenderList(unref(stats), (stat) => {
          _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm"><div class="flex items-center justify-between mb-2"><span class="text-on-surface-variant text-label-md">${ssrInterpolate(stat.label)}</span><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p></div>`);
        });
        _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex items-center justify-between gap-stack-md"><h3 class="font-display text-title-lg text-primary">Daftar Beasiswa</h3><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Tambah Beasiswa </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Beasiswa</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Tipe</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Diskon</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Syarat &amp; Ketentuan</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Penerima</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(scholarships), (item) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4 text-label-md text-on-surface font-medium">${ssrInterpolate(item.name)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", typeClass(item.type)])}">${ssrInterpolate(item.typeLabel)}</span></td><td class="px-6 py-4"><span class="font-bold text-secondary text-label-md">${ssrInterpolate(item.discount)}%</span></td><td class="px-6 py-4 text-label-md text-on-surface-variant max-w-xs truncate">${ssrInterpolate(item.terms)}</td><td class="px-6 py-4"><div class="flex items-center gap-2"><span class="text-label-md text-on-surface">${ssrInterpolate(item.recipients)}</span><button class="text-primary hover:text-primary-container transition-colors" title="Atur Penerima"><span class="material-symbols-outlined text-sm">person_add</span></button></div></td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button><button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(scholarships).length === 0) {
          _push(`<tr><td colspan="6" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data beasiswa.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        var _a, _b;
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter"><div class="p-6 border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(unref(isEditing) ? "Edit Beasiswa" : "Tambah Beasiswa")}</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-6 space-y-4"><div><label class="text-label-sm text-on-surface-variant block mb-1">Nama Beasiswa</label><input${ssrRenderAttr("value", unref(form).name)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Contoh: Beasiswa Tahfidz"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Tipe Beasiswa</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value="yatim"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "yatim") : ssrLooseEqual(unref(form).type, "yatim")) ? " selected" : ""}>Yatim</option><option value="tahfidz"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "tahfidz") : ssrLooseEqual(unref(form).type, "tahfidz")) ? " selected" : ""}>Tahfidz (per Juz)</option><option value="prestasi"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "prestasi") : ssrLooseEqual(unref(form).type, "prestasi")) ? " selected" : ""}>Prestasi Akademik</option></select></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Diskon (%)</label><input${ssrRenderAttr("value", unref(form).discount)} type="number" min="0" max="100" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="0-100"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Syarat &amp; Ketentuan</label><textarea class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" rows="3" placeholder="Deskripsi syarat beasiswa...">${ssrInterpolate(unref(form).terms)}</textarea></div></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Simpan</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showAssignModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter"><div class="p-6 border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">Atur Penerima Beasiswa</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-6"><p class="text-label-md text-on-surface-variant mb-4">Beasiswa: <span class="font-bold text-on-surface">${ssrInterpolate((_a = unref(assignTarget)) == null ? void 0 : _a.name)}</span></p><div class="space-y-2 max-h-60 overflow-y-auto"><!--[-->`);
          ssrRenderList(availableStudents, (s) => {
            _push2(`<label class="${ssrRenderClass([{ "bg-primary-fixed/20": unref(assignedStudents).includes(s.id) }, "flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors"])}"><input type="checkbox"${ssrRenderAttr("value", s.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(assignedStudents)) ? ssrLooseContain(unref(assignedStudents), s.id) : unref(assignedStudents)) ? " checked" : ""} class="w-4 h-4 text-primary focus:ring-primary border-outline-variant rounded"><div><p class="text-label-md text-on-surface">${ssrInterpolate(s.name)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(s.nis)} \u2022 ${ssrInterpolate(s.class)}</p></div></label>`);
          });
          _push2(`<!--]--></div></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Simpan</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showDeleteModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter"><div class="p-6 text-center"><div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-red-500 text-3xl">warning</span></div><h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Beasiswa</h3><p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus beasiswa berikut?</p><p class="font-bold text-on-surface text-body-md">${ssrInterpolate((_b = unref(deleteTarget)) == null ? void 0 : _b.name)}</p></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Hapus</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/keuangan/scholarships.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=scholarships-DYOlc4Sc.mjs.map
