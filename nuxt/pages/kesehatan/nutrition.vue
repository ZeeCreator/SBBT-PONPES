<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary">sync</span>
      <span class="ml-2 text-on-surface-variant">Memuat data...</span>
    </div>
    <div v-else-if="error" class="bg-error-container text-on-error-container p-stack-md rounded-xl mb-stack-lg">{{ error }}</div>
    <template v-else>
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Gizi & Menu Makanan</h2>
      <p class="text-on-surface-variant text-body-md">Perencanaan menu harian/mingguan dan monitoring kalori santri.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
      <div v-for="stat in stats" :key="stat.label" class="glass-card p-stack-md rounded-xl shadow-sm text-center">
        <div class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" :class="stat.bg">
          <span class="material-symbols-outlined" :class="stat.iconColor">{{ stat.icon }}</span>
        </div>
        <p class="font-display text-headline-md" :class="stat.valueColor">{{ stat.value }}</p>
        <p class="text-label-sm text-on-surface-variant">{{ stat.label }}</p>
      </div>
    </div>
    <div class="glass-card rounded-xl shadow-sm overflow-hidden">
      <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-on-surface-variant">filter_alt</span>
            <select v-model="filterKategori" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
              <option value="">Semua Kategori</option>
              <option v-for="k in kategoriOptions" :key="k" :value="k">{{ k }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-on-surface-variant">calendar_today</span>
            <input type="date" v-model="filterDate" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" />
          </div>
        </div>
        <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="showAddModal = true">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Menu
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Menu</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Kategori</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Kalori</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Keterangan</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="record in filteredRecords" :key="record.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(record.id)" @change="toggleOne(record.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
              <td class="px-4 py-3 text-label-md font-medium">{{ record.date }}</td>
              <td class="px-4 py-3 text-label-sm">{{ record.menu }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-0.5 rounded text-[11px] font-bold', kategoriBadge(record.kategori)]">{{ record.kategori }}</span>
              </td>
              <td class="px-4 py-3 text-label-sm">{{ record.calories }} kkal</td>
              <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ record.notes }}</td>
              <td class="px-4 py-3 text-center">
                <button class="text-error hover:text-red-700 transition-colors" @click="deleteItem(record.id)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
            <tr v-if="filteredRecords.length === 0">
              <td colspan="99"  class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showAddModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter">
          <div class="bg-primary px-gutter py-stack-md flex justify-between items-center">
            <div class="text-on-primary">
              <h2 class="font-display text-headline-md">Tambah Menu</h2>
              <p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Kesehatan Module</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showAddModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="saveItem">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Tanggal</label>
              <input type="date" v-model="form.date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Menu Makanan</label>
              <input v-model="form.menu" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Nama menu" required />
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Kategori</label>
                <select v-model="form.kategori" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option v-for="k in kategoriOptions" :key="k" :value="k">{{ k }}</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Kalori (kkal)</label>
                <input type="number" v-model.number="form.calories" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="500" required />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Keterangan</label>
              <input v-model="form.notes" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Catatan tambahan" />
            </div>
            <div class="flex justify-end gap-stack-sm pt-stack-sm">
              <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="showAddModal = false">Batal</button>
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
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredRecords)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const loading = ref(true)
const error = ref('')
const filterKategori = ref('')
const filterDate = ref(new Date().toISOString().split('T')[0])
const showAddModal = ref(false)
const editingId = ref<string | null>(null)

const kategoriOptions = ['Sarapan', 'Makan Siang', 'Makan Malam', 'Snack']

const form = reactive({
  date: new Date().toISOString().split('T')[0],
  menu: '',
  kategori: 'Sarapan',
  calories: 0,
  notes: '',
})

const items = ref<any[]>([])

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    items.value = await $fetch('/api/kesehatan/nutrition') || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const len = items.value.length
  const today = new Date().toISOString().split('T')[0]
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  const avgCal = len ? items.value.reduce((acc: number, r: any) => acc + (Number(r.calories) || 0), 0) / len : 0
  return [
    { label: 'Total Menu', icon: 'restaurant_menu', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: len },
    { label: 'Rata-rata Kalori', icon: 'local_fire_department', bg: 'bg-orange-100', iconColor: 'text-orange-600', valueColor: 'text-orange-700', value: Math.round(avgCal) + ' kkal' },
    { label: 'Menu Hari Ini', icon: 'today', bg: 'bg-blue-100', iconColor: 'text-blue-600', valueColor: 'text-blue-700', value: items.value.filter((r: any) => r.date === today).length },
    { label: 'Minggu Ini', icon: 'calendar_view_week', bg: 'bg-green-100', iconColor: 'text-green-600', valueColor: 'text-green-700', value: items.value.filter((r: any) => r.date >= weekAgo && r.date <= today).length },
  ]
})

const filteredRecords = computed(() => {
  return items.value.filter(r => {
    const matchKategori = !filterKategori.value || r.kategori === filterKategori.value
    return matchKategori
  })
})

function kategoriBadge(kategori: string) {
  switch (kategori) {
    case 'Sarapan': return 'bg-amber-100 text-amber-700'
    case 'Makan Siang': return 'bg-blue-100 text-blue-700'
    case 'Makan Malam': return 'bg-indigo-100 text-indigo-700'
    case 'Snack': return 'bg-pink-100 text-pink-700'
    default: return 'bg-surface-container text-on-surface-variant'
  }
}

function openAddModal() {
  editingId.value = null
  form.date = new Date().toISOString().split('T')[0]
  form.menu = ''
  form.kategori = 'Sarapan'
  form.calories = 0
  form.notes = ''
  showAddModal.value = true
}

async function saveItem() {
  try {
    if (editingId.value) {
      await $fetch(`/api/kesehatan/nutrition/${editingId.value}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/kesehatan/nutrition', { method: 'POST', body: { ...form } })
    }
    showAddModal.value = false; await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function deleteItem(id: string) {
  if (!confirm('Yakin ingin menghapus?')) return
  try {
    await $fetch(`/api/kesehatan/nutrition/${id}`, { method: 'DELETE' }); await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => fetchData())
</script>
