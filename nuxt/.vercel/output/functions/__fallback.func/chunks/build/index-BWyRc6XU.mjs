import { _ as __nuxt_component_0 } from './nuxt-link-Ck3s51Pu.mjs';
import { mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'firebase/auth';
import 'firebase/database';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-mesh flex items-center justify-center p-gutter" }, _attrs))}><div class="w-full max-w-md"><div class="text-center mb-10"><div class="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><span class="material-symbols-outlined text-on-primary text-4xl">school</span></div><h1 class="font-display text-headline-lg text-primary">SIM-PPT</h1><p class="text-on-surface-variant text-body-md">Sistem Informasi Manajemen Pondok Pesantren Terpadu</p></div><div class="glass-card rounded-2xl p-8 shadow-xl"><h2 class="font-display text-headline-md text-primary mb-6">Selamat Datang</h2><p class="text-on-surface-variant text-label-md mb-8">Pilih portal untuk melanjutkan:</p><div class="grid grid-cols-2 gap-4">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/auth/login",
    class: "p-6 rounded-2xl bg-primary text-on-primary hover:brightness-110 transition-all text-center"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<span class="material-symbols-outlined text-3xl mb-2"${_scopeId}>admin_panel_settings</span><p class="font-bold text-label-md"${_scopeId}>Admin</p><p class="text-[10px] opacity-80"${_scopeId}>Dashboard Manajemen</p>`);
      } else {
        return [
          createVNode("span", { class: "material-symbols-outlined text-3xl mb-2" }, "admin_panel_settings"),
          createVNode("p", { class: "font-bold text-label-md" }, "Admin"),
          createVNode("p", { class: "text-[10px] opacity-80" }, "Dashboard Manajemen")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/wali-santri/dashboard",
    class: "p-6 rounded-2xl bg-primary-container text-on-primary-container hover:brightness-110 transition-all text-center"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<span class="material-symbols-outlined text-3xl mb-2"${_scopeId}>family_history</span><p class="font-bold text-label-md"${_scopeId}>Wali Santri</p><p class="text-[10px] opacity-80"${_scopeId}>Portal Orang Tua</p>`);
      } else {
        return [
          createVNode("span", { class: "material-symbols-outlined text-3xl mb-2" }, "family_history"),
          createVNode("p", { class: "font-bold text-label-md" }, "Wali Santri"),
          createVNode("p", { class: "text-[10px] opacity-80" }, "Portal Orang Tua")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/student/dashboard",
    class: "p-6 rounded-2xl bg-secondary-fixed text-on-secondary-fixed hover:brightness-110 transition-all text-center"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<span class="material-symbols-outlined text-3xl mb-2"${_scopeId}>school</span><p class="font-bold text-label-md"${_scopeId}>Santri</p><p class="text-[10px] opacity-80"${_scopeId}>Portal Santri</p>`);
      } else {
        return [
          createVNode("span", { class: "material-symbols-outlined text-3xl mb-2" }, "school"),
          createVNode("p", { class: "font-bold text-label-md" }, "Santri"),
          createVNode("p", { class: "text-[10px] opacity-80" }, "Portal Santri")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/kesantrian/students",
    class: "p-6 rounded-2xl bg-surface-container-high text-on-surface hover:brightness-110 transition-all text-center"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<span class="material-symbols-outlined text-3xl mb-2"${_scopeId}>gavel</span><p class="font-bold text-label-md"${_scopeId}>Kesantrian</p><p class="text-[10px] opacity-80"${_scopeId}>Manajemen Santri</p>`);
      } else {
        return [
          createVNode("span", { class: "material-symbols-outlined text-3xl mb-2" }, "gavel"),
          createVNode("p", { class: "font-bold text-label-md" }, "Kesantrian"),
          createVNode("p", { class: "text-[10px] opacity-80" }, "Manajemen Santri")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-BWyRc6XU.mjs.map
