<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Koperasi Pondok</h2>
      <p class="text-on-surface-variant text-body-md">Manajemen stok barang dan transaksi penjualan koperasi.</p>
    </div>
    <div v-if="errorS" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ errorS }}</div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
    </div>
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
        <div v-for="stat in stats" :key="stat.label" class="glass-card p-stack-md rounded-xl shadow-sm text-center">
          <div class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" :class="stat.bg">
            <span class="material-symbols-outlined" :class="stat.iconColor">{{ stat.icon }}</span>
          </div>
          <p class="font-display text-headline-md" :class="stat.valueColor">{{ stat.value }}</p>
          <p class="text-label-sm text-on-surface-variant">{{ stat.label }}</p>
        </div>
      </div>
      <div class="flex gap-2 mb-stack-md border-b border-outline-variant/20">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" class="px-5 py-3 text-label-md font-medium transition-colors relative" :class="activeTab === tab.key ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'">
          {{ tab.label }}
          <span v-if="activeTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
        </button>
      </div>
      <div v-if="activeTab === 'stok'">
        <div class="glass-card rounded-xl shadow-sm overflow-hidden">
          <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-on-surface-variant">search</span>
              <input v-model="filterStok" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari barang..." />
            </div>
            <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="openAddModal('barang')">
              <span class="material-symbols-outlined text-sm">add</span> Tambah Barang
            </button>
          </div>
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
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama Barang</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Harga</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Stok</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Terjual</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="item in filteredStok" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                  <td class="px-4 py-3 text-label-md font-medium">{{ item.nama }}</td>
                  <td class="px-4 py-3 text-label-md text-primary font-bold">Rp {{ item.harga.toLocaleString() }}</td>
                  <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', item.stok > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">{{ item.stok }}</span></td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.terjual }}</td>
                  <td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors" @click="deleteBarang(item.id)"><span class="material-symbols-outlined">delete</span></button></td>
                </tr>
                <tr v-if="filteredStok.length === 0"><td colspan="99"  class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'transaksi'">
        <div class="glass-card rounded-xl shadow-sm overflow-hidden">
          <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-on-surface-variant">search</span>
                <input v-model="filterTransaksi" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari santri..." />
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-on-surface-variant">calendar_today</span>
                <input type="date" v-model="filterTransaksiDate" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" />
              </div>
            </div>
            <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="openAddModal('transaksi')">
              <span class="material-symbols-outlined text-sm">add</span> Catat Transaksi
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Barang</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Jumlah</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Total</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="item in filteredTransaksi" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                  <td class="px-4 py-3 text-label-md font-medium">{{ item.santri }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.barang }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.jumlah }}</td>
                  <td class="px-4 py-3 text-label-md text-primary font-bold">Rp {{ item.total.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.date }}</td>
                  <td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors" @click="deleteTransaksi(item.id)"><span class="material-symbols-outlined">delete</span></button></td>
                </tr>
                <tr v-if="filteredTransaksi.length === 0"><td colspan="99"  class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter">
          <div class="bg-primary px-gutter py-stack-md flex justify-between items-center">
            <div class="text-on-primary">
              <h2 class="font-display text-headline-md">{{ modalTitle }}</h2>
              <p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Koperasi Module</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="submitForm">
            <div v-if="modalType === 'barang'">
              <div class="space-y-1 mb-stack-md">
                <label class="text-label-md text-on-surface-variant">Nama Barang</label>
                <input v-model="form.nama" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
              </div>
              <div class="grid grid-cols-2 gap-stack-md">
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Harga (Rp)</label>
                  <input type="number" v-model="form.harga" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" min="0" required />
                </div>
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Stok</label>
                  <input type="number" v-model="form.stok" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" min="0" required />
                </div>
              </div>
            </div>
            <div v-if="modalType === 'transaksi'">
              <div class="space-y-1 mb-stack-md">
                <label class="text-label-md text-on-surface-variant">Santri</label>
                <select v-model="form.santri" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required>
                  <option value="">-- Pilih Santri --</option>
                  <option v-for="s in students" :key="s.id" :value="s.name">{{ s.name }} ({{ s.nis || '-' }})</option>
                </select>
              </div>
              <div class="space-y-1 mb-stack-md">
                <label class="text-label-md text-on-surface-variant">Barang</label>
                <select v-model="form.barang" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option v-for="b in stokBarang" :key="b.id" :value="b.nama">{{ b.nama }} (Stok: {{ b.stok }})</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-stack-md">
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Jumlah</label>
                  <input type="number" v-model="form.jumlah" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" min="1" required />
                </div>
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Tanggal</label>
                  <input type="date" v-model="form.date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-stack-sm pt-stack-sm">
              <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="showModal = false">Batal</button>
              <button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredStok)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

interface BarangItem {
  id: number
  nama: string
  harga: number
  stok: number
  terjual: number
}

interface TransaksiItem {
  id: number
  santri: string
  barang: string
  jumlah: number
  total: number
  date: string
}

const activeTab = ref('stok')
const filterStok = ref('')
const filterTransaksi = ref('')
const filterTransaksiDate = ref('')
const showModal = ref(false)
const modalType = ref<'barang' | 'transaksi'>('barang')
const modalTitle = ref('')
const loading = ref(true)
const errorS = ref('')

const form = reactive({
  nama: '',
  harga: 0,
  stok: 0,
  santri: '',
  studentId: null as number | null,
  barang: '',
  jumlah: 1,
  date: new Date().toISOString().split('T')[0],
})

const tabs = [
  { key: 'stok', label: 'Stok Barang' },
  { key: 'transaksi', label: 'Transaksi' },
]

const { getIdToken } = useAuth()
const students = ref<any[]>([])
const stokBarang = ref<BarangItem[]>([])
const transaksi = ref<TransaksiItem[]>([])

async function fetchStudents() {
  try {
    const token = await getIdToken()
    const res = await fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) students.value = await res.json()
  } catch (e) { console.error(e) }
}

watch(() => form.santri, (val) => {
  const match = students.value.find(s => s.name === val)
  form.studentId = match?.id ?? null
})

const stats = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const transToday = transaksi.value.filter(t => t.date === today)
  const habis = stokBarang.value.filter(b => b.stok <= 5)
  const totalSaldo = transaksi.value.reduce((s, t) => s + t.total, 0)
  return [
    { label: 'Total Barang', icon: 'inventory_2', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: stokBarang.value.length.toString() },
    { label: 'Total Transaksi Hari Ini', icon: 'receipt_long', bg: 'bg-green-100', iconColor: 'text-green-600', valueColor: 'text-green-700', value: transToday.length.toString() },
    { label: 'Barang Habis', icon: 'warning', bg: 'bg-red-100', iconColor: 'text-red-600', valueColor: 'text-red-700', value: habis.length.toString() },
    { label: 'Saldo Koperasi', icon: 'account_balance', bg: 'bg-amber-100', iconColor: 'text-amber-600', valueColor: 'text-amber-700', value: `Rp ${totalSaldo.toLocaleString()}` },
  ]
})

const filteredStok = computed(() => stokBarang.value.filter(b => !filterStok.value || b.nama.toLowerCase().includes(filterStok.value.toLowerCase())))
const filteredTransaksi = computed(() => transaksi.value.filter(t => (!filterTransaksi.value || t.santri.toLowerCase().includes(filterTransaksi.value.toLowerCase())) && (!filterTransaksiDate.value || t.date === filterTransaksiDate.value)))

async function fetchData() {
  loading.value = true; errorS.value = ''
  try {
    const [items, txns] = await Promise.all([
      $fetch<BarangItem[]>('/api/koperasi/items').catch(() => [] as BarangItem[]),
      $fetch<TransaksiItem[]>('/api/koperasi/transactions').catch(() => [] as TransaksiItem[]),
    ])
    stokBarang.value = items || []
    transaksi.value = txns || []
  } catch (e: any) { errorS.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

function openAddModal(type: 'barang' | 'transaksi') {
  modalType.value = type
  modalTitle.value = type === 'barang' ? 'Tambah Barang' : 'Catat Transaksi'
  form.nama = ''
  form.harga = 0
  form.stok = 0
  form.santri = ''
  form.barang = stokBarang.value[0]?.nama || ''
  form.jumlah = 1
  form.date = new Date().toISOString().split('T')[0]
  showModal.value = true
}

async function submitForm() {
  try {
    if (modalType.value === 'barang') {
      await $fetch('/api/koperasi/items', { method: 'POST', body: { nama: form.nama, harga: Number(form.harga), stok: Number(form.stok), terjual: 0 } })
    } else {
      await $fetch('/api/koperasi/transactions', { method: 'POST', body: { santri: form.santri, studentId: form.studentId, barang: form.barang, jumlah: Number(form.jumlah), date: form.date } })
    }
    showModal.value = false; await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menyimpan' }
}

async function deleteBarang(id: number) {
  if (!confirm('Yakin ingin menghapus barang ini?')) return
  try { await $fetch(`/api/koperasi/items/${id}`, { method: 'DELETE' }); await fetchData() }
  catch (e: any) { errorS.value = e.message || 'Gagal menghapus' }
}

async function deleteTransaksi(id: number) {
  if (!confirm('Yakin ingin menghapus transaksi ini?')) return
  try { await $fetch(`/api/koperasi/transactions/${id}`, { method: 'DELETE' }); await fetchData() }
  catch (e: any) { errorS.value = e.message || 'Gagal menghapus' }
}

async function bulkDelete() {
  if (!confirm(`Yakin ingin menghapus ${selectedCount} data?`)) return
  try {
    await Promise.all(selected.value.map(id => $fetch(`/api/koperasi/items/${id}`, { method: 'DELETE' })))
    clearSelection()
    await fetchData()
  } catch (e: any) {
    errorS.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => { fetchData(); fetchStudents() })
</script>
