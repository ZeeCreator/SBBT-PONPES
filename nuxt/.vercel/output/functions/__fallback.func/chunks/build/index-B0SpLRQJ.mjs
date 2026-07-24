import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("push");
    const filterPush = ref("");
    const filterBuku = ref("");
    const filterBukuStatus = ref("");
    const filterPengumuman = ref("");
    const showModal = ref(false);
    const modalType = ref("push");
    const modalTitle = ref("");
    const loading = ref(true);
    const errorS = ref("");
    const notifs = ref([]);
    const form = reactive({
      title: "",
      isi: "",
      santri: "",
      pesan: "",
      target: "Semua Wali",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      jenis: "Pengingat SPP"
    });
    const tabs = [
      { key: "push", label: "Notifikasi Push" },
      { key: "buku", label: "Buku Penghubung" },
      { key: "pengumuman", label: "Pengumuman & Siaran" }
    ];
    const pushNotif = computed(() => notifs.value.filter((n) => n.type === "push"));
    const bukuPenghubung = computed(() => notifs.value.filter((n) => n.type === "buku"));
    const pengumuman = computed(() => notifs.value.filter((n) => n.type === "pengumuman"));
    const stats = computed(() => {
      const push = pushNotif.value;
      return [
        { label: "Total Notifikasi Bulan Ini", icon: "notifications", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: notifs.value.length.toString() },
        { label: "Terkirim", icon: "check_circle", bg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", value: push.filter((i) => i.status === "terkirim").length.toString() },
        { label: "Gagal", icon: "error", bg: "bg-red-100", iconColor: "text-red-600", valueColor: "text-red-700", value: push.filter((i) => i.status === "gagal").length.toString() },
        { label: "Pending", icon: "hourglass", bg: "bg-amber-100", iconColor: "text-amber-600", valueColor: "text-amber-700", value: push.filter((i) => i.status === "pending").length.toString() }
      ];
    });
    const filteredPush = computed(() => pushNotif.value.filter((i) => !filterPush.value || i.title.toLowerCase().includes(filterPush.value.toLowerCase())));
    const filteredBuku = computed(() => bukuPenghubung.value.filter((i) => (!filterBuku.value || (i.santri || "").toLowerCase().includes(filterBuku.value.toLowerCase())) && (!filterBukuStatus.value || i.status === filterBukuStatus.value)));
    const filteredPengumuman = computed(() => pengumuman.value.filter((i) => !filterPengumuman.value || i.title.toLowerCase().includes(filterPengumuman.value.toLowerCase())));
    function jenisClass(jenis) {
      const map = { "Pengingat SPP": "bg-blue-100 text-blue-700", "Info Pelanggaran": "bg-red-100 text-red-700", "Pengumuman Libur": "bg-green-100 text-green-700" };
      return map[jenis] || "bg-surface-container text-on-surface-variant";
    }
    function statusClass(status) {
      const map = { "terkirim": "bg-green-100 text-green-700", "gagal": "bg-red-100 text-red-700", "pending": "bg-amber-100 text-amber-700" };
      return map[status] || "bg-surface-container text-on-surface-variant";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Notifikasi &amp; Pengumuman</h2><p class="text-on-surface-variant text-body-md">Kelola notifikasi push, buku penghubung, dan pengumuman siaran.</p></div>`);
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
        _push(`<!--]--></div><div class="flex gap-2 mb-stack-md border-b border-outline-variant/20"><!--[-->`);
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
        if (unref(activeTab) === "push") {
          _push(`<div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterPush))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari notifikasi..."></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Kirim Notifikasi </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Judul</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Jenis</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Target</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
          ssrRenderList(unref(filteredPush), (item) => {
            _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(item.title)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", jenisClass(item.jenis)])}">${ssrInterpolate(item.jenis)}</span></td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.target)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.date)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", statusClass(item.status)])}">${ssrInterpolate(item.status)}</span></td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
          });
          _push(`<!--]-->`);
          if (unref(filteredPush).length === 0) {
            _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</tbody></table></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "buku") {
          _push(`<div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterBuku))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari santri..."></div><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterBukuStatus)) ? ssrLooseContain(unref(filterBukuStatus), "") : ssrLooseEqual(unref(filterBukuStatus), "")) ? " selected" : ""}>Semua Status</option><option value="dibaca"${ssrIncludeBooleanAttr(Array.isArray(unref(filterBukuStatus)) ? ssrLooseContain(unref(filterBukuStatus), "dibaca") : ssrLooseEqual(unref(filterBukuStatus), "dibaca")) ? " selected" : ""}>Dibaca</option><option value="belum"${ssrIncludeBooleanAttr(Array.isArray(unref(filterBukuStatus)) ? ssrLooseContain(unref(filterBukuStatus), "belum") : ssrLooseEqual(unref(filterBukuStatus), "belum")) ? " selected" : ""}>Belum</option></select></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Kirim Pesan </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Pengirim</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Pesan</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
          ssrRenderList(unref(filteredBuku), (item) => {
            _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(item.santri)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.pengirim)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant max-w-[200px] truncate">${ssrInterpolate(item.pesan)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.date)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", item.status === "dibaca" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"])}">${ssrInterpolate(item.status)}</span></td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
          });
          _push(`<!--]-->`);
          if (unref(filteredBuku).length === 0) {
            _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</tbody></table></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "pengumuman") {
          _push(`<div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">search</span><input${ssrRenderAttr("value", unref(filterPengumuman))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari pengumuman..."></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Buat Pengumuman </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Judul</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Isi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Target</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
          ssrRenderList(unref(filteredPengumuman), (item) => {
            _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(item.title)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant max-w-[250px] truncate">${ssrInterpolate(item.isi)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(item.date)}</td><td class="px-4 py-3"><span class="px-2.5 py-0.5 text-[11px] bg-surface-container-low rounded-full">${ssrInterpolate(item.target)}</span></td><td class="px-4 py-3"><span class="${ssrRenderClass(["px-2.5 py-0.5 text-[11px] font-bold rounded-full", item.status === "terkirim" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"])}">${ssrInterpolate(item.status)}</span></td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
          });
          _push(`<!--]-->`);
          if (unref(filteredPengumuman).length === 0) {
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
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">${ssrInterpolate(unref(modalTitle))}</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Notifikasi Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Judul</label><input${ssrRenderAttr("value", unref(form).title)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div>`);
          if (unref(modalType) === "pengumuman") {
            _push2(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">Isi</label><textarea class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" rows="3" required>${ssrInterpolate(unref(form).isi)}</textarea></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(modalType) === "buku") {
            _push2(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">Santri</label><input${ssrRenderAttr("value", unref(form).santri)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(modalType) === "buku") {
            _push2(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">Pesan</label><textarea class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" rows="2" required>${ssrInterpolate(unref(form).pesan)}</textarea></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Target</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Semua Wali"${ssrIncludeBooleanAttr(Array.isArray(unref(form).target) ? ssrLooseContain(unref(form).target, "Semua Wali") : ssrLooseEqual(unref(form).target, "Semua Wali")) ? " selected" : ""}>Semua Wali</option><option value="Kelas 10"${ssrIncludeBooleanAttr(Array.isArray(unref(form).target) ? ssrLooseContain(unref(form).target, "Kelas 10") : ssrLooseEqual(unref(form).target, "Kelas 10")) ? " selected" : ""}>Kelas 10</option><option value="Kelas 11"${ssrIncludeBooleanAttr(Array.isArray(unref(form).target) ? ssrLooseContain(unref(form).target, "Kelas 11") : ssrLooseEqual(unref(form).target, "Kelas 11")) ? " selected" : ""}>Kelas 11</option><option value="Kelas 12"${ssrIncludeBooleanAttr(Array.isArray(unref(form).target) ? ssrLooseContain(unref(form).target, "Kelas 12") : ssrLooseEqual(unref(form).target, "Kelas 12")) ? " selected" : ""}>Kelas 12</option></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input type="date"${ssrRenderAttr("value", unref(form).date)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div></div>`);
          if (unref(modalType) === "push") {
            _push2(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jenis</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Pengingat SPP"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Pengingat SPP") : ssrLooseEqual(unref(form).jenis, "Pengingat SPP")) ? " selected" : ""}>Pengingat SPP</option><option value="Info Pelanggaran"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Info Pelanggaran") : ssrLooseEqual(unref(form).jenis, "Info Pelanggaran")) ? " selected" : ""}>Info Pelanggaran</option><option value="Pengumuman Libur"${ssrIncludeBooleanAttr(Array.isArray(unref(form).jenis) ? ssrLooseContain(unref(form).jenis, "Pengumuman Libur") : ssrLooseEqual(unref(form).jenis, "Pengumuman Libur")) ? " selected" : ""}>Pengumuman Libur</option></select></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Kirim</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/notifikasi/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B0SpLRQJ.mjs.map
