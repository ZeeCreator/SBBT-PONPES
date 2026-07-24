import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const classes = ref([]);
    const loading = ref(true);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Imtihan &amp; Iktibar</h2><p class="text-on-surface-variant text-body-md">Pilih kelas untuk mengelola imtihan (ujian) atau iktibar (catatan harian).</p></div>`);
      if (unref(error)) {
        _push(`<div class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"><!--[-->`);
        ssrRenderList(unref(classes), (cls) => {
          _push(`<div class="glass-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-outline-variant/10"><div class="flex items-center gap-3 mb-4"><div class="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center"><span class="material-symbols-outlined text-primary">school</span></div><div><h3 class="font-display text-title-md text-primary">${ssrInterpolate(cls.name || cls.nama)}</h3><p class="text-label-sm text-on-surface-variant">Tingkat ${ssrInterpolate(cls.level || cls.tingkat)} - ${ssrInterpolate(cls.group || "-")}</p></div></div><div class="flex gap-3"><button class="flex-1 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all text-center"><span class="material-symbols-outlined text-sm align-middle mr-1">quiz</span> Imtihan </button><button class="flex-1 px-4 py-2 bg-secondary text-on-secondary rounded-lg text-label-md hover:brightness-110 transition-all text-center"><span class="material-symbols-outlined text-sm align-middle mr-1">edit_note</span> Iktibar </button></div></div>`);
        });
        _push(`<!--]-->`);
        if (unref(classes).length === 0) {
          _push(`<div class="col-span-full text-center py-12 text-on-surface-variant text-label-md">Belum ada kelas</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/akademik/imtihan/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cl3x1iuE.mjs.map
