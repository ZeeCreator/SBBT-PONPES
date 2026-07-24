import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "import-export",
  __ssrInlineRender: true,
  setup(__props) {
    const templates = [
      { label: "Template Data Santri", type: "santri" },
      { label: "Template Nilai", type: "nilai" },
      { label: "Template Absensi Bulanan", type: "absensi" }
    ];
    const importType = ref("santri");
    const selectedFile = ref(null);
    const importing = ref(false);
    const importResult = ref(null);
    ref();
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Import / Export Data</h2><p class="text-on-surface-variant text-body-md">Download template Excel dan import data santri, nilai, absensi.</p></div><div class="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-stack-lg"><div class="glass-card rounded-xl p-6 shadow-sm"><div class="flex items-center gap-3 mb-4"><div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><span class="material-symbols-outlined text-blue-600">file_download</span></div><div><h3 class="font-display text-title-md text-primary">Download Template</h3><p class="text-label-sm text-on-surface-variant">Pilih tipe data untuk mengunduh template Excel.</p></div></div><div class="space-y-3"><!--[-->`);
      ssrRenderList(templates, (tpl) => {
        _push(`<button class="w-full flex items-center justify-between px-4 py-3 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-all"><span class="text-label-md">${ssrInterpolate(tpl.label)}</span><span class="material-symbols-outlined text-on-surface-variant text-sm">download</span></button>`);
      });
      _push(`<!--]--></div></div><div class="glass-card rounded-xl p-6 shadow-sm"><div class="flex items-center gap-3 mb-4"><div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center"><span class="material-symbols-outlined text-green-600">file_upload</span></div><div><h3 class="font-display text-title-md text-primary">Import Data</h3><p class="text-label-sm text-on-surface-variant">Upload file Excel yang sudah diisi.</p></div></div><div class="space-y-3"><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary"><option value="santri"${ssrIncludeBooleanAttr(Array.isArray(unref(importType)) ? ssrLooseContain(unref(importType), "santri") : ssrLooseEqual(unref(importType), "santri")) ? " selected" : ""}>Data Santri</option><option value="nilai"${ssrIncludeBooleanAttr(Array.isArray(unref(importType)) ? ssrLooseContain(unref(importType), "nilai") : ssrLooseEqual(unref(importType), "nilai")) ? " selected" : ""}>Nilai</option></select><div class="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 text-center hover:border-primary/50 transition-all cursor-pointer"><input type="file" accept=".xlsx,.xls" class="hidden"><span class="material-symbols-outlined text-3xl text-on-surface-variant mb-2">cloud_upload</span><p class="text-label-sm text-on-surface-variant">Klik atau drop file Excel di sini</p>`);
      if (unref(selectedFile)) {
        _push(`<p class="text-label-sm text-primary mt-1">${ssrInterpolate(unref(selectedFile).name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(selectedFile)) {
        _push(`<button class="w-full px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 active:scale-95 transition-all"${ssrIncludeBooleanAttr(unref(importing)) ? " disabled" : ""}>${ssrInterpolate(unref(importing) ? "Mengimpor..." : "Import Data")}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (unref(importResult)) {
        _push(`<div class="glass-card rounded-xl p-6 shadow-sm"><h3 class="font-display text-title-md text-primary mb-3">Hasil Import</h3><div class="grid grid-cols-3 gap-4 mb-3"><div class="text-center p-3 bg-green-50 rounded-lg"><p class="font-display text-headline-md text-green-600">${ssrInterpolate(unref(importResult).success)}</p><p class="text-label-sm text-green-700">Sukses</p></div><div class="text-center p-3 bg-red-50 rounded-lg"><p class="font-display text-headline-md text-red-600">${ssrInterpolate(unref(importResult).failed)}</p><p class="text-label-sm text-red-700">Gagal</p></div><div class="text-center p-3 bg-surface-container-low rounded-lg"><p class="font-display text-headline-md text-on-surface-variant">${ssrInterpolate(unref(importResult).success + unref(importResult).failed)}</p><p class="text-label-sm text-on-surface-variant">Total</p></div></div>`);
        if ((_a = unref(importResult).errors) == null ? void 0 : _a.length) {
          _push(`<div class="space-y-1"><p class="text-label-sm text-red-600 font-medium">Error:</p><!--[-->`);
          ssrRenderList(unref(importResult).errors.slice(0, 5), (err, i) => {
            _push(`<p class="text-label-sm text-red-500">- ${ssrInterpolate(err)}</p>`);
          });
          _push(`<!--]-->`);
          if (unref(importResult).errors.length > 5) {
            _push(`<p class="text-label-sm text-on-surface-variant">...dan ${ssrInterpolate(unref(importResult).errors.length - 5)} error lainnya</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/import-export.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=import-export-BQKFPnTg.mjs.map
