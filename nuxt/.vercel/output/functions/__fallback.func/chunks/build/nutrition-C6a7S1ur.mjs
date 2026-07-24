import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderTeleport } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "nutrition",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const filterKategori = ref("");
    const filterDate = ref((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const showAddModal = ref(false);
    ref(null);
    const kategoriOptions = ["Sarapan", "Makan Siang", "Makan Malam", "Snack"];
    const form = reactive({
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      menu: "",
      kategori: "Sarapan",
      calories: 0,
      notes: ""
    });
    const items = ref([]);
    const stats = computed(() => {
      const len = items.value.length;
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString().split("T")[0];
      const avgCal = len ? items.value.reduce((acc, r) => acc + (Number(r.calories) || 0), 0) / len : 0;
      return [
        { label: "Total Menu", icon: "restaurant_menu", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: len },
        { label: "Rata-rata Kalori", icon: "local_fire_department", bg: "bg-orange-100", iconColor: "text-orange-600", valueColor: "text-orange-700", value: Math.round(avgCal) + " kkal" },
        { label: "Menu Hari Ini", icon: "today", bg: "bg-blue-100", iconColor: "text-blue-600", valueColor: "text-blue-700", value: items.value.filter((r) => r.date === today).length },
        { label: "Minggu Ini", icon: "calendar_view_week", bg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", value: items.value.filter((r) => r.date >= weekAgo && r.date <= today).length }
      ];
    });
    const filteredRecords = computed(() => {
      return items.value.filter((r) => {
        const matchKategori = !filterKategori.value || r.kategori === filterKategori.value;
        return matchKategori;
      });
    });
    function kategoriBadge(kategori) {
      switch (kategori) {
        case "Sarapan":
          return "bg-amber-100 text-amber-700";
        case "Makan Siang":
          return "bg-blue-100 text-blue-700";
        case "Makan Malam":
          return "bg-indigo-100 text-indigo-700";
        case "Snack":
          return "bg-pink-100 text-pink-700";
        default:
          return "bg-surface-container text-on-surface-variant";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}>`);
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary">sync</span><span class="ml-2 text-on-surface-variant">Memuat data...</span></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-error-container text-on-error-container p-stack-md rounded-xl mb-stack-lg">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!--[--><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Gizi &amp; Menu Makanan</h2><p class="text-on-surface-variant text-body-md">Perencanaan menu harian/mingguan dan monitoring kalori santri.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
        ssrRenderList(unref(stats), (stat) => {
          _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm text-center"><div class="${ssrRenderClass([stat.bg, "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"])}"><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(stat.label)}</p></div>`);
        });
        _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">filter_alt</span><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterKategori)) ? ssrLooseContain(unref(filterKategori), "") : ssrLooseEqual(unref(filterKategori), "")) ? " selected" : ""}>Semua Kategori</option><!--[-->`);
        ssrRenderList(kategoriOptions, (k) => {
          _push(`<option${ssrRenderAttr("value", k)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterKategori)) ? ssrLooseContain(unref(filterKategori), k) : ssrLooseEqual(unref(filterKategori), k)) ? " selected" : ""}>${ssrInterpolate(k)}</option>`);
        });
        _push(`<!--]--></select></div><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">calendar_today</span><input type="date"${ssrRenderAttr("value", unref(filterDate))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"></div></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Tambah Menu </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Menu</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Kategori</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Kalori</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Keterangan</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(filteredRecords), (record) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(record.date)}</td><td class="px-4 py-3 text-label-sm">${ssrInterpolate(record.menu)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2 py-0.5 rounded text-[11px] font-bold", kategoriBadge(record.kategori)])}">${ssrInterpolate(record.kategori)}</span></td><td class="px-4 py-3 text-label-sm">${ssrInterpolate(record.calories)} kkal</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(record.notes)}</td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredRecords).length === 0) {
          _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div>`);
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(showAddModal)) {
            _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">Tambah Menu</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Kesehatan Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input type="date"${ssrRenderAttr("value", unref(form).date)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Menu Makanan</label><input${ssrRenderAttr("value", unref(form).menu)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Nama menu" required></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Kategori</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><!--[-->`);
            ssrRenderList(kategoriOptions, (k) => {
              _push2(`<option${ssrRenderAttr("value", k)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).kategori) ? ssrLooseContain(unref(form).kategori, k) : ssrLooseEqual(unref(form).kategori, k)) ? " selected" : ""}>${ssrInterpolate(k)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Kalori (kkal)</label><input type="number"${ssrRenderAttr("value", unref(form).calories)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="500" required></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Keterangan</label><input${ssrRenderAttr("value", unref(form).notes)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Catatan tambahan"></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kesehatan/nutrition.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=nutrition-C6a7S1ur.mjs.map
