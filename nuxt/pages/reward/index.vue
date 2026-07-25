<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Reward & Santri Teladan</h2>
      <p class="text-on-surface-variant text-body-md">Berikan penghargaan poin reward dan tentukan santri teladan.</p>
    </div>
    <div v-if="errorS" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ errorS }}</div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
    </div>
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
        <div v-for="stat in stats" :key="stat.label" class="glass-card p-6 rounded-xl shadow-sm text-center">
          <div class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" :class="stat.bg">
            <span class="material-symbols-outlined" :class="stat.iconColor">{{ stat.icon }}</span>
          </div>
          <p class="font-display text-headline-md" :class="stat.valueColor">{{ stat.value }}</p>
          <p class="text-label-sm text-on-surface-variant">{{ stat.label }}</p>
        </div>
      </div>
      <div class="mb-stack-lg glass-card rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-display text-title-lg text-primary">Santri Teladan</h3>
          <div class="flex items-center gap-2">
            <select v-model="teladanPeriod" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
              <option value="Bulan Ini">Bulan Ini</option>
              <option value="Tahun Ini">Tahun Ini</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="(s, i) in teladanSantri" :key="s.nama" class="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-white">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-on-primary font-bold text-title-lg"
              :class="i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : 'bg-amber-700'">
              <span v-if="i === 0" class="material-symbols-outlined">workspace_premium</span>
              <span v-else-if="i === 1" class="material-symbols-outlined">military_tech</span>
              <span v-else class="material-symbols-outlined">emoji_events</span>
            </div>
            <div>
              <p class="text-label-md font-bold">{{ s.nama }}</p>
              <p class="text-label-sm text-on-surface-variant">{{ s.poin }} poin - {{ s.ket }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="glass-card rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <select v-model="filterMonth" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
              <option value="">Semua Bulan</option>
              <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
          <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
            <span class="material-symbols-outlined text-sm">add</span> Tambah Reward
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
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Santri</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Jenis Reward</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Poin</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Keterangan</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              <tr v-for="item in filteredRewards" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                <td class="px-6 py-4 text-label-md font-medium">{{ item.santri }}</td>
                <td class="px-6 py-4">
                  <span :class="['px-3 py-1 text-[11px] font-bold rounded-full', item.jenis === 'Prestasi' ? 'bg-blue-100 text-blue-700' : item.jenis === 'Kebersihan' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700']">
                    {{ item.jenis }}
                  </span>
                </td>
                <td class="px-6 py-4 text-label-md font-bold text-primary">{{ item.poin }}</td>
                <td class="px-6 py-4 text-label-sm text-on-surface-variant">{{ item.tanggal }}</td>
                <td class="px-6 py-4 text-label-sm text-on-surface-variant max-w-[200px] truncate">{{ item.keterangan }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit" @click="openEditModal(item)">
                      <span class="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus" @click="deleteReward(item.id)">
                      <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredRewards.length === 0">
                <td colspan="99"  class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data reward.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter">
          <div class="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <h3 class="font-display text-title-lg text-primary">{{ editingId ? 'Edit Reward' : 'Tambah Reward' }}</h3>
            <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Santri</label>
              <select v-model="form.santri" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                <option value="">Pilih Santri</option>
                <option v-for="s in students" :key="s.id" :value="s.name">{{ s.name }}</option>
              </select>
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Jenis Reward</label>
              <select v-model="form.jenis" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                <option value="">Pilih Jenis</option>
                <option value="Prestasi">Prestasi</option>
                <option value="Kebersihan">Kebersihan</option>
                <option value="Ibadah">Ibadah</option>
              </select>
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Poin</label>
              <input v-model.number="form.poin" type="number" min="1" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="10" />
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Tanggal</label>
              <input v-model="form.tanggal" type="date" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" />
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Keterangan</label>
              <textarea v-model="form.keterangan" rows="3" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary resize-none" placeholder="Deskripsi reward"></textarea>
            </div>
          </div>
          <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="closeModal">Batal</button>
            <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="saveReward">Simpan</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredRewards)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

interface RewardItem {
  id: number
  santri: string
  jenis: string
  poin: number
  tanggal: string
  keterangan: string
}

const students = ref<any[]>([])
const { getIdToken } = useAuth()
async function fetchStudents() {
  try {
    const token = await getIdToken()
    const res = await fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) students.value = await res.json()
  } catch (e) { console.error(e) }
}
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const loading = ref(true)
const errorS = ref('')
const rewards = ref<RewardItem[]>([])
const filterMonth = ref('')
const teladanPeriod = ref('Bulan Ini')
const showModal = ref(false)
const editingId = ref<string | null>(null)

const filteredRewards = computed(() =>
  !filterMonth.value
    ? rewards.value
    : rewards.value.filter(r => {
        const m = new Date(r.tanggal).getMonth()
        return months[m] === filterMonth.value
      })
)

const teladanSantri = computed(() => {
  const sorted = [...rewards.value].reduce((acc: Record<string, number>, r) => {
    acc[r.santri] = (acc[r.santri] || 0) + r.poin
    return acc
  }, {})
  const entries = Object.entries(sorted).sort((a, b) => b[1] - a[1]).slice(0, 3)
  return entries.map(([nama, poin], i) => ({
    nama,
    poin,
    ket: i === 0 ? 'Santri Teladan' : i === 1 ? 'Santri Terbaik' : 'Santri Berprestasi'
  }))
})

const stats = computed(() => {
  const totalPoin = rewards.value.reduce((s, r) => s + r.poin, 0)
  return [
    { label: 'Total Reward', icon: 'card_giftcard', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: rewards.value.length.toString() },
    { label: 'Top Santri', icon: 'stars', bg: 'bg-amber-100', iconColor: 'text-amber-600', valueColor: 'text-amber-700', value: teladanSantri.value[0]?.nama || '-' },
    { label: 'Total Poin Diberikan', icon: 'toll', bg: 'bg-secondary-fixed', iconColor: 'text-secondary', valueColor: 'text-secondary', value: totalPoin.toString() },
    { label: 'Santri Teladan', icon: 'workspace_premium', bg: 'bg-tertiary-fixed', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: Math.min(3, teladanSantri.value.length).toString() },
  ]
})

async function fetchData() {
  loading.value = true; errorS.value = ''
  try {
    const params: Record<string, string> = {}
    if (filterMonth.value) params.month = filterMonth.value
    const qs = new URLSearchParams(params).toString()
    rewards.value = await $fetch<RewardItem[]>(`/api/reward${qs ? '?' + qs : ''}`) || []
  } catch (e: any) { errorS.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

watch(filterMonth, () => fetchData())

const defaultForm = () => ({
  id: 0,
  santri: '',
  jenis: '',
  poin: 0,
  tanggal: new Date().toISOString().split('T')[0],
  keterangan: '',
})

const form = reactive(defaultForm())

function openAddModal() {
  editingId.value = null
  Object.assign(form, defaultForm())
  showModal.value = true
}

function openEditModal(item: RewardItem) {
  editingId.value = item.id.toString()
  form.id = item.id
  form.santri = item.santri
  form.jenis = item.jenis
  form.poin = item.poin
  form.tanggal = item.tanggal
  form.keterangan = item.keterangan
  showModal.value = true
}

function closeModal() { showModal.value = false }

async function saveReward() {
  if (!form.santri || !form.jenis || !form.poin || !form.tanggal) return
  try {
    if (editingId.value) {
      await $fetch(`/api/reward/${editingId.value}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/reward', { method: 'POST', body: { ...form } })
    }
    closeModal(); await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menyimpan' }
}

async function deleteReward(id: number) {
  if (!confirm('Yakin ingin menghapus data reward ini?')) return
  try {
    await $fetch(`/api/reward/${id}`, { method: 'DELETE' })
    await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menghapus' }
}

async function bulkDelete() {
  if (!confirm(`Yakin ingin menghapus ${selectedCount} data?`)) return
  try {
    await Promise.all(selected.value.map(id => $fetch(`/api/reward/${id}`, { method: 'DELETE' })))
    clearSelection()
    await fetchData()
  } catch (e: any) {
    errorS.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => { fetchData(); fetchStudents() })
</script>
