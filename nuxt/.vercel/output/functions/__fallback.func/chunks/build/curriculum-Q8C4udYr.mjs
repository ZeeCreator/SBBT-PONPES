import { defineComponent, ref, reactive, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
  __name: "curriculum",
  __ssrInlineRender: true,
  setup(__props) {
    const teachers = ref([]);
    useAuth();
    const subjects = ref([]);
    const loading = ref(true);
    const error = ref("");
    const showModal = ref(false);
    const isEditing = ref(false);
    const showDeleteModal = ref(false);
    const deleteTarget = ref(null);
    const form = reactive({
      id: "",
      code: "",
      name: "",
      dept: "",
      hours: 0,
      teacher: "",
      guruId: null,
      active: true
    });
    watch(() => form.teacher, (val) => {
      const found = teachers.value.find((t) => t.name === val);
      form.guruId = found ? found.id : null;
    });
    const stats = computed(() => {
      const total = subjects.value.length;
      const depts = new Set(subjects.value.map((s) => s.dept)).size;
      const teachers2 = new Set(subjects.value.map((s) => s.teacher)).size;
      const totalHours = subjects.value.reduce((sum, s) => sum + (Number(s.hours) || 0), 0);
      return [
        { label: "Total Subjects", icon: "menu_book", iconColor: "text-primary", valueColor: "text-primary", value: String(total) },
        { label: "Active Teachers", icon: "school", iconColor: "text-secondary", valueColor: "text-secondary", value: String(teachers2) },
        { label: "Class Hours/Week", icon: "schedule", iconColor: "text-primary-container", valueColor: "text-on-background", value: String(totalHours) },
        { label: "Departments", icon: "account_tree", iconColor: "text-tertiary", valueColor: "text-on-background", value: String(depts) }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Academic Curriculum Management</h2><p class="text-on-surface-variant text-body-md">Manage curriculum structure, subjects, and class schedules.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm"><div class="flex items-center justify-between mb-2"><span class="text-on-surface-variant text-label-md">${ssrInterpolate(stat.label)}</span><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p></div>`);
      });
      _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><div class="flex items-center gap-4"><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Department:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option>All Departments</option><option>Diniyah</option><option>Tahfidz</option><option>Umum</option></select></div><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Grade:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary"><option>All Levels</option><option>Grade 10</option><option>Grade 11</option><option>Grade 12</option></select></div></div><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Add Subject </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Subject Code</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Subject Name</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Department</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Hours/Week</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Teacher</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10">`);
      if (unref(loading)) {
        _push(`<tr><td colspan="7" class="px-6 py-8 text-center text-on-surface-variant text-label-md">Memuat data...</td></tr>`);
      } else if (unref(error)) {
        _push(`<tr><td colspan="7" class="px-6 py-8 text-center text-red-500 text-label-md">${ssrInterpolate(unref(error))}</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(subjects), (subject) => {
        _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4 text-label-sm font-mono text-on-surface-variant">${ssrInterpolate(subject.code)}</td><td class="px-6 py-4 text-label-md text-on-surface font-medium">${ssrInterpolate(subject.name)}</td><td class="px-6 py-4"><span class="bg-surface-container-low px-2 py-1 rounded text-label-sm text-on-surface-variant">${ssrInterpolate(subject.dept)}</span></td><td class="px-6 py-4 text-label-md">${ssrInterpolate(subject.hours)}</td><td class="px-6 py-4 text-label-md">${ssrInterpolate(subject.teacher)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", subject.active ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container text-on-surface-variant"])}">${ssrInterpolate(subject.active ? "Active" : "Inactive")}</span></td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button><button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (!unref(loading) && unref(subjects).length === 0) {
        _push(`<tr><td colspan="7" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data mata pelajaran. Klik &quot;Add Subject&quot; untuk menambahkan.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        var _a;
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter"><div class="px-gutter py-stack-md border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(unref(isEditing) ? "Edit Subject" : "Tambah Subject")}</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Kode Mata Pelajaran</label><input${ssrRenderAttr("value", unref(form).code)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Contoh: QUR-101"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Mata Pelajaran</label><input${ssrRenderAttr("value", unref(form).name)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Nama mata pelajaran"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Departemen</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).dept) ? ssrLooseContain(unref(form).dept, "") : ssrLooseEqual(unref(form).dept, "")) ? " selected" : ""}>Pilih Departemen</option><option value="Diniyah"${ssrIncludeBooleanAttr(Array.isArray(unref(form).dept) ? ssrLooseContain(unref(form).dept, "Diniyah") : ssrLooseEqual(unref(form).dept, "Diniyah")) ? " selected" : ""}>Diniyah</option><option value="Tahfidz"${ssrIncludeBooleanAttr(Array.isArray(unref(form).dept) ? ssrLooseContain(unref(form).dept, "Tahfidz") : ssrLooseEqual(unref(form).dept, "Tahfidz")) ? " selected" : ""}>Tahfidz</option><option value="Umum"${ssrIncludeBooleanAttr(Array.isArray(unref(form).dept) ? ssrLooseContain(unref(form).dept, "Umum") : ssrLooseEqual(unref(form).dept, "Umum")) ? " selected" : ""}>Umum</option></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Jam/Minggu</label><input${ssrRenderAttr("value", unref(form).hours)} type="number" min="1" max="40" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Pengajar</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).teacher) ? ssrLooseContain(unref(form).teacher, "") : ssrLooseEqual(unref(form).teacher, "")) ? " selected" : ""}>-- Pilih Pengajar --</option><!--[-->`);
          ssrRenderList(unref(teachers), (t) => {
            _push2(`<option${ssrRenderAttr("value", t.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).teacher) ? ssrLooseContain(unref(form).teacher, t.name) : ssrLooseEqual(unref(form).teacher, t.name)) ? " selected" : ""}>${ssrInterpolate(t.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="flex items-center gap-3"><label class="text-label-md text-on-surface-variant">Status Aktif</label><button class="${ssrRenderClass(["w-10 h-5 rounded-full transition-colors relative", unref(form).active ? "bg-primary" : "bg-surface-container-highest"])}"><span class="${ssrRenderClass(["absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform", unref(form).active ? "translate-x-5" : "translate-x-0.5"])}"></span></button></div></div><div class="px-gutter py-stack-md border-t border-outline-variant/20 flex justify-end gap-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all">Simpan</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showDeleteModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter p-6 text-center"><div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-red-500 text-3xl">warning</span></div><h3 class="font-display text-title-lg mb-2">Hapus Subject</h3><p class="text-label-md text-on-surface-variant mb-1">Apakah Anda yakin ingin menghapus subject berikut?</p><p class="font-bold text-body-md">${ssrInterpolate((_a = unref(deleteTarget)) == null ? void 0 : _a.name)}</p><div class="flex gap-3 mt-6"><button class="flex-1 py-2.5 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-high transition-all">Batal</button><button class="flex-1 py-2.5 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Hapus</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/akademik/curriculum.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=curriculum-Q8C4udYr.mjs.map
