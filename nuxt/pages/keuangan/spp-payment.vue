<template>
  <div class="bg-mesh min-h-screen" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="px-gutter max-w-6xl mx-auto">
      <div class="mb-stack-lg">
        <h2 class="font-display text-headline-lg text-primary mb-2">Pembayaran SPP</h2>
        <p class="text-on-surface-variant text-body-md">Selesaikan pembayaran biaya pendidikan santri dengan aman dan cepat.</p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg items-start">
        <div class="lg:col-span-2 space-y-stack-md">
          <div class="glass-card rounded-xl p-8 shadow-sm">
            <div v-if="loading" class="text-center text-on-surface-variant py-8">Memuat data tagihan...</div>
            <div v-else-if="invoices.length === 0" class="text-center text-on-surface-variant py-8">Belum ada tagihan</div>
            <template v-else>
              <div class="mb-4">
                <select v-model="selectedInvoice" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary">
                  <option v-for="inv in invoices" :key="inv.id" :value="inv">
                    {{ inv.invoiceCode || inv.id }} - {{ inv.studentName }} - Rp {{ Number(inv.amount).toLocaleString('id-ID') }}
                  </option>
                </select>
              </div>
              <div v-if="selectedInvoice">
                <div class="flex justify-between items-start mb-6">
                  <div>
                    <h3 class="font-display text-title-lg text-primary mb-1">Ringkasan Tagihan</h3>
                    <p class="text-label-md text-on-surface-variant">Invoice: {{ selectedInvoice.invoiceCode || selectedInvoice.id }}</p>
                  </div>
                  <span :class="['px-4 py-1 rounded-full text-label-sm uppercase tracking-wider', selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-secondary-container/20 text-on-secondary-container']">
                    {{ selectedInvoice.status === 'paid' ? 'Lunas' : 'Menunggu Pembayaran' }}
                  </span>
                </div>
                <div class="space-y-4 mb-8">
                  <div class="flex justify-between items-center py-4 border-b border-outline-variant/30">
                    <div>
                      <p class="font-bold text-on-surface">SPP {{ selectedInvoice.month || '' }} {{ selectedInvoice.year || '' }}</p>
                      <p class="text-label-md text-on-surface-variant">Santri: {{ selectedInvoice.studentName }} ({{ selectedInvoice.studentId }})</p>
                    </div>
                    <p class="font-display text-headline-md text-primary">Rp {{ Number(selectedInvoice.amount).toLocaleString('id-ID') }}</p>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <p class="text-on-surface-variant">Biaya Layanan</p>
                    <p class="text-on-surface">Rp 2.500</p>
                  </div>
                  <div class="flex justify-between items-center pt-6 border-t border-primary/10">
                    <p class="font-bold text-on-surface text-lg">Total Pembayaran</p>
                    <p class="font-display text-headline-lg text-secondary">Rp {{ (Number(selectedInvoice.amount) + 2500).toLocaleString('id-ID') }}</p>
                  </div>
                </div>
                <div class="bg-primary/5 rounded-lg p-4 flex gap-4 items-start">
                  <span class="material-symbols-outlined text-primary mt-1">info</span>
                  <p class="text-label-md text-on-surface-variant">Pembayaran akan diverifikasi secara otomatis setelah transaksi berhasil. Harap simpan bukti pembayaran Anda.</p>
                </div>
                <button v-if="selectedInvoice.status !== 'paid'" class="mt-4 w-full bg-primary text-on-primary py-3 rounded-lg text-label-md font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2" @click="processPayment">
                  <span class="material-symbols-outlined text-sm">payment</span> Bayar Sekarang
                </button>
              </div>
            </template>
          </div>
          <div class="glass-card rounded-xl p-6 shadow-sm">
            <h3 class="font-display text-title-lg text-primary mb-4">Riwayat Terakhir</h3>
            <div class="space-y-3">
              <div v-for="item in history" :key="item.month" class="flex items-center justify-between p-3 rounded-lg hover:bg-white/40 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span class="material-symbols-outlined">receipt_long</span>
                  </div>
                  <div>
                    <p class="text-label-md text-on-surface">SPP {{ item.month }}</p>
                    <p class="text-[10px] text-on-surface-variant uppercase">{{ item.date }} &bull; {{ item.method }}</p>
                  </div>
                </div>
                <button class="text-primary hover:underline text-label-sm font-semibold flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">download</span> Unduh
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-1 space-y-stack-md">
          <div class="glass-card rounded-xl p-8 shadow-sm">
            <h3 class="font-display text-title-lg text-primary mb-6">Metode Pembayaran</h3>
            <div class="space-y-3 mb-8">
              <div class="space-y-2">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Virtual Account</p>
                <label v-for="va in virtualAccounts" :key="va.name" class="group flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-primary/50 cursor-pointer transition-all duration-200"
                  :class="{ 'bg-primary/5 border-primary': selectedPayment === va.name }">
                  <input type="radio" :value="va.name" v-model="selectedPayment" class="w-5 h-5 text-primary focus:ring-primary border-outline-variant" />
                  <div class="flex-1">
                    <p class="font-bold text-on-surface">{{ va.name }}</p>
                    <p class="text-xs text-on-surface-variant">Verifikasi Otomatis</p>
                  </div>
                  <div class="h-6 w-10 rounded bg-surface-container-high flex items-center justify-center text-[8px] font-bold text-on-surface-variant uppercase">{{ va.short }}</div>
                </label>
              </div>
              <div class="space-y-2 pt-2">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">E-Wallet &amp; QRIS</p>
                <label class="group flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-primary/50 cursor-pointer transition-all duration-200"
                  :class="{ 'bg-primary/5 border-primary': selectedPayment === 'QRIS' }">
                  <input type="radio" value="QRIS" v-model="selectedPayment" class="w-5 h-5 text-primary focus:ring-primary border-outline-variant" />
                  <div class="flex-1">
                    <p class="font-bold text-on-surface">QRIS (Gopay, OVO, Dana)</p>
                    <p class="text-xs text-on-surface-variant">Scan QR Code</p>
                  </div>
                  <span class="material-symbols-outlined text-outline">qr_code_scanner</span>
                </label>
              </div>
            </div>
            <button class="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-body-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2" @click="showPaymentModal = true">
              <span class="material-symbols-outlined">verified_user</span> Bayar Sekarang
            </button>
            <p class="text-center text-[10px] text-on-surface-variant mt-4 uppercase tracking-tighter">Secured by Midtrans Payment Gateway</p>
          </div>
          <div class="p-6 bg-secondary-fixed text-on-secondary-fixed rounded-xl border-2 border-dashed border-secondary-container/40">
            <p class="text-label-sm font-bold mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">stars</span> PROMO SANTRI
            </p>
            <p class="text-label-md">Gunakan kode <b>PPTERPADU23</b> untuk potongan biaya layanan Rp 2.500.</p>
          </div>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="showPaymentModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="showPaymentModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-enter">
          <div class="bg-[#002855] p-6 text-white flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="h-6 flex items-center"><span class="text-sm font-bold tracking-wider">MIDTRANS</span></div>
              <span class="text-xs opacity-50">|</span>
              <p class="text-xs font-semibold uppercase tracking-widest">Secure Payment</p>
            </div>
            <button class="p-1 hover:bg-white/10 rounded-full transition-colors" @click="showPaymentModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-8">
            <div class="text-center mb-8">
              <p class="text-on-surface-variant text-label-md mb-1">Total tagihan</p>
              <h4 class="text-3xl font-bold text-on-surface">Rp 752.624</h4>
            </div>
            <div v-if="!paymentSuccess">
              <div class="flex flex-col items-center justify-center py-10 space-y-6">
                <div class="relative">
                  <div class="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <span class="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-3xl">hourglass_empty</span>
                </div>
                <div class="text-center">
                  <p class="font-bold text-lg mb-1">Menunggu Pembayaran</p>
                  <p class="text-on-surface-variant text-label-md">Silakan selesaikan transaksi di aplikasi m-banking atau e-wallet Anda.</p>
                </div>
              </div>
              <button class="w-full bg-primary/10 text-primary py-3 rounded-lg font-semibold hover:bg-primary/20 transition-colors" @click="paymentSuccess = true">Simulasikan Pembayaran Berhasil</button>
            </div>
            <div v-else>
              <div class="flex flex-col items-center justify-center py-6 space-y-4">
                <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white scale-110 shadow-xl shadow-green-200">
                  <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                </div>
                <div class="text-center">
                  <h4 class="font-bold text-2xl mb-1 text-on-surface">Pembayaran Berhasil!</h4>
                  <p class="text-on-surface-variant text-label-md">Terima kasih. Dana telah kami terima dan tercatat di sistem kami.</p>
                </div>
                <div class="w-full bg-surface-container rounded-xl p-4 mt-6">
                  <div class="flex justify-between text-xs mb-2">
                    <span class="text-on-surface-variant">Order ID</span>
                    <span class="font-bold text-on-surface">SIMPPT-7738210</span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="text-on-surface-variant">Waktu Selesai</span>
                    <span class="font-bold text-on-surface">12 Okt 2023, 14:22</span>
                  </div>
                </div>
                <button class="w-full bg-secondary-container text-on-secondary-container py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-md mt-4" @click="downloadReceipt">
                  <span class="material-symbols-outlined">download</span> Download Receipt (PDF)
                </button>
              </div>
            </div>
          </div>
          <div class="px-8 py-4 bg-surface-container-low border-t border-outline-variant/30 flex justify-center">
            <p class="text-[9px] text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
              <span class="material-symbols-outlined text-[10px]">lock</span> Encrypted and Secure connection
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'bendahara' })

const showPaymentModal = ref(false)
const paymentSuccess = ref(false)
const selectedPayment = ref('Bank Mandiri')
const invoices = ref<any[]>([])
const payments = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const selectedInvoice = ref<any>(null)

const virtualAccounts = [
  { name: 'Bank Mandiri', short: 'MAND' },
  { name: 'Bank BRI', short: 'BRI' },
]

const history = computed(() =>
  payments.value.slice(0, 5).map((p: any) => ({
    month: p.month || new Date(p.paidAt || p.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }),
    date: new Date(p.paidAt || p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    method: p.method || 'Transfer',
  }))
)

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const [invData, payData] = await Promise.all([
      $fetch('/api/invoices'),
      $fetch('/api/payments'),
    ])
    invoices.value = invData || []
    payments.value = payData || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

function openPayment(invoice: any) {
  selectedInvoice.value = invoice
  paymentSuccess.value = false
  showPaymentModal.value = true
}

async function processPayment() {
  if (!selectedInvoice.value) return
  try {
    await $fetch('/api/payments', {
      method: 'POST',
      body: {
        invoiceId: selectedInvoice.value.id,
        studentId: selectedInvoice.value.studentId,
        studentName: selectedInvoice.value.studentName,
        amount: selectedInvoice.value.amount,
        method: 'virtual_account',
        month: selectedInvoice.value.month,
      },
    })
    await $fetch(`/api/invoices/${selectedInvoice.value.id}`, {
      method: 'PUT',
      body: { status: 'paid' },
    })
    paymentSuccess.value = true
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal memproses pembayaran'
  }
}

function downloadReceipt() {
  const btn = document.activeElement as HTMLElement
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Generating PDF...'
  setTimeout(() => {
    showPaymentModal.value = false
    paymentSuccess.value = false
  }, 2000)
}

onMounted(() => fetchData())
</script>
