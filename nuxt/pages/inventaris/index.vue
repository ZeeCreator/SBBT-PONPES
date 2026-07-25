<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Inventaris Asrama & Barang</h2>
      <p class="text-on-surface-variant text-body-md">Kelola inventaris kamar, barang sekolah, dan peminjaman.</p>
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
      <div class="flex flex-wrap gap-2 mb-stack-md border-b border-outline-variant/20">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" class="px-5 py-3 text-label-md font-medium transition-colors relative" :class="activeTab === tab.key ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'">
          {{ tab.label }}
          <span v-if="activeTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
        </button>
      </div>
      <div v-if="activeTab === 'kamar'">
        <div class="glass-card rounded-xl shadow-sm overflow-hidden">
          <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-on-surface-variant">search</span>
              <input v-model="filterKamar" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari kamar..." />
            </div>
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
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Kamar</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Kasur</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Lemari</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Meja</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Kursi</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="item in filteredKamar" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                  <td class="px-4 py-3 text-label-md font-medium">{{ item.kamar }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.kasur }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.lemari }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.meja }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.kursi }}</td>
                  <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', item.status === 'Baik' ? 'bg-green-100 text-green-700' : item.status === 'Rusak' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700']">{{ item.status }}</span></td>
                </tr>
                <tr v-if="filteredKamar.length === 0"><td colspan="99"  class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'sekolah'">
        <div class="glass-card rounded-xl shadow-sm overflow-hidden">
          <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-on-surface-variant">search</span>
              <input v-model="filterSekolah" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari barang..." />
            </div>
            <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="openAddModal('barang')">
              <span class="material-symbols-outlined text-sm">add</span> Tambah Barang
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Barang</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Jumlah</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Kondisi</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Lokasi</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="item in filteredSekolah" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                  <td class="px-4 py-3 text-label-md font-medium">{{ item.barang }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.jumlah }}</td>
                  <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', kondisiClass(item.kondisi)]">{{ item.kondisi }}</span></td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.lokasi }}</td>
                  <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', item.status === 'Tersedia' ? 'bg-green-100 text-green-700' : item.status === 'Dipinjam' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700']">{{ item.status }}</span></td>
                  <td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors" @click="deleteBarang(item.id)"><span class="material-symbols-outlined">delete</span></button></td>
                </tr>
                <tr v-if="filteredSekolah.length === 0"><td colspan="99"  class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'peminjaman'">
        <div class="glass-card rounded-xl shadow-sm overflow-hidden">
          <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-on-surface-variant">search</span>
                <input v-model="filterPinjam" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari peminjam..." />
              </div>
              <select v-model="filterPinjamStatus" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
                <option value="">Semua Status</option>
                <option value="Dipinjam">Dipinjam</option>
                <option value="Dikembalikan">Dikembalikan</option>
              </select>
            </div>
            <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="openAddModal('pinjam')">
              <span class="material-symbols-outlined text-sm">add</span> Catat Peminjaman
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Peminjam</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Barang</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal Pinjam</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal Kembali</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="item in filteredPinjam" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                  <td class="px-4 py-3 text-label-md font-medium">{{ item.peminjam }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.barang }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.tglPinjam }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.tglKembali || '-' }}</td>
                  <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', item.status === 'Dipinjam' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700']">{{ item.status }}</span></td>
                  <td class="px-4 py-3 text-center">
                    <button v-if="item.status === 'Dipinjam'" class="text-primary hover:text-primary-fixed-dim mr-2 transition-colors" @click="kembalikan(item.id)"><span class="material-symbols-outlined">assignment_return</span></button>
                    <button class="text-error hover:text-red-700 transition-colors" @click="deletePinjam(item.id)"><span class="material-symbols-outlined">delete</span></button>
                  </td>
                </tr>
                <tr v-if="filteredPinjam.length === 0"><td colspan="99"  class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>
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
              <p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Inventaris Module</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="submitForm">
            <div v-if="modalType === 'barang'">
              <div class="space-y-1 mb-stack-md">
                <label class="text-label-md text-on-surface-variant">Nama Barang</label>
                <input v-model="form.barang" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
              </div>
              <div class="grid grid-cols-2 gap-stack-md">
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Jumlah</label>
                  <input type="number" v-model="form.jumlah" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" min="0" required />
                </div>
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Kondisi</label>
                  <select v-model="form.kondisi" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Lokasi</label>
                <input v-model="form.lokasi" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Contoh: Aula, Kelas 10A" required />
              </div>
            </div>
            <div v-if="modalType === 'pinjam'">
              <div class="space-y-1 mb-stack-md">
                <label class="text-label-md text-on-surface-variant">Nama Peminjam</label>
                <input v-model="form.peminjam" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
              </div>
              <div class="space-y-1 mb-stack-md">
                <label class="text-label-md text-on-surface-variant">Barang</label>
                <select v-model="form.barangPinjam" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option v-for="b in barangSekolah.filter(x => x.status === 'Tersedia')" :key="b.id" :value="b.barang">{{ b.barang }} ({{ b.jumlah }})</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-stack-md">
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Tanggal Pinjam</label>
                  <input type="date" v-model="form.tglPinjam" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
                </div>
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Tanggal Kembali</label>
                  <input type="date" v-model="form.tglKembali" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" />
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
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredKamar)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

interface KamarItem {
  id: number
  kamar: string
  kasur: number
  lemari: number
  meja: number
  kursi: number
  status: string
}

interface BarangSekolahItem {
  id: number
  barang: string
  jumlah: number
  kondisi: string
  lokasi: string
  status: string
}

interface PinjamItem {
  id: number
  peminjam: string
  barang: string
  tglPinjam: string
  tglKembali: string
  status: string
}

const activeTab = ref('kamar')
const filterKamar = ref('')
const filterSekolah = ref('')
const filterPinjam = ref('')
const filterPinjamStatus = ref('')
const showModal = ref(false)
const modalType = ref<'barang' | 'pinjam'>('barang')
const modalTitle = ref('')
const loading = ref(true)
const errorS = ref('')

const form = reactive({
  barang: '',
  jumlah: 0,
  kondisi: 'Baik',
  lokasi: '',
  peminjam: '',
  barangPinjam: '',
  tglPinjam: new Date().toISOString().split('T')[0],
  tglKembali: '',
})

const tabs = [
  { key: 'kamar', label: 'Inventaris Kamar' },
  { key: 'sekolah', label: 'Inventaris Sekolah' },
  { key: 'peminjaman', label: 'Peminjaman' },
]

const inventarisKamar = ref<KamarItem[]>([])
const barangSekolah = ref<BarangSekolahItem[]>([])
const peminjaman = ref<PinjamItem[]>([])

const stats = computed(() => {
  const totalBarang = barangSekolah.value.reduce((s, b) => s + b.jumlah, 0)
  const dipinjam = peminjaman.value.filter(p => p.status === 'Dipinjam').length
  const tersedia = barangSekolah.value.filter(b => b.status === 'Tersedia').length
  const rusak = barangSekolah.value.filter(b => b.status === 'Rusak').length
  return [
    { label: 'Total Barang', icon: 'inventory', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: totalBarang.toString() },
    { label: 'Dipinjam', icon: 'assignment', bg: 'bg-blue-100', iconColor: 'text-blue-600', valueColor: 'text-blue-700', value: dipinjam.toString() },
    { label: 'Tersedia', icon: 'check_circle', bg: 'bg-green-100', iconColor: 'text-green-600', valueColor: 'text-green-700', value: tersedia.toString() },
    { label: 'Rusak', icon: 'warning', bg: 'bg-red-100', iconColor: 'text-red-600', valueColor: 'text-red-700', value: rusak.toString() },
  ]
})

const filteredKamar = computed(() => inventarisKamar.value.filter(k => !filterKamar.value || k.kamar.toLowerCase().includes(filterKamar.value.toLowerCase())))
const filteredSekolah = computed(() => barangSekolah.value.filter(b => !filterSekolah.value || b.barang.toLowerCase().includes(filterSekolah.value.toLowerCase())))
const filteredPinjam = computed(() => peminjaman.value.filter(p => (!filterPinjam.value || p.peminjam.toLowerCase().includes(filterPinjam.value.toLowerCase())) && (!filterPinjamStatus.value || p.status === filterPinjamStatus.value)))

function kondisiClass(kondisi: string) {
  const map: Record<string, string> = { 'Baik': 'bg-green-100 text-green-700', 'Rusak Ringan': 'bg-amber-100 text-amber-700', 'Rusak Berat': 'bg-red-100 text-red-700' }
  return map[kondisi] || 'bg-surface-container text-on-surface-variant'
}

async function fetchData() {
  loading.value = true; errorS.value = ''
  try {
    const [kamar, barang, pinjam] = await Promise.all([
      $fetch<KamarItem[]>('/api/inventaris').catch(() => []),
      $fetch<BarangSekolahItem[]>('/api/inventaris').catch(() => []),
      $fetch<PinjamItem[]>('/api/inventaris/loans').catch(() => []),
    ])
    inventarisKamar.value = kamar || []
    barangSekolah.value = barang || []
    peminjaman.value = pinjam || []
  } catch (e: any) { errorS.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

function openAddModal(type: 'barang' | 'pinjam') {
  modalType.value = type
  modalTitle.value = type === 'barang' ? 'Tambah Barang Inventaris' : 'Catat Peminjaman'
  form.barang = ''
  form.jumlah = 0
  form.kondisi = 'Baik'
  form.lokasi = ''
  form.peminjam = ''
  form.barangPinjam = barangSekolah.value.filter(x => x.status === 'Tersedia')[0]?.barang || ''
  form.tglPinjam = new Date().toISOString().split('T')[0]
  form.tglKembali = ''
  showModal.value = true
}

async function submitForm() {
  try {
    if (modalType.value === 'barang') {
      await $fetch('/api/inventaris', { method: 'POST', body: { barang: form.barang, jumlah: Number(form.jumlah), kondisi: form.kondisi, lokasi: form.lokasi, status: 'Tersedia' } })
    } else {
      await $fetch('/api/inventaris/loans', { method: 'POST', body: { peminjam: form.peminjam, barang: form.barangPinjam, tglPinjam: form.tglPinjam, tglKembali: form.tglKembali, status: 'Dipinjam' } })
    }
    showModal.value = false; await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menyimpan' }
}

async function kembalikan(id: number) {
  try {
    await $fetch(`/api/inventaris/loans/${id}`, { method: 'PATCH', body: { status: 'Dikembalikan', tglKembali: new Date().toISOString().split('T')[0] } })
    await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal mengembalikan' }
}

async function deleteBarang(id: number) {
  if (!confirm('Yakin ingin menghapus barang ini?')) return
  try { await $fetch(`/api/inventaris/${id}`, { method: 'DELETE' }); await fetchData() }
  catch (e: any) { errorS.value = e.message || 'Gagal menghapus' }
}

async function deletePinjam(id: number) {
  if (!confirm('Yakin ingin menghapus data peminjaman ini?')) return
  try { await $fetch(`/api/inventaris/loans/${id}`, { method: 'DELETE' }); await fetchData() }
  catch (e: any) { errorS.value = e.message || 'Gagal menghapus' }
}

async function bulkDelete() {
  if (!confirm(`Yakin ingin menghapus ${selectedCount} data?`)) return
  try {
    await Promise.all(selected.value.map(id => $fetch(`/api/inventaris/${id}`, { method: 'DELETE' })))
    clearSelection()
    await fetchData()
  } catch (e: any) {
    errorS.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => fetchData())
</script>
