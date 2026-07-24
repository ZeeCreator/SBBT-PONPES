import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
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
  __name: "teachers",
  __ssrInlineRender: true,
  setup(__props) {
    const teachers = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const showModal = ref(false);
    const showDelete = ref(false);
    const editingId = ref("");
    const deleteTarget = ref(null);
    const deleteError = ref("");
    const searchQuery = ref("");
    const filterSpecialization = ref("");
    const filterStatus = ref("");
    const form = reactive({
      name: "",
      email: "",
      phone: "",
      specialization: "Umum",
      subjects: [],
      nuptk: "",
      status: "active"
    });
    const subjectsInput = ref("");
    const filteredTeachers = computed(() => {
      const q = searchQuery.value.toLowerCase().trim();
      return teachers.value.filter((t) => {
        if (filterSpecialization.value && t.specialization !== filterSpecialization.value) return false;
        if (filterStatus.value && t.status !== filterStatus.value) return false;
        if (q && !t.name.toLowerCase().includes(q) && !t.email.toLowerCase().includes(q) && !(t.nuptk || "").toLowerCase().includes(q)) return false;
        return true;
      });
    });
    function specializationClass(spec) {
      const map = {
        Tahfidz: "bg-green-100 text-green-700",
        "Kitab Kuning": "bg-amber-100 text-amber-700",
        Umum: "bg-blue-100 text-blue-700",
        "Bahasa Arab": "bg-purple-100 text-purple-700",
        Mahir: "bg-error-container text-error"
      };
      return map[spec] || "bg-surface-container text-on-surface";
    }
    async function fetchTeachers() {
      loading.value = true;
      try {
        const { getIdToken } = useAuth();
        const token = await getIdToken();
        const res = await fetch("/api/guru", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) teachers.value = await res.json();
      } finally {
        loading.value = false;
      }
    }
    fetchTeachers();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="flex items-center justify-between mb-stack-lg"><div><h2 class="font-display text-headline-lg text-primary">Manajemen Guru / Ustadz</h2><p class="text-on-surface-variant text-body-md">Kelola data pengajar dan tenaga pendidik</p></div><button class="bg-primary-container text-on-primary px-6 py-2.5 rounded-xl text-label-md hover:bg-primary transition-all flex items-center gap-2 shadow-md"><span class="material-symbols-outlined text-sm">person_add</span> Tambah Guru </button></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-4 border-b border-outline-variant/20 flex flex-wrap gap-3 items-center"><div class="relative flex-1 min-w-[200px] max-w-sm"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Cari nama atau email..." class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-sm py-2 pl-9 pr-3 focus:ring-primary outline-none"></div><select class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-sm py-2 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterSpecialization)) ? ssrLooseContain(unref(filterSpecialization), "") : ssrLooseEqual(unref(filterSpecialization), "")) ? " selected" : ""}>Semua Spesialisasi</option><option value="Tahfidz"${ssrIncludeBooleanAttr(Array.isArray(unref(filterSpecialization)) ? ssrLooseContain(unref(filterSpecialization), "Tahfidz") : ssrLooseEqual(unref(filterSpecialization), "Tahfidz")) ? " selected" : ""}>Tahfidz</option><option value="Kitab Kuning"${ssrIncludeBooleanAttr(Array.isArray(unref(filterSpecialization)) ? ssrLooseContain(unref(filterSpecialization), "Kitab Kuning") : ssrLooseEqual(unref(filterSpecialization), "Kitab Kuning")) ? " selected" : ""}>Kitab Kuning</option><option value="Umum"${ssrIncludeBooleanAttr(Array.isArray(unref(filterSpecialization)) ? ssrLooseContain(unref(filterSpecialization), "Umum") : ssrLooseEqual(unref(filterSpecialization), "Umum")) ? " selected" : ""}>Umum</option><option value="Bahasa Arab"${ssrIncludeBooleanAttr(Array.isArray(unref(filterSpecialization)) ? ssrLooseContain(unref(filterSpecialization), "Bahasa Arab") : ssrLooseEqual(unref(filterSpecialization), "Bahasa Arab")) ? " selected" : ""}>Bahasa Arab</option><option value="Mahir"${ssrIncludeBooleanAttr(Array.isArray(unref(filterSpecialization)) ? ssrLooseContain(unref(filterSpecialization), "Mahir") : ssrLooseEqual(unref(filterSpecialization), "Mahir")) ? " selected" : ""}>Mahir</option></select><select class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-sm py-2 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "") : ssrLooseEqual(unref(filterStatus), "")) ? " selected" : ""}>Semua Status</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "active") : ssrLooseEqual(unref(filterStatus), "active")) ? " selected" : ""}>Active</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "inactive") : ssrLooseEqual(unref(filterStatus), "inactive")) ? " selected" : ""}>Inactive</option><option value="resigned"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "resigned") : ssrLooseEqual(unref(filterStatus), "resigned")) ? " selected" : ""}>Resigned</option></select></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Email</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Spesialisasi</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Mapel</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
      ssrRenderList(unref(filteredTeachers), (teacher) => {
        _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-label-sm font-bold">${ssrInterpolate(teacher.name.charAt(0))}</div><div><p class="text-label-md font-medium">${ssrInterpolate(teacher.name)}</p>`);
        if (teacher.nuptk) {
          _push(`<p class="text-[10px] text-on-surface-variant">NUPTK: ${ssrInterpolate(teacher.nuptk)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(teacher.email)}</td><td class="px-4 py-3"><span class="${ssrRenderClass([specializationClass(teacher.specialization), "px-2 py-1 text-[10px] font-bold rounded-full"])}">${ssrInterpolate(teacher.specialization)}</span></td><td class="px-4 py-3"><div class="flex flex-wrap gap-1"><!--[-->`);
        ssrRenderList((teacher.subjects || []).slice(0, 2), (subj) => {
          _push(`<span class="px-2 py-0.5 bg-surface-container-high text-on-surface rounded text-[9px]">${ssrInterpolate(subj)}</span>`);
        });
        _push(`<!--]-->`);
        if ((teacher.subjects || []).length > 2) {
          _push(`<span class="text-[9px] text-on-surface-variant">+${ssrInterpolate(teacher.subjects.length - 2)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></td><td class="px-4 py-3"><span class="${ssrRenderClass([teacher.status === "active" ? "text-green-600" : teacher.status === "resigned" ? "text-error" : "text-on-surface-variant", "flex items-center gap-1 text-label-sm"])}"><span class="${ssrRenderClass([teacher.status === "active" ? "bg-green-500" : teacher.status === "resigned" ? "bg-error" : "bg-outline", "w-1.5 h-1.5 rounded-full"])}"></span> ${ssrInterpolate(teacher.status)}</span></td><td class="px-4 py-3"><div class="flex items-center gap-2"><button class="text-primary text-label-sm hover:underline">Edit</button><button class="text-error text-label-sm hover:underline">Hapus</button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table>`);
      if (unref(loading)) {
        _push(`<p class="text-center py-8 text-on-surface-variant text-label-sm">Loading...</p>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(loading) && unref(filteredTeachers).length === 0) {
        _push(`<p class="text-center py-8 text-on-surface-variant text-label-sm">Tidak ada data guru</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div class="bg-surface rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(unref(editingId) ? "Edit Guru" : "Tambah Guru Baru")}</h3><button class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button></div><form class="space-y-4"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Lengkap</label><input${ssrRenderAttr("value", unref(form).name)} type="text" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"></div><div class="grid grid-cols-2 gap-4"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">No. Telepon</label><input${ssrRenderAttr("value", unref(form).phone)} type="text" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">NUPTK <span class="text-xs text-on-surface-variant">(otomatis)</span></label><input${ssrRenderAttr("value", unref(form).nuptk)} type="text" disabled class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md outline-none opacity-60 cursor-not-allowed"${ssrRenderAttr("placeholder", unref(editingId) ? "Nomor induk" : "Akan digenerate otomatis")}></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Spesialisasi</label><select required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"><option value="Tahfidz"${ssrIncludeBooleanAttr(Array.isArray(unref(form).specialization) ? ssrLooseContain(unref(form).specialization, "Tahfidz") : ssrLooseEqual(unref(form).specialization, "Tahfidz")) ? " selected" : ""}>Tahfidz</option><option value="Kitab Kuning"${ssrIncludeBooleanAttr(Array.isArray(unref(form).specialization) ? ssrLooseContain(unref(form).specialization, "Kitab Kuning") : ssrLooseEqual(unref(form).specialization, "Kitab Kuning")) ? " selected" : ""}>Kitab Kuning</option><option value="Umum"${ssrIncludeBooleanAttr(Array.isArray(unref(form).specialization) ? ssrLooseContain(unref(form).specialization, "Umum") : ssrLooseEqual(unref(form).specialization, "Umum")) ? " selected" : ""}>Umum</option><option value="Bahasa Arab"${ssrIncludeBooleanAttr(Array.isArray(unref(form).specialization) ? ssrLooseContain(unref(form).specialization, "Bahasa Arab") : ssrLooseEqual(unref(form).specialization, "Bahasa Arab")) ? " selected" : ""}>Bahasa Arab</option><option value="Mahir"${ssrIncludeBooleanAttr(Array.isArray(unref(form).specialization) ? ssrLooseContain(unref(form).specialization, "Mahir") : ssrLooseEqual(unref(form).specialization, "Mahir")) ? " selected" : ""}>Mahir</option></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Mata Pelajaran (pisahkan dengan koma)</label><input${ssrRenderAttr("value", unref(subjectsInput))} type="text" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="Tahfidz, Nahwu, Shorof"></div>`);
          if (unref(editingId)) {
            _push2(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">Status</label><select class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "active") : ssrLooseEqual(unref(form).status, "active")) ? " selected" : ""}>Active</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "inactive") : ssrLooseEqual(unref(form).status, "inactive")) ? " selected" : ""}>Inactive</option><option value="resigned"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "resigned") : ssrLooseEqual(unref(form).status, "resigned")) ? " selected" : ""}>Resigned</option></select></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-body-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">`);
          if (unref(saving)) {
            _push2(`<span class="material-symbols-outlined animate-spin text-sm">refresh</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` ${ssrInterpolate(unref(saving) ? "Menyimpan..." : unref(editingId) ? "Update Guru" : "Tambah Guru")}</button></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        var _a;
        if (unref(showDelete)) {
          _push2(`<div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div class="bg-surface rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center"><div class="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-error text-3xl">delete</span></div><h3 class="font-display text-title-lg text-primary mb-2">Hapus Guru?</h3><p class="text-label-md text-on-surface-variant mb-6">Yakin ingin menghapus <strong>${ssrInterpolate((_a = unref(deleteTarget)) == null ? void 0 : _a.name)}</strong>? Tindakan ini tidak bisa dibatalkan.</p>`);
          if (unref(deleteError)) {
            _push2(`<p class="text-label-sm text-error mb-4">${ssrInterpolate(unref(deleteError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex gap-3"><button class="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl text-label-md">Batal</button><button class="flex-1 bg-error text-on-error py-3 rounded-xl text-label-md font-bold hover:brightness-110 transition-all">Hapus</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings/teachers.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=teachers-CV8ymLJd.mjs.map
