import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderTeleport } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "zakat",
  __ssrInlineRender: true,
  setup(__props) {
    ref(true);
    ref("");
    const filterJenis = ref("");
    const filterSearch = ref("");
    const showAddModal = ref(false);
    const mustahiqList = ["Fakir", "Miskin", "Amil", "Muallaf", "Riqab", "Gharimin", "Fisabilillah", "Ibnu Sabil"];
    const form = reactive({
      name: "",
      jenis: "Zakat Fitrah",
      amount: 0,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      mustahiq: ""
    });
    const items = ref([]);
    const totalFitrah = computed(() => {
      return items.value.filter((r) => r.jenis === "Zakat Fitrah").reduce((sum, r) => sum + Number(r.amount), 0);
    });
    const totalMal = computed(() => {
      return items.value.filter((r) => r.jenis === "Zakat Mal").reduce((sum, r) => sum + Number(r.amount), 0);
    });
    const uniqueMuzakki = computed(() => {
      return new Set(items.value.map((r) => r.name)).size;
    });
    const stats = computed(() => [
      { label: "Total Zakat Fitrah", icon: "rice_bowl", bg: "bg-teal-100", iconColor: "text-teal-600", valueColor: "text-teal-700", value: `${totalFitrah.value} Kg` },
      { label: "Total Zakat Mal", icon: "account_balance_wallet", bg: "bg-purple-100", iconColor: "text-purple-600", valueColor: "text-purple-700", value: `Rp ${totalMal.value.toLocaleString()}` },
      { label: "Total Muzakki", icon: "groups", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: uniqueMuzakki.value.toString() },
      { label: "Total Transaksi", icon: "receipt_long", bg: "bg-amber-100", iconColor: "text-amber-600", valueColor: "text-amber-700", value: items.value.length.toString() }
    ]);
    const filteredRecords = computed(() => {
      return items.value.filter((r) => {
        const matchJenis = !filterJenis.value || r.jenis === filterJenis.value;
        const matchSearch = !filterSearch.value || r.name.toLowerCase().includes(filterSearch.value.toLowerCase());
        return matchJenis && matchSearch;
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Setoran Zakat</h2><p class="text-on-surface-variant text-body-md">Pencatatan zakat fitrah &amp; zakat mal.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm text-center"><div class="${ssrRenderClass([stat.bg, "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"])}"><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(stat.label)}</p></div>`);
      });
      _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">filter_alt</span><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterJenis)) ? ssrLooseContain(unref(filterJenis), "") : ssrLooseEqual(unref(filterJenis), "")) ? " selected" : ""}>Semua Jenis</option><option value="Zakat Fitrah"${ssrIncludeBooleanAttr(Array.isArray(unref(filterJenis)) ? ssrLooseContain(unref(filterJenis), "Zakat Fitrah") : ssrLooseEqual(unref(filterJenis), "Zakat Fitrah")) ? " selected" : ""}>Zakat Fitrah</option><option value="Zakat Mal"${ssrIncludeBooleanAttr(Array.isArray(unref(filterJenis)) ? ssrLooseContain(unref(filterJenis), "Zakat Mal") : ssrLooseEqual(unref(filterJenis), "Zakat Mal")) ? " selected" : ""}>Zakat Mal</option></select></div><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterSearch))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari..."></div></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Catat Zakat </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama Muzakki</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Jenis Zakat</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Jumlah</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Mustahiq</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
      ssrRenderList(unref(filteredRecords), (record) => {
        _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(record.name)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2 py-0.5 rounded text-[11px] font-bold", record.jenis === "Zakat Fitrah" ? "bg-teal-100 text-teal-700" : "bg-purple-100 text-purple-700"])}">${ssrInterpolate(record.jenis)}</span></td><td class="px-4 py-3 text-label-md font-bold text-primary">`);
        if (record.jenis === "Zakat Fitrah") {
          _push(`<!--[-->${ssrInterpolate(record.amount)} Kg<!--]-->`);
        } else {
          _push(`<!--[-->Rp ${ssrInterpolate(record.amount.toLocaleString())}<!--]-->`);
        }
        _push(`</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(record.date)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(record.mustahiq || "-")}</td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
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
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">Catat Zakat</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Ibadah Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Muzakki</label><input${ssrRenderAttr("value", unref(form).name)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Nama" required></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jenis Zakat</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Zakat Fitrah"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Zakat Fitrah") : ssrLooseEqual(unref(form).jenis, "Zakat Fitrah")) ? " selected" : ""}>Zakat Fitrah</option><option value="Zakat Mal"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Zakat Mal") : ssrLooseEqual(unref(form).jenis, "Zakat Mal")) ? " selected" : ""}>Zakat Mal</option></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">${ssrInterpolate(unref(form).jenis === "Zakat Fitrah" ? "Jumlah (Kg)" : "Jumlah (Rp)")}</label><input type="number"${ssrRenderAttr("value", unref(form).amount)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="0" min="0" required></div></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input type="date"${ssrRenderAttr("value", unref(form).date)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Mustahiq</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).mustahiq) ? ssrLooseContain(unref(form).mustahiq, "") : ssrLooseEqual(unref(form).mustahiq, "")) ? " selected" : ""}>Pilih Mustahiq</option><!--[-->`);
          ssrRenderList(mustahiqList, (m) => {
            _push2(`<option${ssrRenderAttr("value", m)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).mustahiq) ? ssrLooseContain(unref(form).mustahiq, m) : ssrLooseEqual(unref(form).mustahiq, m)) ? " selected" : ""}>${ssrInterpolate(m)}</option>`);
          });
          _push2(`<!--]--></select></div></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ibadah/zakat.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=zakat-CaTraaoj.mjs.map
