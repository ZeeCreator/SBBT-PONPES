import { defineComponent, ref, computed, watch, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderTeleport } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    const loading = ref(true);
    const error = ref("");
    const schedules = ref([]);
    const classes = ref([]);
    const teachers = ref([]);
    const subjects = ref([]);
    const rooms = ref([]);
    const filterClass = ref("");
    const filterTeacher = ref("");
    useAuth();
    const filteredSchedules = computed(() => {
      let items = schedules.value;
      if (filterClass.value) items = items.filter((s) => s.kelas === filterClass.value);
      if (filterTeacher.value) items = items.filter((s) => s.guru === filterTeacher.value);
      return items;
    });
    const scheduleMap = computed(() => {
      const map = {};
      for (const item of filteredSchedules.value) {
        if (!map[item.hari]) map[item.hari] = {};
        if (!map[item.hari][item.jamKe]) map[item.hari][item.jamKe] = [];
        map[item.hari][item.jamKe].push(item);
      }
      return map;
    });
    function cellItems(day, period) {
      var _a;
      return ((_a = scheduleMap.value[day]) == null ? void 0 : _a[period]) || [];
    }
    const maxPeriods = computed(() => {
      let max = 0;
      for (const item of filteredSchedules.value) {
        if (item.jamKe > max) max = item.jamKe;
      }
      return max || 8;
    });
    const stats = computed(() => {
      const f = filteredSchedules.value;
      return [
        { label: "Total Jadwal", value: f.length.toString(), color: "text-primary" },
        { label: "Kelas", value: new Set(f.map((s) => s.kelas)).size.toString(), color: "text-secondary" },
        { label: "Mapel", value: new Set(f.map((s) => s.mapel)).size.toString(), color: "text-tertiary" },
        { label: "Pengajar", value: new Set(f.map((s) => s.guru)).size.toString(), color: "text-error" },
        { label: "Ruang", value: new Set(f.map((s) => s.ruang)).size.toString(), color: "text-green-600" }
      ];
    });
    const subjectColors = [
      { border: "#4F46E5", bg: "#EEF2FF" },
      { border: "#0891B2", bg: "#ECFEFF" },
      { border: "#059669", bg: "#ECFDF5" },
      { border: "#D97706", bg: "#FFFBEB" },
      { border: "#DC2626", bg: "#FEF2F2" },
      { border: "#7C3AED", bg: "#F5F3FF" },
      { border: "#DB2777", bg: "#FDF2F8" },
      { border: "#2563EB", bg: "#EFF6FF" },
      { border: "#CA8A04", bg: "#FEFCE8" },
      { border: "#16A34A", bg: "#F0FDF4" }
    ];
    const subjectColorIndex = {};
    function getColorIdx(subject) {
      if (!(subject in subjectColorIndex)) {
        subjectColorIndex[subject] = Object.keys(subjectColorIndex).length % subjectColors.length;
      }
      return subjectColorIndex[subject];
    }
    function subjectColor(subject) {
      return subjectColors[getColorIdx(subject)].border;
    }
    function subjectBg(subject) {
      return subjectColors[getColorIdx(subject)].bg;
    }
    const legendColors = computed(() => {
      const seen = /* @__PURE__ */ new Set();
      const result = [];
      for (const item of filteredSchedules.value) {
        if (!seen.has(item.mapel)) {
          seen.add(item.mapel);
          result.push({ subject: item.mapel, ...subjectColors[getColorIdx(item.mapel)] });
        }
      }
      return result;
    });
    async function fetchData() {
      loading.value = true;
      error.value = "";
      try {
        const params = {};
        if (filterClass.value) params.kelas = filterClass.value;
        if (filterTeacher.value) params.guru = filterTeacher.value;
        const qs = new URLSearchParams(params).toString();
        schedules.value = await $fetch(`/api/jadwal${qs ? "?" + qs : ""}`) || [];
      } catch (e) {
        error.value = e.message || "Gagal memuat data";
      } finally {
        loading.value = false;
      }
    }
    watch([filterClass, filterTeacher], () => fetchData());
    const draggedItem = ref(null);
    const dropTarget = ref("");
    const showModal = ref(false);
    const isEditing = ref(false);
    const showDeleteModal = ref(false);
    ref(null);
    const defaultForm = () => ({
      id: "",
      hari: "",
      jamKe: 1,
      mapel: "",
      guru: "",
      kelas: "",
      ruang: ""
    });
    const form = reactive(defaultForm());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg flex flex-wrap items-center justify-between gap-stack-md"><div><h2 class="font-display text-headline-lg text-primary">Jadwal Pelajaran</h2><p class="text-on-surface-variant text-body-md">Atur jadwal pelajaran terintegrasi master data.</p></div><div class="flex items-center gap-3"><select class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-4 focus:ring-primary min-w-[160px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterClass)) ? ssrLooseContain(unref(filterClass), "") : ssrLooseEqual(unref(filterClass), "")) ? " selected" : ""}>Semua Kelas</option><!--[-->`);
      ssrRenderList(unref(classes), (k) => {
        _push(`<option${ssrRenderAttr("value", k.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterClass)) ? ssrLooseContain(unref(filterClass), k.name) : ssrLooseEqual(unref(filterClass), k.name)) ? " selected" : ""}>${ssrInterpolate(k.name)}</option>`);
      });
      _push(`<!--]--></select><select class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-4 focus:ring-primary min-w-[160px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterTeacher)) ? ssrLooseContain(unref(filterTeacher), "") : ssrLooseEqual(unref(filterTeacher), "")) ? " selected" : ""}>Semua Pengajar</option><!--[-->`);
      ssrRenderList(unref(teachers), (t) => {
        _push(`<option${ssrRenderAttr("value", t.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterTeacher)) ? ssrLooseContain(unref(filterTeacher), t.name) : ssrLooseEqual(unref(filterTeacher), t.name)) ? " selected" : ""}>${ssrInterpolate(t.name)}</option>`);
      });
      _push(`<!--]--></select><button class="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">print</span> Cetak </button><button class="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Tambah Jadwal </button></div></div>`);
      if (unref(error)) {
        _push(`<div class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span></div>`);
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 md:grid-cols-5 gap-gutter mb-stack-lg"><!--[-->`);
        ssrRenderList(unref(stats), (stat) => {
          _push(`<div class="glass-card p-4 rounded-xl shadow-sm text-center"><p class="${ssrRenderClass([stat.color, "font-display text-headline-sm"])}">${ssrInterpolate(stat.value)}</p><p class="text-label-xs text-on-surface-variant">${ssrInterpolate(stat.label)}</p></div>`);
        });
        _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="overflow-x-auto"><table class="w-full min-w-[700px]" style="${ssrRenderStyle({ "table-layout": "fixed" })}"><thead><tr><th class="w-[70px] px-2 py-3 text-label-sm text-on-surface-variant bg-surface-container-low text-center sticky left-0 z-10">Jam</th><!--[-->`);
        ssrRenderList(days, (day) => {
          _push(`<th class="px-2 py-3 text-label-md font-semibold text-primary bg-surface-container-low text-center min-w-[130px]">${ssrInterpolate(day)}</th>`);
        });
        _push(`<!--]--></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(maxPeriods), (period) => {
          _push(`<tr class="border-t border-outline-variant/10"><td class="px-2 py-1 text-label-xs text-on-surface-variant bg-surface-container-low text-center sticky left-0 z-10 font-medium h-[85px]">Ke-${ssrInterpolate(period)}</td><!--[-->`);
          ssrRenderList(days, (day) => {
            _push(`<td class="${ssrRenderClass([unref(dropTarget) === `${day}-${period}` ? "bg-primary-fixed/25 ring-2 ring-primary/40" : "hover:bg-primary-fixed/5", "px-1 py-1 align-top cursor-pointer transition-colors min-h-[85px] relative"])}">`);
            if (cellItems(day, period).length) {
              _push(`<div class="space-y-1"><!--[-->`);
              ssrRenderList(cellItems(day, period), (item) => {
                var _a;
                _push(`<div draggable="true" class="${ssrRenderClass([{ "opacity-40": ((_a = unref(draggedItem)) == null ? void 0 : _a.id) === item.id }, "group rounded-md px-1.5 py-1 border-l-[3px] transition-all hover:shadow-sm text-[11px] leading-tight cursor-grab active:cursor-grabbing"])}" style="${ssrRenderStyle({ borderLeftColor: subjectColor(item.mapel), backgroundColor: subjectBg(item.mapel) })}"><div class="font-bold truncate">${ssrInterpolate(item.mapel)}</div><div class="text-[10px] text-on-surface-variant truncate">`);
                if (unref(filterTeacher)) {
                  _push(`<!--[-->${ssrInterpolate(item.kelas)}<!--]-->`);
                } else {
                  _push(`<!--[-->${ssrInterpolate(item.guru)}<!--]-->`);
                }
                _push(`</div><div class="flex items-center justify-between mt-0.5"><span class="text-[9px] text-outline truncate">${ssrInterpolate(item.ruang)}</span><div class="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"><button class="p-0.5 rounded hover:bg-primary/15 text-primary"><span class="material-symbols-outlined text-[12px]">edit</span></button><button class="p-0.5 rounded hover:bg-red-100 text-red-500"><span class="material-symbols-outlined text-[12px]">delete</span></button></div></div></div>`);
              });
              _push(`<!--]--><button class="w-full text-[10px] text-primary/60 hover:text-primary flex items-center justify-center gap-0.5 py-0.5 rounded hover:bg-primary-fixed/20 transition-colors"><span class="material-symbols-outlined text-[12px]">add_circle</span> Tambah </button></div>`);
            } else {
              _push(`<div class="h-full min-h-[80px] flex items-center justify-center"><span class="material-symbols-outlined text-outline/20 text-lg">add_circle</span></div>`);
            }
            _push(`</td>`);
          });
          _push(`<!--]--></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div><div class="mt-stack-lg flex items-center gap-4 text-label-sm text-on-surface-variant"><span class="font-medium">Legenda:</span><!--[-->`);
        ssrRenderList(unref(legendColors), (c, i) => {
          _push(`<span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm inline-block" style="${ssrRenderStyle({ backgroundColor: c.bg, border: `2px solid ${c.border}` })}"></span> ${ssrInterpolate(c.subject)}</span>`);
        });
        _push(`<!--]--></div><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter"><div class="p-6 border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(unref(isEditing) ? "Edit Jadwal" : "Tambah Jadwal")}</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-6 space-y-4"><div class="grid grid-cols-2 gap-4"><div><label class="text-label-sm text-on-surface-variant block mb-1">Hari</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).hari) ? ssrLooseContain(unref(form).hari, "") : ssrLooseEqual(unref(form).hari, "")) ? " selected" : ""}>Pilih Hari</option><!--[-->`);
          ssrRenderList(days, (d) => {
            _push2(`<option${ssrRenderAttr("value", d)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).hari) ? ssrLooseContain(unref(form).hari, d) : ssrLooseEqual(unref(form).hari, d)) ? " selected" : ""}>${ssrInterpolate(d)}</option>`);
          });
          _push2(`<!--]--></select></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Jam Ke-</label><input${ssrRenderAttr("value", unref(form).jamKe)} type="number" min="1" max="12" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"></div></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Mata Pelajaran</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).mapel) ? ssrLooseContain(unref(form).mapel, "") : ssrLooseEqual(unref(form).mapel, "")) ? " selected" : ""}>Pilih Mata Pelajaran</option><!--[-->`);
          ssrRenderList(unref(subjects), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).mapel) ? ssrLooseContain(unref(form).mapel, s.name) : ssrLooseEqual(unref(form).mapel, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Guru / Pengajar</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).guru) ? ssrLooseContain(unref(form).guru, "") : ssrLooseEqual(unref(form).guru, "")) ? " selected" : ""}>Pilih Pengajar</option><!--[-->`);
          ssrRenderList(unref(teachers), (t) => {
            _push2(`<option${ssrRenderAttr("value", t.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).guru) ? ssrLooseContain(unref(form).guru, t.name) : ssrLooseEqual(unref(form).guru, t.name)) ? " selected" : ""}>${ssrInterpolate(t.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Kelas</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas) ? ssrLooseContain(unref(form).kelas, "") : ssrLooseEqual(unref(form).kelas, "")) ? " selected" : ""}>Pilih Kelas</option><!--[-->`);
          ssrRenderList(unref(classes), (k) => {
            _push2(`<option${ssrRenderAttr("value", k.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas) ? ssrLooseContain(unref(form).kelas, k.name) : ssrLooseEqual(unref(form).kelas, k.name)) ? " selected" : ""}>${ssrInterpolate(k.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Ruang</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).ruang) ? ssrLooseContain(unref(form).ruang, "") : ssrLooseEqual(unref(form).ruang, "")) ? " selected" : ""}>Pilih Ruang</option><!--[-->`);
          ssrRenderList(unref(rooms), (r) => {
            _push2(`<option${ssrRenderAttr("value", r)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).ruang) ? ssrLooseContain(unref(form).ruang, r) : ssrLooseEqual(unref(form).ruang, r)) ? " selected" : ""}>${ssrInterpolate(r)}</option>`);
          });
          _push2(`<!--]--></select></div></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Simpan</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showDeleteModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter"><div class="p-6 text-center"><div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-red-500 text-3xl">warning</span></div><h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Jadwal</h3><p class="text-on-surface-variant text-label-md">Apakah Anda yakin ingin menghapus jadwal ini?</p></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Hapus</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/jadwal/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-otz_B_Ra.mjs.map
