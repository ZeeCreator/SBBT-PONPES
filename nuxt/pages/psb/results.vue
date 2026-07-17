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
        <h2 class="font-display text-headline-md text-primary">Pengumuman & Daftar Ulang</h2>
        <p class="text-on-surface-variant text-body-md">Kelola hasil pengumuman kelulusan dan pendaftaran ulang.</p>
      </div>
    </div>
    <div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50">
      <div class="p-stack-md border-b border-surface-variant/30 flex flex-wrap items-center gap-stack-md">
        <div class="flex items-center gap-2">
          <label class="text-label-sm text-on-surface-variant">Status:</label>
          <select v-model="filterStatus" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3">
            <option value="">Semua</option>
            <option value="Lulus">Lulus</option>
            <option value="Tidak">Tidak</option>
          </select>
        </div>
        <div class="ml-auto flex items-center gap-2">
          <span class="text-on-surface-variant text-[12px] italic flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span> {{ filteredResults.length }} hasil
          </span>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nama</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Kelas</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal Daftar Ulang</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-variant/30">
            <tr v-for="r in filteredResults" :key="r.id" class="hover:bg-primary-container/5 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-bold">{{ r.initials }}</div>
                  <p class="text-label-md text-on-surface">{{ r.name }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', r.status === 'Lulus' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-error-container text-on-error-container']">{{ r.status }}</span>
              </td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ r.class || '-' }}</td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ r.registerDate || '-' }}</td>
              <td class="px-6 py-4">
                <button class="text-error hover:text-red-700 transition-colors" @click="deleteItem(r.id)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const loading = ref(true)
const error = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  name: '',
  status: 'Lulus',
  class: '',
  registerDate: '',
})

const items = ref<any[]>([])

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    const params: Record<string, string> = {}
    if (filterStatus.value) params.status = filterStatus.value
    items.value = await $fetch('/api/psb/results', { params }) || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const len = items.value.length
  const lulus = items.value.filter(r => r.status === 'Lulus').length
  const tidak = items.value.filter(r => r.status === 'Tidak').length
  const daftarUlang = items.value.filter(r => r.registerDate).length
  return [
    { label: 'Total Peserta', icon: 'group', value: len, subtext: 'Semua peserta', iconColor: 'text-primary', valueColor: 'text-primary' },
    { label: 'Lulus', icon: 'check_circle', value: lulus, subtext: len ? Math.round((lulus / len) * 100) + '% diterima' : '0%', iconColor: 'text-primary', valueColor: 'text-primary' },
    { label: 'Tidak Lulus', icon: 'cancel', value: tidak, subtext: len ? Math.round((tidak / len) * 100) + '% ditolak' : '0%', iconColor: 'text-error', valueColor: 'text-error' },
    { label: 'Daftar Ulang', icon: 'how_to_reg', value: daftarUlang, subtext: lulus ? Math.round((daftarUlang / lulus) * 100) + '% dari lulus' : '0%', iconColor: 'text-secondary', valueColor: 'text-secondary' },
  ]
})

const filteredResults = computed(() =>
  !filterStatus.value ? items.value : items.value.filter(r => r.status === filterStatus.value)
)

async function saveItem() {
  try {
    if (editingId.value) {
      await $fetch(`/api/psb/results/${editingId.value}`, { method: 'PATCH', body: { ...form } })
    } else {
      await $fetch('/api/psb/results', { method: 'POST', body: { ...form } })
    }
    showModal.value = false; await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function deleteItem(id: string) {
  if (!confirm('Yakin ingin menghapus?')) return
  try {
    await $fetch(`/api/psb/results/${id}`, { method: 'DELETE' }); await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => fetchData())
</script>
