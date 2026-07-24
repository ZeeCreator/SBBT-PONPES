import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { hasInjectionContext, inject, toRef, isRef, ref, getCurrentInstance, defineAsyncComponent, defineComponent, h, computed, unref, shallowRef, provide, shallowReactive, Suspense, Fragment, useSSRContext, createApp, withCtx, createVNode, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, reactive, effectScope, nextTick, mergeProps, getCurrentScope, isReadonly, isShallow, isReactive, toRaw } from 'vue';
import { v as parseURL, l as encodePath, x as decodePath, y as hasProtocol, z as isScriptProtocol, A as joinURL, w as withQuery, B as klona, C as sanitizeStatusCode, D as getRequestHeader, E as destr, F as isEqual, G as getContext, s as setCookie, H as getCookie, f as deleteCookie, $ as $fetch$1, I as defu, J as createHooks, c as createError$1, K as executeAsync } from '../_/nitro.mjs';
import { u as useHead$1, h as headSymbol, b as baseURL } from '../routes/renderer.mjs';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { signOut, createUserWithEmailAndPassword, signInWithCustomToken, signInWithEmailAndPassword } from 'firebase/auth';
import { get, ref as ref$1 } from 'firebase/database';
import { ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
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
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.21.8";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
const HTML_ATTR_ENCODE_MAP = {
  "&": "%26",
  '"': "%22",
  "'": "%27",
  "<": "%3C",
  ">": "%3E"
};
function encodeForHtmlAttr(value) {
  return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedHeader = encodeURL(location2, isExternalHost);
        const encodedLoc = encodeForHtmlAttr(encodedHeader);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
  return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    const pathname = url.pathname.replace(/^\/{2,}/, "/");
    return pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
function encodeRoutePath(url) {
  const parsed = parseURL(url);
  return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  Object.defineProperty(nuxtError, "status", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusCode,
    configurable: true
  });
  Object.defineProperty(nuxtError, "statusText", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusMessage,
    configurable: true
  });
  return nuxtError;
};
function freezeHead(head) {
  const realPush = head.push;
  head.push = () => ({ dispose: () => {
  }, patch: () => {
  }, _poll: () => {
  } });
  return () => {
    head.push = realPush;
  };
}
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    if (nuxtApp.ssrContext.islandContext) {
      const unfreeze = freezeHead(head);
      nuxtApp.hooks.hookOnce("app:created", unfreeze);
    }
    nuxtApp.vueApp.use(head);
  }
});
function toArray$1(value) {
  return Array.isArray(value) ? value : [value];
}
const matcher = (m, p) => {
  return [];
};
const _routeRulesMatcher = (path) => defu({}, ...matcher("", typeof path === "string" ? path.toLowerCase() : path).map((r) => r.data).reverse());
const routeRulesMatcher$1 = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher$1(path.toLowerCase());
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
const __nuxt_page_meta$Y = { layout: "super-admin" };
const __nuxt_page_meta$X = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$W = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$V = { layout: "ustadz", requiredRole: "ustadz" };
const __nuxt_page_meta$U = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$T = { layout: "alumni", requiredRole: "alumni" };
const __nuxt_page_meta$S = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$R = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$Q = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$P = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$O = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$N = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$M = { layout: "alumni", requiredRole: "alumni" };
const __nuxt_page_meta$L = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$K = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$J = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$I = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$H = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$G = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$F = { layout: "kesantrian", requiredRole: "kesantrian" };
const __nuxt_page_meta$E = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$D = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$C = { layout: "super-admin", requiredRole: "kesantrian" };
const __nuxt_page_meta$B = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$A = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$z = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$y = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$x = { layout: "super-admin" };
const __nuxt_page_meta$w = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$v = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$u = { layout: "wali-santri", requiredRole: "wali_santri" };
const __nuxt_page_meta$t = { layout: "wali-santri", requiredRole: "wali_santri" };
const __nuxt_page_meta$s = { layout: "alumni", requiredRole: "alumni" };
const __nuxt_page_meta$r = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$q = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$p = { layout: "kesantrian", requiredRole: "kesantrian" };
const __nuxt_page_meta$o = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$n = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$m = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$l = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$k = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$j = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$i = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$h = { layout: "super-admin", requiredRole: "bendahara" };
const __nuxt_page_meta$g = { layout: "wali-santri", requiredRole: "wali_santri" };
const __nuxt_page_meta$f = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$e = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$d = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$c = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$b = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$a = { layout: "wali-santri", requiredRole: "wali_santri" };
const __nuxt_page_meta$9 = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$8 = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$7 = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$6 = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$5 = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$4 = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$3 = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$2 = { layout: "super-admin", requiredRole: "super_admin" };
const __nuxt_page_meta$1 = { layout: "kesantrian", requiredRole: "kesantrian" };
const __nuxt_page_meta = { layout: "super-admin", requiredRole: "super_admin" };
const _routes = [
  {
    name: "index",
    path: "/",
    component: () => import('./index-BWyRc6XU.mjs')
  },
  {
    name: "developer",
    path: "/developer",
    meta: __nuxt_page_meta$Y || {},
    component: () => import('./developer-DGp1jJBN.mjs')
  },
  {
    name: "psb-tests",
    path: "/psb/tests",
    meta: __nuxt_page_meta$X || {},
    component: () => import('./tests-BCsVihC0.mjs')
  },
  {
    name: "auth-login",
    path: "/auth/login",
    component: () => import('./login-DNCCqrQS.mjs')
  },
  {
    name: "izin",
    path: "/izin",
    meta: __nuxt_page_meta$W || {},
    component: () => import('./index-yvcZYq2s.mjs')
  },
  {
    name: "portal-guru",
    path: "/portal/guru",
    meta: __nuxt_page_meta$V || {},
    component: () => import('./guru-BC2UAhVr.mjs')
  },
  {
    name: "psb-results",
    path: "/psb/results",
    meta: __nuxt_page_meta$U || {},
    component: () => import('./results-CPAVnJcn.mjs')
  },
  {
    name: "alumni",
    path: "/alumni",
    meta: __nuxt_page_meta$T || {},
    component: () => import('./index-BlQ9OYD1.mjs')
  },
  {
    name: "ibadah-infaq",
    path: "/ibadah/infaq",
    meta: __nuxt_page_meta$S || {},
    component: () => import('./infaq-CtTnmvYk.mjs')
  },
  {
    name: "ibadah-wirid",
    path: "/ibadah/wirid",
    meta: __nuxt_page_meta$R || {},
    component: () => import('./wirid-CU6x1EPW.mjs')
  },
  {
    name: "ibadah-zakat",
    path: "/ibadah/zakat",
    meta: __nuxt_page_meta$Q || {},
    component: () => import('./zakat-CaTraaoj.mjs')
  },
  {
    name: "jadwal",
    path: "/jadwal",
    meta: __nuxt_page_meta$P || {},
    component: () => import('./index-otz_B_Ra.mjs')
  },
  {
    name: "mutasi",
    path: "/mutasi",
    meta: __nuxt_page_meta$O || {},
    component: () => import('./index-BslENfot.mjs')
  },
  {
    name: "reward",
    path: "/reward",
    meta: __nuxt_page_meta$N || {},
    component: () => import('./index-DHb4sfXp.mjs')
  },
  {
    name: "alumni-events",
    path: "/alumni/events",
    meta: __nuxt_page_meta$M || {},
    component: () => import('./events-NSze_L2E.mjs')
  },
  {
    name: "khidmah",
    path: "/khidmah",
    meta: __nuxt_page_meta$L || {},
    component: () => import('./index-Cwd3rlYo.mjs')
  },
  {
    name: "laporan",
    path: "/laporan",
    meta: __nuxt_page_meta$K || {},
    component: () => import('./index-BxgYeZGM.mjs')
  },
  {
    name: "settings-rbac",
    path: "/settings/rbac",
    meta: __nuxt_page_meta$J || {},
    component: () => import('./rbac-aIu5vRe2.mjs')
  },
  {
    name: "tahfidz",
    path: "/tahfidz",
    meta: __nuxt_page_meta$I || {},
    component: () => import('./index-DkYlNNRO.mjs')
  },
  {
    name: "ibadah-fasting",
    path: "/ibadah/fasting",
    meta: __nuxt_page_meta$H || {},
    component: () => import('./fasting-BH6iIowp.mjs')
  },
  {
    name: "koperasi",
    path: "/koperasi",
    meta: __nuxt_page_meta$G || {},
    component: () => import('./index-CZyuKyD-.mjs')
  },
  {
    name: "portal-musyrif",
    path: "/portal/musyrif",
    meta: __nuxt_page_meta$F || {},
    component: () => import('./musyrif-BAIUcFOd.mjs')
  },
  {
    name: "ibadah-tahajjud",
    path: "/ibadah/tahajjud",
    meta: __nuxt_page_meta$E || {},
    component: () => import('./tahajjud-BWwxSfos.mjs')
  },
  {
    name: "akademik-grading",
    path: "/akademik/grading",
    meta: __nuxt_page_meta$D || {},
    component: () => import('./grading-Cs643tZt.mjs')
  },
  {
    name: "attendance",
    path: "/attendance",
    meta: __nuxt_page_meta$C || {},
    component: () => import('./index-CV4R2jfH.mjs')
  },
  {
    name: "inventaris",
    path: "/inventaris",
    meta: __nuxt_page_meta$B || {},
    component: () => import('./index-D_Uxths-.mjs')
  },
  {
    name: "kesehatan-growth",
    path: "/kesehatan/growth",
    meta: __nuxt_page_meta$A || {},
    component: () => import('./growth-BRqpHmRJ.mjs')
  },
  {
    name: "notifikasi",
    path: "/notifikasi",
    meta: __nuxt_page_meta$z || {},
    component: () => import('./index-B0SpLRQJ.mjs')
  },
  {
    name: "keuangan-salaries",
    path: "/keuangan/salaries",
    meta: __nuxt_page_meta$y || {},
    component: () => import('./salaries-BG99ANXg.mjs')
  },
  {
    name: "master-data",
    path: "/master-data",
    meta: __nuxt_page_meta$x || {},
    component: () => import('./index-BehaLOez.mjs')
  },
  {
    name: "psb-registrations",
    path: "/psb/registrations",
    meta: __nuxt_page_meta$w || {},
    component: () => import('./registrations-BL9deubl.mjs')
  },
  {
    name: "settings-teachers",
    path: "/settings/teachers",
    meta: __nuxt_page_meta$v || {},
    component: () => import('./teachers-CV8ymLJd.mjs')
  },
  {
    name: "student-dashboard",
    path: "/student/dashboard",
    meta: __nuxt_page_meta$u || {},
    component: () => import('./dashboard-DSbfeQHK.mjs')
  },
  {
    name: "wali-santri-todos",
    path: "/wali-santri/todos",
    meta: __nuxt_page_meta$t || {},
    component: () => import('./todos-Cp0sVtTG.mjs')
  },
  {
    name: "alumni-graduations",
    path: "/alumni/graduations",
    meta: __nuxt_page_meta$s || {},
    component: () => import('./graduations-D0GMA-A4.mjs')
  },
  {
    name: "akademik-curriculum",
    path: "/akademik/curriculum",
    meta: __nuxt_page_meta$r || {},
    component: () => import('./curriculum-Q8C4udYr.mjs')
  },
  {
    name: "akademik-menu",
    path: "/akademik/menu",
    meta: __nuxt_page_meta$q || {},
    component: () => import('./index-Cgg3qTc6.mjs')
  },
  {
    name: "kesantrian-students",
    path: "/kesantrian/students",
    meta: __nuxt_page_meta$p || {},
    component: () => import('./students-D2GbSg8z.mjs')
  },
  {
    name: "kesehatan-nutrition",
    path: "/kesehatan/nutrition",
    meta: __nuxt_page_meta$o || {},
    component: () => import('./nutrition-C6a7S1ur.mjs')
  },
  {
    name: "keuangan-spp-config",
    path: "/keuangan/spp-config",
    meta: __nuxt_page_meta$n || {},
    component: () => import('./spp-config-BOGe4kY5.mjs')
  },
  {
    name: "master-data-classes",
    path: "/master-data/classes",
    meta: __nuxt_page_meta$m || {},
    component: () => import('./classes-Dt4fm37U.mjs')
  },
  {
    name: "master-data-periods",
    path: "/master-data/periods",
    meta: __nuxt_page_meta$l || {},
    component: () => import('./periods-BfSj9N9a.mjs')
  },
  {
    name: "tools-import-export",
    path: "/tools/import-export",
    meta: __nuxt_page_meta$k || {},
    component: () => import('./import-export-BQKFPnTg.mjs')
  },
  {
    name: "extracurricular-arts",
    path: "/extracurricular/arts",
    meta: __nuxt_page_meta$j || {},
    component: () => import('./arts-C0OJGyD1.mjs')
  },
  {
    name: "kesehatan-sanitation",
    path: "/kesehatan/sanitation",
    meta: __nuxt_page_meta$i || {},
    component: () => import('./sanitation-CzAH0Q4V.mjs')
  },
  {
    name: "keuangan-spp-payment",
    path: "/keuangan/spp-payment",
    meta: __nuxt_page_meta$h || {},
    component: () => import('./spp-payment-B-gXbITX.mjs')
  },
  {
    name: "keuangan-wali-santri",
    path: "/keuangan/wali-santri",
    meta: __nuxt_page_meta$g || {},
    component: () => import('./wali-santri-D7Ab7ZZ_.mjs')
  },
  {
    name: "wali-santri-register",
    path: "/wali-santri/register",
    meta: __nuxt_page_meta$f || {},
    component: () => import('./register-KjrLHqe-.mjs')
  },
  {
    name: "extracurricular",
    path: "/extracurricular",
    meta: __nuxt_page_meta$e || {},
    component: () => import('./index-DDnD7077.mjs')
  },
  {
    name: "extracurricular-media",
    path: "/extracurricular/media",
    meta: __nuxt_page_meta$d || {},
    component: () => import('./media-BvJLzNF8.mjs')
  },
  {
    name: "keuangan-scholarships",
    path: "/keuangan/scholarships",
    meta: __nuxt_page_meta$c || {},
    component: () => import('./scholarships-DYOlc4Sc.mjs')
  },
  {
    name: "super-admin-dashboard",
    path: "/super-admin/dashboard",
    meta: __nuxt_page_meta$b || {},
    component: () => import('./dashboard-X8ijCfO_.mjs')
  },
  {
    name: "wali-santri-dashboard",
    path: "/wali-santri/dashboard",
    meta: __nuxt_page_meta$a || {},
    component: () => import('./dashboard-W8JWLDDj.mjs')
  },
  {
    name: "akademik-imtihan",
    path: "/akademik/imtihan",
    meta: __nuxt_page_meta$9 || {},
    component: () => import('./index-Cl3x1iuE.mjs')
  },
  {
    name: "extracurricular-hadroh",
    path: "/extracurricular/hadroh",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./hadroh-CuOOKHBY.mjs')
  },
  {
    name: "master-data-dormitories",
    path: "/master-data/dormitories",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./dormitories-C9w6GM5d.mjs')
  },
  {
    name: "ibadah-prayer-attendance",
    path: "/ibadah/prayer-attendance",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./prayer-attendance-X8agf6rC.mjs')
  },
  {
    name: "kesehatan-medical-records",
    path: "/kesehatan/medical-records",
    meta: __nuxt_page_meta$5 || {},
    component: () => import('./medical-records-DweTytfv.mjs')
  },
  {
    name: "master-data-academic-years",
    path: "/master-data/academic-years",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./academic-years-iOs6Posw.mjs')
  },
  {
    name: "akademik-imtihan-kelas-type",
    path: "/akademik/imtihan/:kelas()/:type()",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./_type_-EZnVoXp8.mjs')
  },
  {
    name: "extracurricular-public-speaking",
    path: "/extracurricular/public-speaking",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./public-speaking-Czq8rQNI.mjs')
  },
  {
    name: "kesantrian-information-vector",
    path: "/kesantrian/information-vector",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./index-DwxDbpae.mjs')
  },
  {
    name: "akademik-imtihan-kelas-nilai-examId",
    path: "/akademik/imtihan/:kelas()/nilai/:examId()",
    meta: __nuxt_page_meta || {},
    component: () => import('./_examId_-CGmZjKRV.mjs')
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function _mergeTransitionProps(routeProps) {
  const _props = [];
  for (const prop of routeProps) {
    if (!prop) {
      continue;
    }
    _props.push({
      ...prop,
      onAfterLeave: prop.onAfterLeave ? toArray(prop.onAfterLeave) : void 0,
      onBeforeLeave: prop.onBeforeLeave ? toArray(prop.onBeforeLeave) : void 0
    });
  }
  return defu(..._props);
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    if (from === START_LOCATION) {
      return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
    }
    return new Promise((resolve) => {
      const doScroll = () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      };
      nuxtApp.hooks.hookOnce("page:loading:end", () => {
        const transitionPromise = nuxtApp["~transitionPromise"];
        if (transitionPromise) {
          transitionPromise.then(doScroll);
        } else {
          doScroll();
        }
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    status: result && (result.status || result.statusCode) || 404,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || tryUseNuxtApp();
  return nuxt?.ssrContext?.head || nuxt?.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => {
    const decoded = decodeURIComponent(val);
    const parsed = destr(decoded);
    if (typeof parsed === "number" && (!Number.isFinite(parsed) || String(parsed) !== decoded)) {
      return decoded;
    }
    return parsed;
  },
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
let firebaseApp;
let db;
let auth;
let storage;
let rtdb;
function useFirebase() {
  return { firebaseApp, db, auth, storage, rtdb };
}
async function fetchRoleFromRtdb(uid) {
  try {
    const snap = await get(ref$1(rtdb, `roles/${uid}/role`));
    if (snap.exists()) return snap.val();
  } catch {
  }
  return null;
}
function useAuth() {
  const { auth: auth2 } = useFirebase();
  const user = useState("auth-user", () => null);
  const role = useState("auth-role", () => null);
  const loading = useState("auth-loading", () => true);
  const authCookie = useCookie("auth-logged-in", {
    default: () => false,
    sameSite: "lax",
    path: "/"
  });
  function init() {
  }
  async function login(email, password) {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body: { email, password }
    });
    if (auth2.currentUser?.email !== email) {
      const cred = await signInWithEmailAndPassword(auth2, email, password);
      user.value = cred.user;
    }
    authCookie.value = true;
    role.value = res.role || null;
    try {
      fetch("/api/activity-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Login Sistem",
          description: `${res.name || email}`,
          icon: "login",
          color: "#1a6bff",
          userName: res.name || email
        })
      });
    } catch {
    }
    return auth2.currentUser;
  }
  async function loginWithNis(nis) {
    const res = await $fetch("/api/auth/nis-login", {
      method: "POST",
      body: { nis }
    });
    if (res.customToken) {
      const cred = await signInWithCustomToken(auth2, res.customToken);
      user.value = cred.user;
    }
    authCookie.value = true;
    role.value = res.role || "wali_santri";
    try {
      fetch("/api/activity-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Login NIS",
          description: `${res.name} (NIS: ${nis})`,
          icon: "login",
          color: "#16a34a",
          userName: res.name || nis
        })
      });
    } catch {
    }
    return auth2.currentUser;
  }
  async function refreshRole() {
    if (!user.value) {
      role.value = null;
      return;
    }
    const r = await fetchRoleFromRtdb(user.value.uid);
    if (r) {
      role.value = r;
      return;
    }
    try {
      const idTokenResult = await user.value.getIdTokenResult();
      const claimsRole = idTokenResult.claims.role;
      if (typeof claimsRole === "string") {
        role.value = claimsRole;
        return;
      }
    } catch {
    }
    role.value = null;
  }
  async function register(email, password) {
    const cred = await createUserWithEmailAndPassword(auth2, email, password);
    return cred.user;
  }
  async function logout() {
    await signOut(auth2);
    user.value = null;
    role.value = null;
    authCookie.value = false;
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    } catch {
    }
  }
  async function loginWithToken(customToken) {
    const cred = await signInWithCustomToken(auth2, customToken);
    user.value = cred.user;
    authCookie.value = true;
    return cred.user;
  }
  async function getIdToken() {
    if (!auth2.currentUser) return null;
    return auth2.currentUser.getIdToken();
  }
  return { user, role, loading, init, login, loginWithNis, loginWithToken, register, logout, getIdToken, refreshRole };
}
const auth_45global = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  useAuth();
  const authCookie = useCookie("auth-logged-in");
  const publicRoutes = ["/", "/auth/login"];
  if (publicRoutes.includes(to.path)) return;
  {
    if (!authCookie.value) {
      return navigateTo("/auth/login");
    }
    return;
  }
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  auth_45global,
  manifest_45route_45rule
];
const namedMiddleware = {};
Object.assign(/* @__PURE__ */ Object.create(null), {});
const pageIslandRoutes = Object.assign(/* @__PURE__ */ Object.create(null), {});
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      const lastTo = to.matched.at(-1)?.components?.default;
      const lastFrom = from.matched.at(-1)?.components?.default;
      if (lastTo === lastFrom) {
        syncCurrentRoute();
        return;
      }
      if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const error = /* @__PURE__ */ useError();
    const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
    if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    const hasDeferredRoute = false;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext && !isServerPage) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray$1(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        const routeRules = getRouteRules({ path: to.path });
        if (routeRules.appMiddleware) {
          for (const key in routeRules.appMiddleware) {
            if (routeRules.appMiddleware[key]) {
              middlewareEntries.add(key);
            } else {
              middlewareEntries.delete(key);
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    if (isServerPage) {
      router.beforeResolve((to) => {
        const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
        const actual = to.matched.find((m) => m.components?.default?.__nuxt_island)?.components?.default;
        if (!expected || expected !== actual?.__nuxt_island) {
          nuxtApp.ssrContext["~renderResponse"] = {
            statusCode: 400,
            statusMessage: "Invalid island request path"
          };
          return false;
        }
      });
    }
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0 && !error.value) {
        return nuxtApp.runWithContext(() => showError(createError({
          status: 404,
          fatal: false,
          statusText: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        if (hasDeferredRoute) ;
        else {
          await router.replace({
            ...resolvedInitialRoute,
            force: true
          });
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const api_auth_zJEA5HkGD_ae3rBuyi56L2Tkq0B4FxZMZ7RWsPkCT80 = /* @__PURE__ */ defineNuxtPlugin(() => {
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  api_auth_zJEA5HkGD_ae3rBuyi56L2Tkq0B4FxZMZ7RWsPkCT80
];
const layouts = {
  alumni: defineAsyncComponent(() => import('./alumni-Bm3vxL1O.mjs').then((m) => m.default || m)),
  default: defineAsyncComponent(() => import('./default-BzmLKx2x.mjs').then((m) => m.default || m)),
  kesantrian: defineAsyncComponent(() => import('./kesantrian-CQ-UsBae.mjs').then((m) => m.default || m)),
  santri: defineAsyncComponent(() => import('./santri-DMIWqiXc.mjs').then((m) => m.default || m)),
  "super-admin": defineAsyncComponent(() => import('./super-admin-Bk_eSrLW.mjs').then((m) => m.default || m)),
  ustadz: defineAsyncComponent(() => import('./ustadz-BnESsY0j.mjs').then((m) => m.default || m)),
  "wali-santri": defineAsyncComponent(() => import('./wali-santri-lIMrEkEV.mjs').then((m) => m.default || m))
};
const routeRulesMatcher = _routeRulesMatcher;
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? routeRulesMatcher(route?.path).appLayout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = !!layout.value && layout.value in layouts;
      const hasTransition = hasLayout && !!(route?.meta.layoutTransition ?? appLayoutTransition);
      const transitionProps = hasTransition && _mergeTransitionProps([
        route?.meta.layoutTransition,
        appLayoutTransition,
        {
          onBeforeLeave() {
            nuxtApp["~transitionPromise"] = new Promise((resolve) => {
              nuxtApp["~transitionFinish"] = resolve;
            });
          },
          onAfterLeave() {
            nuxtApp["~transitionFinish"]?.();
            delete nuxtApp["~transitionFinish"];
            delete nuxtApp["~transitionPromise"];
          }
        }
      ]);
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(transitionProps, {
        default: () => h(
          Suspense,
          {
            suspensible: true,
            onResolve: async () => {
              await nextTick(done);
            }
          },
          {
            default: () => h(
              LayoutProvider,
              {
                layoutProps: mergeProps(context.attrs, route.meta.layoutProps ?? {}, { ref: layoutRef }),
                key: layout.value || void 0,
                name: layout.value,
                shouldProvide: !props.name,
                isRenderingNewLayout: (name) => {
                  return name !== previouslyRenderedLayout && name === layout.value;
                },
                hasTransition
              },
              context.slots
            )
          }
        )
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        // When name=false, always return true so NuxtPage doesn't skip rendering
        isCurrent: (route) => name === false || name === (route.meta.layout ?? routeRulesMatcher(route.path).appLayout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "SIM-PPT | Sistem Informasi Manajemen Pondok Pesantren Terpadu",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "description", content: "Sistem Informasi Manajemen Pondok Pesantren Terpadu - Platform manajemen digital terpadu untuk lingkungan pondok pesantren." }
      ],
      bodyAttrs: {
        class: "bg-background text-on-background font-sans min-h-screen overflow-x-hidden"
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtPage = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    const status = Number(_error.statusCode || 500);
    const is404 = status === 404;
    const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-Dm3uxygN.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-BxcHt3Pi.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ status: unref(status), statusText: unref(statusText), statusCode: unref(status), statusMessage: unref(statusText), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    function invokeAppErrorHandler(err, target, info) {
      const errorHandler = nuxtApp.vueApp.config.errorHandler;
      if (errorHandler && !errorHandler.__nuxt_default) {
        try {
          errorHandler(err, target, info);
        } catch (handlerError) {
          console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
        }
      }
    }
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        invokeAppErrorHandler(err, target, info);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));

export { useAuth as a, useRoute as b, useRouter as c, useNuxtApp as d, entry_default as default, encodeRoutePath as e, useRuntimeConfig as f, nuxtLinkDefaults as g, navigateTo as n, resolveRouteObject as r, useHead as u };
//# sourceMappingURL=server.mjs.map
