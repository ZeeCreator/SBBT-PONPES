import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport } from 'vue/server-renderer';
import { a as useAuth } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'fs';
import 'google-auth-library';
import 'fast-deep-equal';
import 'http';
import 'https';
import 'http2';
import 'url';
import 'events';
import '@fastify/busboy';
import 'zlib';
import 'jsonwebtoken';
import 'jwks-rsa';
import '@firebase/database-compat/standalone';
import 'path';
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
  __name: "prayer-attendance",
  __ssrInlineRender: true,
  setup(__props) {
    ref(true);
    ref("");
    const filterDate = ref((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const filterClass = ref("");
    const showAddModal = ref(false);
    const students = ref([]);
    useAuth();
    const classes = ["10-A", "10-B", "11-A", "11-B", "12-A", "12-B"];
    const form = reactive({
      name: "",
      studentId: "",
      class: "10-A",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      subuh: "jamaah",
      dzuhur: "jamaah",
      ashar: "jamaah",
      maghrib: "jamaah",
      isya: "jamaah"
    });
    const items = ref([]);
    const stats = computed(() => {
      const total = items.value.length;
      items.value.filter(
        (i) => ["subuh", "dzuhur", "ashar", "maghrib", "isya"].some((t) => i[t] === "jamaah")
      ).length;
      const absenCount = items.value.filter(
        (i) => ["subuh", "dzuhur", "ashar", "maghrib", "isya"].some((t) => i[t] === "absen")
      ).length;
      const uzurCount = items.value.filter(
        (i) => ["subuh", "dzuhur", "ashar", "maghrib", "isya"].some((t) => i[t] === "uzur")
      ).length;
      const avgPct = total > 0 ? Math.round(items.value.reduce((s, i) => {
        const present = ["subuh", "dzuhur", "ashar", "maghrib", "isya"].filter((t) => i[t] !== "absen").length;
        return s + present / 5 * 100;
      }, 0) / total) : 0;
      return [
        { label: "Total Santri", icon: "groups", bg: "bg-primary-fixed", iconColor: "text-primary", valueColor: "text-primary", value: total.toString() },
        { label: "Kehadiran Jamaah", icon: "check_circle", bg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", value: `${avgPct}%` },
        { label: "Absen Hari Ini", icon: "cancel", bg: "bg-red-100", iconColor: "text-red-600", valueColor: "text-red-700", value: absenCount.toString() },
        { label: "Uzur", icon: "medical_services", bg: "bg-amber-100", iconColor: "text-amber-600", valueColor: "text-amber-700", value: uzurCount.toString() }
      ];
    });
    const filteredRecords = computed(() => {
      return items.value.filter((r) => {
        const matchClass = !filterClass.value || r.class === filterClass.value;
        return matchClass;
      });
    });
    function statusClass(status) {
      switch (status) {
        case "jamaah":
          return "text-green-600";
        case "sendirian":
          return "text-blue-600";
        case "uzur":
          return "text-amber-600";
        case "absen":
          return "text-red-600";
        default:
          return "text-on-surface-variant";
      }
    }
    function statusIcon(status) {
      switch (status) {
        case "jamaah":
          return "check_circle";
        case "sendirian":
          return "person";
        case "uzur":
          return "medical_services";
        case "absen":
          return "cancel";
        default:
          return "remove_circle";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Rekap Kehadiran Sholat</h2><p class="text-on-surface-variant text-body-md">Monitoring kehadiran sholat 5 waktu santri.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm text-center"><div class="${ssrRenderClass([stat.bg, "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"])}"><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(stat.label)}</p></div>`);
      });
      _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">calendar_today</span><input type="date"${ssrRenderAttr("value", unref(filterDate))} class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"></div><div class="flex items-center gap-2"><span class="material-symbols-outlined text-on-surface-variant">class</span><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterClass)) ? ssrLooseContain(unref(filterClass), "") : ssrLooseEqual(unref(filterClass), "")) ? " selected" : ""}>Semua Kelas</option><!--[-->`);
      ssrRenderList(classes, (cls) => {
        _push(`<option${ssrRenderAttr("value", cls)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterClass)) ? ssrLooseContain(unref(filterClass), cls) : ssrLooseEqual(unref(filterClass), cls)) ? " selected" : ""}>${ssrInterpolate(cls)}</option>`);
      });
      _push(`<!--]--></select></div></div><button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Tambah Rekap </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama Santri</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Kelas</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Subuh</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Dzuhur</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Ashar</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Maghrib</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Isya</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Persentase</th><th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
      ssrRenderList(unref(filteredRecords), (record) => {
        _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(record.name)}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(record.class)}</td><td class="px-4 py-3 text-center"><span class="${ssrRenderClass(statusClass(record.subuh))}"><span class="material-symbols-outlined">${ssrInterpolate(statusIcon(record.subuh))}</span></span></td><td class="px-4 py-3 text-center"><span class="${ssrRenderClass(statusClass(record.dzuhur))}"><span class="material-symbols-outlined">${ssrInterpolate(statusIcon(record.dzuhur))}</span></span></td><td class="px-4 py-3 text-center"><span class="${ssrRenderClass(statusClass(record.ashar))}"><span class="material-symbols-outlined">${ssrInterpolate(statusIcon(record.ashar))}</span></span></td><td class="px-4 py-3 text-center"><span class="${ssrRenderClass(statusClass(record.maghrib))}"><span class="material-symbols-outlined">${ssrInterpolate(statusIcon(record.maghrib))}</span></span></td><td class="px-4 py-3 text-center"><span class="${ssrRenderClass(statusClass(record.isya))}"><span class="material-symbols-outlined">${ssrInterpolate(statusIcon(record.isya))}</span></span></td><td class="px-4 py-3 text-center"><span class="${ssrRenderClass(["px-2 py-1 text-[11px] font-bold rounded-full", record.percentage >= 80 ? "bg-green-100 text-green-700" : record.percentage >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"])}">${ssrInterpolate(record.percentage)}%</span></td><td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors"><span class="material-symbols-outlined">delete</span></button></td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(filteredRecords).length === 0) {
        _push(`<tr><td colspan="9" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showAddModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">Tambah Rekap Kehadiran</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Ibadah Module</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).name) ? ssrLooseContain(unref(form).name, "") : ssrLooseEqual(unref(form).name, "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
          ssrRenderList(unref(students), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).name) ? ssrLooseContain(unref(form).name, s.name) : ssrLooseEqual(unref(form).name, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Kelas</label><input${ssrRenderAttr("value", unref(form).class)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Kelas" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tanggal</label><input type="date"${ssrRenderAttr("value", unref(form).date)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div></div><div class="grid grid-cols-5 gap-2"><!--[-->`);
          ssrRenderList(["subuh", "dzuhur", "ashar", "maghrib", "isya"], (waktu) => {
            _push2(`<div class="space-y-1 text-center"><label class="text-label-sm text-on-surface-variant capitalize">${ssrInterpolate(waktu)}</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-sm focus:ring-primary p-2 outline-none"><option value="jamaah"${ssrIncludeBooleanAttr(Array.isArray(unref(form)[waktu]) ? ssrLooseContain(unref(form)[waktu], "jamaah") : ssrLooseEqual(unref(form)[waktu], "jamaah")) ? " selected" : ""}>Jamaah</option><option value="sendirian"${ssrIncludeBooleanAttr(Array.isArray(unref(form)[waktu]) ? ssrLooseContain(unref(form)[waktu], "sendirian") : ssrLooseEqual(unref(form)[waktu], "sendirian")) ? " selected" : ""}>Sendirian</option><option value="absen"${ssrIncludeBooleanAttr(Array.isArray(unref(form)[waktu]) ? ssrLooseContain(unref(form)[waktu], "absen") : ssrLooseEqual(unref(form)[waktu], "absen")) ? " selected" : ""}>Absen</option><option value="uzur"${ssrIncludeBooleanAttr(Array.isArray(unref(form)[waktu]) ? ssrLooseContain(unref(form)[waktu], "uzur") : ssrLooseEqual(unref(form)[waktu], "uzur")) ? " selected" : ""}>Uzur</option></select></div>`);
          });
          _push2(`<!--]--></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ibadah/prayer-attendance.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=prayer-attendance-X8agf6rC.mjs.map
