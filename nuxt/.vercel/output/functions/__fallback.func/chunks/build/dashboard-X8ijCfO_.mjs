import { _ as __nuxt_component_0 } from './nuxt-link-Ck3s51Pu.mjs';
import { _ as _sfc_main$1 } from './GlassCard-DvlDYjHk.mjs';
import { defineComponent, computed, ref, reactive, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const userName = computed(() => {
      var _a, _b;
      if ((_a = user.value) == null ? void 0 : _a.displayName) return user.value.displayName;
      if ((_b = user.value) == null ? void 0 : _b.email) return user.value.email.split("@")[0];
      return "Admin";
    });
    const currentDate = computed(() => {
      return (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    });
    const loading = ref(true);
    const error = ref("");
    const stats = reactive({
      totalStudents: 0,
      activeStudents: 0,
      alumniStudents: 0,
      totalTeachers: 0,
      ratioGuru: 18,
      financialHealth: 0,
      recentViolations: 0,
      totalPelanggaran: 0,
      pelanggaranBerat: 0,
      pelanggaranRingan: 0,
      attendanceRate: 0
    });
    const growthRate = computed(() => {
      return stats.activeStudents > 0 ? Math.round(stats.activeStudents / (stats.totalStudents || 1) * 100) - 70 : 12;
    });
    const activities = ref([]);
    const classes = ref([]);
    async function fetchData(showLoader = true) {
      if (showLoader) loading.value = true;
      if (showLoader) error.value = "";
      try {
        const data = await $fetch("/api/dashboard-stats");
        stats.totalStudents = data.totalStudents;
        stats.activeStudents = data.activeStudents;
        stats.alumniStudents = data.alumniStudents;
        stats.totalTeachers = data.totalTeachers;
        stats.ratioGuru = data.ratioGuru;
        stats.financialHealth = data.financialHealth;
        stats.recentViolations = data.recentViolations;
        stats.totalPelanggaran = data.totalPelanggaran;
        stats.pelanggaranBerat = data.pelanggaranBerat;
        stats.pelanggaranRingan = data.pelanggaranRingan;
        stats.attendanceRate = data.attendanceRate;
        activities.value = data.activities || [];
        classes.value = data.classes || [];
      } catch (e) {
        if (showLoader) error.value = "Gagal memuat data: " + (e.message || "Terjadi kesalahan");
      } finally {
        if (showLoader) loading.value = false;
      }
    }
    fetchData();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_GlassCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-stack-lg flex items-center justify-between"><div><h2 class="font-display text-headline-lg text-primary">Global Overview</h2><p class="text-body-md text-on-surface-variant">Selamat datang, ${ssrInterpolate(unref(userName))} \u2014 ringkasan ekosistem pondok.</p></div><span class="text-label-sm text-on-surface-variant">${ssrInterpolate(unref(currentDate))}</span></div>`);
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-20"><span class="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-6 rounded-xl bg-error-container text-on-error-container text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/kesantrian/students",
          class: "block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_GlassCard, {
                hover: "",
                borderColor: "border-primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex justify-between items-start mb-4"${_scopeId2}><div class="bg-primary-fixed p-2 rounded-lg text-on-primary-fixed"${_scopeId2}><span class="material-symbols-outlined"${_scopeId2}>group</span></div><span class="text-primary font-bold text-label-sm flex items-center gap-1"${_scopeId2}>+${ssrInterpolate(unref(growthRate))}% <span class="material-symbols-outlined text-sm"${_scopeId2}>trending_up</span></span></div><p class="text-label-md text-on-surface-variant"${_scopeId2}>Total Santri</p><h3 class="font-display text-display-lg text-primary-container leading-none my-2"${_scopeId2}>${ssrInterpolate(unref(stats).totalStudents)}</h3><p class="text-label-sm text-on-surface-variant/70 italic"${_scopeId2}>${ssrInterpolate(unref(stats).activeStudents)} Aktif | ${ssrInterpolate(unref(stats).alumniStudents)} Alumni</p>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                        createVNode("div", { class: "bg-primary-fixed p-2 rounded-lg text-on-primary-fixed" }, [
                          createVNode("span", { class: "material-symbols-outlined" }, "group")
                        ]),
                        createVNode("span", { class: "text-primary font-bold text-label-sm flex items-center gap-1" }, [
                          createTextVNode("+" + toDisplayString(unref(growthRate)) + "% ", 1),
                          createVNode("span", { class: "material-symbols-outlined text-sm" }, "trending_up")
                        ])
                      ]),
                      createVNode("p", { class: "text-label-md text-on-surface-variant" }, "Total Santri"),
                      createVNode("h3", { class: "font-display text-display-lg text-primary-container leading-none my-2" }, toDisplayString(unref(stats).totalStudents), 1),
                      createVNode("p", { class: "text-label-sm text-on-surface-variant/70 italic" }, toDisplayString(unref(stats).activeStudents) + " Aktif | " + toDisplayString(unref(stats).alumniStudents) + " Alumni", 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_GlassCard, {
                  hover: "",
                  borderColor: "border-primary"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                      createVNode("div", { class: "bg-primary-fixed p-2 rounded-lg text-on-primary-fixed" }, [
                        createVNode("span", { class: "material-symbols-outlined" }, "group")
                      ]),
                      createVNode("span", { class: "text-primary font-bold text-label-sm flex items-center gap-1" }, [
                        createTextVNode("+" + toDisplayString(unref(growthRate)) + "% ", 1),
                        createVNode("span", { class: "material-symbols-outlined text-sm" }, "trending_up")
                      ])
                    ]),
                    createVNode("p", { class: "text-label-md text-on-surface-variant" }, "Total Santri"),
                    createVNode("h3", { class: "font-display text-display-lg text-primary-container leading-none my-2" }, toDisplayString(unref(stats).totalStudents), 1),
                    createVNode("p", { class: "text-label-sm text-on-surface-variant/70 italic" }, toDisplayString(unref(stats).activeStudents) + " Aktif | " + toDisplayString(unref(stats).alumniStudents) + " Alumni", 1)
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/settings/teachers",
          class: "block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_GlassCard, {
                hover: "",
                borderColor: "border-secondary-container"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex justify-between items-start mb-4"${_scopeId2}><div class="bg-secondary-fixed p-2 rounded-lg text-on-secondary-fixed"${_scopeId2}><span class="material-symbols-outlined"${_scopeId2}>person_pin</span></div><span class="text-secondary font-bold text-label-sm"${_scopeId2}>Aktif</span></div><p class="text-label-md text-on-surface-variant"${_scopeId2}>Total Guru</p><h3 class="font-display text-display-lg text-primary-container leading-none my-2"${_scopeId2}>${ssrInterpolate(unref(stats).totalTeachers)}</h3><p class="text-label-sm text-on-surface-variant/70 italic"${_scopeId2}>1:${ssrInterpolate(unref(stats).ratioGuru)} Rasio Guru:Santri</p>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                        createVNode("div", { class: "bg-secondary-fixed p-2 rounded-lg text-on-secondary-fixed" }, [
                          createVNode("span", { class: "material-symbols-outlined" }, "person_pin")
                        ]),
                        createVNode("span", { class: "text-secondary font-bold text-label-sm" }, "Aktif")
                      ]),
                      createVNode("p", { class: "text-label-md text-on-surface-variant" }, "Total Guru"),
                      createVNode("h3", { class: "font-display text-display-lg text-primary-container leading-none my-2" }, toDisplayString(unref(stats).totalTeachers), 1),
                      createVNode("p", { class: "text-label-sm text-on-surface-variant/70 italic" }, "1:" + toDisplayString(unref(stats).ratioGuru) + " Rasio Guru:Santri", 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_GlassCard, {
                  hover: "",
                  borderColor: "border-secondary-container"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                      createVNode("div", { class: "bg-secondary-fixed p-2 rounded-lg text-on-secondary-fixed" }, [
                        createVNode("span", { class: "material-symbols-outlined" }, "person_pin")
                      ]),
                      createVNode("span", { class: "text-secondary font-bold text-label-sm" }, "Aktif")
                    ]),
                    createVNode("p", { class: "text-label-md text-on-surface-variant" }, "Total Guru"),
                    createVNode("h3", { class: "font-display text-display-lg text-primary-container leading-none my-2" }, toDisplayString(unref(stats).totalTeachers), 1),
                    createVNode("p", { class: "text-label-sm text-on-surface-variant/70 italic" }, "1:" + toDisplayString(unref(stats).ratioGuru) + " Rasio Guru:Santri", 1)
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/keuangan/spp-payment",
          class: "block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_GlassCard, {
                hover: "",
                borderColor: "border-primary-fixed-dim"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex justify-between items-start mb-4"${_scopeId2}><div class="bg-primary-fixed-dim/30 p-2 rounded-lg text-primary"${_scopeId2}><span class="material-symbols-outlined"${_scopeId2}>payments</span></div><span class="text-primary font-bold text-label-sm"${_scopeId2}>Bulan Ini</span></div><p class="text-label-md text-on-surface-variant"${_scopeId2}>Kesehatan Keuangan</p><h3 class="font-display text-display-lg text-primary-container leading-none my-2"${_scopeId2}>${ssrInterpolate(unref(stats).financialHealth)}<span class="font-display text-headline-md"${_scopeId2}>%</span></h3><div class="w-full bg-surface-container-highest rounded-full h-1.5 mt-2"${_scopeId2}><div class="bg-primary h-1.5 rounded-full" style="${ssrRenderStyle({ width: unref(stats).financialHealth + "%" })}"${_scopeId2}></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                        createVNode("div", { class: "bg-primary-fixed-dim/30 p-2 rounded-lg text-primary" }, [
                          createVNode("span", { class: "material-symbols-outlined" }, "payments")
                        ]),
                        createVNode("span", { class: "text-primary font-bold text-label-sm" }, "Bulan Ini")
                      ]),
                      createVNode("p", { class: "text-label-md text-on-surface-variant" }, "Kesehatan Keuangan"),
                      createVNode("h3", { class: "font-display text-display-lg text-primary-container leading-none my-2" }, [
                        createTextVNode(toDisplayString(unref(stats).financialHealth), 1),
                        createVNode("span", { class: "font-display text-headline-md" }, "%")
                      ]),
                      createVNode("div", { class: "w-full bg-surface-container-highest rounded-full h-1.5 mt-2" }, [
                        createVNode("div", {
                          class: "bg-primary h-1.5 rounded-full",
                          style: { width: unref(stats).financialHealth + "%" }
                        }, null, 4)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_GlassCard, {
                  hover: "",
                  borderColor: "border-primary-fixed-dim"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                      createVNode("div", { class: "bg-primary-fixed-dim/30 p-2 rounded-lg text-primary" }, [
                        createVNode("span", { class: "material-symbols-outlined" }, "payments")
                      ]),
                      createVNode("span", { class: "text-primary font-bold text-label-sm" }, "Bulan Ini")
                    ]),
                    createVNode("p", { class: "text-label-md text-on-surface-variant" }, "Kesehatan Keuangan"),
                    createVNode("h3", { class: "font-display text-display-lg text-primary-container leading-none my-2" }, [
                      createTextVNode(toDisplayString(unref(stats).financialHealth), 1),
                      createVNode("span", { class: "font-display text-headline-md" }, "%")
                    ]),
                    createVNode("div", { class: "w-full bg-surface-container-highest rounded-full h-1.5 mt-2" }, [
                      createVNode("div", {
                        class: "bg-primary h-1.5 rounded-full",
                        style: { width: unref(stats).financialHealth + "%" }
                      }, null, 4)
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/kesantrian/students",
          class: "block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_GlassCard, {
                hover: "",
                borderColor: "border-error"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex justify-between items-start mb-4"${_scopeId2}><div class="bg-error-container p-2 rounded-lg text-on-error-container"${_scopeId2}><span class="material-symbols-outlined"${_scopeId2}>warning</span></div><span class="text-error font-bold text-label-sm"${_scopeId2}>7 Hari</span></div><p class="text-label-md text-on-surface-variant"${_scopeId2}>Pelanggaran Terbaru</p><h3 class="font-display text-display-lg text-error leading-none my-2"${_scopeId2}>${ssrInterpolate(String(unref(stats).recentViolations).padStart(2, "0"))}</h3><p class="text-label-sm text-on-surface-variant/70 italic"${_scopeId2}>${ssrInterpolate(unref(stats).pelanggaranBerat)} Berat | ${ssrInterpolate(unref(stats).pelanggaranRingan)} Ringan</p>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                        createVNode("div", { class: "bg-error-container p-2 rounded-lg text-on-error-container" }, [
                          createVNode("span", { class: "material-symbols-outlined" }, "warning")
                        ]),
                        createVNode("span", { class: "text-error font-bold text-label-sm" }, "7 Hari")
                      ]),
                      createVNode("p", { class: "text-label-md text-on-surface-variant" }, "Pelanggaran Terbaru"),
                      createVNode("h3", { class: "font-display text-display-lg text-error leading-none my-2" }, toDisplayString(String(unref(stats).recentViolations).padStart(2, "0")), 1),
                      createVNode("p", { class: "text-label-sm text-on-surface-variant/70 italic" }, toDisplayString(unref(stats).pelanggaranBerat) + " Berat | " + toDisplayString(unref(stats).pelanggaranRingan) + " Ringan", 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_GlassCard, {
                  hover: "",
                  borderColor: "border-error"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                      createVNode("div", { class: "bg-error-container p-2 rounded-lg text-on-error-container" }, [
                        createVNode("span", { class: "material-symbols-outlined" }, "warning")
                      ]),
                      createVNode("span", { class: "text-error font-bold text-label-sm" }, "7 Hari")
                    ]),
                    createVNode("p", { class: "text-label-md text-on-surface-variant" }, "Pelanggaran Terbaru"),
                    createVNode("h3", { class: "font-display text-display-lg text-error leading-none my-2" }, toDisplayString(String(unref(stats).recentViolations).padStart(2, "0")), 1),
                    createVNode("p", { class: "text-label-sm text-on-surface-variant/70 italic" }, toDisplayString(unref(stats).pelanggaranBerat) + " Berat | " + toDisplayString(unref(stats).pelanggaranRingan) + " Ringan", 1)
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter"><section class="lg:col-span-2 glass-card rounded-xl shadow-sm flex flex-col h-full"><div class="p-6 border-b border-white/20 flex justify-between items-center"><div><h4 class="font-display text-title-lg text-primary">Activity Feed</h4><p class="text-label-md text-on-surface-variant">Log aktivitas real-time dari database</p></div><div class="flex items-center gap-2"><span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><span class="text-label-sm text-on-surface-variant">Langsung</span><button class="text-primary-container hover:bg-primary-fixed/30 px-3 py-1 rounded-lg transition-colors text-label-md">Refresh</button></div></div><div class="flex-1 p-6 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar"><!--[-->`);
        ssrRenderList(unref(activities), (activity, idx) => {
          var _a;
          _push(`<div class="flex gap-4 group"><div class="relative"><div class="${ssrRenderClass(["w-10 h-10 rounded-full flex items-center justify-center z-10 relative", activity.bg])}"><span class="${ssrRenderClass([activity.iconColor, "material-symbols-outlined text-sm"])}">${ssrInterpolate(activity.icon)}</span></div>`);
          if (idx < unref(activities).length - 1) {
            _push(`<div class="absolute top-10 left-1/2 w-0.5 h-full bg-outline-variant/30 -translate-x-1/2"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div><p class="text-label-md text-on-background">${(_a = activity.title) != null ? _a : ""}</p><p class="text-label-sm text-on-surface-variant/70">${ssrInterpolate(activity.time)}</p></div></div>`);
        });
        _push(`<!--]-->`);
        if (unref(activities).length === 0) {
          _push(`<div class="text-center py-8 text-on-surface-variant text-label-md"> Belum ada aktivitas. Mulai kelola data melalui menu sidebar. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></section><div class="space-y-gutter"><section class="glass-card rounded-xl shadow-sm p-6"><h4 class="font-display text-title-lg text-primary mb-4">Aksi Cepat</h4><div class="grid grid-cols-1 gap-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/kesantrian/students",
          class: "flex items-center gap-3 w-full p-4 bg-primary text-on-primary rounded-xl hover:bg-primary-container transition-all active:scale-95 text-left"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="material-symbols-outlined"${_scopeId}>person_add</span><div${_scopeId}><p class="text-label-md"${_scopeId}>Daftarkan Santri Baru</p><p class="text-[10px] opacity-70"${_scopeId}>Onboard santri baru ke sistem</p></div>`);
            } else {
              return [
                createVNode("span", { class: "material-symbols-outlined" }, "person_add"),
                createVNode("div", null, [
                  createVNode("p", { class: "text-label-md" }, "Daftarkan Santri Baru"),
                  createVNode("p", { class: "text-[10px] opacity-70" }, "Onboard santri baru ke sistem")
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/keuangan/spp-payment",
          class: "flex items-center gap-3 w-full p-4 bg-white border border-primary text-primary rounded-xl hover:bg-primary-fixed/10 transition-all active:scale-95 text-left"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="material-symbols-outlined"${_scopeId}>payments</span><div${_scopeId}><p class="text-label-md"${_scopeId}>Kelola Pembayaran SPP</p><p class="text-[10px] text-on-surface-variant"${_scopeId}>Buat tagihan &amp; proses pembayaran</p></div>`);
            } else {
              return [
                createVNode("span", { class: "material-symbols-outlined" }, "payments"),
                createVNode("div", null, [
                  createVNode("p", { class: "text-label-md" }, "Kelola Pembayaran SPP"),
                  createVNode("p", { class: "text-[10px] text-on-surface-variant" }, "Buat tagihan & proses pembayaran")
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/settings/rbac",
          class: "flex items-center gap-3 w-full p-4 bg-white border border-outline-variant text-on-background rounded-xl hover:bg-surface-container-low transition-all active:scale-95 text-left"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="material-symbols-outlined"${_scopeId}>settings</span><div${_scopeId}><p class="text-label-md"${_scopeId}>Pengaturan Sistem</p><p class="text-[10px] text-on-surface-variant"${_scopeId}>Role &amp; akses pengguna</p></div>`);
            } else {
              return [
                createVNode("span", { class: "material-symbols-outlined" }, "settings"),
                createVNode("div", null, [
                  createVNode("p", { class: "text-label-md" }, "Pengaturan Sistem"),
                  createVNode("p", { class: "text-[10px] text-on-surface-variant" }, "Role & akses pengguna")
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></section>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/akademik/grading",
          class: "block relative h-48 rounded-xl overflow-hidden shadow-sm group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="absolute inset-0 bg-gradient-to-br from-primary-container/80 to-primary/60 flex flex-col justify-end p-6 hover:brightness-110 transition-all"${_scopeId}><p class="text-on-primary font-bold text-label-sm uppercase tracking-widest mb-1"${_scopeId}>Akademik</p><h5 class="text-on-primary font-display text-headline-md mb-2"${_scopeId}>Input Nilai</h5><div class="flex items-center gap-2 text-on-primary/80"${_scopeId}><span class="material-symbols-outlined text-[18px]"${_scopeId}>assignment</span><span class="text-label-sm"${_scopeId}>${ssrInterpolate(unref(classes).length)} kelas tersedia</span></div></div>`);
            } else {
              return [
                createVNode("div", { class: "absolute inset-0 bg-gradient-to-br from-primary-container/80 to-primary/60 flex flex-col justify-end p-6 hover:brightness-110 transition-all" }, [
                  createVNode("p", { class: "text-on-primary font-bold text-label-sm uppercase tracking-widest mb-1" }, "Akademik"),
                  createVNode("h5", { class: "text-on-primary font-display text-headline-md mb-2" }, "Input Nilai"),
                  createVNode("div", { class: "flex items-center gap-2 text-on-primary/80" }, [
                    createVNode("span", { class: "material-symbols-outlined text-[18px]" }, "assignment"),
                    createVNode("span", { class: "text-label-sm" }, toDisplayString(unref(classes).length) + " kelas tersedia", 1)
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><section class="mt-stack-lg glass-card rounded-xl shadow-sm p-6 overflow-hidden"><div class="flex justify-between items-center mb-6"><h4 class="font-display text-title-lg text-primary">Indeks Performa Akademik</h4>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/akademik/curriculum",
          class: "text-label-sm text-primary hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Kelola Kurikulum`);
            } else {
              return [
                createTextVNode("Kelola Kurikulum")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="text-label-sm text-on-surface-variant/70 border-b border-outline-variant/20"><th class="pb-4 font-semibold uppercase tracking-wider">Kelas</th><th class="pb-4 font-semibold uppercase tracking-wider">Rata-rata Nilai</th><th class="pb-4 font-semibold uppercase tracking-wider">Absensi</th><th class="pb-4 font-semibold uppercase tracking-wider">Progress</th><th class="pb-4 font-semibold uppercase tracking-wider">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10"><!--[-->`);
        ssrRenderList(unref(classes), (cls) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="py-4 text-label-md">${ssrInterpolate(cls.name)}</td><td class="py-4"><span class="bg-primary-fixed text-on-primary-fixed px-2 py-1 rounded text-label-sm font-bold">${ssrInterpolate(cls.avgGrade)}</span></td><td class="py-4 text-label-md">${ssrInterpolate(cls.attendance)}</td><td class="py-4"><div class="flex items-center gap-2"><div class="flex-1 bg-surface-container-highest rounded-full h-1 w-24"><div class="bg-primary h-1 rounded-full" style="${ssrRenderStyle({ width: cls.progress + "%" })}"></div></div><span class="text-[10px] text-on-surface-variant">${ssrInterpolate(cls.progress)}%</span></div></td><td class="py-4">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/kesantrian/students",
            class: "material-symbols-outlined text-outline hover:text-primary transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`more_horiz`);
              } else {
                return [
                  createTextVNode("more_horiz")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(classes).length === 0) {
          _push(`<tr><td colspan="5" class="py-8 text-center text-on-surface-variant text-label-md"> Belum ada data. `);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/kesantrian/students",
            class: "text-primary underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Tambah santri`);
              } else {
                return [
                  createTextVNode("Tambah santri")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(` untuk memulai. </td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></section><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/super-admin/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-X8ijCfO_.mjs.map
