import { defineComponent, ref, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
  __name: "todos",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const todos = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const message = ref("");
    const showModal = ref(false);
    const editingId = ref("");
    const form = reactive({
      title: "",
      description: "",
      priority: "medium"
    });
    function priorityClass(p) {
      const map = { low: "bg-blue-100 text-blue-700", medium: "bg-amber-100 text-amber-700", high: "bg-red-100 text-red-700" };
      return map[p] || map.medium;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="flex items-center justify-between mb-stack-lg"><div><h2 class="font-display text-headline-lg text-primary">Catatan &amp; Todos</h2><p class="text-body-md text-on-surface-variant">Kelola catatan dan tugas untuk dipantau.</p></div><button class="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Tambah Catatan </button></div>`);
      if (unref(message)) {
        _push(`<div class="${ssrRenderClass([unref(message).includes("\u2705") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700", "mb-stack-md p-4 rounded-xl text-label-sm font-medium"])}">${ssrInterpolate(unref(message))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="text-center py-12"><span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span><p class="text-label-sm text-on-surface-variant mt-2">Memuat data...</p></div>`);
      } else if (unref(todos).length === 0) {
        _push(`<div class="glass-card rounded-2xl p-12 text-center"><span class="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">checklist</span><p class="text-title-md text-on-surface-variant">Belum ada catatan</p><p class="text-label-sm text-on-surface-variant/60 mt-1">Klik &quot;Tambah Catatan&quot; untuk membuat catatan baru.</p></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(todos), (todo) => {
          _push(`<div class="${ssrRenderClass([todo.done ? "opacity-60" : "", "glass-card rounded-2xl p-gutter transition-all hover:shadow-md"])}"><div class="flex items-start gap-4"><button class="${ssrRenderClass([todo.done ? "bg-primary border-primary text-on-primary" : "border-outline-variant hover:border-primary", "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0"])}">`);
          if (todo.done) {
            _push(`<span class="material-symbols-outlined text-xs">check</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button><div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1"><p class="${ssrRenderClass([todo.done ? "line-through text-on-surface-variant" : "text-on-surface", "text-body-md font-semibold"])}">${ssrInterpolate(todo.title)}</p><span class="${ssrRenderClass([priorityClass(todo.priority), "px-2 py-0.5 rounded text-[10px] font-bold uppercase"])}">${ssrInterpolate(todo.priority)}</span></div>`);
          if (todo.description) {
            _push(`<p class="text-label-sm text-on-surface-variant mb-2">${ssrInterpolate(todo.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex items-center gap-3 text-[11px] text-on-surface-variant/60"><span>${ssrInterpolate(todo.createdAt ? new Date(todo.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-")}</span>`);
          if (todo.done && todo.updatedAt) {
            _push(`<span>Selesai: ${ssrInterpolate(new Date(todo.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><button class="p-1.5 text-on-surface-variant hover:text-error transition-colors shrink-0"><span class="material-symbols-outlined text-sm">delete</span></button></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><h3 class="font-display text-headline-md text-on-primary">${ssrInterpolate(unref(editingId) ? "Edit Catatan" : "Tambah Catatan")}</h3><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-4"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Judul <span class="text-error">*</span></label><input${ssrRenderAttr("value", unref(form).title)} type="text" required class="w-full bg-surface-container-low border-none rounded-lg text-body-md p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Judul catatan"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Deskripsi</label><textarea class="w-full bg-surface-container-low border-none rounded-lg text-body-md p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Deskripsi (opsional)" rows="3">${ssrInterpolate(unref(form).description)}</textarea></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Prioritas</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md p-3 outline-none focus:ring-2 focus:ring-primary"><option value="low"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "low") : ssrLooseEqual(unref(form).priority, "low")) ? " selected" : ""}>Rendah</option><option value="medium"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "medium") : ssrLooseEqual(unref(form).priority, "medium")) ? " selected" : ""}>Sedang</option><option value="high"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "high") : ssrLooseEqual(unref(form).priority, "high")) ? " selected" : ""}>Tinggi</option></select></div><div class="flex justify-end gap-3 pt-2"><button type="button" class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg">Batal</button><button type="submit" class="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 active:scale-95 transition-all">${ssrInterpolate(unref(saving) ? "Menyimpan..." : unref(editingId) ? "Update" : "Simpan")}</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/wali-santri/todos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=todos-Cp0sVtTG.mjs.map
