<template>
  <div class="bg-mesh min-h-screen" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="px-gutter max-w-container-max mx-auto">
      <div class="mb-stack-lg">
        <h2 class="font-display text-headline-lg text-primary mb-2">Portal Pembayaran Wali Santri</h2>
        <p class="text-on-surface-variant text-body-md">Kelola tagihan pendidikan dan riwayat pembayaran santri.</p>
      </div>
      <div v-if="errorS" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ errorS }}</div>
      <div v-if="loading" class="flex items-center justify-center py-12">
        <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
      </div>
      <template v-else>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg mb-stack-lg">
          <div class="glass-card rounded-xl p-6 shadow-sm flex items-center gap-5 border-l-4 border-primary">
            <div class="w-14 h-14 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
            <div>
              <p class="text-on-surface-variant text-label-sm uppercase tracking-widest mb-1">Tagihan Aktif</p>
              <h4 class="font-display text-headline-lg text-primary">Rp {{ formatNumber(billTotal) }}</h4>
            </div>
          </div>
          <div class="glass-card rounded-xl p-6 shadow-sm flex items-center gap-5 border-l-4 border-secondary-container">
            <div class="w-14 h-14 bg-secondary-fixed rounded-full flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined text-3xl">checklist</span>
            </div>
            <div>
              <p class="text-on-surface-variant text-label-sm uppercase tracking-widest mb-1">Sudah Dibayar</p>
              <h4 class="font-display text-headline-lg text-secondary">Rp {{ formatNumber(paidTotal) }}</h4>
            </div>
          </div>
          <div class="glass-card rounded-xl p-6 shadow-sm flex items-center gap-5 border-l-4 border-tertiary-container">
            <div class="w-14 h-14 bg-tertiary-container rounded-full flex items-center justify-center text-tertiary">
              <span class="material-symbols-outlined text-3xl">receipt_long</span>
            </div>
            <div>
              <p class="text-on-surface-variant text-label-sm uppercase tracking-widest mb-1">Total Transaksi</p>
              <h4 class="font-display text-headline-lg text-tertiary">{{ paymentHistory.length }}</h4>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg items-start mb-stack-lg">
          <div class="lg:col-span-2 space-y-stack-md">
            <div class="glass-card rounded-xl p-6 shadow-sm">
              <div class="flex items-center gap-4 mb-5">
                <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary">person</span>
                </div>
                <div>
                  <h3 class="font-display text-title-lg text-primary">Muhammad Rizky Fauzi</h3>
                  <p class="text-label-sm text-on-surface-variant">NIS: 202410023 &bull; Kelas 11 IPA 2 &bull; Asrama: Al-Ghazali 3</p>
                </div>
                <span class="ml-auto bg-primary-fixed text-on-primary-fixed text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Active</span>
              </div>
            </div>
            <div class="glass-card rounded-xl p-6 shadow-sm">
              <h3 class="font-display text-title-lg text-primary mb-4">Tagihan Tertunda</h3>
              <div class="space-y-3">
                <div v-for="bill in pendingBills" :key="bill.id" class="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 gap-3">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-error-container/30 flex items-center justify-center text-error">
                      <span class="material-symbols-outlined text-sm">schedule</span>
                    </div>
                    <div>
                      <p class="text-label-md text-on-surface font-medium">{{ bill.label }}</p>
                      <p class="text-label-sm text-on-surface-variant">Jatuh tempo: {{ bill.dueDate }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 ml-14 sm:ml-0">
                    <span class="font-display text-headline-sm text-error font-bold">Rp {{ formatNumber(bill.amount) }}</span>
                    <button class="bg-primary text-on-primary px-5 py-2 rounded-lg text-label-md hover:brightness-110 active:scale-95 transition-all shadow-sm flex items-center gap-1.5" @click="quickPay(bill)">
                      <span class="material-symbols-outlined text-sm">flash_on</span> Bayar
                    </button>
                  </div>
                </div>
                <div v-if="pendingBills.length === 0" class="text-center py-6">
                  <span class="material-symbols-outlined text-4xl text-green-500 mb-2">check_circle</span>
                  <p class="text-label-md text-on-surface-variant">Tidak ada tagihan tertunda.</p>
                </div>
              </div>
            </div>
            <div class="glass-card rounded-xl p-6 shadow-sm">
              <h3 class="font-display text-title-lg text-primary mb-4">Riwayat Pembayaran</h3>
              <BulkActionBar :selected-count="selectedCount" @clear="clearSelection">
                <template #actions>
                  <button class="flex items-center gap-1 px-3 py-1.5 bg-error text-on-error rounded-lg text-label-sm hover:brightness-110 transition-all" @click="bulkDelete">
                    <span class="material-symbols-outlined text-sm">delete</span> Hapus
                  </button>
                </template>
              </BulkActionBar>

              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead class="bg-surface-container-low">
                    <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
                      <th class="px-4 py-3 text-label-md text-on-surface-variant">Pembayaran</th>
                      <th class="px-4 py-3 text-label-md text-on-surface-variant">Tanggal</th>
                      <th class="px-4 py-3 text-label-md text-on-surface-variant">Metode</th>
                      <th class="px-4 py-3 text-label-md text-on-surface-variant">Jumlah</th>
                      <th class="px-4 py-3 text-label-md text-on-surface-variant">Status</th>
                      <th class="px-4 py-3 text-label-md text-on-surface-variant">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant/10">
                    <tr v-for="tx in paymentHistory" :key="tx.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(tx.id)" @change="toggleOne(tx.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                      <td class="px-4 py-3 text-label-md text-on-surface font-medium">{{ tx.label }}</td>
                      <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ tx.date }}</td>
                      <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ tx.method }}</td>
                      <td class="px-4 py-3 text-label-md text-on-surface">Rp {{ formatNumber(tx.amount) }}</td>
                      <td class="px-4 py-3">
                        <span :class="['px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider', statusClass(tx.status)]">{{ tx.status }}</span>
                      </td>
                      <td class="px-4 py-3">
                        <button class="text-primary hover:underline text-label-sm font-semibold flex items-center gap-1" @click="downloadReceipt(tx)">
                          <span class="material-symbols-outlined text-sm">download</span> Unduh
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="lg:col-span-1 space-y-stack-md">
            <div class="glass-card rounded-xl p-6 shadow-sm">
              <h3 class="font-display text-title-lg text-primary mb-4">Ringkasan</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center pb-3 border-b border-outline-variant/20">
                  <span class="text-label-md text-on-surface-variant">SPP Bulan Ini</span>
                  <span class="font-bold text-on-surface">Rp 850.000</span>
                </div>
                <div class="flex justify-between items-center pb-3 border-b border-outline-variant/20">
                  <span class="text-label-md text-on-surface-variant">Biaya Bangunan</span>
                  <span class="font-bold text-on-surface">Rp 50.000</span>
                </div>
                <div class="flex justify-between items-center pb-3 border-b border-outline-variant/20">
                  <span class="text-label-md text-on-surface-variant">Denda</span>
                  <span class="font-bold text-error">Rp 0</span>
                </div>
                <div class="flex justify-between items-center pt-2">
                  <span class="text-label-md font-bold text-on-surface">Total Tagihan</span>
                  <span class="font-display text-headline-md text-primary">Rp 900.000</span>
                </div>
              </div>
              <button class="w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-label-md hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-6" @click="quickPayAll">
                <span class="material-symbols-outlined">flash_on</span> Bayar Semua Tagihan
              </button>
            </div>
            <div class="glass-card rounded-xl p-6 shadow-sm">
              <h3 class="font-display text-title-lg text-primary mb-4">Informasi</h3>
              <div class="bg-primary-fixed/10 rounded-lg p-4 flex gap-3 items-start">
                <span class="material-symbols-outlined text-primary mt-0.5">info</span>
                <div>
                  <p class="text-label-sm text-on-surface-variant">Pembayaran SPP dapat dilakukan melalui Virtual Account (Mandiri, BRI, BNI) atau QRIS. Konfirmasi pembayaran akan diproses dalam 5-10 menit.</p>
                </div>
              </div>
              <div class="mt-4 flex items-center gap-2 text-label-sm text-on-surface-variant">
                <span class="material-symbols-outlined text-sm">mail</span>
                Hubungi: bendahara@sppt.sch.id
              </div>
              <div class="flex items-center gap-2 text-label-sm text-on-surface-variant mt-1">
                <span class="material-symbols-outlined text-sm">call</span>
                (021) 1234-5678
              </div>
            </div>
          </div>
        </div>
      </template>
      <Teleport to="body">
        <div v-if="showReceiptModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="showReceiptModal = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-enter">
            <div class="p-6 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 class="font-display text-title-lg text-primary">Download Kwitansi</h3>
              <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="showReceiptModal = false">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="p-6 text-center">
              <div class="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-primary text-3xl">description</span>
              </div>
              <p class="font-bold text-body-md text-on-surface mb-1">Kwitansi {{ receiptTarget?.label }}</p>
              <p class="text-label-md text-on-surface-variant mb-2">{{ receiptTarget?.date }}</p>
              <p class="font-display text-headline-md text-primary mb-6">Rp {{ formatNumber(receiptTarget?.amount || 0) }}</p>
              <div class="flex flex-col gap-3">
                <button class="w-full bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-sm" @click="simulateDownload">
                  <span class="material-symbols-outlined">download</span> Download PDF
                </button>
                <button class="w-full bg-surface-container-low text-on-surface py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-higher transition-all" @click="showReceiptModal = false">
                  <span class="material-symbols-outlined">close</span> Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => paymentHistory)
definePageMeta({ layout: 'wali-santri', requiredRole: 'wali_santri' })

interface Bill {
  id: number
  label: string
  amount: number
  dueDate: string
}

interface Transaction {
  id: number
  label: string
  date: string
  method: string
  amount: number
  status: string
}

const loading = ref(true)
const errorS = ref('')
const pendingBills = ref<Bill[]>([])
const paymentHistory = ref<Transaction[]>([])

const billTotal = computed(() => pendingBills.value.reduce((a, b) => a + b.amount, 0))
const paidTotal = computed(() => paymentHistory.value.reduce((a, b) => a + b.amount, 0))

function formatNumber(n: number) {
  return n.toLocaleString('id-ID')
}

function statusClass(status: string) {
  return status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
}

async function fetchData() {
  loading.value = true; errorS.value = ''
  try {
    const [bills, txs] = await Promise.all([
      $fetch<Bill[]>('/api/keuangan/spp-config').catch(() => [] as Bill[]),
      $fetch<Transaction[]>('/api/keuangan/spp-config').catch(() => [] as Transaction[]),
    ])
    pendingBills.value = bills || []
    paymentHistory.value = txs || []
  } catch (e: any) { errorS.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

const showReceiptModal = ref(false)
const receiptTarget = ref<Transaction | null>(null)

function quickPay(bill: Bill) {
  alert(`Pembayaran ${bill.label} sebesar Rp ${formatNumber(bill.amount)} sedang diproses...`)
}

function quickPayAll() {
  const total = pendingBills.value.reduce((a, b) => a + b.amount, 0)
  alert(`Pembayaran semua tagihan sebesar Rp ${formatNumber(total)} sedang diproses...`)
}

function downloadReceipt(tx: Transaction) {
  receiptTarget.value = tx
  showReceiptModal.value = true
}

function simulateDownload() {
  const btn = document.activeElement as HTMLElement
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Generating PDF...'
  setTimeout(() => {
    alert('Kwitansi berhasil diunduh dalam format PDF.')
    showReceiptModal.value = false
  }, 1500)
}

async function bulkDelete() {
  if (!confirm(`Yakin ingin menghapus ${selectedCount} data?`)) return
  try {
    await Promise.all(selected.value.map(id => $fetch(`/api/keuangan/payments/${id}`, { method: 'DELETE' })))
    clearSelection()
    await fetchData()
  } catch (e: any) {
    errorS.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => fetchData())
</script>
