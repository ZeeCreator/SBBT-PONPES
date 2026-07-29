<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="flex items-center justify-between mb-stack-lg">
      <div>
        <h2 class="font-display text-headline-lg text-primary">Izin Ustadz / Guru</h2>
        <p class="text-on-surface-variant text-body-md">Kelola pengajuan izin dan cuti tenaga pengajar</p>
      </div>
      <button class="bg-primary-container text-on-primary px-6 py-2.5 rounded-xl text-label-md hover:bg-primary transition-all flex items-center gap-2 shadow-md" @click="openAddModal">
        <span class="material-symbols-outlined text-sm">add</span> Ajukan Izin
      </button>
    </div>

    <!-- Stats + Diagram -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-gutter mb-stack-lg">
      <div class="glass-card rounded-2xl p-stack-md shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center"><span class="material-symbols-outlined text-primary">assignment</span></div>
        <div><p class="text-label-sm text-on-surface-variant">Total Pengajuan</p><p class="text-headline-md font-display text-primary">{{ stats.total }}</p></div>
      </div>
      <div class="glass-card rounded-2xl p-stack-md shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center"><span class="material-symbols-outlined text-amber-700">hourglass_top</span></div>
        <div><p class="text-label-sm text-on-surface-variant">Pending</p><p class="text-headline-md font-display text-amber-700">{{ stats.pending }}</p></div>
      </div>
      <div class="glass-card rounded-2xl p-stack-md shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><span class="material-symbols-outlined text-green-600">check_circle</span></div>
        <div><p class="text-label-sm text-on-surface-variant">Disetujui</p><p class="text-headline-md font-display text-green-600">{{ stats.disetujui }}</p></div>
      </div>
      <div class="glass-card rounded-2xl p-stack-md shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><span class="material-symbols-outlined text-error">cancel</span></div>
        <div><p class="text-label-sm text-on-surface-variant">Ditolak</p><p class="text-headline-md font-display text-error">{{ stats.ditolak }}</p></div>
      </div>
    </div>

    <!-- Chart Bulanan -->
    <div class="glass-card rounded-2xl p-stack-md shadow-sm mb-stack-lg">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-display text-title-lg text-primary">Diagram Izin Bulanan</h4>
        <span class="text-label-sm text-on-surface-variant">{{ chartData.length }} bulan</span>
      </div>
      <div v-if="chartData.length === 0" class="text-center py-8 text-on-surface-variant text-label-sm">Belum ada data izin</div>
      <div v-else class="space-y-3">
        <div v-for="month in chartData" :key="month.label" class="flex items-center gap-4">
          <span class="text-label-sm text-on-surface-variant w-16 shrink-0">{{ month.label }}</span>
          <div class="flex-1 flex items-center gap-0.5 h-8">
            <div
              v-for="(item, i) in month.bars"
              :key="i"
              class="h-full rounded transition-all duration-500 hover:brightness-110 cursor-pointer relative group"
              :class="item.color"
              :style="{ width: item.pct + '%' }"
              :title="item.label + ': ' + item.count"
            >
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-surface-container-highest rounded text-label-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10">{{ item.label }}: {{ item.count }}</div>
            </div>
          </div>
          <span class="text-label-sm text-on-surface-variant w-8 text-right">{{ month.total }}</span>
        </div>
        <!-- Legend -->
        <div class="flex items-center gap-4 pt-2 text-label-xs text-on-surface-variant">
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-amber-400 inline-block"></span> Pending</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-500 inline-block"></span> Disetujui</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-red-400 inline-block"></span> Ditolak</span>
        </div>
      </div>
    </div>

    <!-- Filter + Table -->
    <div class="glass-card rounded-xl shadow-sm overflow-hidden">
      <div class="p-4 border-b border-outline-variant/20 flex flex-wrap gap-3 items-center">
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input v-model="searchQuery" type="text" placeholder="Cari guru..." class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-sm py-2 pl-9 pr-3 focus:ring-primary outline-none" />
        </div>
        <select v-model="filterStatus" class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-sm py-2 px-3 focus:ring-primary outline-none">
          <option value="">Semua Status</option>
          <option value="Pending">Pending</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>
        <select v-model="filterJenis" class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-sm py-2 px-3 focus:ring-primary outline-none">
          <option value="">Semua Jenis</option>
          <option value="Izin Sakit">Izin Sakit</option>
          <option value="Izin Dinas">Izin Dinas</option>
          <option value="Izin Khusus">Izin Khusus</option>
          <option value="Cuti">Cuti</option>
        </select>
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
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Guru</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Jenis Izin</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal Mulai</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal Selesai</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Keterangan</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary text-label-sm font-bold">{{ item.nama.charAt(0) }}</div>
                  <span class="text-label-md font-medium">{{ item.nama }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 text-[10px] font-bold rounded-full" :class="jenisClass(item.jenis)">{{ item.jenis }}</span>
              </td>
              <td class="px-4 py-3 text-label-sm">{{ item.tglMulai ? new Date(item.tglMulai).toLocaleDateString('id-ID') : '-' }}</td>
              <td class="px-4 py-3 text-label-sm">{{ item.tglSelesai ? new Date(item.tglSelesai).toLocaleDateString('id-ID') : '-' }}</td>
              <td class="px-4 py-3 text-label-sm text-on-surface-variant max-w-[150px] truncate">{{ item.keterangan || '-' }}</td>
              <td class="px-4 py-3">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full', statusClass(item.status)]">{{ item.status }}</span>
              </td>
              <td class="px-4 py-3">
                <div v-if="item.status === 'Pending'" class="flex items-center gap-2">
                  <button class="text-green-600 text-label-sm hover:underline flex items-center gap-0.5" @click="approve(item)"><span class="material-symbols-outlined text-sm">check</span> Setujui</button>
                  <button class="text-error text-label-sm hover:underline flex items-center gap-0.5" @click="reject(item)"><span class="material-symbols-outlined text-sm">close</span> Tolak</button>
                </div>
                <span v-else class="text-label-sm text-on-surface-variant">-</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="loading" class="text-center py-8 text-on-surface-variant text-label-sm">Loading...</p>
        <p v-if="!loading && filteredItems.length === 0" class="text-center py-8 text-on-surface-variant text-label-sm">Tidak ada data izin</p>
      </div>
    </div>

    <!-- Modal Add -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showModal = false">
        <div class="bg-surface rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-display text-title-lg text-primary">Ajukan Izin Guru</h3>
            <button class="text-on-surface-variant hover:text-on-surface" @click="showModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form @submit.prevent="saveItem" novalidate class="space-y-4">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Guru</label>
              <select v-model="form.guruId" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" @change="onGuruChange">
                <option value="" disabled>Pilih guru...</option>
                <option v-for="g in teachers" :key="g.id" :value="g.id">{{ g.name }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Jenis Izin</label>
              <select v-model="form.jenis" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none">
                <option value="Izin Sakit">Izin Sakit</option>
                <option value="Izin Dinas">Izin Dinas</option>
                <option value="Izin Khusus">Izin Khusus</option>
                <option value="Cuti">Cuti</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Tanggal Mulai</label>
                <input v-model="form.tglMulai" type="date" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Tanggal Selesai</label>
                <input v-model="form.tglSelesai" type="date" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Keterangan</label>
              <textarea v-model="form.keterangan" rows="3" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="Alasan izin..."></textarea>
            </div>
            <button type="submit" :disabled="saving" class="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-body-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              <span v-if="saving" class="material-symbols-outlined animate-spin text-sm">refresh</span>
              {{ saving ? 'Menyimpan...' : 'Ajukan Izin' }}
            </button>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'

definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const { getIdToken } = useAuth()

const items = ref<any[]>([])
const teachers = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')
const filterJenis = ref('')

const form = reactive({
  guruId: '',
  nama: '',
  jenis: 'Izin Sakit',
  tglMulai: '',
  tglSelesai: '',
  keterangan: '',
})

const filteredItems = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return items.value.filter(i => {
    if (filterStatus.value && i.status !== filterStatus.value) return false
    if (filterJenis.value && i.jenis !== filterJenis.value) return false
    if (q && !i.nama.toLowerCase().includes(q)) return false
    return true
  })
})

const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredItems)

const stats = computed(() => {
  const total = items.value.length
  const pending = items.value.filter(i => i.status === 'Pending').length
  const disetujui = items.value.filter(i => i.status === 'Disetujui').length
  const ditolak = items.value.filter(i => i.status === 'Ditolak').length
  return { total, pending, disetujui, ditolak }
})

const chartData = computed(() => {
  const byMonth: Record<string, { pending: number; disetujui: number; ditolak: number }> = {}
  items.value.forEach(i => {
    if (!i.createdAt) return
    const d = new Date(i.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!byMonth[key]) byMonth[key] = { pending: 0, disetujui: 0, ditolak: 0 }
    if (i.status === 'Pending') byMonth[key].pending++
    else if (i.status === 'Disetujui') byMonth[key].disetujui++
    else if (i.status === 'Ditolak') byMonth[key].ditolak++
  })
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return Object.entries(byMonth).sort().map(([key, val]) => {
    const total = val.pending + val.disetujui + val.ditolak
    const bars = [
      { label: 'Pending', count: val.pending, pct: total > 0 ? (val.pending / total) * 100 : 0, color: 'bg-amber-400' },
      { label: 'Disetujui', count: val.disetujui, pct: total > 0 ? (val.disetujui / total) * 100 : 0, color: 'bg-green-500' },
      { label: 'Ditolak', count: val.ditolak, pct: total > 0 ? (val.ditolak / total) * 100 : 0, color: 'bg-red-400' },
    ].filter(b => b.count > 0)
    const [, mm] = key.split('-')
    return { label: monthNames[parseInt(mm) - 1] || key, total, bars }
  })
})

function jenisClass(jenis: string) {
  const map: Record<string, string> = {
    'Izin Sakit': 'bg-purple-100 text-purple-700',
    'Izin Dinas': 'bg-blue-100 text-blue-700',
    'Izin Khusus': 'bg-orange-100 text-orange-700',
    Cuti: 'bg-teal-100 text-teal-700',
  }
  return map[jenis] || 'bg-surface-container text-on-surface'
}

function statusClass(status: string) {
  if (status === 'Pending') return 'bg-amber-100 text-amber-700'
  if (status === 'Disetujui') return 'bg-green-100 text-green-700'
  return 'bg-red-100 text-red-700'
}

function onGuruChange() {
  const g = teachers.value.find(t => t.id === form.guruId)
  form.nama = g?.name || ''
}

function openAddModal() {
  form.guruId = ''
  form.nama = ''
  form.jenis = 'Izin Sakit'
  form.tglMulai = ''
  form.tglSelesai = ''
  form.keterangan = ''
  showModal.value = true
}

async function saveItem() {
  saving.value = true
  try {
    await $fetch('/api/guru-izin', { method: 'POST', body: { ...form } })
    showModal.value = false
    await fetchData()
  } finally {
    saving.value = false
  }
}

async function approve(item: any) {
  await $fetch(`/api/guru-izin/${item.id}`, { method: 'PATCH', body: { status: 'Disetujui' } })
  await fetchData()
}

async function reject(item: any) {
  await $fetch(`/api/guru-izin/${item.id}`, { method: 'PATCH', body: { status: 'Ditolak' } })
  await fetchData()
}

async function bulkDelete() {
  if (!confirm(`Yakin ingin menghapus ${selectedCount} data izin?`)) return
  await Promise.all(selected.value.map(id => $fetch(`/api/guru-izin/${id}`, { method: 'DELETE' })))
  clearSelection()
  await fetchData()
}

async function fetchData() {
  loading.value = true
  try {
    const token = await getIdToken()
    const [izinRes, guruRes] = await Promise.all([
      fetch('/api/guru-izin', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/guru', { headers: { Authorization: `Bearer ${token}` } }),
    ])
    if (izinRes.ok) items.value = await izinRes.json()
    if (guruRes.ok) teachers.value = await guruRes.json()
  } finally {
    loading.value = false
  }
}

fetchData()
</script>
