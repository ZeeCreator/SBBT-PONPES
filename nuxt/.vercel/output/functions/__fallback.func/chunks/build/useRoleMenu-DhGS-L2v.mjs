import { _ as __nuxt_component_0 } from './nuxt-link-Ck3s51Pu.mjs';
import { defineComponent, computed, unref, withCtx, createVNode, toDisplayString, ref, reactive, mergeProps, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle, ssrRenderTeleport } from 'vue/server-renderer';
import { b as useRoute, c as useRouter } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Sidebar",
  __ssrInlineRender: true,
  props: {
    menuItems: {},
    roleLabel: {},
    variant: { default: "admin" },
    mobileOpen: { type: Boolean, default: false }
  },
  emits: ["close"],
  setup(__props) {
    const props = __props;
    const route = useRoute();
    const variantConfig = {
      admin: {
        bg: "bg-primary-container",
        title: "text-on-primary",
        subtitle: "text-on-primary/60",
        closeBtn: "text-on-primary/70 hover:text-on-primary",
        iconWrapper: "w-10 h-10 rounded-lg bg-primary flex items-center justify-center",
        iconText: "text-on-primary",
        activeBg: "bg-white/10",
        activeBorder: "border-l-4 border-secondary-container",
        activeText: "text-on-primary font-bold",
        activeIcon: "text-secondary-container",
        inactiveText: "text-on-primary/70",
        inactiveHover: "hover:text-on-primary hover:bg-white/5",
        actionBtn: "text-on-primary/70 hover:text-on-primary hover:bg-white/5"
      },
      ustadz: {
        bg: "bg-[#1a3a5c]",
        title: "text-white",
        subtitle: "text-white/60",
        closeBtn: "text-white/70 hover:text-white",
        iconWrapper: "w-10 h-10 rounded-lg bg-[#2d6a9f] flex items-center justify-center",
        iconText: "text-white",
        activeBg: "bg-white/10",
        activeBorder: "border-l-4 border-[#fbbf24]",
        activeText: "text-white font-bold",
        activeIcon: "text-[#fbbf24]",
        inactiveText: "text-white/70",
        inactiveHover: "hover:text-white hover:bg-white/5",
        actionBtn: "text-white/70 hover:text-white hover:bg-white/5"
      },
      alumni: {
        bg: "bg-[#374151]",
        title: "text-white",
        subtitle: "text-white/60",
        closeBtn: "text-white/70 hover:text-white",
        iconWrapper: "w-10 h-10 rounded-lg bg-[#6366f1] flex items-center justify-center",
        iconText: "text-white",
        activeBg: "bg-white/10",
        activeBorder: "border-l-4 border-[#a5b4fc]",
        activeText: "text-white font-bold",
        activeIcon: "text-[#a5b4fc]",
        inactiveText: "text-white/70",
        inactiveHover: "hover:text-white hover:bg-white/5",
        actionBtn: "text-white/70 hover:text-white hover:bg-white/5"
      },
      walisantri: {
        bg: "bg-primary",
        title: "text-on-primary",
        subtitle: "text-on-primary/60",
        closeBtn: "text-on-primary/70 hover:text-on-primary",
        iconWrapper: "w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center",
        iconText: "text-on-primary",
        activeBg: "bg-white/10",
        activeBorder: "border-l-4 border-secondary-container",
        activeText: "text-on-primary font-bold",
        activeIcon: "text-secondary-container",
        inactiveText: "text-on-primary/70",
        inactiveHover: "hover:text-on-primary hover:bg-white/5",
        actionBtn: "text-on-primary/70 hover:text-on-primary hover:bg-white/5"
      },
      santri: {
        bg: "bg-[#0f4c3a]",
        title: "text-white",
        subtitle: "text-white/60",
        closeBtn: "text-white/70 hover:text-white",
        iconWrapper: "w-10 h-10 rounded-lg bg-[#2e7d5e] flex items-center justify-center",
        iconText: "text-white",
        activeBg: "bg-white/10",
        activeBorder: "border-l-4 border-[#4caf50]",
        activeText: "text-white font-bold",
        activeIcon: "text-[#4caf50]",
        inactiveText: "text-white/70",
        inactiveHover: "hover:text-white hover:bg-white/5",
        actionBtn: "text-white/70 hover:text-white hover:bg-white/5"
      }
    };
    const cfg = computed(() => variantConfig[props.variant]);
    const sidebarBg = computed(() => cfg.value.bg);
    const titleClass = computed(() => cfg.value.title);
    const subtitleClass = computed(() => cfg.value.subtitle);
    const closeBtnClass = computed(() => cfg.value.closeBtn);
    const iconWrapperClass = computed(() => cfg.value.iconWrapper);
    const iconTextClass = computed(() => cfg.value.iconText);
    const activeIconClass = computed(() => cfg.value.activeIcon);
    function navLinkClass(to) {
      const active = isActive(to);
      return [
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
        active ? cfg.value.activeBg : cfg.value.inactiveText + " " + cfg.value.inactiveHover,
        active ? cfg.value.activeBorder : "",
        active ? cfg.value.activeText : ""
      ];
    }
    const actionBtnClass = computed(() => cfg.value.actionBtn);
    function isActive(path) {
      if (path === "/super-admin/dashboard" || path === "/wali-santri/dashboard" || path === "/student/dashboard") {
        return route.path === path;
      }
      return route.path.startsWith(path);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><aside class="${ssrRenderClass([
        "h-screen w-64 fixed left-0 top-0 flex flex-col py-stack-md shadow-xl z-50 transition-transform duration-300",
        unref(sidebarBg),
        __props.mobileOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0"
      ])}"><div class="px-gutter mb-stack-lg flex items-center gap-3"><div class="${ssrRenderClass(unref(iconWrapperClass))}"><span class="${ssrRenderClass([unref(iconTextClass), "material-symbols-outlined text-2xl"])}">school</span></div><div class="flex-1"><h1 class="${ssrRenderClass([unref(titleClass), "font-display text-headline-md font-bold leading-tight"])}">SIM-PPT</h1><p class="${ssrRenderClass([unref(subtitleClass), "text-[10px] tracking-widest uppercase"])}">${ssrInterpolate(__props.roleLabel)}</p></div><button class="${ssrRenderClass([unref(closeBtnClass), "md:hidden"])}"><span class="material-symbols-outlined">close</span></button></div><nav class="flex-1 space-y-1 px-3 overflow-y-auto scrollbar-hide"><!--[-->`);
      ssrRenderList(__props.menuItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: navLinkClass(item.to),
          onClick: ($event) => _ctx.$emit("close")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{ [unref(activeIconClass)]: isActive(item.to) }, "material-symbols-outlined"])}"${_scopeId}>${ssrInterpolate(item.icon)}</span><span class="text-label-md"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["material-symbols-outlined", { [unref(activeIconClass)]: isActive(item.to) }]
                }, toDisplayString(item.icon), 3),
                createVNode("span", { class: "text-label-md" }, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="mt-auto px-3 space-y-1 border-t border-white/10 pt-stack-md"><button class="${ssrRenderClass([unref(actionBtnClass), "flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all duration-200"])}"><span class="material-symbols-outlined">logout</span><span class="text-label-md">Logout</span></button></div></aside>`);
      if (__props.mobileOpen) {
        _push(`<div class="fixed inset-0 bg-black/30 z-40 md:hidden"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TopBar",
  __ssrInlineRender: true,
  props: {
    roleLabel: {},
    userName: {},
    subtitle: { default: "" }
  },
  emits: ["toggle-sidebar"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useRouter();
    ref(null);
    const searchQuery = ref("");
    const showResults = ref(false);
    const loading = ref(false);
    const highlightedIndex = ref(-1);
    const results = ref({ students: [], teachers: [] });
    const showSystemPopup = ref(false);
    const systemStatus = reactive({
      status: "checking...",
      timestamp: "",
      services: {},
      uptime: 0
    });
    const serverUptime = ref("-");
    const showNotifPopup = ref(false);
    const notifications = ref([]);
    const loadingNotif = ref(false);
    const showAppsPopup = ref(false);
    const quickApps = [
      { label: "Santri", icon: "group", to: "/kesantrian/students", bg: "#e8f0fe", color: "#1a6bff" },
      { label: "Absensi", icon: "calendar_month", to: "/attendance", bg: "#e6f7e6", color: "#2e7d32" },
      { label: "Akademik", icon: "school", to: "/akademik/menu", bg: "#fce4ec", color: "#c62828" },
      { label: "Keuangan", icon: "payments", to: "/keuangan/spp-payment", bg: "#fff3e0", color: "#e65100" },
      { label: "Izin", icon: "passport", to: "/izin", bg: "#f3e5f5", color: "#6a1b9a" },
      { label: "Developer", icon: "code", to: "/developer", bg: "#e8eaf6", color: "#283593" }
    ];
    function timeAgo(ts) {
      if (!ts) return "";
      const diff = Date.now() - new Date(ts).getTime();
      const mins = Math.floor(diff / 6e4);
      if (mins < 1) return "baru saja";
      if (mins < 60) return `${mins}m yang lalu`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}j yang lalu`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days}h yang lalu`;
      return new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    }
    function getInitials(name) {
      return (name || "A").split(" ").map((n) => n[0]).filter(Boolean).join("").substring(0, 2).toUpperCase();
    }
    const initials = computed(() => {
      const name = props.userName || "A";
      return name.split(" ").map((n) => n[0]).filter(Boolean).join("").substring(0, 2).toUpperCase() || "AD";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 bg-surface/60 backdrop-blur-xl border-b border-white/20 shadow-sm flex justify-between items-center px-gutter z-30" }, _attrs))}><div class="flex items-center gap-4 flex-1"><button class="md:hidden text-primary p-2"><span class="material-symbols-outlined">menu</span></button><div class="relative hidden sm:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30 flex-1 max-w-md"><span class="material-symbols-outlined text-outline text-sm">search</span><input class="bg-transparent border-none focus:ring-0 text-body-sm w-full ml-2 placeholder:text-on-surface-variant outline-none" placeholder="Cari santri atau ustadz..." type="text"${ssrRenderAttr("value", unref(searchQuery))}>`);
      if (unref(searchQuery)) {
        _push(`<button class="text-on-surface-variant hover:text-on-surface ml-1"><span class="material-symbols-outlined text-sm">close</span></button>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showResults) && unref(searchQuery).length >= 1) {
        _push(`<div class="absolute top-full left-0 right-0 mt-2 bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[70vh] overflow-y-auto">`);
        if (unref(loading)) {
          _push(`<div class="p-6 text-center text-on-surface-variant text-label-sm"><span class="material-symbols-outlined animate-spin align-middle mr-2 text-sm">refresh</span> Mencari... </div>`);
        } else if (unref(results).students.length === 0 && unref(results).teachers.length === 0) {
          _push(`<div class="p-6 text-center text-on-surface-variant text-label-sm"> Tidak ditemukan hasil untuk &quot;${ssrInterpolate(unref(searchQuery))}&quot; </div>`);
        } else {
          _push(`<!--[-->`);
          if (unref(results).students.length > 0) {
            _push(`<div class="p-3 pb-0"><p class="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold px-3 mb-1">Santri</p><!--[-->`);
            ssrRenderList(unref(results).students, (s, i) => {
              _push(`<div class="${ssrRenderClass(["flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors", unref(highlightedIndex) === i ? "bg-primary-fixed/20" : "hover:bg-surface-container-high"])}"><div class="w-9 h-9 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-label-sm shrink-0">${ssrInterpolate(getInitials(s.name))}</div><div class="flex-1 min-w-0"><p class="text-label-md text-on-surface truncate">${ssrInterpolate(s.name)}</p><p class="text-[11px] text-on-surface-variant truncate">NIS: ${ssrInterpolate(s.nis || "-")} \u2022 ${ssrInterpolate(s.class || "-")}</p></div><div class="flex items-center gap-1 shrink-0"><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Lihat Detail"><span class="material-symbols-outlined text-sm">open_in_new</span></button></div></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(results).teachers.length > 0) {
            _push(`<div class="p-3"><p class="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold px-3 mb-1">Ustadz / Guru</p><!--[-->`);
            ssrRenderList(unref(results).teachers, (t, i) => {
              _push(`<div class="${ssrRenderClass(["flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors", unref(highlightedIndex) === unref(results).students.length + i ? "bg-primary-fixed/20" : "hover:bg-surface-container-high"])}"><div class="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold text-label-sm shrink-0">${ssrInterpolate(getInitials(t.name))}</div><div class="flex-1 min-w-0"><p class="text-label-md text-on-surface truncate">${ssrInterpolate(t.name)}</p><p class="text-[11px] text-on-surface-variant truncate">${ssrInterpolate(t.specialization || "-")} \u2022 ${ssrInterpolate(t.status || "-")}</p></div><div class="flex items-center gap-1 shrink-0"><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Lihat Detail"><span class="material-symbols-outlined text-sm">open_in_new</span></button></div></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex items-center gap-stack-md"><div class="${ssrRenderClass([unref(systemStatus).status === "healthy" ? "bg-green-50 text-green-700 hover:bg-green-100" : unref(systemStatus).status === "degraded" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high", "relative hidden lg:flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition-colors select-none"])}"><span class="${ssrRenderClass([unref(systemStatus).status === "healthy" ? "bg-green-500 animate-pulse" : unref(systemStatus).status === "degraded" ? "bg-red-500" : "bg-on-surface-variant", "w-2 h-2 rounded-full"])}"></span><span class="text-label-sm">System</span></div><div class="relative"><button class="text-on-surface-variant hover:bg-surface-container-high/50 p-2 rounded-full transition-colors relative"><span class="material-symbols-outlined">notifications</span>`);
      if (unref(notifications).length > 0) {
        _push(`<span class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">${ssrInterpolate(unref(notifications).length > 9 ? "9+" : unref(notifications).length)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      if (unref(showNotifPopup)) {
        _push(`<div class="absolute top-full right-0 mt-2 w-80 bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden z-50"><div class="px-4 py-3 border-b border-outline-variant/20 flex items-center justify-between"><span class="text-label-md font-bold text-on-surface">Notifikasi</span><span class="text-label-sm text-on-surface-variant">${ssrInterpolate(unref(notifications).length)} baru</span></div><div class="max-h-80 overflow-y-auto">`);
        if (unref(loadingNotif)) {
          _push(`<div class="p-6 text-center text-on-surface-variant text-label-sm"><span class="material-symbols-outlined animate-spin align-middle mr-2 text-sm">refresh</span> Memuat... </div>`);
        } else if (unref(notifications).length === 0) {
          _push(`<div class="p-6 text-center text-on-surface-variant text-label-sm">Tidak ada notifikasi</div>`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(unref(notifications).slice(0, 10), (n) => {
            _push(`<div class="flex items-start gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors border-b border-outline-variant/10 last:border-b-0"><div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style="${ssrRenderStyle({ backgroundColor: n.color || "#e8f0fe" })}"><span class="material-symbols-outlined text-sm" style="${ssrRenderStyle({ color: n.color ? "#fff" : "#1a6bff" })}">${ssrInterpolate(n.icon || "notifications")}</span></div><div class="flex-1 min-w-0"><p class="text-label-sm text-on-surface truncate">${ssrInterpolate(n.action || n.title || "-")}</p><p class="text-[11px] text-on-surface-variant truncate">${ssrInterpolate(n.description || n.message || "")}</p><p class="text-[10px] text-on-surface-variant mt-0.5">${ssrInterpolate(timeAgo(n.timestamp || n.createdAt || ""))}</p></div></div>`);
          });
          _push(`<!--]-->`);
        }
        _push(`</div><div class="px-4 py-2.5 border-t border-outline-variant/20 text-center">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/notifikasi",
          class: "text-label-sm text-primary hover:underline",
          onClick: ($event) => showNotifPopup.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Lihat Semua`);
            } else {
              return [
                createTextVNode("Lihat Semua")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="relative"><button class="text-on-surface-variant hover:bg-surface-container-high/50 p-2 rounded-full transition-colors"><span class="material-symbols-outlined">apps</span></button>`);
      if (unref(showAppsPopup)) {
        _push(`<div class="absolute top-full right-0 mt-2 w-64 bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden z-50 p-3"><div class="grid grid-cols-3 gap-2"><!--[-->`);
        ssrRenderList(quickApps, (app) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: app.to,
            to: app.to,
            class: "flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-surface-container-low transition-colors",
            onClick: ($event) => showAppsPopup.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="w-10 h-10 rounded-xl flex items-center justify-center" style="${ssrRenderStyle({ backgroundColor: app.bg })}"${_scopeId}><span class="material-symbols-outlined" style="${ssrRenderStyle({ color: app.color })}"${_scopeId}>${ssrInterpolate(app.icon)}</span></div><span class="text-[10px] text-on-surface-variant text-center leading-tight"${_scopeId}>${ssrInterpolate(app.label)}</span>`);
              } else {
                return [
                  createVNode("div", {
                    class: "w-10 h-10 rounded-xl flex items-center justify-center",
                    style: { backgroundColor: app.bg }
                  }, [
                    createVNode("span", {
                      class: "material-symbols-outlined",
                      style: { color: app.color }
                    }, toDisplayString(app.icon), 5)
                  ], 4),
                  createVNode("span", { class: "text-[10px] text-on-surface-variant text-center leading-tight" }, toDisplayString(app.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center gap-3 ml-2 pl-stack-md border-l border-outline-variant/30"><div class="text-right hidden sm:block"><p class="text-label-md leading-none text-primary">${ssrInterpolate(__props.userName)}</p>`);
      if (__props.subtitle) {
        _push(`<p class="text-[10px] text-on-surface-variant">${ssrInterpolate(__props.subtitle)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-label-md">${ssrInterpolate(unref(initials))}</div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showSystemPopup)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-modal-enter"><div class="px-gutter py-stack-md bg-primary flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">System Status</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Firebase &amp; Vercel</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><div class="p-gutter space-y-stack-md"><div class="flex items-center justify-between"><span class="text-label-md text-on-surface-variant">Overall Status</span><span class="${ssrRenderClass([unref(systemStatus).status === "healthy" ? "bg-green-100 text-green-700" : unref(systemStatus).status === "degraded" ? "bg-red-100 text-red-700" : "bg-surface-container-low text-on-surface-variant", "px-3 py-1 rounded-full text-label-sm font-bold"])}">${ssrInterpolate(unref(systemStatus).status === "healthy" ? "\u2705 Healthy" : unref(systemStatus).status === "degraded" ? "\u26A0 Degraded" : "...")}</span></div><div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(systemStatus).services, (svc, name) => {
            _push2(`<div class="flex items-center justify-between p-3 bg-surface-container-low rounded-lg"><div class="flex items-center gap-2"><span class="${ssrRenderClass([svc.status === "ok" ? "bg-green-500" : "bg-red-500", "w-2 h-2 rounded-full"])}"></span><span class="text-label-md font-medium capitalize">${ssrInterpolate(name)}</span></div><span class="${ssrRenderClass([svc.status === "ok" ? "text-green-600" : "text-red-600", "text-label-sm"])}">${ssrInterpolate(svc.status === "ok" ? `\u2713 ${svc.latency}` : "\u2717")}</span></div>`);
          });
          _push2(`<!--]--></div><div class="flex justify-between p-3 bg-surface-container-low rounded-lg"><span class="text-label-md text-on-surface-variant">Server Uptime</span><span class="text-label-md font-medium">${ssrInterpolate(unref(serverUptime))}</span></div><button class="w-full py-2.5 bg-primary text-on-primary text-label-md rounded-lg hover:brightness-110 active:scale-95 transition-all">Detail ke Developer Page</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</header>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TopBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const menus = {
  super_admin: {
    label: "Super Admin",
    variant: "admin",
    menu: [
      { label: "Dashboard", icon: "dashboard", to: "/super-admin/dashboard" },
      { label: "Santri", icon: "group", to: "/kesantrian/students" },
      { label: "Master Data", icon: "database", to: "/master-data" },
      { label: "Akademik", icon: "school", to: "/akademik/menu" },
      { label: "Penilaian", icon: "assignment", to: "/akademik/grading" },
      { label: "Jadwal", icon: "schedule", to: "/jadwal" },
      { label: "Tahfidz", icon: "menu_book", to: "/tahfidz" },
      { label: "Absensi", icon: "calendar_month", to: "/attendance" },
      { label: "Ibadah", icon: "mosque", to: "/ibadah/prayer-attendance" },
      { label: "Guru", icon: "badge", to: "/settings/teachers" },
      { label: "Keuangan", icon: "payments", to: "/keuangan/spp-payment" },
      { label: "Kesehatan", icon: "medical_services", to: "/kesehatan/medical-records" },
      { label: "Ekstrakurikuler", icon: "sports_kabaddi", to: "/extracurricular" },
      { label: "PSB/PPDB", icon: "app_registration", to: "/psb/registrations" },
      { label: "Alumni", icon: "diversity_3", to: "/alumni" },
      { label: "Izin Santri", icon: "passport", to: "/izin" },
      { label: "Mutasi", icon: "swap_horiz", to: "/mutasi" },
      { label: "Inventaris", icon: "inventory_2", to: "/inventaris" },
      { label: "Import/Export", icon: "file_present", to: "/tools/import-export" },
      { label: "Notifikasi", icon: "notifications", to: "/notifikasi" },
      { label: "Laporan", icon: "description", to: "/laporan" },
      { label: "Wali Santri", icon: "family_history", to: "/wali-santri/register" },
      { label: "Pengaturan", icon: "settings", to: "/settings/rbac" },
      { label: "Developer", icon: "code", to: "/developer" }
    ]
  },
  bendahara: {
    label: "Bendahara",
    variant: "admin",
    menu: [
      { label: "Dashboard", icon: "dashboard", to: "/super-admin/dashboard" },
      { label: "Tagihan SPP", icon: "payments", to: "/keuangan/spp-payment" },
      { label: "Riwayat Bayar", icon: "receipt_long", to: "/keuangan/spp-payment" },
      { label: "Santri", icon: "group", to: "/kesantrian/students" },
      { label: "Laporan", icon: "description", to: "/laporan" }
    ]
  },
  kesantrian: {
    label: "Kesantrian",
    variant: "admin",
    menu: [
      { label: "Dashboard", icon: "dashboard", to: "/super-admin/dashboard" },
      { label: "Data Santri", icon: "group", to: "/kesantrian/students" },
      { label: "Pelanggaran", icon: "gavel", to: "/kesantrian/students" },
      { label: "Absensi", icon: "calendar_month", to: "/attendance" },
      { label: "Ibadah", icon: "mosque", to: "/ibadah/prayer-attendance" },
      { label: "Tahfidz", icon: "menu_book", to: "/tahfidz" },
      { label: "Izin Santri", icon: "passport", to: "/izin" },
      { label: "Reward", icon: "stars", to: "/reward" },
      { label: "Mutasi", icon: "swap_horiz", to: "/mutasi" },
      { label: "Khidmah", icon: "volunteer_activism", to: "/khidmah" },
      { label: "Kesehatan", icon: "medical_services", to: "/kesehatan/medical-records" },
      { label: "Ekstrakurikuler", icon: "sports_kabaddi", to: "/extracurricular" },
      { label: "Inventaris", icon: "inventory_2", to: "/inventaris" },
      { label: "Import/Export", icon: "file_present", to: "/tools/import-export" },
      { label: "Laporan", icon: "description", to: "/laporan" }
    ]
  },
  ustadz: {
    label: "Ustadz / Ustadzah",
    variant: "ustadz",
    menu: [
      { label: "Dashboard", icon: "dashboard", to: "/portal/guru" },
      { label: "Jadwal Mengajar", icon: "schedule", to: "/jadwal" },
      { label: "Penilaian", icon: "assignment", to: "/akademik/grading" },
      { label: "Absensi Santri", icon: "calendar_month", to: "/attendance" },
      { label: "Tahfidz", icon: "menu_book", to: "/tahfidz" },
      { label: "Data Santri", icon: "group", to: "/kesantrian/students" }
    ]
  },
  wali_santri: {
    label: "Wali Santri",
    variant: "walisantri",
    menu: [
      { label: "Dashboard", icon: "dashboard", to: "/wali-santri/dashboard" },
      { label: "Data Anak", icon: "badge", to: "/student/dashboard" },
      { label: "Keuangan", icon: "payments", to: "/keuangan/wali-santri" },
      { label: "Akademik", icon: "auto_stories", to: "/akademik/menu" },
      { label: "Nilai", icon: "assignment", to: "/akademik/grading" },
      { label: "Absensi", icon: "calendar_month", to: "/attendance" },
      { label: "Tahfidz", icon: "menu_book", to: "/tahfidz" },
      { label: "Catatan", icon: "checklist", to: "/wali-santri/todos" }
    ]
  },
  alumni: {
    label: "Alumni",
    variant: "alumni",
    menu: [
      { label: "Dashboard", icon: "dashboard", to: "/alumni" },
      { label: "Data Alumni", icon: "group", to: "/alumni" },
      { label: "Acara", icon: "event", to: "/alumni/events" },
      { label: "Wisuda", icon: "auto_stories", to: "/alumni/graduations" }
    ]
  }
};
function useRoleMenu(role) {
  return menus[role || ""] || menus.wali_santri;
}

export { _sfc_main$1 as _, _sfc_main as a, useRoleMenu as u };
//# sourceMappingURL=useRoleMenu-DhGS-L2v.mjs.map
