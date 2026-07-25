<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary">sync</span>
      <span class="ml-2 text-on-surface-variant">Memuat data...</span>
    </div>
    <div v-else-if="error" class="bg-error-container text-on-error-container p-stack-md rounded-xl mb-stack-lg">{{ error }}</div>
    <template v-else>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
      <div v-for="stat in stats" :key="stat.label" class="glass-card p-stack-md rounded-xl shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-on-surface-variant text-label-md">{{ stat.label }}</span>
          <span class="material-symbols-outlined" :class="stat.iconColor">{{ stat.icon }}</span>
        </div>
        <p class="font-display text-headline-md" :class="stat.valueColor">{{ stat.value }}</p>
        <div class="flex items-center gap-1 mt-1">
          <span class="text-on-surface-variant text-[10px]">{{ stat.subtext }}</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-stack-md mb-stack-md">
      <div>
        <h2 class="font-display text-headline-md text-primary">Pendaftaran Santri Baru</h2>
        <p class="text-on-surface-variant text-body-md">Kelola pendaftaran PPDB dan verifikasi calon santri.</p>
      </div>
    </div>
    <div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50">
      <div class="p-stack-md border-b border-surface-variant/30 flex flex-wrap items-center gap-stack-md">
        <div class="flex items-center gap-2">
          <label class="text-label-sm text-on-surface-variant">Status:</label>
          <select v-model="filterStatus" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3">
            <option value="">Semua</option>
            <option value="Pending">Pending</option>
            <option value="Diterima">Diterima</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
        <div class="ml-auto flex items-center gap-2">
          <span class="text-on-surface-variant text-[12px] italic flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span> {{ filteredRegistrations.length }} pendaftar
          </span>
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
        <table class="w-full text-left border-collapse">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Lengkap</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Asal Sekolah</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal Daftar</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-variant/30">
            <tr v-for="r in filteredRegistrations" :key="r.id" class="hover:bg-primary-container/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(r.id)" @change="toggleOne(r.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-bold">{{ r.initials }}</div>
                  <p class="text-label-md text-on-surface">{{ r.name }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ r.school }}</td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', statusClass(r.status)]">{{ r.status }}</span>
              </td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ r.registerDate }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button class="text-on-surface-variant hover:text-primary transition-colors" @click="openStatusModal(r)">
                    <span class="material-symbols-outlined">edit_note</span>
                  </button>
                  <button class="text-error hover:text-red-700 transition-colors" @click="deleteItem(r.id)">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter">
          <div class="bg-primary-container px-gutter py-stack-md flex justify-between items-center">
            <div class="text-on-primary">
              <h2 class="font-display text-headline-md">Update Status Pendaftaran</h2>
              <p class="text-[11px] text-on-primary-container uppercase tracking-widest">PSB Module &bull; {{ selectedReg?.name }}</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="updateStatus">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Status Pendaftaran</label>
              <select v-model="statusForm.status" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="Pending">Pending</option>
                <option value="Diterima">Diterima</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Catatan</label>
              <textarea v-model="statusForm.notes" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" rows="3" placeholder="Alasan / catatan verifikasi..."></textarea>
            </div>
            <div class="flex justify-end gap-stack-sm pt-stack-sm">
              <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="showModal = false">Batal</button>
              <button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </template>

  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredRegistrations)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const loading = ref(true)
const error = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const selectedReg = ref<any>(null)

const statusForm = reactive({
  status: 'Pending',
  notes: '',
})

const items = ref<any[]>([])

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    const params: Record<string, string> = {}
    if (filterStatus.value) params.status = filterStatus.value
    items.value = await $fetch('/api/psb/registrations', { params }) || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

const stats = computed(() => [
  { label: 'Total Pendaftar', icon: 'person_add', value: items.value.length, subtext: 'Semua pendaftar', iconColor: 'text-primary', valueColor: 'text-primary' },
  { label: 'Pending', icon: 'hourglass_empty', value: items.value.filter(r => r.status === 'Pending').length, subtext: 'Menunggu verifikasi', iconColor: 'text-secondary', valueColor: 'text-secondary' },
  { label: 'Diterima', icon: 'check_circle', value: items.value.filter(r => r.status === 'Diterima').length, subtext: 'Lolos seleksi', iconColor: 'text-tertiary-container', valueColor: 'text-on-background' },
  { label: 'Ditolak', icon: 'cancel', value: items.value.filter(r => r.status === 'Ditolak').length, subtext: 'Tidak lolos', iconColor: 'text-error', valueColor: 'text-error' },
])

const filteredRegistrations = computed(() =>
  !filterStatus.value ? items.value : items.value.filter(r => r.status === filterStatus.value)
)

function statusClass(status: string) {
  const map: Record<string, string> = {
    'Pending': 'bg-secondary-fixed text-on-secondary-fixed',
    'Diterima': 'bg-primary-fixed text-on-primary-fixed',
    'Ditolak': 'bg-error-container text-on-error-container',
  }
  return map[status] || 'bg-surface-container text-on-surface-variant'
}

function openStatusModal(r: any) {
  selectedReg.value = r
  statusForm.status = r.status
  statusForm.notes = ''
  showModal.value = true
}

async function updateStatus() {
  if (!selectedReg.value) return
  try {
    await $fetch(`/api/psb/registrations/${selectedReg.value.id}`, { method: 'PATCH', body: { status: statusForm.status } })
    showModal.value = false; await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal memperbarui status'
  }
}

async function deleteItem(id: string) {
  if (!confirm('Yakin ingin menghapus?')) return
  try {
    await $fetch(`/api/psb/registrations/${id}`, { method: 'DELETE' }); await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

async function bulkDelete() {
  if (!confirm(`Yakin ingin menghapus ${selectedCount} data?`)) return
  try {
    await Promise.all(selected.value.map(id => $fetch(`/api/psb/registrations/${id}`, { method: 'DELETE' })))
    clearSelection()
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => fetchData())
</script>
