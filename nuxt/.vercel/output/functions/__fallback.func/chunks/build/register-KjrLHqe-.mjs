import { defineComponent, reactive, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    const form = reactive({ nis: "" });
    const message = ref("");
    const saving = ref(false);
    const studentInfo = ref(null);
    const accounts = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Registrasi Wali Santri</h2><p class="text-body-md text-on-surface-variant">Buat akun wali santri yang terhubung dengan NIS santri. Login menggunakan NIS tanpa password.</p></div>`);
      if (unref(message)) {
        _push(`<div class="${ssrRenderClass([unref(message).includes("\u2705") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700", "mb-stack-md p-4 rounded-xl text-label-sm font-medium"])}">${ssrInterpolate(unref(message))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter"><div class="glass-card rounded-2xl p-stack-md shadow-sm"><h3 class="font-display text-title-lg text-primary mb-4">Buat Akun Baru</h3><form class="space-y-4"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">NIS Santri <span class="text-error">*</span></label><div class="flex gap-2"><input${ssrRenderAttr("value", unref(form).nis)} type="text" maxlength="8" required class="flex-1 bg-surface-container-low border-none rounded-lg text-body-md p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="8 digit NIS"><button type="button" class="px-3 py-2 bg-surface-container-high text-label-sm rounded-lg hover:bg-surface-container-higher transition-all">Cari</button></div></div>`);
      if (unref(studentInfo)) {
        _push(`<div class="p-3 bg-surface-container-low rounded-lg"><p class="text-label-sm font-semibold text-primary">${ssrInterpolate(unref(studentInfo).name)}</p><p class="text-label-xs text-on-surface-variant">NIS: ${ssrInterpolate(unref(studentInfo).nis)} \u2022 Kelas: ${ssrInterpolate(unref(studentInfo).class || "-")}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="w-full bg-primary text-on-primary py-3 rounded-xl text-label-md font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-60">${ssrInterpolate(unref(saving) ? "Mendaftarkan..." : "Daftarkan Wali Santri")}</button><p class="text-label-xs text-on-surface-variant">Wali santri login menggunakan NIS tanpa password.</p></form></div><div class="glass-card rounded-2xl p-stack-md shadow-sm"><div class="flex items-center justify-between mb-4"><h3 class="font-display text-title-lg text-primary">Akun Terdaftar</h3><button class="p-2 text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined">refresh</span></button></div>`);
      if (unref(accounts).length === 0) {
        _push(`<div class="text-center py-8 text-on-surface-variant text-label-sm">Belum ada akun wali santri terdaftar.</div>`);
      } else {
        _push(`<div class="space-y-3 max-h-96 overflow-y-auto"><!--[-->`);
        ssrRenderList(unref(accounts), (acct) => {
          _push(`<div class="p-3 bg-surface-container-low rounded-lg flex items-center justify-between"><div><p class="text-label-sm font-semibold">${ssrInterpolate(acct.parentName || acct.studentName)}</p><p class="text-label-xs text-on-surface-variant">NIS: ${ssrInterpolate(acct.nis)} \u2022 ${ssrInterpolate(acct.email)}</p></div><div class="flex items-center gap-2"><span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">Active</span><button class="p-1 text-on-surface-variant hover:text-error transition-colors" title="Hapus akun"><span class="material-symbols-outlined text-lg">delete</span></button></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/wali-santri/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-KjrLHqe-.mjs.map
