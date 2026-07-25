<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary">sync</span>
      <span class="ml-2 text-on-surface-variant">Memuat data...</span>
    </div>
    <div v-else-if="error" class="bg-error-container text-on-error-container p-stack-md rounded-xl mb-stack-lg">{{ error }}</div>
    <template v-else>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
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
        <h2 class="font-display text-headline-md text-primary">Wisuda & Kelulusan</h2>
        <p class="text-on-surface-variant text-body-md">Tracking data wisuda dan kelulusan santri.</p>
      </div>
      <div class="flex items-center gap-stack-sm">
        <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md transition-all shadow-md active:scale-95" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Data Wisuda
        </button>
      </div>
    </div>
    <div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Santri</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal Wisuda</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Juz Tahfidz</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">No. Sertifikat</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-variant/30">
            <tr v-for="g in graduations" :key="g.id" class="hover:bg-primary-container/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(g.id)" @change="toggleOne(g.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-bold">{{ g.initials }}</div>
                  <p class="text-label-md text-on-surface">{{ g.name }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ g.date }}</td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ g.juz }} Juz</td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ g.certificateNumber }}</td>
              <td class="px-6 py-4">
                <button class="text-error hover:text-red-700 transition-colors" @click="deleteItem(g.id)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
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
              <h2 class="font-display text-headline-md">Tambah Data Wisuda</h2>
              <p class="text-[11px] text-on-primary-container uppercase tracking-widest">Alumni Module</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="saveItem">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Santri</label>
              <input v-model="form.name" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Tanggal Wisuda</label>
              <input v-model="form.date" type="date" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Juz Tahfidz</label>
              <input v-model.number="form.juz" type="number" min="1" max="30" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">No. Sertifikat</label>
              <input v-model="form.certificateNumber" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required />
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
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => graduations)
definePageMeta({ layout: 'alumni', requiredRole: 'alumni' })

const loading = ref(true)
const error = ref('')
const showModal = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  name: '',
  date: '',
  juz: 1,
  certificateNumber: '',
})

const items = ref<any[]>([])

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    items.value = await $fetch('/api/alumni/graduations') || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const totalJuz = items.value.reduce((acc: number, g: any) => acc + (g.juz || 0), 0)
  return [
    { label: 'Total Wisuda', icon: 'workspace_premium', value: items.value.length, subtext: 'Santri diwisuda', iconColor: 'text-primary', valueColor: 'text-primary' },
    { label: 'Total Juz', icon: 'menu_book', value: totalJuz, subtext: 'Rata-rata ' + (items.value.length ? (totalJuz / items.value.length).toFixed(1) : '0') + ' juz/santri', iconColor: 'text-secondary', valueColor: 'text-secondary' },
    { label: 'Wisuda 2026', icon: 'celebration', value: items.value.filter((g: any) => g.date?.startsWith('2026')).length, subtext: 'Tahun berjalan', iconColor: 'text-tertiary-container', valueColor: 'text-on-background' },
  ]
})

function openAddModal() {
  editingId.value = null
  form.name = ''
  form.date = ''
  form.juz = 1
  form.certificateNumber = ''
  showModal.value = true
}

async function saveItem() {
  try {
    if (editingId.value) {
      await $fetch(`/api/alumni/graduations/${editingId.value}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/alumni/graduations', { method: 'POST', body: { ...form } })
    }
    showModal.value = false; await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function deleteItem(id: string) {
  if (!confirm('Yakin ingin menghapus?')) return
  try {
    await $fetch(`/api/alumni/graduations/${id}`, { method: 'DELETE' }); await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => fetchData())
</script>
