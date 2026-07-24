import { defineComponent, ref, computed, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
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
  __name: "dormitories",
  __ssrInlineRender: true,
  setup(__props) {
    const teachers = ref([]);
    useAuth();
    const loading = ref(true);
    const error = ref("");
    const items = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const showDeleteModal = ref(false);
    const deleteTarget = ref(null);
    const showRoomModal = ref(false);
    const roomDormitory = ref(null);
    const newRoomName = ref("");
    const selectedRooms = ref([]);
    const stats = computed(() => {
      const totalUnits = items.value.length;
      const totalRooms = items.value.reduce((sum, d) => {
        var _a;
        return sum + (((_a = d.rooms) == null ? void 0 : _a.length) || 0);
      }, 0);
      return [
        { label: "Total Gedung", icon: "domain", iconColor: "text-primary", valueColor: "text-primary", value: String(totalUnits) },
        { label: "Total Kamar", icon: "door_front", iconColor: "text-secondary", valueColor: "text-secondary", value: String(totalRooms) },
        { label: "Pembina", icon: "supervisor_account", iconColor: "text-primary-container", valueColor: "text-on-background", value: String(totalUnits) },
        { label: "Kapasitas", icon: "bed", iconColor: "text-tertiary", valueColor: "text-on-background", value: String(totalRooms * 8) }
      ];
    });
    const defaultForm = () => ({
      id: 0,
      name: "",
      gender: "",
      supervisor: "",
      supervisorId: null,
      rooms: []
    });
    const form = reactive(defaultForm());
    watch(() => form.supervisor, (val) => {
      const found = teachers.value.find((t) => t.name === val);
      form.supervisorId = found ? found.id : null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Manajemen Gedung &amp; Kamar</h2><p class="text-on-surface-variant text-body-md">Kelola data gedung, kamar, dan pembina asrama.</p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm"><div class="flex items-center justify-between mb-2"><span class="text-on-surface-variant text-label-md">${ssrInterpolate(stat.label)}</span><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p></div>`);
      });
      _push(`<!--]--></div><div class="glass-card rounded-xl shadow-sm overflow-hidden"><div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md"><h3 class="font-display text-title-lg text-primary">Daftar Gedung</h3><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm"><span class="material-symbols-outlined text-sm">add</span> Tambah Gedung </button></div>`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center text-on-surface-variant text-label-md">Memuat data...</div>`);
      } else if (unref(error)) {
        _push(`<div class="p-8 text-center text-red-500 text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Gedung</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Gender</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Pembina</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Jumlah Kamar</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(items), (item) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-6 py-4 text-label-md text-on-surface font-medium">${ssrInterpolate(item.name)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", item.gender === "Putra" ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-pink-700"])}">${ssrInterpolate(item.gender)}</span></td><td class="px-6 py-4 text-label-md">${ssrInterpolate(item.supervisor)}</td><td class="px-6 py-4"><button class="text-label-sm text-primary hover:underline font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-sm">meeting_room</span> ${ssrInterpolate((item.rooms || []).length)} Kamar </button></td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button><button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(items).length === 0) {
          _push(`<tr><td colspan="5" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data gedung. Klik &quot;Tambah Gedung&quot; untuk menambahkan.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div>`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        var _a, _b;
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter"><div class="p-6 border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">${ssrInterpolate(unref(isEditing) ? "Edit Gedung" : "Tambah Gedung")}</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-6 space-y-4"><div><label class="text-label-sm text-on-surface-variant block mb-1">Nama Gedung</label><input${ssrRenderAttr("value", unref(form).name)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Contoh: Al-Ghazali"></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Gender</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).gender) ? ssrLooseContain(unref(form).gender, "") : ssrLooseEqual(unref(form).gender, "")) ? " selected" : ""}>Pilih Gender</option><option value="Putra"${ssrIncludeBooleanAttr(Array.isArray(unref(form).gender) ? ssrLooseContain(unref(form).gender, "Putra") : ssrLooseEqual(unref(form).gender, "Putra")) ? " selected" : ""}>Putra</option><option value="Putri"${ssrIncludeBooleanAttr(Array.isArray(unref(form).gender) ? ssrLooseContain(unref(form).gender, "Putri") : ssrLooseEqual(unref(form).gender, "Putri")) ? " selected" : ""}>Putri</option></select></div><div><label class="text-label-sm text-on-surface-variant block mb-1">Pembina</label><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).supervisor) ? ssrLooseContain(unref(form).supervisor, "") : ssrLooseEqual(unref(form).supervisor, "")) ? " selected" : ""}>-- Pilih Pembina --</option><!--[-->`);
          ssrRenderList(unref(teachers), (t) => {
            _push2(`<option${ssrRenderAttr("value", t.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).supervisor) ? ssrLooseContain(unref(form).supervisor, t.name) : ssrLooseEqual(unref(form).supervisor, t.name)) ? " selected" : ""}>${ssrInterpolate(t.name)}</option>`);
          });
          _push2(`<!--]--></select></div></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Simpan</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showRoomModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter"><div class="p-6 border-b border-outline-variant/20 flex justify-between items-center"><h3 class="font-display text-title-lg text-primary">Kelola Kamar - ${ssrInterpolate((_a = unref(roomDormitory)) == null ? void 0 : _a.name)}</h3><button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-6"><div class="flex items-center gap-3 mb-4"><input${ssrRenderAttr("value", unref(newRoomName))} type="text" class="flex-1 bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary" placeholder="Nama kamar baru"><button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm flex items-center gap-1"><span class="material-symbols-outlined text-sm">add</span> Tambah </button></div>`);
          if (unref(roomDormitory) && (unref(roomDormitory).rooms || []).length > 0) {
            _push2(`<div class="flex items-center justify-between mb-3 px-1"><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(unref(selectedRooms).length === (unref(roomDormitory).rooms || []).length) ? " checked" : ""} class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"><span class="text-label-sm text-on-surface-variant font-semibold">Pilih Semua</span></label>`);
            if (unref(selectedRooms).length > 0) {
              _push2(`<button class="text-label-sm text-error hover:text-red-700 flex items-center gap-1"><span class="material-symbols-outlined text-sm">delete</span> Hapus ${ssrInterpolate(unref(selectedRooms).length)} Terpilih </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(roomDormitory)) {
            _push2(`<div class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar"><!--[-->`);
            ssrRenderList(unref(roomDormitory).rooms || [], (room, idx) => {
              _push2(`<div class="flex items-center justify-between p-3 rounded-lg bg-surface-container-low"><div class="flex items-center gap-3"><input type="checkbox"${ssrIncludeBooleanAttr(unref(selectedRooms).includes(room)) ? " checked" : ""} class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"><span class="material-symbols-outlined text-primary text-sm">meeting_room</span><span class="text-label-md text-on-surface">${ssrInterpolate(room)}</span></div><button class="p-1 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><span class="material-symbols-outlined text-sm">close</span></button></div>`);
            });
            _push2(`<!--]-->`);
            if ((unref(roomDormitory).rooms || []).length === 0) {
              _push2(`<p class="text-center text-on-surface-variant text-label-sm py-8">Belum ada kamar. Tambahkan kamar baru.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">`);
          if (unref(selectedRooms).length > 0) {
            _push2(`<button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Hapus ${ssrInterpolate(unref(selectedRooms).length)} Terpilih</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Selesai</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showDeleteModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter"><div class="p-6 text-center"><div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-red-500 text-3xl">warning</span></div><h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Gedung</h3><p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus gedung berikut?</p><p class="font-bold text-on-surface text-body-md">${ssrInterpolate((_b = unref(deleteTarget)) == null ? void 0 : _b.name)}</p>`);
          if (unref(deleteTarget) && (unref(deleteTarget).rooms || []).length > 0) {
            _push2(`<p class="text-xs text-red-500 mt-2 flex items-center justify-center gap-1"><span class="material-symbols-outlined text-xs">warning</span> ${ssrInterpolate((unref(deleteTarget).rooms || []).length)} kamar di dalamnya juga akan dihapus. </p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Hapus</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/master-data/dormitories.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dormitories-C9w6GM5d.mjs.map
