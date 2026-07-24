import { defineComponent, ref, computed, watch, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport } from 'vue/server-renderer';
import { a as useAuth } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'firebase-admin/app';
import 'firebase-admin/auth';
import 'firebase-admin/database';
import 'jose';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'firebase/auth';
import 'firebase/database';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "salaries",
  __ssrInlineRender: true,
  setup(__props) {
    const teachers = ref([]);
    useAuth();
    const months = [
      { value: "Januari 2026", label: "Januari 2026" },
      { value: "Februari 2026", label: "Februari 2026" },
      { value: "Maret 2026", label: "Maret 2026" },
      { value: "April 2026", label: "April 2026" },
      { value: "Mei 2026", label: "Mei 2026" },
      { value: "Juni 2026", label: "Juni 2026" },
      { value: "Juli 2026", label: "Juli 2026" }
    ];
    const filterMonth = ref("Juli 2026");
    const loading = ref(true);
    const errorS = ref("");
    const salaries = ref([]);
    const stats = computed(() => {
      const current = salaries.value.filter((s) => s.month === filterMonth.value);
      const totalPayroll = current.reduce((a, b) => a + b.baseSalary + b.allowance - b.deduction, 0);
      return [
        { label: "Total Payroll", icon: "payments", iconColor: "text-primary", valueColor: "text-primary", value: `Rp ${formatNumber(totalPayroll)}` },
        { label: "Jumlah Pegawai", icon: "badge", iconColor: "text-secondary", valueColor: "text-secondary", value: current.length },
        { label: "Rata-rata Gaji", icon: "bar_chart", iconColor: "text-primary-container", valueColor: "text-on-background", value: current.length > 0 ? `Rp ${formatNumber(Math.round(totalPayroll / current.length))}` : "Rp 0" },
        { label: "Total Potongan", icon: "money_off", iconColor: "text-error", valueColor: "text-error", value: `Rp ${formatNumber(current.reduce((a, b) => a + b.deduction, 0))}` }
      ];
    });
    const filteredSalaries = computed(
      () => salaries.value.filter((s) => s.month === filterMonth.value)
    );
    function formatNumber(n) {
      return n.toLocaleString("id-ID");
    }
    async function fetchData() {
      loading.value = true;
      errorS.value = "";
      try {
        const params = filterMonth.value ? `?month=${encodeURIComponent(filterMonth.value)}` : "";
        salaries.value = await $fetch(`/api/keuangan/salaries${params}`) || [];
      } catch (e) {
        errorS.value = e.message || "Gagal memuat data";
      } finally {
        loading.value = false;
      }
    }
    watch(filterMonth, () => fetchData());
    const showModal = ref(false);
    const isEditing = ref(false);
    const showDeleteModal = ref(false);
    const deleteTarget = ref(null);
    const defaultForm = () => ({
      id: 0,
      name: "",
      initials: "",
      position: "Guru",
      baseSalary: 0,
      allowance: 0,
      deduction: 0,
      month: filterMonth.value,
      guruId: null
    });
    const form = reactive(defaultForm());
    watch(() => form.name, (val) => {
      const found = teachers.value.find((t) => t.name === val);
      form.guruId = found ? found.id : null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "bg-mesh min-h-screen",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="px-gutter max-w-container-max mx-auto"><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary mb-2">Syahriyah / Honor Guru</h2><p class="text-on-surface-variant text-body-md">Kelola penggajian bulanan guru, musyrif, dan staf.</p></div>`);
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
        _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><h3 class="font-display text-title-lg text-primary">Daftar Penggajian</h3><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Bulan:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><!--[-->`);
        ssrRenderList(months, (m) => {
          _push(`<option${ssrRenderAttr("value", m.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterMonth)) ? ssrLooseContain(unref(filterMonth), m.value) : ssrLooseEqual(unref(filterMonth), m.value)) ? " selected" : ""}>${ssrInterpolate(m.label)}</option>`);
        });
        _push(`<!--]--></select></div></div><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Tambah Gaji </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Nama</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Jabatan</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Gaji Pokok</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Tunjangan</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Potongan</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Total Diterima</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Bulan</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(filteredSalaries), (item) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center text-label-md font-bold">${ssrInterpolate(item.initials)}</div><span class="text-label-md text-on-surface font-medium">${ssrInterpolate(item.name)}</span></div></td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(item.position)}</td><td class="px-6 py-4 text-label-md text-on-surface">Rp ${ssrInterpolate(formatNumber(item.baseSalary))}</td><td class="px-6 py-4 text-label-md text-green-600">+ Rp ${ssrInterpolate(formatNumber(item.allowance))}</td><td class="px-6 py-4 text-label-md text-red-500">- Rp ${ssrInterpolate(formatNumber(item.deduction))}</td><td class="px-6 py-4 font-display text-headline-sm text-primary">Rp ${ssrInterpolate(formatNumber(item.baseSalary + item.allowance - item.deduction))}</td><td class="px-6 py-4"><span class="bg-surface-container-low px-2 py-1 rounded text-label-sm text-on-surface-variant">${ssrInterpolate(item.month)}</span></td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button><button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredSalaries).length === 0) {
          _push(`<tr><td colspan="8" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data penggajian untuk bulan ini.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        var _a, _b;
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter"><div class="p-6 border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(unref(isEditing) ? "Edit Gaji" : "Tambah Gaji")}</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-6 space-y-4"><div class="grid grid-cols-2 gap-4"><div><label class="text-label-sm text-on-surface-variant block mb-1">Nama Pegawai</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).name) ? ssrLooseContain(unref(form).name, "") : ssrLooseEqual(unref(form).name, "")) ? " selected" : ""}>-- Pilih Pegawai --</option><!--[-->`);
          ssrRenderList(unref(teachers), (t) => {
            _push2(`<option${ssrRenderAttr("value", t.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).name) ? ssrLooseContain(unref(form).name, t.name) : ssrLooseEqual(unref(form).name, t.name)) ? " selected" : ""}>${ssrInterpolate(t.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Jabatan</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value="Guru"${ssrIncludeBooleanAttr(Array.isArray(unref(form).position) ? ssrLooseContain(unref(form).position, "Guru") : ssrLooseEqual(unref(form).position, "Guru")) ? " selected" : ""}>Guru</option><option value="Musyrif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).position) ? ssrLooseContain(unref(form).position, "Musyrif") : ssrLooseEqual(unref(form).position, "Musyrif")) ? " selected" : ""}>Musyrif</option><option value="Staf"${ssrIncludeBooleanAttr(Array.isArray(unref(form).position) ? ssrLooseContain(unref(form).position, "Staf") : ssrLooseEqual(unref(form).position, "Staf")) ? " selected" : ""}>Staf</option><option value="Kepala Sekolah"${ssrIncludeBooleanAttr(Array.isArray(unref(form).position) ? ssrLooseContain(unref(form).position, "Kepala Sekolah") : ssrLooseEqual(unref(form).position, "Kepala Sekolah")) ? " selected" : ""}>Kepala Sekolah</option><option value="Wakil Kepala"${ssrIncludeBooleanAttr(Array.isArray(unref(form).position) ? ssrLooseContain(unref(form).position, "Wakil Kepala") : ssrLooseEqual(unref(form).position, "Wakil Kepala")) ? " selected" : ""}>Wakil Kepala</option></select></div></div><div class="grid grid-cols-2 gap-4"><div><label class="text-label-sm text-on-surface-variant block mb-1">Gaji Pokok</label><input${ssrRenderAttr("value", unref(form).baseSalary)} type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Tunjangan</label><input${ssrRenderAttr("value", unref(form).allowance)} type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp"></div></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Potongan (Pinjaman, dll)</label><input${ssrRenderAttr("value", unref(form).deduction)} type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Periode Bulan</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><!--[-->`);
          ssrRenderList(months, (m) => {
            _push2(`<option${ssrRenderAttr("value", m.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).month) ? ssrLooseContain(unref(form).month, m.value) : ssrLooseEqual(unref(form).month, m.value)) ? " selected" : ""}>${ssrInterpolate(m.label)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="bg-primary-fixed/20 rounded-lg p-4 flex items-center justify-between"><span class="text-label-md text-on-surface-variant">Total Diterima</span><span class="font-display text-headline-md text-primary">Rp ${ssrInterpolate(formatNumber(unref(form).baseSalary + unref(form).allowance - unref(form).deduction))}</span></div></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Simpan</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showDeleteModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter"><div class="p-6 text-center"><div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-red-500 text-3xl">warning</span></div><h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Data Gaji</h3><p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus data gaji berikut?</p><p class="font-bold text-on-surface text-body-md">${ssrInterpolate((_a = unref(deleteTarget)) == null ? void 0 : _a.name)} - ${ssrInterpolate((_b = unref(deleteTarget)) == null ? void 0 : _b.month)}</p></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Hapus</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/keuangan/salaries.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=salaries-BG99ANXg.mjs.map
