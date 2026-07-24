import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderClass, ssrRenderTeleport, ssrRenderStyle } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "spp-payment",
  __ssrInlineRender: true,
  setup(__props) {
    const showPaymentModal = ref(false);
    const paymentSuccess = ref(false);
    const selectedPayment = ref("Bank Mandiri");
    const invoices = ref([]);
    const payments = ref([]);
    const loading = ref(true);
    ref("");
    const selectedInvoice = ref(null);
    const virtualAccounts = [
      { name: "Bank Mandiri", short: "MAND" },
      { name: "Bank BRI", short: "BRI" }
    ];
    const history = computed(
      () => payments.value.slice(0, 5).map((p) => ({
        month: p.month || new Date(p.paidAt || p.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long" }),
        date: new Date(p.paidAt || p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        method: p.method || "Transfer"
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "bg-mesh min-h-screen",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="px-gutter max-w-6xl mx-auto"><div class="mb-stack-lg"><h2 class="font-display text-headline-lg text-primary mb-2">Pembayaran SPP</h2><p class="text-on-surface-variant text-body-md">Selesaikan pembayaran biaya pendidikan santri dengan aman dan cepat.</p></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg items-start"><div class="lg:col-span-2 space-y-stack-md"><div class="glass-card rounded-xl p-8 shadow-sm">`);
      if (unref(loading)) {
        _push(`<div class="text-center text-on-surface-variant py-8">Memuat data tagihan...</div>`);
      } else if (unref(invoices).length === 0) {
        _push(`<div class="text-center text-on-surface-variant py-8">Belum ada tagihan</div>`);
      } else {
        _push(`<!--[--><div class="mb-4"><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary"><!--[-->`);
        ssrRenderList(unref(invoices), (inv) => {
          _push(`<option${ssrRenderAttr("value", inv)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedInvoice)) ? ssrLooseContain(unref(selectedInvoice), inv) : ssrLooseEqual(unref(selectedInvoice), inv)) ? " selected" : ""}>${ssrInterpolate(inv.invoiceCode || inv.id)} - ${ssrInterpolate(inv.studentName)} - Rp ${ssrInterpolate(Number(inv.amount).toLocaleString("id-ID"))}</option>`);
        });
        _push(`<!--]--></select></div>`);
        if (unref(selectedInvoice)) {
          _push(`<div><div class="flex justify-between items-start mb-6"><div><h3 class="font-display text-title-lg text-primary mb-1">Ringkasan Tagihan</h3><p class="text-label-md text-on-surface-variant">Invoice: ${ssrInterpolate(unref(selectedInvoice).invoiceCode || unref(selectedInvoice).id)}</p></div><span class="${ssrRenderClass(["px-4 py-1 rounded-full text-label-sm uppercase tracking-wider", unref(selectedInvoice).status === "paid" ? "bg-green-100 text-green-700" : "bg-secondary-container/20 text-on-secondary-container"])}">${ssrInterpolate(unref(selectedInvoice).status === "paid" ? "Lunas" : "Menunggu Pembayaran")}</span></div><div class="space-y-4 mb-8"><div class="flex justify-between items-center py-4 border-b border-outline-variant/30"><div><p class="font-bold text-on-surface">SPP ${ssrInterpolate(unref(selectedInvoice).month || "")} ${ssrInterpolate(unref(selectedInvoice).year || "")}</p><p class="text-label-md text-on-surface-variant">Santri: ${ssrInterpolate(unref(selectedInvoice).studentName)} (${ssrInterpolate(unref(selectedInvoice).studentId)})</p></div><p class="font-display text-headline-md text-primary">Rp ${ssrInterpolate(Number(unref(selectedInvoice).amount).toLocaleString("id-ID"))}</p></div><div class="flex justify-between items-center py-2"><p class="text-on-surface-variant">Biaya Layanan</p><p class="text-on-surface">Rp 2.500</p></div><div class="flex justify-between items-center pt-6 border-t border-primary/10"><p class="font-bold text-on-surface text-lg">Total Pembayaran</p><p class="font-display text-headline-lg text-secondary">Rp ${ssrInterpolate((Number(unref(selectedInvoice).amount) + 2500).toLocaleString("id-ID"))}</p></div></div><div class="bg-primary/5 rounded-lg p-4 flex gap-4 items-start"><span class="material-symbols-outlined text-primary mt-1">info</span><p class="text-label-md text-on-surface-variant">Pembayaran akan diverifikasi secara otomatis setelah transaksi berhasil. Harap simpan bukti pembayaran Anda.</p></div>`);
          if (unref(selectedInvoice).status !== "paid") {
            _push(`<button class="mt-4 w-full bg-primary text-on-primary py-3 rounded-lg text-label-md font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"><span class="material-symbols-outlined text-sm">payment</span> Bayar Sekarang </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div><div class="glass-card rounded-xl p-6 shadow-sm"><h3 class="font-display text-title-lg text-primary mb-4">Riwayat Terakhir</h3><div class="space-y-3"><!--[-->`);
      ssrRenderList(unref(history), (item) => {
        _push(`<div class="flex items-center justify-between p-3 rounded-lg hover:bg-white/40 transition-colors"><div class="flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span class="material-symbols-outlined">receipt_long</span></div><div><p class="text-label-md text-on-surface">SPP ${ssrInterpolate(item.month)}</p><p class="text-[10px] text-on-surface-variant uppercase">${ssrInterpolate(item.date)} \u2022 ${ssrInterpolate(item.method)}</p></div></div><button class="text-primary hover:underline text-label-sm font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-sm">download</span> Unduh </button></div>`);
      });
      _push(`<!--]--></div></div></div><div class="lg:col-span-1 space-y-stack-md"><div class="glass-card rounded-xl p-8 shadow-sm"><h3 class="font-display text-title-lg text-primary mb-6">Metode Pembayaran</h3><div class="space-y-3 mb-8"><div class="space-y-2"><p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Virtual Account</p><!--[-->`);
      ssrRenderList(virtualAccounts, (va) => {
        _push(`<label class="${ssrRenderClass([{ "bg-primary/5 border-primary": unref(selectedPayment) === va.name }, "group flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-primary/50 cursor-pointer transition-all duration-200"])}"><input type="radio"${ssrRenderAttr("value", va.name)}${ssrIncludeBooleanAttr(ssrLooseEqual(unref(selectedPayment), va.name)) ? " checked" : ""} class="w-5 h-5 text-primary focus:ring-primary border-outline-variant"><div class="flex-1"><p class="font-bold text-on-surface">${ssrInterpolate(va.name)}</p><p class="text-xs text-on-surface-variant">Verifikasi Otomatis</p></div><div class="h-6 w-10 rounded bg-surface-container-high flex items-center justify-center text-[8px] font-bold text-on-surface-variant uppercase">${ssrInterpolate(va.short)}</div></label>`);
      });
      _push(`<!--]--></div><div class="space-y-2 pt-2"><p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">E-Wallet &amp; QRIS</p><label class="${ssrRenderClass([{ "bg-primary/5 border-primary": unref(selectedPayment) === "QRIS" }, "group flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-primary/50 cursor-pointer transition-all duration-200"])}"><input type="radio" value="QRIS"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(selectedPayment), "QRIS")) ? " checked" : ""} class="w-5 h-5 text-primary focus:ring-primary border-outline-variant"><div class="flex-1"><p class="font-bold text-on-surface">QRIS (Gopay, OVO, Dana)</p><p class="text-xs text-on-surface-variant">Scan QR Code</p></div><span class="material-symbols-outlined text-outline">qr_code_scanner</span></label></div></div><button class="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-body-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"><span class="material-symbols-outlined">verified_user</span> Bayar Sekarang </button><p class="text-center text-[10px] text-on-surface-variant mt-4 uppercase tracking-tighter">Secured by Midtrans Payment Gateway</p></div><div class="p-6 bg-secondary-fixed text-on-secondary-fixed rounded-xl border-2 border-dashed border-secondary-container/40"><p class="text-label-sm font-bold mb-2 flex items-center gap-2"><span class="material-symbols-outlined text-sm">stars</span> PROMO SANTRI </p><p class="text-label-md">Gunakan kode <b>PPTERPADU23</b> untuk potongan biaya layanan Rp 2.500.</p></div></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showPaymentModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-enter"><div class="bg-[#002855] p-6 text-white flex justify-between items-center"><div class="flex items-center gap-3"><div class="h-6 flex items-center"><span class="text-sm font-bold tracking-wider">MIDTRANS</span></div><span class="text-xs opacity-50">|</span><p class="text-xs font-semibold uppercase tracking-widest">Secure Payment</p></div><button class="p-1 hover:bg-white/10 rounded-full transition-colors"><span class="material-symbols-outlined">close</span></button></div><div class="p-8"><div class="text-center mb-8"><p class="text-on-surface-variant text-label-md mb-1">Total tagihan</p><h4 class="text-3xl font-bold text-on-surface">Rp 752.624</h4></div>`);
          if (!unref(paymentSuccess)) {
            _push2(`<div><div class="flex flex-col items-center justify-center py-10 space-y-6"><div class="relative"><div class="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div><span class="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-3xl">hourglass_empty</span></div><div class="text-center"><p class="font-bold text-lg mb-1">Menunggu Pembayaran</p><p class="text-on-surface-variant text-label-md">Silakan selesaikan transaksi di aplikasi m-banking atau e-wallet Anda.</p></div></div><button class="w-full bg-primary/10 text-primary py-3 rounded-lg font-semibold hover:bg-primary/20 transition-colors">Simulasikan Pembayaran Berhasil</button></div>`);
          } else {
            _push2(`<div><div class="flex flex-col items-center justify-center py-6 space-y-4"><div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white scale-110 shadow-xl shadow-green-200"><span class="material-symbols-outlined text-4xl" style="${ssrRenderStyle({ "font-variation-settings": "'FILL' 1" })}">check_circle</span></div><div class="text-center"><h4 class="font-bold text-2xl mb-1 text-on-surface">Pembayaran Berhasil!</h4><p class="text-on-surface-variant text-label-md">Terima kasih. Dana telah kami terima dan tercatat di sistem kami.</p></div><div class="w-full bg-surface-container rounded-xl p-4 mt-6"><div class="flex justify-between text-xs mb-2"><span class="text-on-surface-variant">Order ID</span><span class="font-bold text-on-surface">SIMPPT-7738210</span></div><div class="flex justify-between text-xs"><span class="text-on-surface-variant">Waktu Selesai</span><span class="font-bold text-on-surface">12 Okt 2023, 14:22</span></div></div><button class="w-full bg-secondary-container text-on-secondary-container py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-md mt-4"><span class="material-symbols-outlined">download</span> Download Receipt (PDF) </button></div></div>`);
          }
          _push2(`</div><div class="px-8 py-4 bg-surface-container-low border-t border-outline-variant/30 flex justify-center"><p class="text-[9px] text-on-surface-variant uppercase tracking-widest flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">lock</span> Encrypted and Secure connection </p></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/keuangan/spp-payment.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=spp-payment-B-gXbITX.mjs.map
