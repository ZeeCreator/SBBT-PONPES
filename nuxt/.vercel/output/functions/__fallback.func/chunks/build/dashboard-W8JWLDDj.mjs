import { _ as __nuxt_component_0 } from './nuxt-link-Ck3s51Pu.mjs';
import { defineComponent, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const transactions = [
      { month: "September", note: "Building Fee", date: "Paid on Sept 05, 2024", method: "Credit Card", amount: "Rp 1.250.000" },
      { month: "August", note: "", date: "Paid on Aug 08, 2024", method: "Bank Transfer", amount: "Rp 750.000" }
    ];
    const subjects = [
      { name: "Al-Qur'an & Hadith", score: 92, grade: "A", gradeClass: "text-green-600 bg-green-100" },
      { name: "Mathematics", score: 85, grade: "B+", gradeClass: "text-primary-container bg-primary-fixed" },
      { name: "Physics", score: 88, grade: "A-", gradeClass: "text-primary-container bg-primary-fixed" },
      { name: "Arabic Language", score: 95, grade: "A", gradeClass: "text-green-600 bg-green-100" }
    ];
    const attendanceStats = [
      { label: "Congregational Prayer", icon: "check_circle", bg: "bg-green-100", iconColor: "text-green-700", value: "100% On-time" },
      { label: "Tahfidz Target", icon: "menu_book", bg: "bg-blue-100", iconColor: "text-blue-700", value: "On Schedule (Juz 12)" },
      { label: "Extracurricular", icon: "fitness_center", bg: "bg-purple-100", iconColor: "text-purple-700", value: "Karate Club (Active)" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg mb-stack-lg"><div class="lg:col-span-2 glass-card rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group"><div class="absolute -right-12 -top-12 w-48 h-48 bg-primary-fixed-dim/10 rounded-full blur-3xl group-hover:bg-primary-fixed-dim/20 transition-all"></div><div class="relative"><div class="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg bg-primary-fixed flex items-center justify-center"><span class="material-symbols-outlined text-5xl text-primary">person</span></div><div class="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider">Active</div></div><div class="flex-1 text-center md:text-left space-y-2"><span class="px-3 py-1 bg-primary-fixed text-on-primary-fixed text-[12px] font-bold rounded-full">Grade 11 - IPA 2</span><h3 class="font-display text-headline-lg text-primary">Muhammad Rizky Fauzi</h3><div class="flex flex-wrap justify-center md:justify-start gap-4 pt-2"><div class="flex items-center gap-2 text-on-surface-variant"><span class="material-symbols-outlined text-primary text-sm">id_card</span><span class="text-label-md">NIS: 202410023</span></div><div class="flex items-center gap-2 text-on-surface-variant"><span class="material-symbols-outlined text-primary text-sm">home_pin</span><span class="text-label-md">Dorm: Al-Ghazali 3</span></div></div></div><div class="w-full md:w-auto flex flex-row md:flex-col gap-3"><button class="flex-1 bg-primary text-white px-6 py-3 rounded-xl text-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"><span class="material-symbols-outlined text-sm">person_search</span> Profile </button><button class="flex-1 bg-white border border-primary text-primary px-6 py-3 rounded-xl text-label-md flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"><span class="material-symbols-outlined text-sm">mail</span> Message </button></div></div><div class="space-y-stack-md"><div class="glass-card rounded-3xl p-6 flex items-center justify-between border-l-4 border-secondary-container"><div><p class="text-on-surface-variant text-label-sm uppercase tracking-widest mb-1">Attendance</p><h4 class="text-headline-md font-bold text-primary">98.4%</h4></div><div class="w-12 h-12 bg-secondary-fixed rounded-full flex items-center justify-center"><span class="material-symbols-outlined text-on-secondary-fixed">fact_check</span></div></div><div class="glass-card rounded-3xl p-6 flex items-center justify-between border-l-4 border-primary-container"><div><p class="text-on-surface-variant text-label-sm uppercase tracking-widest mb-1">Academic Rank</p><h4 class="text-headline-md font-bold text-primary">3 / 32</h4></div><div class="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center"><span class="material-symbols-outlined text-on-primary-fixed">military_tech</span></div></div></div></div><div class="grid grid-cols-1 xl:grid-cols-2 gap-stack-lg"><div class="glass-card rounded-3xl p-8"><div class="flex items-center justify-between mb-8"><div><h3 class="font-display text-headline-md text-primary">SPP Payment Status</h3><p class="text-on-surface-variant text-body-md">Manage education fees and bills</p></div><span class="material-symbols-outlined text-on-surface-variant/40 text-4xl">payments</span></div><div class="bg-primary text-white rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg shadow-primary-container/20"><div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-fixed-dim/20 to-transparent opacity-50"></div><div class="relative z-10"><p class="text-on-primary/60 text-label-sm uppercase tracking-wider mb-1">Outstanding Balance</p><h2 class="font-display text-display-lg">Rp 1.250.000</h2><p class="text-on-primary-fixed-variant text-label-md bg-white/10 w-fit px-3 py-1 rounded-full mt-2">Due on Oct 10, 2024</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/keuangan/spp-payment",
        class: "relative z-10 bg-secondary-container text-on-secondary-fixed font-bold px-8 py-4 rounded-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-secondary-container/30"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Pay via Midtrans <span class="material-symbols-outlined"${_scopeId}>arrow_forward</span>`);
          } else {
            return [
              createTextVNode(" Pay via Midtrans "),
              createVNode("span", { class: "material-symbols-outlined" }, "arrow_forward")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-4"><h4 class="font-display text-title-lg text-primary">Recent Transactions</h4><div class="divide-y divide-outline-variant/30"><!--[-->`);
      ssrRenderList(transactions, (tx) => {
        _push(`<div class="py-4 flex items-center justify-between"><div class="flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-primary text-lg">description</span></div><div><p class="text-label-md text-on-surface">${ssrInterpolate(tx.month)} SPP${ssrInterpolate(tx.note ? " & " + tx.note : "")}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(tx.date)} \u2022 ${ssrInterpolate(tx.method)}</p></div></div><div class="text-right"><p class="text-label-md text-primary font-bold">${ssrInterpolate(tx.amount)}</p><span class="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-bold uppercase">Success</span></div></div>`);
      });
      _push(`<!--]--></div><button class="w-full text-center py-4 text-secondary text-label-md hover:underline">View All History</button></div></div><div class="space-y-stack-lg"><div class="glass-card rounded-3xl p-8 h-full"><div class="flex items-center justify-between mb-8"><div><h3 class="font-display text-headline-md text-primary">Academic Progress</h3><p class="text-on-surface-variant text-body-md">Latest examination results</p></div><button class="bg-surface-container-high/50 p-2 rounded-full hover:bg-surface-container-high transition-colors"><span class="material-symbols-outlined text-primary">download</span></button></div><div class="grid grid-cols-2 gap-4 mb-8"><!--[-->`);
      ssrRenderList(subjects, (subject) => {
        _push(`<div class="p-5 rounded-2xl bg-surface-container-low border border-white flex flex-col gap-2"><p class="text-label-sm text-on-surface-variant uppercase tracking-widest">${ssrInterpolate(subject.name)}</p><div class="flex items-end justify-between"><span class="text-headline-md font-bold text-primary">${ssrInterpolate(subject.score)}</span><span class="${ssrRenderClass(["text-label-sm px-2 py-0.5 rounded uppercase", subject.gradeClass])}">${ssrInterpolate(subject.grade)}</span></div><div class="w-full bg-outline-variant/30 h-1 rounded-full mt-2"><div class="bg-primary h-1 rounded-full" style="${ssrRenderStyle({ width: subject.score + "%" })}"></div></div></div>`);
      });
      _push(`<!--]--></div><div class="p-6 rounded-3xl bg-error-container/30 border border-error/10"><div class="flex items-start gap-4"><div class="w-12 h-12 bg-error-container rounded-2xl flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-error" data-weight="fill">gavel</span></div><div><h4 class="font-display text-title-lg text-error font-bold mb-1">Disciplinary Points: 5</h4><p class="text-on-surface-variant text-label-md">Recent: Late to Fajr prayer (3 pts), Not wearing uniform correctly (2 pts). Total accumulated points: 5/100.</p><button class="mt-3 text-error font-bold text-label-sm flex items-center gap-1 hover:underline"> View Details <span class="material-symbols-outlined text-xs">arrow_outward</span></button></div></div></div></div></div></div><div class="mt-stack-lg glass-card rounded-3xl p-8"><div class="flex items-center justify-between mb-8"><div><h3 class="font-display text-headline-md text-primary">Attendance Overview</h3><p class="text-on-surface-variant text-body-md">Tracking daily academic and spiritual activities</p></div><div class="flex gap-2"><div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-50 border border-green-100"><span class="w-3 h-3 rounded-full bg-green-500"></span><span class="text-label-sm text-green-700">Present</span></div><div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 border border-amber-100"><span class="w-3 h-3 rounded-full bg-amber-500"></span><span class="text-label-sm text-amber-700">Permit</span></div><div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 border border-red-100"><span class="w-3 h-3 rounded-full bg-red-500"></span><span class="text-label-sm text-red-700">Alpha</span></div></div></div><div class="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-31 gap-2 mb-8"><!--[-->`);
      ssrRenderList(31, (day) => {
        _push(`<div class="group relative flex flex-col items-center"><div class="${ssrRenderClass([
          "w-full aspect-square rounded-md transition-transform hover:scale-110 cursor-help",
          day === 12 ? "bg-red-500" : day === 24 ? "bg-amber-500" : day > 25 ? "bg-green-500 opacity-20" : "bg-green-500"
        ])}"></div><span class="text-[8px] mt-1 text-on-surface-variant font-medium">${ssrInterpolate(day)}</span></div>`);
      });
      _push(`<!--]--></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><!--[-->`);
      ssrRenderList(attendanceStats, (stat) => {
        _push(`<div class="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-white"><div class="${ssrRenderClass(["w-10 h-10 rounded-full flex items-center justify-center", stat.bg])}"><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><div><p class="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">${ssrInterpolate(stat.label)}</p><p class="font-bold text-primary">${ssrInterpolate(stat.value)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/wali-santri/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-W8JWLDDj.mjs.map
