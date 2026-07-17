<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Manajemen Periode</h2>
      <p class="text-on-surface-variant text-body-md">Kelola periode SPP dan tahfidz untuk pembayaran dan kegiatan.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
      <div v-for="stat in stats" :key="stat.label" class="glass-card p-stack-md rounded-xl shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-on-surface-variant text-label-md">{{ stat.label }}</span>
          <span class="material-symbols-outlined" :class="stat.iconColor">{{ stat.icon }}</span>
        </div>
        <p class="font-display text-headline-md" :class="stat.valueColor">{{ stat.value }}</p>
      </div>
    </div>

    <div class="glass-card rounded-xl shadow-sm overflow-hidden">
      <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
        <h3 class="font-display text-title-lg text-primary">Daftar Periode</h3>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Periode
        </button>
      </div>
      <div v-if="loading" class="p-8 text-center text-on-surface-variant text-label-md">Memuat data...</div>
      <div v-else-if="error" class="p-8 text-center text-red-500 text-label-md">{{ error }}</div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Periode</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Mulai</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Selesai</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="item in items" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-6 py-4 text-label-md text-on-surface font-medium">{{ item.name }}</td>
              <td class="px-6 py-4 text-label-sm text-on-surface-variant">{{ item.startDate }}</td>
              <td class="px-6 py-4 text-label-sm text-on-surface-variant">{{ item.endDate }}</td>
              <td class="px-6 py-4">
                <button @click="toggleActive(item)" :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider border-0 cursor-pointer transition-all', item.isActive ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant']">
                  {{ item.isActive ? 'Aktif' : 'Nonaktif' }}
                </button>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit" @click="openEditModal(item)">
                    <span class="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus" @click="confirmDelete(item)">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data periode. Klik "Tambah Periode" untuk menambahkan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter">
          <div class="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <h3 class="font-display text-title-lg text-primary">{{ isEditing ? 'Edit Periode' : 'Tambah Periode' }}</h3>
            <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Nama Periode</label>
              <input v-model="form.name" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Contoh: SPP Bulan Juli 2024" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">Tanggal Mulai</label>
                <input v-model="form.startDate" type="date" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" />
              </div>
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">Tanggal Selesai</label>
                <input v-model="form.endDate" type="date" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" />
              </div>
            </div>
            <div class="flex items-center gap-3">
              <label class="text-label-sm text-on-surface-variant">Set sebagai aktif</label>
              <button @click="form.isActive = !form.isActive" :class="['w-10 h-5 rounded-full transition-colors relative', form.isActive ? 'bg-primary' : 'bg-surface-container-highest']">
                <span :class="['absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form.isActive ? 'translate-x-5' : 'translate-x-0.5']"></span>
              </button>
            </div>
          </div>
          <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="closeModal">Batal</button>
            <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="saveItem">Simpan</button>
          </div>
        </div>
      </div>

      <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="showDeleteModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter">
          <div class="p-6 text-center">
            <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
            </div>
            <h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Periode</h3>
            <p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus periode berikut?</p>
            <p class="font-bold text-on-surface text-body-md">{{ deleteTarget?.name }}</p>
          </div>
          <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="showDeleteModal = false">Batal</button>
            <button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="doDelete">Hapus</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

interface Period {
  id: number
  name: string
  startDate: string
  endDate: string
  isActive: boolean
}

const loading = ref(true)
const error = ref('')
const items = ref<Period[]>([])
const showModal = ref(false)
const isEditing = ref(false)
const showDeleteModal = ref(false)
const deleteTarget = ref<Period | null>(null)

const stats = computed(() => [
  { label: 'Total Periode', icon: 'date_range', iconColor: 'text-primary', valueColor: 'text-primary', value: String(items.value.length) },
  { label: 'Periode SPP', icon: 'payments', iconColor: 'text-secondary', valueColor: 'text-secondary', value: String(items.value.filter(p => p.name.toLowerCase().includes('spp')).length) },
  { label: 'Periode Tahfidz', icon: 'book', iconColor: 'text-primary-container', valueColor: 'text-on-background', value: String(items.value.filter(p => p.name.toLowerCase().includes('tahfidz')).length) },
  { label: 'Aktif', icon: 'check_circle', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: String(items.value.filter(p => p.isActive).length) },
])

const defaultForm = () => ({
  id: 0,
  name: '',
  startDate: '',
  endDate: '',
  isActive: false,
})

const form = reactive(defaultForm())

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/master-data/periods')
    items.value = data || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

async function saveItem() {
  if (!form.name || !form.startDate || !form.endDate) return
  try {
    if (isEditing.value) {
      await $fetch(`/api/master-data/periods/${form.id}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/master-data/periods', { method: 'POST', body: { ...form } })
    }
    showModal.value = false
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function toggleActive(item: Period) {
  try {
    await $fetch(`/api/master-data/periods/${item.id}`, {
      method: 'PUT',
      body: { ...item, isActive: !item.isActive }
    })
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal mengubah status'
  }
}

async function doDelete() {
  if (!deleteTarget.value) return
  try {
    await $fetch(`/api/master-data/periods/${deleteTarget.value.id}`, { method: 'DELETE' })
    showDeleteModal.value = false
    deleteTarget.value = null
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

function openAddModal() {
  isEditing.value = false
  Object.assign(form, defaultForm())
  showModal.value = true
}

function openEditModal(item: Period) {
  isEditing.value = true
  Object.assign(form, { ...item })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function confirmDelete(item: Period) {
  deleteTarget.value = item
  showDeleteModal.value = true
}

onMounted(() => fetchData())
</script>
