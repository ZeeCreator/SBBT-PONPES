import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const menuCards = [
      { title: "Kurikulum", description: "Kelola struktur kurikulum, mata pelajaran, dan jadwal", icon: "book", to: "/akademik/curriculum", bg: "bg-blue-100", iconColor: "text-blue-600" },
      { title: "Penilaian", description: "Input dan lihat nilai akademik santri", icon: "assignment", to: "/akademik/grading", bg: "bg-green-100", iconColor: "text-green-600" },
      { title: "Imtihan", description: "Kelola jadwal dan nilai ujian imtihan", icon: "quiz", to: "/akademik/imtihan", bg: "bg-purple-100", iconColor: "text-purple-600" },
      { title: "Iktibar", description: "Catatan iktibar harian santri", icon: "edit_note", to: "/akademik/imtihan", bg: "bg-amber-100", iconColor: "text-amber-600" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary">Menu Akademik</h2><p class="text-on-surface-variant text-body-md">Kelola kurikulum, penilaian, imtihan, dan iktibar.</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"><!--[-->`);
      ssrRenderList(menuCards, (card) => {
        _push(`<div class="glass-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group border border-outline-variant/10"><div class="${ssrRenderClass([card.bg, "w-14 h-14 rounded-2xl flex items-center justify-center mb-4"])}"><span class="${ssrRenderClass([card.iconColor, "material-symbols-outlined text-2xl"])}">${ssrInterpolate(card.icon)}</span></div><h3 class="font-display text-title-lg text-primary mb-1 group-hover:text-primary-fixed transition-colors">${ssrInterpolate(card.title)}</h3><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(card.description)}</p></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/akademik/menu/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cgg3qTc6.mjs.map
