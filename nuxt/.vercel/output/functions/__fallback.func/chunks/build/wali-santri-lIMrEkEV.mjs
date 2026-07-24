import { u as useRoleMenu, _ as _sfc_main$1, a as _sfc_main$2 } from './useRoleMenu-DhGS-L2v.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { a as useAuth } from './server.mjs';
import './nuxt-link-Ck3s51Pu.mjs';
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
  __name: "wali-santri",
  __ssrInlineRender: true,
  setup(__props) {
    const sidebarOpen = ref(false);
    const { user, role } = useAuth();
    const roleCfg = computed(() => useRoleMenu(role.value));
    const userName = computed(() => {
      var _a, _b;
      if ((_a = user.value) == null ? void 0 : _a.displayName) return user.value.displayName;
      if ((_b = user.value) == null ? void 0 : _b.email) return user.value.email.split("@")[0];
      return roleCfg.value.label;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Sidebar = _sfc_main$1;
      const _component_TopBar = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background flex" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Sidebar, {
        "menu-items": unref(roleCfg).menu,
        "role-label": unref(roleCfg).label,
        variant: unref(roleCfg).variant,
        "mobile-open": unref(sidebarOpen),
        onClose: ($event) => sidebarOpen.value = false
      }, null, _parent));
      _push(`<main class="flex-1 md:ml-64 min-h-screen">`);
      _push(ssrRenderComponent(_component_TopBar, {
        "role-label": unref(roleCfg).label,
        "user-name": unref(userName),
        onToggleSidebar: ($event) => sidebarOpen.value = !unref(sidebarOpen)
      }, null, _parent));
      _push(`<div class="pt-24 pb-12 px-gutter max-w-container-max mx-auto">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/wali-santri.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=wali-santri-lIMrEkEV.mjs.map
