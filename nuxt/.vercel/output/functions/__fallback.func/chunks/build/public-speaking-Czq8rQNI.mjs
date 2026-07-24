import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderStyle, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
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
  __name: "public-speaking",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const items = ref([]);
    const showModal = ref(false);
    const editingId = ref(null);
    const filterBahasa = ref("");
    const filterStatus = ref("");
    const students = ref([]);
    const teachers = ref([]);
    useAuth();
    const form = reactive({ santri: "", bahasa: "Arab", tanggal: "", nilai: 75, mentor: "", status: "Dalam Latihan", studentId: "", guruId: "" });
    const filteredItems = computed(() => items.value.filter((s) => {
      if (filterBahasa.value && s.bahasa !== filterBahasa.value) return false;
      if (filterStatus.value && s.status !== filterStatus.value) return false;
      return true;
    }));
    const stats = computed(() => {
      const total = items.value.length;
      const lulus = items.value.filter((s) => s.status === "Lulus").length;
      const rataNilai = total ? Math.round(items.value.reduce((sum, s) => sum + (Number(s.nilai) || 0), 0) / total) : 0;
      const mentorSet = new Set(items.value.map((s) => s.mentor));
      return [
        { label: "Total Peserta", icon: "record_voice_over", iconColor: "text-primary", valueColor: "text-primary", value: String(total), subtext: `${lulus} lulus` },
        { label: "Sesi Bulan Ini", icon: "event", iconColor: "text-secondary", valueColor: "text-secondary", value: String(total), subtext: "Total sesi" },
        { label: "Rata-rata Nilai", icon: "trending_up", iconColor: "text-primary-container", valueColor: "text-on-background", value: String(rataNilai), subtext: "3 bahasa" },
        { label: "Mentor", icon: "coach", iconColor: "text-tertiary", valueColor: "text-on-background", value: String(mentorSet.size), subtext: "Pembimbing" }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Pidato &amp; Muhadhoroh</h2><p class="text-on-surface-variant text-body-md">Kelola latihan pidato 3 bahasa (Arab, Inggris, Indonesia) dan muhadhoroh.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm"><div class="flex items-center justify-between mb-2"><span class="text-on-surface-variant text-label-md">${ssrInterpolate(stat.label)}</span><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-[11px] text-on-surface-variant mt-1">${ssrInterpolate(stat.subtext)}</p></div>`);
      });
      _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Bahasa:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterBahasa)) ? ssrLooseContain(unref(filterBahasa), "") : ssrLooseEqual(unref(filterBahasa), "")) ? " selected" : ""}>Semua</option><option value="Arab"${ssrIncludeBooleanAttr(Array.isArray(unref(filterBahasa)) ? ssrLooseContain(unref(filterBahasa), "Arab") : ssrLooseEqual(unref(filterBahasa), "Arab")) ? " selected" : ""}>Arab</option><option value="Inggris"${ssrIncludeBooleanAttr(Array.isArray(unref(filterBahasa)) ? ssrLooseContain(unref(filterBahasa), "Inggris") : ssrLooseEqual(unref(filterBahasa), "Inggris")) ? " selected" : ""}>Inggris</option><option value="Indonesia"${ssrIncludeBooleanAttr(Array.isArray(unref(filterBahasa)) ? ssrLooseContain(unref(filterBahasa), "Indonesia") : ssrLooseEqual(unref(filterBahasa), "Indonesia")) ? " selected" : ""}>Indonesia</option></select></div><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Status:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "") : ssrLooseEqual(unref(filterStatus), "")) ? " selected" : ""}>Semua</option><option value="Lulus"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Lulus") : ssrLooseEqual(unref(filterStatus), "Lulus")) ? " selected" : ""}>Lulus</option><option value="Dalam Latihan"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Dalam Latihan") : ssrLooseEqual(unref(filterStatus), "Dalam Latihan")) ? " selected" : ""}>Dalam Latihan</option><option value="Belum"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Belum") : ssrLooseEqual(unref(filterStatus), "Belum")) ? " selected" : ""}>Belum</option></select></div></div><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Tambah Latihan </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Santri</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Bahasa</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Nilai</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Mentor</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th><th class="px-6 py-4 text-label-md text-on-surface-variant"></th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
      ssrRenderList(unref(filteredItems), (s) => {
        _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4 text-label-md font-medium text-on-surface">${ssrInterpolate(s.santri)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-2 py-1 rounded text-label-sm font-bold", s.bahasa === "Arab" ? "bg-green-100 text-green-700" : s.bahasa === "Inggris" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"])}">${ssrInterpolate(s.bahasa)}</span></td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(s.tanggal)}</td><td class="px-6 py-4"><div class="flex items-center gap-2"><div class="flex-1 h-1.5 w-16 bg-surface-container-highest rounded-full overflow-hidden"><div class="h-full rounded-full bg-primary-container" style="${ssrRenderStyle({ width: s.nilai + "%" })}"></div></div><span class="${ssrRenderClass([s.nilai >= 85 ? "text-primary" : s.nilai >= 70 ? "text-secondary" : "text-error", "text-label-sm font-bold"])}">${ssrInterpolate(s.nilai)}</span></div></td><td class="px-6 py-4 text-label-md">${ssrInterpolate(s.mentor)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", s.status === "Lulus" ? "bg-primary-fixed text-on-primary-fixed" : s.status === "Dalam Latihan" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-surface-container text-on-surface-variant"])}">${ssrInterpolate(s.status)}</span></td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined">edit</span></button><button class="text-on-surface-variant hover:text-error transition-colors"><span class="material-symbols-outlined">delete</span></button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(filteredItems).length === 0) {
        _push(`<tr><td colspan="7" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Tidak ada sesi ditemukan</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div><div class="p-4 border-t border-outline-variant/20 flex items-center justify-between"><span class="text-on-surface-variant text-label-md">Menampilkan ${ssrInterpolate(unref(filteredItems).length)} dari ${ssrInterpolate(unref(items).length)} sesi</span><div class="flex gap-2"><button class="p-2 border border-outline-variant/30 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"><span class="material-symbols-outlined">chevron_left</span></button><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md">1</button><button class="p-2 border border-outline-variant/30 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"><span class="material-symbols-outlined">chevron_right</span></button></div></div></div>`);
      if (unref(loading)) {
        _push(`<div class="flex justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(error)) {
        _push(`<div class="mt-4 p-4 bg-error-container text-on-error-container rounded-lg text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">${ssrInterpolate(unref(editingId) ? "Edit Sesi Latihan" : "Tambah Sesi Latihan")}</h2><p class="text-[11px] text-on-primary/80 uppercase tracking-widest">Ekstrakurikuler \u2022 Pidato &amp; Muhadhoroh</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, "") : ssrLooseEqual(unref(form).santri, "")) ? " selected" : ""}>Pilih Santri</option><!--[-->`);
          ssrRenderList(unref(students), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.nama)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).santri) ? ssrLooseContain(unref(form).santri, s.nama) : ssrLooseEqual(unref(form).santri, s.nama)) ? " selected" : ""}>${ssrInterpolate(s.nama)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Bahasa</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Arab"${ssrIncludeBooleanAttr(Array.isArray(unref(form).bahasa) ? ssrLooseContain(unref(form).bahasa, "Arab") : ssrLooseEqual(unref(form).bahasa, "Arab")) ? " selected" : ""}>Arab</option><option value="Inggris"${ssrIncludeBooleanAttr(Array.isArray(unref(form).bahasa) ? ssrLooseContain(unref(form).bahasa, "Inggris") : ssrLooseEqual(unref(form).bahasa, "Inggris")) ? " selected" : ""}>Inggris</option><option value="Indonesia"${ssrIncludeBooleanAttr(Array.isArray(unref(form).bahasa) ? ssrLooseContain(unref(form).bahasa, "Indonesia") : ssrLooseEqual(unref(form).bahasa, "Indonesia")) ? " selected" : ""}>Indonesia</option></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" type="date"${ssrRenderAttr("value", unref(form).tanggal)} required></div></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nilai (0-100)</label><input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" type="number" min="0" max="100"${ssrRenderAttr("value", unref(form).nilai)} required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Mentor</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).mentor) ? ssrLooseContain(unref(form).mentor, "") : ssrLooseEqual(unref(form).mentor, "")) ? " selected" : ""}>Pilih Mentor</option><!--[-->`);
          ssrRenderList(unref(teachers), (t) => {
            _push2(`<option${ssrRenderAttr("value", t.nama)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).mentor) ? ssrLooseContain(unref(form).mentor, t.nama) : ssrLooseEqual(unref(form).mentor, t.nama)) ? " selected" : ""}>${ssrInterpolate(t.nama)}</option>`);
          });
          _push2(`<!--]--></select></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Status</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Lulus"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Lulus") : ssrLooseEqual(unref(form).status, "Lulus")) ? " selected" : ""}>Lulus</option><option value="Dalam Latihan"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Dalam Latihan") : ssrLooseEqual(unref(form).status, "Dalam Latihan")) ? " selected" : ""}>Dalam Latihan</option><option value="Belum"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Belum") : ssrLooseEqual(unref(form).status, "Belum")) ? " selected" : ""}>Belum</option></select></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/extracurricular/public-speaking.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=public-speaking-Czq8rQNI.mjs.map
