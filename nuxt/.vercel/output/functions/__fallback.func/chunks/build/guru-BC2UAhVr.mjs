import { _ as _sfc_main$1 } from './GlassCard-DvlDYjHk.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-Ck3s51Pu.mjs';
import { defineComponent, computed, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { a as useAuth } from './server.mjs';
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
  __name: "guru",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const userName = computed(() => {
      var _a, _b;
      if ((_a = user.value) == null ? void 0 : _a.displayName) return user.value.displayName;
      if ((_b = user.value) == null ? void 0 : _b.email) return user.value.email.split("@")[0];
      return "Ustadz";
    });
    const currentDate = computed(() => {
      return (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    });
    const stats = {
      classesToday: 4,
      totalStudents: 98,
      mentoredStudents: 42,
      classes: 3,
      pendingVerifications: 7,
      completedToday: 12,
      absentToday: 3,
      presentToday: 95
    };
    const schedule = [
      { time: "07:00 - 08:30", subject: "Al-Qur'an & Tajwid", class: "Kelas 11-A", room: "Ruang 3", students: 24, status: "Selesai" },
      { time: "08:45 - 10:15", subject: "Hadits & Fiqih", class: "Kelas 12-B", room: "Ruang 5", students: 22, status: "Selesai" },
      { time: "10:30 - 12:00", subject: "Tahfidz Program", class: "Kelas 11-A", room: "Lab Tahfidz", students: 24, status: "Berlangsung" },
      { time: "13:00 - 14:30", subject: "Sejarah Kebudayaan Islam", class: "Kelas 10-C", room: "Ruang 2", students: 28, status: "Akan Datang" }
    ];
    const quickGradeClasses = [
      { name: "Kelas 11-A", subject: "Al-Qur'an & Tajwid", count: 24 },
      { name: "Kelas 12-B", subject: "Hadits & Fiqih", count: 22 },
      { name: "Kelas 10-C", subject: "SKI", count: 28 }
    ];
    const tahfidzPending = [
      { name: "Ahmad Farhan", surah: "Al-Mulk", ayat: "1-10", time: "5 menit lalu" },
      { name: "Muhammad Rizky", surah: "Yasin", ayat: "1-15", time: "12 menit lalu" },
      { name: "Zidni Fikri", surah: "Ar-Rahman", ayat: "1-20", time: "30 menit lalu" },
      { name: "Abdullah Nazri", surah: "Al-Kahfi", ayat: "1-10", time: "1 jam lalu" }
    ];
    const activities = [
      { icon: "assignment", bg: "bg-primary-fixed", iconColor: "text-primary", title: "Input nilai untuk <strong>Kelas 11-A</strong> \u2014 Al-Qur'an & Tajwid", time: "10 menit lalu" },
      { icon: "how_to_reg", bg: "bg-secondary-fixed", iconColor: "text-secondary", title: "Absensi <strong>Kelas 12-B</strong> selesai \u2014 22 hadir, 1 izin", time: "30 menit lalu" },
      { icon: "menu_book", bg: "bg-error-container", iconColor: "text-error", title: "<strong>Ahmad Farhan</strong> setoran hafalan Al-Mulk ayat 1-10 \u2014 menunggu verifikasi", time: "45 menit lalu" },
      { icon: "check_circle", bg: "bg-green-100", iconColor: "text-green-700", title: "<strong>Muhammad Rizky</strong> verifikasi tahfidz disetujui \u2014 Yasin 1-15", time: "1 jam lalu" },
      { icon: "warning", bg: "bg-amber-100", iconColor: "text-amber-700", title: "<strong>Abdullah Nazri</strong> terlambat masuk kelas \u2014 poin pelanggaran: -5", time: "2 jam lalu" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_GlassCard = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-stack-lg"><div><h2 class="font-display text-headline-lg text-primary">Portal Guru</h2><p class="text-body-md text-on-surface-variant">Selamat datang, ${ssrInterpolate(unref(userName))} \u2014 ringkasan aktivitas mengajar hari ini.</p></div><span class="text-label-sm text-on-surface-variant">${ssrInterpolate(unref(currentDate))}</span></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">`);
      _push(ssrRenderComponent(_component_GlassCard, {
        hover: "",
        borderColor: "border-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-start mb-4"${_scopeId}><div class="bg-primary-fixed p-2 rounded-lg text-on-primary-fixed"${_scopeId}><span class="material-symbols-outlined"${_scopeId}>school</span></div><span class="text-primary font-bold text-label-sm"${_scopeId}>Hari Ini</span></div><p class="text-label-md text-on-surface-variant"${_scopeId}>Kelas Diajar</p><h3 class="font-display text-display-lg text-primary-container leading-none my-2"${_scopeId}>${ssrInterpolate(stats.classesToday)}</h3><p class="text-label-sm text-on-surface-variant/70 italic"${_scopeId}>${ssrInterpolate(stats.totalStudents)} total santri</p>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                createVNode("div", { class: "bg-primary-fixed p-2 rounded-lg text-on-primary-fixed" }, [
                  createVNode("span", { class: "material-symbols-outlined" }, "school")
                ]),
                createVNode("span", { class: "text-primary font-bold text-label-sm" }, "Hari Ini")
              ]),
              createVNode("p", { class: "text-label-md text-on-surface-variant" }, "Kelas Diajar"),
              createVNode("h3", { class: "font-display text-display-lg text-primary-container leading-none my-2" }, toDisplayString(stats.classesToday), 1),
              createVNode("p", { class: "text-label-sm text-on-surface-variant/70 italic" }, toDisplayString(stats.totalStudents) + " total santri", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_GlassCard, {
        hover: "",
        borderColor: "border-secondary-container"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-start mb-4"${_scopeId}><div class="bg-secondary-fixed p-2 rounded-lg text-on-secondary-fixed"${_scopeId}><span class="material-symbols-outlined"${_scopeId}>group</span></div><span class="text-secondary font-bold text-label-sm"${_scopeId}>Aktif</span></div><p class="text-label-md text-on-surface-variant"${_scopeId}>Santri Bimbingan</p><h3 class="font-display text-display-lg text-primary-container leading-none my-2"${_scopeId}>${ssrInterpolate(stats.mentoredStudents)}</h3><p class="text-label-sm text-on-surface-variant/70 italic"${_scopeId}>${ssrInterpolate(stats.classes)} kelas</p>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                createVNode("div", { class: "bg-secondary-fixed p-2 rounded-lg text-on-secondary-fixed" }, [
                  createVNode("span", { class: "material-symbols-outlined" }, "group")
                ]),
                createVNode("span", { class: "text-secondary font-bold text-label-sm" }, "Aktif")
              ]),
              createVNode("p", { class: "text-label-md text-on-surface-variant" }, "Santri Bimbingan"),
              createVNode("h3", { class: "font-display text-display-lg text-primary-container leading-none my-2" }, toDisplayString(stats.mentoredStudents), 1),
              createVNode("p", { class: "text-label-sm text-on-surface-variant/70 italic" }, toDisplayString(stats.classes) + " kelas", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_GlassCard, {
        hover: "",
        borderColor: "border-primary-fixed-dim"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-start mb-4"${_scopeId}><div class="bg-primary-fixed-dim/30 p-2 rounded-lg text-primary"${_scopeId}><span class="material-symbols-outlined"${_scopeId}>assignment</span></div><span class="text-primary font-bold text-label-sm"${_scopeId}>Menunggu</span></div><p class="text-label-md text-on-surface-variant"${_scopeId}>Verifikasi Hafalan</p><h3 class="font-display text-display-lg text-primary-container leading-none my-2"${_scopeId}>${ssrInterpolate(stats.pendingVerifications)}</h3><p class="text-label-sm text-on-surface-variant/70 italic"${_scopeId}>${ssrInterpolate(stats.completedToday)} selesai hari ini</p>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                createVNode("div", { class: "bg-primary-fixed-dim/30 p-2 rounded-lg text-primary" }, [
                  createVNode("span", { class: "material-symbols-outlined" }, "assignment")
                ]),
                createVNode("span", { class: "text-primary font-bold text-label-sm" }, "Menunggu")
              ]),
              createVNode("p", { class: "text-label-md text-on-surface-variant" }, "Verifikasi Hafalan"),
              createVNode("h3", { class: "font-display text-display-lg text-primary-container leading-none my-2" }, toDisplayString(stats.pendingVerifications), 1),
              createVNode("p", { class: "text-label-sm text-on-surface-variant/70 italic" }, toDisplayString(stats.completedToday) + " selesai hari ini", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_GlassCard, {
        hover: "",
        borderColor: "border-error"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-start mb-4"${_scopeId}><div class="bg-error-container p-2 rounded-lg text-on-error-container"${_scopeId}><span class="material-symbols-outlined"${_scopeId}>fact_check</span></div><span class="text-error font-bold text-label-sm"${_scopeId}>Hari Ini</span></div><p class="text-label-md text-on-surface-variant"${_scopeId}>Absensi Santri</p><h3 class="font-display text-display-lg text-error leading-none my-2"${_scopeId}>${ssrInterpolate(stats.absentToday)}</h3><p class="text-label-sm text-on-surface-variant/70 italic"${_scopeId}>${ssrInterpolate(stats.presentToday)} hadir</p>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                createVNode("div", { class: "bg-error-container p-2 rounded-lg text-on-error-container" }, [
                  createVNode("span", { class: "material-symbols-outlined" }, "fact_check")
                ]),
                createVNode("span", { class: "text-error font-bold text-label-sm" }, "Hari Ini")
              ]),
              createVNode("p", { class: "text-label-md text-on-surface-variant" }, "Absensi Santri"),
              createVNode("h3", { class: "font-display text-display-lg text-error leading-none my-2" }, toDisplayString(stats.absentToday), 1),
              createVNode("p", { class: "text-label-sm text-on-surface-variant/70 italic" }, toDisplayString(stats.presentToday) + " hadir", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg"><section class="lg:col-span-2 glass-card rounded-xl shadow-sm flex flex-col h-full"><div class="p-6 border-b border-white/20 flex justify-between items-center"><div><h4 class="font-display text-title-lg text-primary">Jadwal Mengajar Hari Ini</h4><p class="text-label-md text-on-surface-variant">${ssrInterpolate(schedule.length)} sesi pelajaran</p></div><button class="text-primary-container hover:bg-primary-fixed/30 px-3 py-1 rounded-lg transition-colors text-label-md">Lihat Semua</button></div><div class="flex-1 p-6 space-y-4"><!--[-->`);
      ssrRenderList(schedule, (item, idx) => {
        _push(`<div class="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-white/50"><div class="text-center min-w-[56px]"><p class="text-label-sm font-bold text-primary">${ssrInterpolate(item.time)}</p><span class="${ssrRenderClass(["text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block", item.status === "Berlangsung" ? "bg-green-100 text-green-700" : item.status === "Selesai" ? "bg-surface-container-high text-on-surface-variant" : "bg-blue-100 text-blue-700"])}">${ssrInterpolate(item.status)}</span></div><div class="flex-1"><p class="text-label-md font-medium text-on-surface">${ssrInterpolate(item.subject)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(item.class)} \u2022 ${ssrInterpolate(item.room)}</p></div><div class="flex items-center gap-2"><span class="text-label-sm text-on-surface-variant">${ssrInterpolate(item.students)} santri</span><button class="p-2 hover:bg-surface-container-high rounded-lg transition-colors"><span class="material-symbols-outlined text-sm text-primary">arrow_forward</span></button></div></div>`);
      });
      _push(`<!--]-->`);
      if (schedule.length === 0) {
        _push(`<div class="text-center py-8 text-on-surface-variant text-label-md"> Tidak ada jadwal mengajar hari ini. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><div class="space-y-gutter"><section class="glass-card rounded-xl shadow-sm p-6"><div class="flex items-center justify-between mb-4"><h4 class="font-display text-title-lg text-primary">Input Nilai Cepat</h4><span class="material-symbols-outlined text-on-surface-variant/40">edit_note</span></div><div class="space-y-3"><!--[-->`);
      ssrRenderList(quickGradeClasses, (cls, idx) => {
        _push(`<div class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer"><div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center"><span class="material-symbols-outlined text-sm text-primary">description</span></div><div class="flex-1"><p class="text-label-md text-on-surface">${ssrInterpolate(cls.name)}</p><p class="text-[11px] text-on-surface-variant">${ssrInterpolate(cls.subject)} \u2022 ${ssrInterpolate(cls.count)} santri</p></div><button class="px-4 py-1.5 bg-primary text-on-primary text-[11px] font-bold rounded-lg hover:bg-primary-container transition-colors">Nilai</button></div>`);
      });
      _push(`<!--]--></div></section><section class="glass-card rounded-xl shadow-sm p-6"><div class="flex items-center justify-between mb-4"><h4 class="font-display text-title-lg text-primary">Verifikasi Hafalan</h4><span class="w-6 h-6 rounded-full bg-error-container flex items-center justify-center"><span class="text-[10px] font-bold text-on-error-container">${ssrInterpolate(tahfidzPending.length)}</span></span></div><div class="space-y-3"><!--[-->`);
      ssrRenderList(tahfidzPending, (item, idx) => {
        _push(`<div class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low"><div class="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center"><span class="material-symbols-outlined text-sm text-secondary">menu_book</span></div><div class="flex-1 min-w-0"><p class="text-label-md text-on-surface truncate">${ssrInterpolate(item.name)}</p><p class="text-[11px] text-on-surface-variant">${ssrInterpolate(item.surah)} ${ssrInterpolate(item.ayat)} \u2022 ${ssrInterpolate(item.time)}</p></div><div class="flex gap-1"><button class="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"><span class="material-symbols-outlined text-sm">check</span></button><button class="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"><span class="material-symbols-outlined text-sm">close</span></button></div></div>`);
      });
      _push(`<!--]-->`);
      if (tahfidzPending.length === 0) {
        _push(`<div class="text-center py-4 text-on-surface-variant text-label-md"> Tidak ada verifikasi menunggu. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></div></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter"><div class="grid grid-cols-2 gap-gutter">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/akademik/grading",
        class: "glass-card rounded-xl p-6 shadow-sm hover:scale-[1.02] transition-transform text-center flex flex-col items-center gap-3 border-l-4 border-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center"${_scopeId}><span class="material-symbols-outlined text-primary"${_scopeId}>edit_note</span></div><h5 class="font-display text-title-lg text-primary"${_scopeId}>Input Nilai</h5><p class="text-label-sm text-on-surface-variant"${_scopeId}>Kelola penilaian akademik</p>`);
          } else {
            return [
              createVNode("div", { class: "w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center" }, [
                createVNode("span", { class: "material-symbols-outlined text-primary" }, "edit_note")
              ]),
              createVNode("h5", { class: "font-display text-title-lg text-primary" }, "Input Nilai"),
              createVNode("p", { class: "text-label-sm text-on-surface-variant" }, "Kelola penilaian akademik")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/attendance",
        class: "glass-card rounded-xl p-6 shadow-sm hover:scale-[1.02] transition-transform text-center flex flex-col items-center gap-3 border-l-4 border-secondary-container"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-12 h-12 bg-secondary-fixed rounded-xl flex items-center justify-center"${_scopeId}><span class="material-symbols-outlined text-secondary"${_scopeId}>how_to_reg</span></div><h5 class="font-display text-title-lg text-secondary"${_scopeId}>Absensi</h5><p class="text-label-sm text-on-surface-variant"${_scopeId}>Rekam kehadiran santri</p>`);
          } else {
            return [
              createVNode("div", { class: "w-12 h-12 bg-secondary-fixed rounded-xl flex items-center justify-center" }, [
                createVNode("span", { class: "material-symbols-outlined text-secondary" }, "how_to_reg")
              ]),
              createVNode("h5", { class: "font-display text-title-lg text-secondary" }, "Absensi"),
              createVNode("p", { class: "text-label-sm text-on-surface-variant" }, "Rekam kehadiran santri")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/jadwal",
        class: "glass-card rounded-xl p-6 shadow-sm hover:scale-[1.02] transition-transform text-center flex flex-col items-center gap-3 border-l-4 border-primary-fixed-dim"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-12 h-12 bg-primary-fixed-dim/30 rounded-xl flex items-center justify-center"${_scopeId}><span class="material-symbols-outlined text-primary"${_scopeId}>calendar_month</span></div><h5 class="font-display text-title-lg text-primary"${_scopeId}>Jadwal Mengajar</h5><p class="text-label-sm text-on-surface-variant"${_scopeId}>Lihat jadwal pelajaran</p>`);
          } else {
            return [
              createVNode("div", { class: "w-12 h-12 bg-primary-fixed-dim/30 rounded-xl flex items-center justify-center" }, [
                createVNode("span", { class: "material-symbols-outlined text-primary" }, "calendar_month")
              ]),
              createVNode("h5", { class: "font-display text-title-lg text-primary" }, "Jadwal Mengajar"),
              createVNode("p", { class: "text-label-sm text-on-surface-variant" }, "Lihat jadwal pelajaran")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tahfidz",
        class: "glass-card rounded-xl p-6 shadow-sm hover:scale-[1.02] transition-transform text-center flex flex-col items-center gap-3 border-l-4 border-error"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-12 h-12 bg-error-container rounded-xl flex items-center justify-center"${_scopeId}><span class="material-symbols-outlined text-error"${_scopeId}>menu_book</span></div><h5 class="font-display text-title-lg text-error"${_scopeId}>Tahfidz</h5><p class="text-label-sm text-on-surface-variant"${_scopeId}>Verifikasi setoran hafalan</p>`);
          } else {
            return [
              createVNode("div", { class: "w-12 h-12 bg-error-container rounded-xl flex items-center justify-center" }, [
                createVNode("span", { class: "material-symbols-outlined text-error" }, "menu_book")
              ]),
              createVNode("h5", { class: "font-display text-title-lg text-error" }, "Tahfidz"),
              createVNode("p", { class: "text-label-sm text-on-surface-variant" }, "Verifikasi setoran hafalan")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><section class="lg:col-span-2 glass-card rounded-xl shadow-sm flex flex-col h-full"><div class="p-6 border-b border-white/20 flex justify-between items-center"><div><h4 class="font-display text-title-lg text-primary">Aktivitas Terbaru</h4><p class="text-label-md text-on-surface-variant">Log aktivitas mengajar dan bimbingan</p></div><div class="flex items-center gap-2"><span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><span class="text-label-sm text-on-surface-variant">Langsung</span><button class="text-primary-container hover:bg-primary-fixed/30 px-3 py-1 rounded-lg transition-colors text-label-md">Refresh</button></div></div><div class="flex-1 p-6 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar"><!--[-->`);
      ssrRenderList(activities, (activity, idx) => {
        var _a;
        _push(`<div class="flex gap-4 group"><div class="relative"><div class="${ssrRenderClass(["w-10 h-10 rounded-full flex items-center justify-center z-10 relative", activity.bg])}"><span class="${ssrRenderClass([activity.iconColor, "material-symbols-outlined text-sm"])}">${ssrInterpolate(activity.icon)}</span></div>`);
        if (idx < activities.length - 1) {
          _push(`<div class="absolute top-10 left-1/2 w-0.5 h-full bg-outline-variant/30 -translate-x-1/2"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><p class="text-label-md text-on-background">${(_a = activity.title) != null ? _a : ""}</p><p class="text-label-sm text-on-surface-variant/70">${ssrInterpolate(activity.time)}</p></div></div>`);
      });
      _push(`<!--]-->`);
      if (activities.length === 0) {
        _push(`<div class="text-center py-8 text-on-surface-variant text-label-md"> Belum ada aktivitas hari ini. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></div><section class="mt-stack-lg glass-card rounded-xl shadow-sm p-6"><h4 class="font-display text-title-lg text-primary mb-4">Aksi Cepat</h4><div class="grid grid-cols-1 md:grid-cols-3 gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/akademik/grading",
        class: "flex items-center gap-3 w-full p-4 bg-primary text-on-primary rounded-xl hover:bg-primary-container transition-all active:scale-95 text-left"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined"${_scopeId}>edit_note</span><div${_scopeId}><p class="text-label-md"${_scopeId}>Input Nilai</p><p class="text-[10px] opacity-70"${_scopeId}>Beri penilaian untuk kelas</p></div>`);
          } else {
            return [
              createVNode("span", { class: "material-symbols-outlined" }, "edit_note"),
              createVNode("div", null, [
                createVNode("p", { class: "text-label-md" }, "Input Nilai"),
                createVNode("p", { class: "text-[10px] opacity-70" }, "Beri penilaian untuk kelas")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/attendance",
        class: "flex items-center gap-3 w-full p-4 bg-white border border-primary text-primary rounded-xl hover:bg-primary-fixed/10 transition-all active:scale-95 text-left"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined"${_scopeId}>how_to_reg</span><div${_scopeId}><p class="text-label-md"${_scopeId}>Rekam Absensi</p><p class="text-[10px] text-on-surface-variant"${_scopeId}>Catat kehadiran santri</p></div>`);
          } else {
            return [
              createVNode("span", { class: "material-symbols-outlined" }, "how_to_reg"),
              createVNode("div", null, [
                createVNode("p", { class: "text-label-md" }, "Rekam Absensi"),
                createVNode("p", { class: "text-[10px] text-on-surface-variant" }, "Catat kehadiran santri")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tahfidz",
        class: "flex items-center gap-3 w-full p-4 bg-white border border-outline-variant text-on-background rounded-xl hover:bg-surface-container-low transition-all active:scale-95 text-left"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined"${_scopeId}>menu_book</span><div${_scopeId}><p class="text-label-md"${_scopeId}>Verifikasi Hafalan</p><p class="text-[10px] text-on-surface-variant"${_scopeId}>Setoran tahfidz santri</p></div>`);
          } else {
            return [
              createVNode("span", { class: "material-symbols-outlined" }, "menu_book"),
              createVNode("div", null, [
                createVNode("p", { class: "text-label-md" }, "Verifikasi Hafalan"),
                createVNode("p", { class: "text-[10px] text-on-surface-variant" }, "Setoran tahfidz santri")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/portal/guru.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=guru-BC2UAhVr.mjs.map
