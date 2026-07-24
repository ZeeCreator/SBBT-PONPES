import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("kamar");
    const filterKamar = ref("");
    const filterSekolah = ref("");
    const filterPinjam = ref("");
    const filterPinjamStatus = ref("");
    const showModal = ref(false);
    const modalType = ref("barang");
    const modalTitle = ref("");
    const loading = ref(true);
    const errorS = ref("");
    const form = reactive({
      barang: "",
      jumlah: 0,
      kondisi: "Baik",
      lokasi: "",
      peminjam: "",
      barangPinjam: "",
      tglPinjam: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      tglKembali: ""
    });
    const tabs = [
      { key: "kamar", label: "Inventaris Kamar" },
      { key: "sekolah", label: "Inventaris Sekolah" },
      { key: "peminjaman", label: "Peminjaman" }
    ];
    const inventarisKamar = ref([]);
    const barangSekolah = ref([]);
    const peminjaman = ref([]);
    const stats = computed(() => {
      const totalBarang = barangSekolah.value.reduce((s, b) => s + b.jumlah, 0);
      const dipinjam = peminjaman.value.filter((p) => p.status === "Dipinjam").length;
      const tersedia = barangSekolah.value.filter((b) => b.status === "Tersedia").length;
      const rusak = barangSekolah.value.filter((b) => b.status === "Rusak").length;
      return [
        { label: "Total Barang", icon: "inventory", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: totalBarang.toString() },
        { label: "Dipinjam", icon: "assignment", bg: "bg-blue-100", iconColor: "text-blue-600", valueColor: "text-blue-700", value: dipinjam.toString() },
        { label: "Tersedia", icon: "check_circle", bg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", value: tersedia.toString() },
        { label: "Rusak", icon: "warning", bg: "bg-red-100", iconColor: "text-red-600", valueColor: "text-red-700", value: rusak.toString() }
      ];
    });
    const filteredKamar = computed(() => inventarisKamar.value.filter((k) => !filterKamar.value || k.kamar.toLowerCase().includes(filterKamar.value.toLowerCase())));
    const filteredSekolah = computed(() => barangSekolah.value.filter((b) => !filterSekolah.value || b.barang.toLowerCase().includes(filterSekolah.value.toLowerCase())));
    const filteredPinjam = computed(() => peminjaman.value.filter((p) => (!filterPinjam.value || p.peminjam.toLowerCase().includes(filterPinjam.value.toLowerCase())) && (!filterPinjamStatus.value || p.status === filterPinjamStatus.value)));
    function kondisiClass(kondisi) {
      const map = { "Baik": "bg-green-100 text-green-700", "Rusak Ringan": "bg-amber-100 text-amber-700", "Rusak Berat": "bg-red-100 text-red-700" };
      return map[kondisi] || "bg-surface-container text-on-surface-variant";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Inventaris Asrama &amp; Barang</h2><p class="text-on-surface-variant text-body-md">Kelola inventaris kamar, barang sekolah, dan peminjaman.</p></div>`);
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
          _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm text-center"><div class="${ssrRenderClass([stat.bg, "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"])}"><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(stat.label)}</p></div>`);
        });
        _push(`<!--]--></div><div class="flex flex-wrap gap-2 mb-stack-md border-b border-outline-variant/20"><!--[-->`);
        ssrRenderList(tabs, (tab) => {
          _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.key ? "text-primary" : "text-on-surface-variant hover:text-on-surface", "px-5 py-3 text-label-md font-medium transition-colors relative"])}">${ssrInterpolate(tab.label)} `);
          if (unref(activeTab) === tab.key) {
            _push(`<span class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div>`);
        if (unref(activeTab) === "kamar") {
          _push(`<div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterKamar))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari kamar..."></div></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Kamar</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Kasur</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Lemari</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Meja</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Kursi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
          ssrRenderList(unref(filteredKamar), (item) => {
            _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(item.kamar)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.kasur)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.lemari)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.meja)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.kursi)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", item.status === "Baik" ? "bg-green-100 text-green-700" : item.status === "Rusak" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"])}">${ssrInterpolate(item.status)}</span></td></tr>`);
          });
          _push(`<!--]-->`);
          if (unref(filteredKamar).length === 0) {
            _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</tbody></table></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "sekolah") {
          _push(`<div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterSekolah))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari barang..."></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Tambah Barang </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Barang</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Jumlah</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Kondisi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Lokasi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
          ssrRenderList(unref(filteredSekolah), (item) => {
            _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(item.barang)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.jumlah)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", kondisiClass(item.kondisi)])}">${ssrInterpolate(item.kondisi)}</span></td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.lokasi)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", item.status === "Tersedia" ? "bg-green-100 text-green-700" : item.status === "Dipinjam" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"])}">${ssrInterpolate(item.status)}</span></td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
          });
          _push(`<!--]-->`);
          if (unref(filteredSekolah).length === 0) {
            _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</tbody></table></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "peminjaman") {
          _push(`<div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterPinjam))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari peminjam..."></div><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterPinjamStatus)) ? ssrLooseContain(unref(filterPinjamStatus), "") : ssrLooseEqual(unref(filterPinjamStatus), "")) ? " selected" : ""}>Semua Status</option><option value="Dipinjam"${ssrIncludeBooleanAttr(Array.isArray(unref(filterPinjamStatus)) ? ssrLooseContain(unref(filterPinjamStatus), "Dipinjam") : ssrLooseEqual(unref(filterPinjamStatus), "Dipinjam")) ? " selected" : ""}>Dipinjam</option><option value="Dikembalikan"${ssrIncludeBooleanAttr(Array.isArray(unref(filterPinjamStatus)) ? ssrLooseContain(unref(filterPinjamStatus), "Dikembalikan") : ssrLooseEqual(unref(filterPinjamStatus), "Dikembalikan")) ? " selected" : ""}>Dikembalikan</option></select></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Catat Peminjaman </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Peminjam</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Barang</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal Pinjam</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal Kembali</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
          ssrRenderList(unref(filteredPinjam), (item) => {
            _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(item.peminjam)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.barang)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.tglPinjam)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.tglKembali || "-")}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", item.status === "Dipinjam" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"])}">${ssrInterpolate(item.status)}</span></td><td class="px-4 py-3 text-center">`);
            if (item.status === "Dipinjam") {
              _push(`<button class="text-primary hover:text-primary-fixed-dim mr-2 transition-colors"><span class="material-symbols-outlined">assignment_return</span></button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
          });
          _push(`<!--]-->`);
          if (unref(filteredPinjam).length === 0) {
            _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</tbody></table></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">${ssrInterpolate(unref(modalTitle))}</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Inventaris Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md">`);
          if (unref(modalType) === "barang") {
            _push2(`<div><div class="space-y-1 mb-stack-md"><label class="text-label-md text-on-surface-variant">Nama Barang</label><input${ssrRenderAttr("value", unref(form).barang)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jumlah</label><input type="number"${ssrRenderAttr("value", unref(form).jumlah)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" min="0" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Kondisi</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Baik"${ssrIncludeBooleanAttr(Array.isArray(unref(form).kondisi) ? ssrLooseContain(unref(form).kondisi, "Baik") : ssrLooseEqual(unref(form).kondisi, "Baik")) ? " selected" : ""}>Baik</option><option value="Rusak Ringan"${ssrIncludeBooleanAttr(Array.isArray(unref(form).kondisi) ? ssrLooseContain(unref(form).kondisi, "Rusak Ringan") : ssrLooseEqual(unref(form).kondisi, "Rusak Ringan")) ? " selected" : ""}>Rusak Ringan</option><option value="Rusak Berat"${ssrIncludeBooleanAttr(Array.isArray(unref(form).kondisi) ? ssrLooseContain(unref(form).kondisi, "Rusak Berat") : ssrLooseEqual(unref(form).kondisi, "Rusak Berat")) ? " selected" : ""}>Rusak Berat</option></select></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Lokasi</label><input${ssrRenderAttr("value", unref(form).lokasi)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Contoh: Aula, Kelas 10A" required></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(modalType) === "pinjam") {
            _push2(`<div><div class="space-y-1 mb-stack-md"><label class="text-label-md text-on-surface-variant">Nama Peminjam</label><input${ssrRenderAttr("value", unref(form).peminjam)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div><div class="space-y-1 mb-stack-md"><label class="text-label-md text-on-surface-variant">Barang</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><!--[-->`);
            ssrRenderList(unref(barangSekolah).filter((x) => x.status === "Tersedia"), (b) => {
              _push2(`<option${ssrRenderAttr("value", b.barang)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).barangPinjam) ? ssrLooseContain(unref(form).barangPinjam, b.barang) : ssrLooseEqual(unref(form).barangPinjam, b.barang)) ? " selected" : ""}>${ssrInterpolate(b.barang)} (${ssrInterpolate(b.jumlah)})</option>`);
            });
            _push2(`<!--]--></select></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal Pinjam</label><input type="date"${ssrRenderAttr("value", unref(form).tglPinjam)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal Kembali</label><input type="date"${ssrRenderAttr("value", unref(form).tglKembali)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/inventaris/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D_Uxths-.mjs.map
