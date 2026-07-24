import { _ as __nuxt_component_0 } from './nuxt-link-Ck3s51Pu.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const cards = [
      { label: "Kelas & Tingkatan", icon: "layers", to: "/master-data/classes", desc: "Atur kelas, tingkatan, dan rombongan belajar" },
      { label: "Gedung & Kamar", icon: "domain", to: "/master-data/dormitories", desc: "Kelola gedung, lantai, dan kamar santri" },
      { label: "Tahun Ajaran", icon: "calendar_today", to: "/master-data/academic-years", desc: "Tentukan tahun ajaran aktif" },
      { label: "Periode", icon: "date_range", to: "/master-data/periods", desc: "Atur periode dalam tahun ajaran" },
      { label: "Guru / Ustadz", icon: "badge", to: "/settings/teachers", desc: "Data tenaga pengajar dan wali kelas" },
      { label: "Mata Pelajaran", icon: "menu_book", to: "/akademik/curriculum", desc: "Kurikulum dan daftar mata pelajaran" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><h1 class="text-headline-lg font-bold">Master Data</h1></div><p class="text-body-md text-on-surface/60 max-w-2xl"> Kelola data inti pondok \u2014 kelas, kamar, guru, mata pelajaran, dan pengaturan tahun ajaran. </p><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      ssrRenderList(cards, (card) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: card.to,
          to: card.to,
          class: "group block rounded-xl border border-outline/20 bg-surface p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-start gap-4"${_scopeId}><div class="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center shrink-0"${_scopeId}><span class="material-symbols-outlined text-primary text-2xl"${_scopeId}>${ssrInterpolate(card.icon)}</span></div><div class="flex-1 min-w-0"${_scopeId}><h3 class="font-semibold text-body-lg group-hover:text-primary transition-colors"${_scopeId}>${ssrInterpolate(card.label)}</h3><p class="text-body-sm text-on-surface/50 mt-1"${_scopeId}>${ssrInterpolate(card.desc)}</p></div><span class="material-symbols-outlined text-on-surface/30 group-hover:text-primary/60 transition-colors"${_scopeId}>chevron_right</span></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-start gap-4" }, [
                  createVNode("div", { class: "w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center shrink-0" }, [
                    createVNode("span", { class: "material-symbols-outlined text-primary text-2xl" }, toDisplayString(card.icon), 1)
                  ]),
                  createVNode("div", { class: "flex-1 min-w-0" }, [
                    createVNode("h3", { class: "font-semibold text-body-lg group-hover:text-primary transition-colors" }, toDisplayString(card.label), 1),
                    createVNode("p", { class: "text-body-sm text-on-surface/50 mt-1" }, toDisplayString(card.desc), 1)
                  ]),
                  createVNode("span", { class: "material-symbols-outlined text-on-surface/30 group-hover:text-primary/60 transition-colors" }, "chevron_right")
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/master-data/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BehaLOez.mjs.map
