import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const loginMode = ref("email");
    const email = ref("");
    const nis = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const error = ref("");
    const submitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-mesh flex items-center justify-center p-gutter" }, _attrs))}><div class="w-full max-w-md"><div class="text-center mb-10"><div class="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><span class="material-symbols-outlined text-on-primary text-4xl">school</span></div><h1 class="font-display text-headline-lg text-primary">SIM-PPT</h1><p class="text-on-surface-variant text-body-md">Sistem Informasi Manajemen Pondok Pesantren Terpadu</p></div><div class="glass-card rounded-2xl p-8 shadow-xl"><h2 class="font-display text-headline-md text-primary mb-2">Masuk</h2><p class="text-on-surface-variant text-label-md mb-8">Silakan masuk menggunakan akun Anda.</p><form class="space-y-5">`);
      if (unref(error)) {
        _push(`<div class="p-3 rounded-lg bg-error-container text-on-error-container text-label-sm flex items-center gap-2"><span class="material-symbols-outlined text-sm">error</span> ${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex bg-surface-container-low rounded-lg p-1"><button type="button" class="${ssrRenderClass([unref(loginMode) === "email" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface", "flex-1 py-2 text-center text-label-sm font-medium rounded-md transition-all"])}">Email</button><button type="button" class="${ssrRenderClass([unref(loginMode) === "nis" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface", "flex-1 py-2 text-center text-label-sm font-medium rounded-md transition-all"])}">NIS Wali Santri</button></div>`);
      if (unref(loginMode) === "email") {
        _push(`<div class="space-y-4"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Email</label><input${ssrRenderAttr("value", unref(email))} type="email" class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="admin@pesantren.sch.id" required></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Kata Sandi</label><div class="relative"><input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(password), null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none pr-12" required><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"><span class="material-symbols-outlined text-sm">${ssrInterpolate(unref(showPassword) ? "visibility_off" : "visibility")}</span></button></div></div></div>`);
      } else {
        _push(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">NIS Santri</label><input${ssrRenderAttr("value", unref(nis))} type="text" maxlength="8" class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="8 digit NIS" required><p class="text-label-xs text-on-surface-variant">Masuk tanpa password menggunakan NIS santri/wali santri.</p></div>`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-body-md hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">`);
      if (unref(submitting)) {
        _push(`<span class="material-symbols-outlined animate-spin">refresh</span>`);
      } else {
        _push(`<span class="material-symbols-outlined">login</span>`);
      }
      _push(` ${ssrInterpolate(unref(submitting) ? "Memproses..." : "Masuk")}</button></form><div class="mt-8 pt-6 border-t border-outline-variant/20"><p class="text-center text-label-sm text-on-surface-variant mb-3">Demo Akses Cepat</p><div class="grid grid-cols-3 gap-2"><button class="p-2 rounded-xl bg-primary-fixed/30 text-on-primary-fixed-variant text-label-sm font-semibold hover:bg-primary-fixed/50 transition-colors">Admin</button><button class="p-2 rounded-xl bg-secondary-fixed/30 text-on-secondary-fixed-variant text-label-sm font-semibold hover:bg-secondary-fixed/50 transition-colors">Ustadz</button><button class="p-2 rounded-xl bg-surface-container-high text-on-surface text-label-sm font-semibold hover:bg-surface-container-highest transition-colors">Alumni</button><button class="p-2 rounded-xl bg-primary/10 text-primary text-label-sm font-semibold hover:bg-primary/20 transition-colors">Bendahara</button><button class="p-2 rounded-xl bg-primary-fixed/20 text-primary-fixed-variant text-label-sm font-semibold hover:bg-primary-fixed/40 transition-colors">Kesantrian</button><button class="p-2 rounded-xl bg-secondary/10 text-secondary text-label-sm font-semibold hover:bg-secondary/20 transition-colors">Wali</button></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DNCCqrQS.mjs.map
