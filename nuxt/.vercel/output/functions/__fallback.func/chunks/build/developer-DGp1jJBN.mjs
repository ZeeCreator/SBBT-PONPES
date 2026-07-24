import { defineComponent, reactive, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderTeleport } from 'vue/server-renderer';
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
  __name: "developer",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const health = reactive({
      status: "checking...",
      timestamp: "",
      services: {}
    });
    const serverUptime = ref("-");
    const uptimeLogs = ref([]);
    const uptimeMessage = ref("");
    const systemInfo = ref({});
    const logs = ref([]);
    const backups = ref([]);
    const backupMessage = ref("");
    const showPreview = ref(false);
    const previewData = ref("");
    const showRestoreConfirm = ref(false);
    const restoreTarget = ref("");
    const restoring = ref(false);
    const driveFiles = ref([]);
    const driveMessage = ref("");
    const showDriveRestore = ref(false);
    ref("");
    const driveRestoreName = ref("");
    const driveRestoring = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Developer Tools</h2><p class="text-body-md text-on-surface-variant">System monitoring, health checks, dan informasi teknis.</p></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-stack-lg"><div class="glass-card rounded-2xl p-stack-md shadow-sm"><div class="flex items-center gap-3 mb-4"><div class="${ssrRenderClass(["w-10 h-10 rounded-full flex items-center justify-center", unref(health).status === "healthy" ? "bg-green-100" : "bg-red-100"])}"><span class="${ssrRenderClass([unref(health).status === "healthy" ? "text-green-600" : "text-red-600", "material-symbols-outlined"])}">${ssrInterpolate(unref(health).status === "healthy" ? "check_circle" : "warning")}</span></div><div><p class="text-title-md font-display">Firebase Status</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(unref(health).status === "healthy" ? "All systems operational" : "Degraded performance")}</p></div><button class="ml-auto p-2 text-on-surface-variant hover:text-primary transition-colors" title="Refresh"><span class="material-symbols-outlined">refresh</span></button></div><div class="space-y-3"><!--[-->`);
      ssrRenderList(unref(health).services, (svc, name) => {
        _push(`<div class="flex items-center justify-between p-3 bg-surface-container-low rounded-lg"><div class="flex items-center gap-2"><span class="${ssrRenderClass([svc.status === "ok" ? "bg-green-500" : "bg-red-500", "w-2 h-2 rounded-full"])}"></span><span class="text-label-md font-medium capitalize">${ssrInterpolate(name)}</span></div><span class="${ssrRenderClass([svc.status === "ok" ? "text-green-600" : "text-red-600", "text-label-sm"])}">${ssrInterpolate(svc.status === "ok" ? svc.latency : svc.message)}</span></div>`);
      });
      _push(`<!--]--></div><p class="text-label-sm text-on-surface-variant mt-4">Server uptime: ${ssrInterpolate(unref(serverUptime))}</p><p class="text-label-sm text-on-surface-variant">Terakhir diperiksa: ${ssrInterpolate(unref(health).timestamp ? new Date(unref(health).timestamp).toLocaleString("id-ID") : "-")}</p></div><div class="glass-card rounded-2xl p-stack-md shadow-sm"><h4 class="font-display text-title-lg text-primary mb-4">System Info</h4><div class="space-y-3"><!--[-->`);
      ssrRenderList(unref(systemInfo), (val, key) => {
        _push(`<div class="flex justify-between p-3 bg-surface-container-low rounded-lg"><span class="text-label-md text-on-surface-variant">${ssrInterpolate(key)}</span><span class="text-label-md font-medium max-w-[60%] text-right break-all">${ssrInterpolate(val)}</span></div>`);
      });
      _push(`<!--]--></div></div></div><div class="glass-card rounded-2xl p-stack-md shadow-sm mb-stack-lg"><div class="flex items-center justify-between mb-4"><h4 class="font-display text-title-lg text-primary">Uptime History</h4><div class="flex items-center gap-2"><span class="text-label-sm text-on-surface-variant">${ssrInterpolate(unref(uptimeLogs).length)} record</span><button class="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Refresh"><span class="material-symbols-outlined">refresh</span></button></div></div>`);
      if (unref(uptimeLogs).length === 0) {
        _push(`<div class="text-center py-6 text-on-surface-variant text-label-sm">Belum ada data uptime. Jalankan cron atau klik &quot;Check Now&quot;.</div>`);
      } else {
        _push(`<div class="overflow-x-auto max-h-96 overflow-y-auto"><table class="w-full text-left"><thead><tr class="text-label-sm text-on-surface-variant/70 border-b border-outline-variant/20"><th class="pb-2 font-semibold">Waktu</th><th class="pb-2 font-semibold">Status</th><th class="pb-2 font-semibold">RTDB</th><th class="pb-2 font-semibold">Auth</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(uptimeLogs), (log) => {
          var _a, _b;
          _push(`<tr class="hover:bg-primary-fixed/5 text-label-sm"><td class="py-2 text-on-surface-variant">${ssrInterpolate(log.timestamp ? new Date(log.timestamp).toLocaleString("id-ID") : "-")}</td><td class="py-2"><span class="${ssrRenderClass([log.status === "healthy" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700", "px-2 py-0.5 rounded text-label-sm font-bold"])}">${ssrInterpolate(log.status)}</span></td><td class="py-2">`);
          if ((_a = log.services) == null ? void 0 : _a.rtdb) {
            _push(`<span class="${ssrRenderClass(log.services.rtdb.status === "ok" ? "text-green-600" : "text-red-600")}">${ssrInterpolate(log.services.rtdb.status === "ok" ? `\u2713 ${log.services.rtdb.latency}` : "\u2717")}</span>`);
          } else {
            _push(`<span class="text-on-surface-variant">-</span>`);
          }
          _push(`</td><td class="py-2">`);
          if ((_b = log.services) == null ? void 0 : _b.auth) {
            _push(`<span class="${ssrRenderClass(log.services.auth.status === "ok" ? "text-green-600" : "text-red-600")}">${ssrInterpolate(log.services.auth.status === "ok" ? `\u2713 ${log.services.auth.latency}` : "\u2717")}</span>`);
          } else {
            _push(`<span class="text-on-surface-variant">-</span>`);
          }
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      _push(`<div class="mt-4 flex items-center gap-3"><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">play_arrow</span> Check Now </button>`);
      if (unref(uptimeMessage)) {
        _push(`<span class="${ssrRenderClass([unref(uptimeMessage).includes("\u2705") ? "text-green-600" : "text-on-surface-variant", "text-label-sm"])}">${ssrInterpolate(unref(uptimeMessage))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="glass-card rounded-2xl p-stack-md shadow-sm mb-stack-lg"><div class="flex items-center justify-between mb-4"><h4 class="font-display text-title-lg text-primary">Backup &amp; Restore</h4><div class="flex items-center gap-2"><button class="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-label-sm hover:brightness-110 transition-all"><span class="material-symbols-outlined text-sm">backup</span> Backup Now </button><button class="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Refresh"><span class="material-symbols-outlined">refresh</span></button></div></div>`);
      if (unref(backupMessage)) {
        _push(`<p class="${ssrRenderClass([unref(backupMessage).includes("\u2705") ? "text-green-600" : "text-red-600", "mb-3 text-label-sm"])}">${ssrInterpolate(unref(backupMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(backups).length === 0) {
        _push(`<div class="text-center py-6 text-on-surface-variant text-label-sm">Belum ada backup lokal.</div>`);
      } else {
        _push(`<div class="overflow-x-auto max-h-60 overflow-y-auto"><table class="w-full text-left"><thead><tr class="text-label-sm text-on-surface-variant/70 border-b border-outline-variant/20"><th class="pb-2 font-semibold">File</th><th class="pb-2 font-semibold">Ukuran</th><th class="pb-2 font-semibold">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(backups), (b) => {
          _push(`<tr class="hover:bg-primary-fixed/5 text-label-sm"><td class="py-2 max-w-[200px] truncate">${ssrInterpolate(b.name)}</td><td class="py-2 text-on-surface-variant">${ssrInterpolate((b.size / 1024).toFixed(1))} KB</td><td class="py-2"><div class="flex items-center gap-2"><button class="text-label-xs px-2 py-1 bg-primary text-on-primary rounded hover:brightness-110 transition-all">Preview</button><button class="text-label-xs px-2 py-1 bg-error text-on-error rounded hover:brightness-110 transition-all">Restore</button><button class="text-label-xs px-2 py-1 border border-outline-variant rounded hover:bg-surface-container-high transition-all">Download</button><button class="p-1 text-on-surface-variant hover:text-error transition-colors"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showPreview)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><h3 class="font-display text-headline-md text-on-primary">Preview Backup</h3><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><pre class="p-gutter overflow-auto max-h-[60vh] text-label-sm text-on-surface bg-surface-container-lowest rounded-lg m-gutter">${ssrInterpolate(unref(previewData))}</pre></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showRestoreConfirm)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-modal-enter"><div class="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-error text-3xl">restore</span></div><h3 class="font-display text-title-lg text-primary mb-2">Restore Database?</h3><p class="text-label-md text-on-surface-variant mb-6">Tindakan ini akan <strong>menimpa seluruh data</strong> di database dengan data dari backup <strong>${ssrInterpolate(unref(restoreTarget))}</strong>. Yakin?</p><div class="flex gap-3"><button class="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl text-label-md">Batal</button><button class="flex-1 bg-error text-on-error py-3 rounded-xl text-label-md font-bold hover:brightness-110 transition-all">${ssrInterpolate(unref(restoring) ? "Merestore..." : "Restore")}</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div><div class="glass-card rounded-2xl p-stack-md shadow-sm mb-stack-lg"><div class="flex items-center justify-between mb-4"><h4 class="font-display text-title-lg text-primary">Google Drive</h4><div class="flex items-center gap-2"><button class="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-label-sm hover:brightness-110 transition-all"><span class="material-symbols-outlined text-sm">cloud_upload</span> Backup &amp; Upload </button><button class="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Refresh"><span class="material-symbols-outlined">refresh</span></button></div></div>`);
      if (unref(driveMessage)) {
        _push(`<p class="${ssrRenderClass([unref(driveMessage).includes("\u2705") ? "text-green-600" : "text-red-600", "mb-3 text-label-sm"])}">${ssrInterpolate(unref(driveMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(driveFiles).length === 0) {
        _push(`<div class="text-center py-6 text-on-surface-variant text-label-sm">Belum ada data. Klik &quot;Backup &amp; Upload&quot; untuk mengupload backup ke Drive.</div>`);
      } else {
        _push(`<div class="overflow-x-auto max-h-60 overflow-y-auto"><table class="w-full text-left"><thead><tr class="text-label-sm text-on-surface-variant/70 border-b border-outline-variant/20"><th class="pb-2 font-semibold">Nama File</th><th class="pb-2 font-semibold">Ukuran</th><th class="pb-2 font-semibold">Tanggal</th><th class="pb-2 font-semibold">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(driveFiles), (f) => {
          _push(`<tr class="hover:bg-primary-fixed/5 text-label-sm"><td class="py-2 max-w-[200px] truncate">${ssrInterpolate(f.name)}</td><td class="py-2 text-on-surface-variant">${ssrInterpolate((f.size / 1024).toFixed(1))} KB</td><td class="py-2 text-on-surface-variant">${ssrInterpolate(f.createdTime ? new Date(f.createdTime).toLocaleDateString("id-ID") : "-")}</td><td class="py-2"><div class="flex items-center gap-2"><button class="text-label-xs px-2 py-1 bg-error text-on-error rounded hover:brightness-110 transition-all">Restore</button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showDriveRestore)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-modal-enter"><div class="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-error text-3xl">cloud_download</span></div><h3 class="font-display text-title-lg text-primary mb-2">Restore dari Drive?</h3><p class="text-label-md text-on-surface-variant mb-6">Akan menimpa seluruh database dengan data dari file Drive <strong>${ssrInterpolate(unref(driveRestoreName))}</strong>. Yakin?</p><div class="flex gap-3"><button class="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl text-label-md">Batal</button><button class="flex-1 bg-error text-on-error py-3 rounded-xl text-label-md font-bold hover:brightness-110 transition-all">${ssrInterpolate(unref(driveRestoring) ? "Merestore..." : "Restore")}</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div><div class="glass-card rounded-2xl p-stack-md shadow-sm"><div class="flex items-center justify-between mb-4"><h4 class="font-display text-title-lg text-primary">Activity Logs Preview</h4><button class="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-label-sm hover:brightness-110 transition-all"><span class="material-symbols-outlined text-sm">bug_report</span> Test Log </button></div><div class="overflow-x-auto max-h-80 overflow-y-auto"><table class="w-full text-left"><thead><tr class="text-label-sm text-on-surface-variant/70 border-b border-outline-variant/20"><th class="pb-2 font-semibold">Action</th><th class="pb-2 font-semibold">Description</th><th class="pb-2 font-semibold">Icon</th><th class="pb-2 font-semibold">Timestamp</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
      ssrRenderList(unref(logs), (log) => {
        _push(`<tr class="hover:bg-primary-fixed/5 text-label-sm"><td class="py-2">${ssrInterpolate(log.action)}</td><td class="py-2 text-on-surface-variant">${ssrInterpolate(log.description)}</td><td class="py-2"><span class="material-symbols-outlined text-sm">${ssrInterpolate(log.icon)}</span></td><td class="py-2 text-on-surface-variant">${ssrInterpolate(log.timestamp ? new Date(log.timestamp).toLocaleString("id-ID") : "-")}</td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(logs).length === 0) {
        _push(`<tr><td colspan="4" class="py-4 text-center text-on-surface-variant">Belum ada data</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/developer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=developer-DGp1jJBN.mjs.map
