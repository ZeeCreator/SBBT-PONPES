import { _ as __nuxt_component_0 } from './nuxt-link-Ck3s51Pu.mjs';
import { defineComponent, ref, reactive, watch, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
import { a as useAuth } from './server.mjs';
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
  __name: "rbac",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("roles");
    const showAddUser = ref(false);
    const fbUsers = ref([]);
    const loadingUsers = ref(true);
    const addingUser = ref(false);
    const addError = ref("");
    const addForm = reactive({
      name: "",
      email: "",
      password: "",
      role: "wali_santri"
    });
    const tabs = [
      { id: "roles", label: "Roles & Permissions", icon: "admin_panel_settings" },
      { id: "users", label: "User Management", icon: "people" },
      { id: "guru", label: "Manage Teachers", icon: "school" },
      { id: "firebase", label: "Security Rules", icon: "security" }
    ];
    const roles = [
      {
        name: "Super Admin",
        description: "Full system access",
        icon: "admin_panel_settings",
        bg: "bg-primary-fixed",
        iconColor: "text-primary",
        status: "Active",
        permissions: ["Read all collections", "Write all collections", "Manage users", "Firebase console", "System config"]
      },
      {
        name: "Bendahara",
        description: "Financial management",
        icon: "payments",
        bg: "bg-secondary-fixed",
        iconColor: "text-secondary",
        status: "Active",
        permissions: ["Read payments", "Write payments", "Read invoices", "Write invoices", "Midtrans integration"]
      },
      {
        name: "Kesantrian",
        description: "Student & discipline",
        icon: "gavel",
        bg: "bg-error-container",
        iconColor: "text-error",
        status: "Active",
        permissions: ["Read students", "Write students", "Read violations", "Write violations", "Attendance"]
      },
      {
        name: "Wali Santri",
        description: "Parent/guardian read-only",
        icon: "family_history",
        bg: "bg-surface-container-high",
        iconColor: "text-primary",
        status: "Active",
        permissions: ["Read own child data", "Read payments", "Read grades", "Read attendance", "No write access"]
      }
    ];
    async function fetchUsers() {
      loadingUsers.value = true;
      try {
        const { getIdToken } = useAuth();
        const token = await getIdToken();
        const res = await fetch("/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          fbUsers.value = await res.json();
        }
      } catch (e) {
        console.error("Failed to fetch users:", e);
      } finally {
        loadingUsers.value = false;
      }
    }
    watch(activeTab, (tab) => {
      if (tab === "users") fetchUsers();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><div class="px-gutter max-w-container-max mx-auto" style="${ssrRenderStyle({ "padding-top": "6rem", "padding-bottom": "3rem" })}"><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">System Settings &amp; RBAC Control</h2><p class="text-on-surface-variant text-body-md">Manage system configuration, user roles, and permissions.</p></div><div class="grid grid-cols-1 lg:grid-cols-4 gap-gutter"><div class="lg:col-span-1 space-y-gutter"><div class="glass-card rounded-xl p-4 shadow-sm"><nav class="space-y-1"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<a class="${ssrRenderClass([unref(activeTab) === tab.id ? "bg-primary-fixed/30 text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-low", "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer"])}"><span class="material-symbols-outlined text-sm">${ssrInterpolate(tab.icon)}</span><span class="text-label-md">${ssrInterpolate(tab.label)}</span></a>`);
      });
      _push(`<!--]--></nav></div></div><div class="lg:col-span-3 space-y-gutter">`);
      if (unref(activeTab) === "roles") {
        _push(`<div class="glass-card rounded-xl p-6 shadow-sm"><div class="flex items-center justify-between mb-6"><div><h3 class="font-display text-title-lg text-primary">Role Management</h3><p class="text-label-md text-on-surface-variant">Configure user roles and access permissions (Firebase Custom Claims)</p></div><button class="bg-primary-container text-on-primary px-4 py-2 rounded-lg text-label-md hover:bg-primary transition-all flex items-center gap-2"><span class="material-symbols-outlined text-sm">add</span> Add Role </button></div><div class="space-y-4"><!--[-->`);
        ssrRenderList(roles, (role) => {
          _push(`<div class="p-5 rounded-xl bg-surface-container-low border border-white"><div class="flex items-center justify-between mb-3"><div class="flex items-center gap-3"><div class="${ssrRenderClass(["w-10 h-10 rounded-full flex items-center justify-center", role.bg])}"><span class="${ssrRenderClass([role.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(role.icon)}</span></div><div><p class="text-label-md font-bold">${ssrInterpolate(role.name)}</p><p class="text-[11px] text-on-surface-variant">${ssrInterpolate(role.description)}</p></div></div><span class="${ssrRenderClass([role.status === "Active" ? "bg-green-100 text-green-700" : "bg-surface-container text-on-surface-variant", "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"])}">${ssrInterpolate(role.status)}</span></div><div class="flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(role.permissions, (permission) => {
            _push(`<span class="px-2 py-1 bg-white rounded text-[10px] text-on-surface-variant border border-outline-variant/30">${ssrInterpolate(permission)}</span>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "users") {
        _push(`<div class="glass-card rounded-xl p-6 shadow-sm"><div class="flex items-center justify-between mb-4"><h3 class="font-display text-title-lg text-primary">User Management</h3><button class="bg-primary-container text-on-primary px-4 py-2 rounded-lg text-label-md hover:bg-primary transition-all flex items-center gap-2"><span class="material-symbols-outlined text-sm">person_add</span> Add User </button></div><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-4 py-3 text-label-sm text-on-surface-variant">User</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Email</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Role</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">UID</th><th class="px-4 py-3 text-label-sm text-on-surface-variant">Action</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(fbUsers), (user) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-4 py-3 text-label-md font-medium">${ssrInterpolate(user.displayName || "-")}</td><td class="px-4 py-3 text-label-sm text-on-surface-variant">${ssrInterpolate(user.email)}</td><td class="px-4 py-3"><select class="bg-surface-container-low border border-outline-variant/30 rounded px-2 py-1 text-[10px] font-bold focus:ring-primary"><option value="super_admin"${ssrIncludeBooleanAttr(Array.isArray(user.role) ? ssrLooseContain(user.role, "super_admin") : ssrLooseEqual(user.role, "super_admin")) ? " selected" : ""}>Super Admin</option><option value="bendahara"${ssrIncludeBooleanAttr(Array.isArray(user.role) ? ssrLooseContain(user.role, "bendahara") : ssrLooseEqual(user.role, "bendahara")) ? " selected" : ""}>Bendahara</option><option value="kesantrian"${ssrIncludeBooleanAttr(Array.isArray(user.role) ? ssrLooseContain(user.role, "kesantrian") : ssrLooseEqual(user.role, "kesantrian")) ? " selected" : ""}>Kesantrian</option><option value="wali_santri"${ssrIncludeBooleanAttr(Array.isArray(user.role) ? ssrLooseContain(user.role, "wali_santri") : ssrLooseEqual(user.role, "wali_santri")) ? " selected" : ""}>Wali Santri</option></select></td><td class="px-4 py-3 text-label-sm text-on-surface-variant/50 font-mono text-[10px]">${ssrInterpolate(user.uid.substring(0, 12))}...</td><td class="px-4 py-3"><div class="flex items-center gap-2"><button class="text-primary text-label-sm hover:underline">Set Role</button>`);
          if (user.uid === "YjTj0ZiMo5en1EfhgpOW4L8csJv1") {
            _push(`<button class="text-secondary text-label-sm font-bold flex items-center gap-1"><span class="material-symbols-outlined text-xs">verified</span> Owner </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
        if (unref(loadingUsers)) {
          _push(`<p class="text-center py-8 text-on-surface-variant text-label-sm">Loading users...</p>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(loadingUsers) && unref(fbUsers).length === 0) {
          _push(`<p class="text-center py-8 text-on-surface-variant text-label-sm">No users found</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "guru") {
        _push(`<div class="glass-card rounded-xl p-6 shadow-sm"><div class="flex items-center justify-between mb-6"><div><h3 class="font-display text-title-lg text-primary">Manage Teachers</h3><p class="text-label-md text-on-surface-variant">CRUD data ustadz/guru pengajar</p></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/settings/teachers",
          class: "bg-primary-container text-on-primary px-4 py-2 rounded-lg text-label-md hover:bg-primary transition-all flex items-center gap-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="material-symbols-outlined text-sm"${_scopeId}>add</span> Manage Teachers `);
            } else {
              return [
                createVNode("span", { class: "material-symbols-outlined text-sm" }, "add"),
                createTextVNode(" Manage Teachers ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><p class="text-on-surface-variant text-label-sm">Guru management page tersedia di halaman terpisah.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "firebase") {
        _push(`<div class="glass-card rounded-xl p-6 shadow-sm"><h3 class="font-display text-title-lg text-primary mb-4">Firebase Security Rules</h3><div class="p-4 rounded-xl bg-primary-container/5 border border-primary-container/20 mb-4"><pre class="text-label-sm text-on-surface leading-relaxed overflow-x-auto"><code>// Firestore Security Rules
rules_version = &#39;2&#39;;
service cloud.firestore {
  match /databases/{database}/documents {

    // Students collection
    match /students/{studentId} {
      allow read: if request.auth != null
        &amp;&amp; (request.auth.token.role == &#39;super_admin&#39;
        || request.auth.token.role == &#39;kesantrian&#39;
        || request.auth.token.role == &#39;bendahara&#39;
        || (request.auth.token.role == &#39;wali_santri&#39;
            &amp;&amp; request.auth.token.studentId == studentId));

      allow write: if request.auth != null
        &amp;&amp; (request.auth.token.role == &#39;super_admin&#39;
        || request.auth.token.role == &#39;kesantrian&#39;);

      // Sub-collections
      match /grades/{gradeId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null
          &amp;&amp; request.auth.token.role == &#39;super_admin&#39;;
      }

      match /violations/{violationId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null
          &amp;&amp; (request.auth.token.role == &#39;super_admin&#39;
          || request.auth.token.role == &#39;kesantrian&#39;);
      }
    }

    // Payments &amp; Invoices
    match /invoices/{invoiceId} {
      allow read: if request.auth != null
        &amp;&amp; (request.auth.token.role == &#39;super_admin&#39;
        || request.auth.token.role == &#39;bendahara&#39;);
      allow write: if request.auth != null
        &amp;&amp; (request.auth.token.role == &#39;super_admin&#39;
        || request.auth.token.role == &#39;bendahara&#39;);
    }

    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        &amp;&amp; (request.auth.token.role == &#39;super_admin&#39;
        || request.auth.token.role == &#39;bendahara&#39;);
    }
  }
}</code></pre></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showAddUser)) {
          _push2(`<div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div class="bg-surface rounded-2xl p-8 w-full max-w-md shadow-2xl"><div class="flex items-center justify-between mb-6"><h3 class="font-display text-title-lg text-primary">Tambah User Baru</h3><button class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button></div><form class="space-y-4"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Lengkap</label><input${ssrRenderAttr("value", unref(addForm).name)} type="text" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Email</label><input${ssrRenderAttr("value", unref(addForm).email)} type="email" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Password</label><input${ssrRenderAttr("value", unref(addForm).password)} type="password" required minlength="6" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Role</label><select class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"><option value="super_admin"${ssrIncludeBooleanAttr(Array.isArray(unref(addForm).role) ? ssrLooseContain(unref(addForm).role, "super_admin") : ssrLooseEqual(unref(addForm).role, "super_admin")) ? " selected" : ""}>Super Admin</option><option value="bendahara"${ssrIncludeBooleanAttr(Array.isArray(unref(addForm).role) ? ssrLooseContain(unref(addForm).role, "bendahara") : ssrLooseEqual(unref(addForm).role, "bendahara")) ? " selected" : ""}>Bendahara</option><option value="kesantrian"${ssrIncludeBooleanAttr(Array.isArray(unref(addForm).role) ? ssrLooseContain(unref(addForm).role, "kesantrian") : ssrLooseEqual(unref(addForm).role, "kesantrian")) ? " selected" : ""}>Kesantrian</option><option value="wali_santri"${ssrIncludeBooleanAttr(Array.isArray(unref(addForm).role) ? ssrLooseContain(unref(addForm).role, "wali_santri") : ssrLooseEqual(unref(addForm).role, "wali_santri")) ? " selected" : ""}>Wali Santri</option></select></div><button type="submit"${ssrIncludeBooleanAttr(unref(addingUser)) ? " disabled" : ""} class="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-body-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">`);
          if (unref(addingUser)) {
            _push2(`<span class="material-symbols-outlined animate-spin text-sm">refresh</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` ${ssrInterpolate(unref(addingUser) ? "Mendaftarkan..." : "Daftarkan User")}</button>`);
          if (unref(addError)) {
            _push2(`<p class="text-error text-label-sm text-center">${ssrInterpolate(unref(addError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings/rbac.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=rbac-aIu5vRe2.mjs.map
