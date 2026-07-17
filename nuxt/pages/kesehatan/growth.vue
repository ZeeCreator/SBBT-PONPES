<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary">sync</span>
      <span class="ml-2 text-on-surface-variant">Memuat data...</span>
    </div>
    <div v-else-if="error" class="bg-error-container text-on-error-container p-stack-md rounded-xl mb-stack-lg">{{ error }}</div>
    <template v-else>
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Stimulasi Tinggi & Berat Badan</h2>
      <p class="text-on-surface-variant text-body-md">Monitoring pertumbuhan TB/BB santri secara berkala.</p>
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
            <span class="material-symbols-outlined text-on-surface-variant">search</span>
            <input v-model="filterStudent" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari santri..." />
          </div>
        </div>
        <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="showAddModal = true">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Pengukuran
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">TB (cm)</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">BB (kg)</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">IMT</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status Gizi</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="record in filteredRecords" :key="record.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-3 text-label-md font-medium">{{ record.name }}</td>
              <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ record.date }}</td>
              <td class="px-4 py-3 text-label-sm">{{ record.height }}</td>
              <td class="px-4 py-3 text-label-sm">{{ record.weight }}</td>
              <td class="px-4 py-3 text-label-sm">{{ record.imt }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 text-[11px] font-bold rounded-full', nutritionBadge(record.status)]">{{ record.status }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <button class="text-error hover:text-red-700 transition-colors" @click="deleteItem(record.id)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
            <tr v-if="filteredRecords.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td>
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
              <h2 class="font-display text-headline-md">Tambah Pengukuran</h2>
              <p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Kesehatan Module</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showAddModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="saveItem">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Santri</label>
              <select v-model="form.name" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required>
                <option value="">-- Pilih Santri --</option>
                <option v-for="s in students" :key="s.id" :value="s.name">{{ s.name }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Tanggal</label>
              <input type="date" v-model="form.date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Tinggi Badan (cm)</label>
                <input type="number" v-model.number="form.height" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="170" step="0.1" required />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Berat Badan (kg)</label>
                <input type="number" v-model.number="form.weight" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="65" step="0.1" required />
              </div>
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
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const loading = ref(true)
const error = ref('')
const filterStudent = ref('')
const showAddModal = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  name: '',
  studentId: '',
  date: new Date().toISOString().split('T')[0],
  height: 0,
  weight: 0,
})

const items = ref<any[]>([])
const students = ref<any[]>([])
const { getIdToken } = useAuth()

async function fetchStudents() {
  try {
    const token = await getIdToken.value?.()
    const res = await $fetch('/api/students', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    students.value = res || []
  } catch (e: any) {
    console.error('Gagal memuat daftar santri', e)
  }
}

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    items.value = await $fetch('/api/kesehatan/growth') || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const len = items.value.length
  const avgHeight = len ? items.value.reduce((acc: number, r: any) => acc + (Number(r.height) || 0), 0) / len : 0
  const avgWeight = len ? items.value.reduce((acc: number, r: any) => acc + (Number(r.weight) || 0), 0) / len : 0
  const giziBaik = items.value.filter((r: any) => r.status === 'Normal').length
  return [
    { label: 'Total Tercatat', icon: 'monitoring', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: len },
    { label: 'Rata-rata TB', icon: 'height', bg: 'bg-blue-100', iconColor: 'text-blue-600', valueColor: 'text-blue-700', value: avgHeight.toFixed(1) + ' cm' },
    { label: 'Rata-rata BB', icon: 'monitor_weight', bg: 'bg-green-100', iconColor: 'text-green-600', valueColor: 'text-green-700', value: avgWeight.toFixed(1) + ' kg' },
    { label: 'Gizi Baik', icon: 'check_circle', bg: 'bg-teal-100', iconColor: 'text-teal-600', valueColor: 'text-teal-700', value: len ? Math.round((giziBaik / len) * 100) + '%' : '0%' },
  ]
})

const filteredRecords = computed(() => {
  return items.value.filter(r => {
    return !filterStudent.value || (r.name || '').toLowerCase().includes(filterStudent.value.toLowerCase())
  })
})

function nutritionBadge(status: string) {
  switch (status) {
    case 'Normal': return 'bg-green-100 text-green-700'
    case 'Overweight': return 'bg-orange-100 text-orange-700'
    case 'Underweight': return 'bg-amber-100 text-amber-700'
    case 'Obesitas': return 'bg-red-100 text-red-700'
    default: return 'bg-surface-container text-on-surface-variant'
  }
}

function openAddModal() {
  editingId.value = null
  form.name = ''
  form.date = new Date().toISOString().split('T')[0]
  form.height = 0
  form.weight = 0
  showAddModal.value = true
}

async function saveItem() {
  try {
    if (editingId.value) {
      await $fetch(`/api/kesehatan/growth/${editingId.value}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/kesehatan/growth', { method: 'POST', body: { ...form } })
    }
    showAddModal.value = false; await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function deleteItem(id: string) {
  if (!confirm('Yakin ingin menghapus?')) return
  try {
    await $fetch(`/api/kesehatan/growth/${id}`, { method: 'DELETE' }); await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => { fetchData(); fetchStudents() })
</script>
