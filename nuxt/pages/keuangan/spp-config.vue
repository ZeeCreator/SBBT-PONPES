<template>
  <div class="bg-mesh min-h-screen" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="px-gutter max-w-container-max mx-auto">
      <div class="mb-stack-lg">
        <h2 class="font-display text-headline-lg text-primary mb-2">Konfigurasi SPP & Biaya</h2>
        <p class="text-on-surface-variant text-body-md">Kelola tarif SPP per kelas/tingkat dan biaya tambahan pendidikan.</p>
      </div>
      <div v-if="errorS" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ errorS }}</div>
      <div v-if="loading" class="flex items-center justify-center py-12">
        <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
      </div>
      <template v-else>
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
            <div class="flex items-center gap-4">
              <h3 class="font-display text-title-lg text-primary">Daftar Konfigurasi Biaya</h3>
              <div class="flex items-center gap-2">
                <label class="text-label-sm text-on-surface-variant">Filter:</label>
                <select v-model="filterLevel" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
                  <option value="">Semua Tingkat</option>
                  <option value="7">Kelas 7</option>
                  <option value="8">Kelas 8</option>
                  <option value="9">Kelas 9</option>
                  <option value="10">Kelas 10</option>
                  <option value="11">Kelas 11</option>
                  <option value="12">Kelas 12</option>
                </select>
              </div>
            </div>
            <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
              <span class="material-symbols-outlined text-sm">add</span> Tambah Konfigurasi
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Tingkat / Kelas</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Kategori</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">SPP</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Bangunan</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Buku</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Kegiatan</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Seragam</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Total</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="item in filteredConfigs" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
                  <td class="px-6 py-4 text-label-md text-on-surface font-medium">{{ item.level }} - {{ item.className }}</td>
                  <td class="px-6 py-4">
                    <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', categoryClass(item.category)]">{{ item.category }}</span>
                  </td>
                  <td class="px-6 py-4 text-label-md text-on-surface">Rp {{ formatNumber(item.spp) }}</td>
                  <td class="px-6 py-4 text-label-md text-on-surface-variant">Rp {{ formatNumber(item.building) }}</td>
                  <td class="px-6 py-4 text-label-md text-on-surface-variant">Rp {{ formatNumber(item.books) }}</td>
                  <td class="px-6 py-4 text-label-md text-on-surface-variant">Rp {{ formatNumber(item.activities) }}</td>
                  <td class="px-6 py-4 text-label-md text-on-surface-variant">Rp {{ formatNumber(item.uniform) }}</td>
                  <td class="px-6 py-4 font-display text-headline-sm text-primary">Rp {{ formatNumber(item.spp + item.building + item.books + item.activities + item.uniform) }}</td>
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
                <tr v-if="filteredConfigs.length === 0">
                  <td colspan="9" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada konfigurasi biaya.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
      <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="closeModal">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-modal-enter">
            <div class="p-6 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 class="font-display text-title-lg text-primary">{{ isEditing ? 'Edit Konfigurasi' : 'Tambah Konfigurasi' }}</h3>
              <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="closeModal">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-label-sm text-on-surface-variant block mb-1">Tingkat</label>
                  <select v-model="form.level" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                    <option value="">Pilih Tingkat</option>
                    <option v-for="l in ['7','8','9','10','11','12']" :key="l" :value="l">Kelas {{ l }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-label-sm text-on-surface-variant block mb-1">Nama Kelas</label>
                  <input v-model="form.className" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Contoh: 7A" />
                </div>
              </div>
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">Kategori Santri</label>
                <select v-model="form.category" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                  <option value="Reguler">Reguler</option>
                  <option value="Yatim">Yatim</option>
                  <option value="Beasiswa">Beasiswa</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-label-sm text-on-surface-variant block mb-1">Nominal SPP</label>
                  <input v-model.number="form.spp" type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp" />
                </div>
                <div>
                  <label class="text-label-sm text-on-surface-variant block mb-1">Biaya Bangunan</label>
                  <input v-model.number="form.building" type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp" />
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="text-label-sm text-on-surface-variant block mb-1">Biaya Buku</label>
                  <input v-model.number="form.books" type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp" />
                </div>
                <div>
                  <label class="text-label-sm text-on-surface-variant block mb-1">Biaya Kegiatan</label>
                  <input v-model.number="form.activities" type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp" />
                </div>
                <div>
                  <label class="text-label-sm text-on-surface-variant block mb-1">Biaya Seragam</label>
                  <input v-model.number="form.uniform" type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp" />
                </div>
              </div>
              <div class="bg-primary-fixed/20 rounded-lg p-4 flex items-center justify-between">
                <span class="text-label-md text-on-surface-variant">Total Keseluruhan</span>
                <span class="font-display text-headline-md text-primary">Rp {{ formatNumber(form.spp + form.building + form.books + form.activities + form.uniform) }}</span>
              </div>
            </div>
            <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
              <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="closeModal">Batal</button>
              <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="saveConfig">Simpan</button>
            </div>
          </div>
        </div>
        <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="showDeleteModal = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter">
            <div class="p-6 text-center">
              <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
              </div>
              <h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Konfigurasi</h3>
              <p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus konfigurasi berikut?</p>
              <p class="font-bold text-on-surface text-body-md">{{ deleteTarget?.level }} - {{ deleteTarget?.className }} ({{ deleteTarget?.category }})</p>
            </div>
            <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
              <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="showDeleteModal = false">Batal</button>
              <button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="doDelete">Hapus</button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

interface ConfigItem {
  id: number
  level: string
  className: string
  category: string
  spp: number
  building: number
  books: number
  activities: number
  uniform: number
}

const filterLevel = ref('')
const loading = ref(true)
const errorS = ref('')
const configs = ref<ConfigItem[]>([])

const stats = computed(() => {
  const total = configs.value.length
  const allSpp = configs.value.map(c => c.spp)
  const minSpp = allSpp.length ? Math.min(...allSpp) : 0
  const maxSpp = allSpp.length ? Math.max(...allSpp) : 0
  const totals = configs.value.map(c => c.spp + c.building + c.books + c.activities + c.uniform)
  const avgTotal = totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0
  return [
    { label: 'Total Konfigurasi', icon: 'settings', iconColor: 'text-primary', valueColor: 'text-primary', value: total },
    { label: 'Range SPP', icon: 'currency_exchange', iconColor: 'text-secondary', valueColor: 'text-secondary', value: `Rp ${formatNumber(minSpp)} - Rp ${formatNumber(maxSpp)}` },
    { label: 'Rata-rata Total', icon: 'calculate', iconColor: 'text-primary-container', valueColor: 'text-on-background', value: `Rp ${formatNumber(avgTotal)}` },
    { label: 'Kategori', icon: 'category', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: `${new Set(configs.value.map(c => c.category)).size} jenis` },
  ]
})

const filteredConfigs = computed(() =>
  !filterLevel.value ? configs.value : configs.value.filter(c => c.level === filterLevel.value)
)

function categoryClass(cat: string) {
  const map: Record<string, string> = {
    'Reguler': 'bg-primary-fixed text-on-primary-fixed',
    'Yatim': 'bg-secondary-fixed text-on-secondary-fixed',
    'Beasiswa': 'bg-tertiary-container text-on-tertiary-container',
  }
  return map[cat] || 'bg-surface-container text-on-surface-variant'
}

function formatNumber(n: number) {
  return n.toLocaleString('id-ID')
}

async function fetchData() {
  loading.value = true; errorS.value = ''
  try {
    const params = filterLevel.value ? `?level=${filterLevel.value}` : ''
    configs.value = await $fetch<ConfigItem[]>(`/api/keuangan/spp-config${params}`) || []
  } catch (e: any) { errorS.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

watch(filterLevel, () => fetchData())

const showModal = ref(false)
const isEditing = ref(false)
const showDeleteModal = ref(false)
const deleteTarget = ref<ConfigItem | null>(null)

const defaultForm = () => ({
  id: 0,
  level: '',
  className: '',
  category: 'Reguler',
  spp: 0,
  building: 0,
  books: 0,
  activities: 0,
  uniform: 0,
})

const form = reactive(defaultForm())

function openAddModal() {
  isEditing.value = false
  Object.assign(form, defaultForm())
  showModal.value = true
}

function openEditModal(item: ConfigItem) {
  isEditing.value = true
  Object.assign(form, { ...item })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveConfig() {
  if (!form.level || !form.className || form.spp <= 0) return
  try {
    if (isEditing.value) {
      await $fetch(`/api/keuangan/spp-config/${form.id}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/keuangan/spp-config', { method: 'POST', body: { ...form } })
    }
    closeModal(); await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menyimpan' }
}

function confirmDelete(item: ConfigItem) {
  deleteTarget.value = item
  showDeleteModal.value = true
}

async function doDelete() {
  if (deleteTarget.value) {
    try {
      await $fetch(`/api/keuangan/spp-config/${deleteTarget.value.id}`, { method: 'DELETE' })
      await fetchData()
      showDeleteModal.value = false
      deleteTarget.value = null
    } catch (e: any) { errorS.value = e.message || 'Gagal menghapus' }
  }
}

onMounted(() => fetchData())
</script>
