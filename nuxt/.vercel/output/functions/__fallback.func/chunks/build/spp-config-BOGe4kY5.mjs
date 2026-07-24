import { defineComponent, ref, computed, watch, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "spp-config",
  __ssrInlineRender: true,
  setup(__props) {
    const filterLevel = ref("");
    const loading = ref(true);
    const errorS = ref("");
    const configs = ref([]);
    const stats = computed(() => {
      const total = configs.value.length;
      const allSpp = configs.value.map((c) => c.spp);
      const minSpp = allSpp.length ? Math.min(...allSpp) : 0;
      const maxSpp = allSpp.length ? Math.max(...allSpp) : 0;
      const totals = configs.value.map((c) => c.spp + c.building + c.books + c.activities + c.uniform);
      const avgTotal = totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;
      return [
        { label: "Total Konfigurasi", icon: "settings", iconColor: "text-primary", valueColor: "text-primary", value: total },
        { label: "Range SPP", icon: "currency_exchange", iconColor: "text-secondary", valueColor: "text-secondary", value: `Rp ${formatNumber(minSpp)} - Rp ${formatNumber(maxSpp)}` },
        { label: "Rata-rata Total", icon: "calculate", iconColor: "text-primary-container", valueColor: "text-on-background", value: `Rp ${formatNumber(avgTotal)}` },
        { label: "Kategori", icon: "category", iconColor: "text-tertiary", valueColor: "text-on-background", value: `${new Set(configs.value.map((c) => c.category)).size} jenis` }
      ];
    });
    const filteredConfigs = computed(
      () => !filterLevel.value ? configs.value : configs.value.filter((c) => c.level === filterLevel.value)
    );
    function categoryClass(cat) {
      const map = {
        "Reguler": "bg-primary-fixed text-on-primary-fixed",
        "Yatim": "bg-secondary-fixed text-on-secondary-fixed",
        "Beasiswa": "bg-tertiary-container text-on-tertiary-container"
      };
      return map[cat] || "bg-surface-container text-on-surface-variant";
    }
    function formatNumber(n) {
      return n.toLocaleString("id-ID");
    }
    async function fetchData() {
      loading.value = true;
      errorS.value = "";
      try {
        const params = filterLevel.value ? `?level=${filterLevel.value}` : "";
        configs.value = await $fetch(`/api/keuangan/spp-config${params}`) || [];
      } catch (e) {
        errorS.value = e.message || "Gagal memuat data";
      } finally {
        loading.value = false;
      }
    }
    watch(filterLevel, () => fetchData());
    const showModal = ref(false);
    const isEditing = ref(false);
    const showDeleteModal = ref(false);
    const deleteTarget = ref(null);
    const defaultForm = () => ({
      id: 0,
      level: "",
      className: "",
      category: "Reguler",
      spp: 0,
      building: 0,
      books: 0,
      activities: 0,
      uniform: 0
    });
    const form = reactive(defaultForm());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "bg-mesh min-h-screen",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="px-gutter max-w-container-max mx-auto"><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary mb-2">Konfigurasi SPP &amp; Biaya</h2><p class="text-on-surface-variant text-body-md">Kelola tarif SPP per kelas/tingkat dan biaya tambahan pendidikan.</p></div>`);
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
        _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><h3 class="font-display text-title-lg text-primary">Daftar Konfigurasi Biaya</h3><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Filter:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterLevel)) ? ssrLooseContain(unref(filterLevel), "") : ssrLooseEqual(unref(filterLevel), "")) ? " selected" : ""}>Semua Tingkat</option><option value="7"${ssrIncludeBooleanAttr(Array.isArray(unref(filterLevel)) ? ssrLooseContain(unref(filterLevel), "7") : ssrLooseEqual(unref(filterLevel), "7")) ? " selected" : ""}>Kelas 7</option><option value="8"${ssrIncludeBooleanAttr(Array.isArray(unref(filterLevel)) ? ssrLooseContain(unref(filterLevel), "8") : ssrLooseEqual(unref(filterLevel), "8")) ? " selected" : ""}>Kelas 8</option><option value="9"${ssrIncludeBooleanAttr(Array.isArray(unref(filterLevel)) ? ssrLooseContain(unref(filterLevel), "9") : ssrLooseEqual(unref(filterLevel), "9")) ? " selected" : ""}>Kelas 9</option><option value="10"${ssrIncludeBooleanAttr(Array.isArray(unref(filterLevel)) ? ssrLooseContain(unref(filterLevel), "10") : ssrLooseEqual(unref(filterLevel), "10")) ? " selected" : ""}>Kelas 10</option><option value="11"${ssrIncludeBooleanAttr(Array.isArray(unref(filterLevel)) ? ssrLooseContain(unref(filterLevel), "11") : ssrLooseEqual(unref(filterLevel), "11")) ? " selected" : ""}>Kelas 11</option><option value="12"${ssrIncludeBooleanAttr(Array.isArray(unref(filterLevel)) ? ssrLooseContain(unref(filterLevel), "12") : ssrLooseEqual(unref(filterLevel), "12")) ? " selected" : ""}>Kelas 12</option></select></div></div><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Tambah Konfigurasi </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Tingkat / Kelas</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Kategori</th><th class="px-6 py-4 text-label-md text-on-surface-variant">SPP</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Bangunan</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Buku</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Kegiatan</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Seragam</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Total</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(filteredConfigs), (item) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4 text-label-md text-on-surface font-medium">${ssrInterpolate(item.level)} - ${ssrInterpolate(item.className)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", categoryClass(item.category)])}">${ssrInterpolate(item.category)}</span></td><td class="px-6 py-4 text-label-md text-on-surface">Rp ${ssrInterpolate(formatNumber(item.spp))}</td><td class="px-6 py-4 text-label-md text-on-surface-variant">Rp ${ssrInterpolate(formatNumber(item.building))}</td><td class="px-6 py-4 text-label-md text-on-surface-variant">Rp ${ssrInterpolate(formatNumber(item.books))}</td><td class="px-6 py-4 text-label-md text-on-surface-variant">Rp ${ssrInterpolate(formatNumber(item.activities))}</td><td class="px-6 py-4 text-label-md text-on-surface-variant">Rp ${ssrInterpolate(formatNumber(item.uniform))}</td><td class="px-6 py-4 font-display text-headline-sm text-primary">Rp ${ssrInterpolate(formatNumber(item.spp + item.building + item.books + item.activities + item.uniform))}</td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button><button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredConfigs).length === 0) {
          _push(`<tr><td colspan="9" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada konfigurasi biaya.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        var _a, _b, _c;
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-modal-enter"><div class="p-6 border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(unref(isEditing) ? "Edit Konfigurasi" : "Tambah Konfigurasi")}</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-6 space-y-4"><div class="grid grid-cols-2 gap-4"><div><label class="text-label-sm text-on-surface-variant block mb-1">Tingkat</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "") : ssrLooseEqual(unref(form).level, "")) ? " selected" : ""}>Pilih Tingkat</option><!--[-->`);
          ssrRenderList(["7", "8", "9", "10", "11", "12"], (l) => {
            _push2(`<option${ssrRenderAttr("value", l)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, l) : ssrLooseEqual(unref(form).level, l)) ? " selected" : ""}>Kelas ${ssrInterpolate(l)}</option>`);
          });
          _push2(`<!--]--></select></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Nama Kelas</label><input${ssrRenderAttr("value", unref(form).className)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Contoh: 7A"></div></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Kategori Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value="Reguler"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, "Reguler") : ssrLooseEqual(unref(form).category, "Reguler")) ? " selected" : ""}>Reguler</option><option value="Yatim"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, "Yatim") : ssrLooseEqual(unref(form).category, "Yatim")) ? " selected" : ""}>Yatim</option><option value="Beasiswa"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, "Beasiswa") : ssrLooseEqual(unref(form).category, "Beasiswa")) ? " selected" : ""}>Beasiswa</option></select></div><div class="grid grid-cols-2 gap-4"><div><label class="text-label-sm text-on-surface-variant block mb-1">Nominal SPP</label><input${ssrRenderAttr("value", unref(form).spp)} type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Biaya Bangunan</label><input${ssrRenderAttr("value", unref(form).building)} type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp"></div></div><div class="grid grid-cols-3 gap-4"><div><label class="text-label-sm text-on-surface-variant block mb-1">Biaya Buku</label><input${ssrRenderAttr("value", unref(form).books)} type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Biaya Kegiatan</label><input${ssrRenderAttr("value", unref(form).activities)} type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Biaya Seragam</label><input${ssrRenderAttr("value", unref(form).uniform)} type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp"></div></div><div class="bg-primary-fixed/20 rounded-lg p-4 flex items-center justify-between"><span class="text-label-md text-on-surface-variant">Total Keseluruhan</span><span class="font-display text-headline-md text-primary">Rp ${ssrInterpolate(formatNumber(unref(form).spp + unref(form).building + unref(form).books + unref(form).activities + unref(form).uniform))}</span></div></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Simpan</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showDeleteModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter"><div class="p-6 text-center"><div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-red-500 text-3xl">warning</span></div><h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Konfigurasi</h3><p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus konfigurasi berikut?</p><p class="font-bold text-on-surface text-body-md">${ssrInterpolate((_a = unref(deleteTarget)) == null ? void 0 : _a.level)} - ${ssrInterpolate((_b = unref(deleteTarget)) == null ? void 0 : _b.className)} (${ssrInterpolate((_c = unref(deleteTarget)) == null ? void 0 : _c.category)})</p></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Hapus</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/keuangan/spp-config.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=spp-config-BOGe4kY5.mjs.map
