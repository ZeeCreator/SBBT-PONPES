<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Infaq & Shodaqoh Harian</h2>
      <p class="text-on-surface-variant text-body-md">Catatan infaq harian santri.</p>
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
            <input v-model="filterSearch" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari santri..." />
          </div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-on-surface-variant">calendar_today</span>
            <input type="date" v-model="filterDate" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" />
          </div>
        </div>
        <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="showAddModal = true">
          <span class="material-symbols-outlined text-sm">add</span> Catat Infaq
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama Santri</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Jumlah</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Keterangan</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="record in filteredRecords" :key="record.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-3 text-label-md font-medium">{{ record.name }}</td>
              <td class="px-4 py-3 text-label-md font-bold text-primary">Rp {{ record.amount.toLocaleString() }}</td>
              <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ record.date }}</td>
              <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ record.keterangan || '-' }}</td>
              <td class="px-4 py-3 text-center">
                <button class="text-error hover:text-red-700 transition-colors" @click="deleteRecord(record.id)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
            <tr v-if="filteredRecords.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td>
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
              <h2 class="font-display text-headline-md">Catat Infaq & Shodaqoh</h2>
              <p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Ibadah Module</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showAddModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="submitRecord">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Santri</label>
              <select v-model="form.name" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required>
                <option value="">-- Pilih Santri --</option>
                <option v-for="s in students" :key="s.id" :value="s.name">{{ s.name }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Jumlah (Rp)</label>
                <input type="number" v-model="form.amount" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="0" min="0" required />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Tanggal</label>
                <input type="date" v-model="form.date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Keterangan</label>
              <textarea v-model="form.keterangan" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Opsional" rows="2"></textarea>
            </div>
            <div class="flex justify-end gap-stack-sm pt-stack-sm">
              <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="showAddModal = false">Batal</button>
              <button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const loading = ref(true)
const error = ref('')
const filterSearch = ref('')
const filterDate = ref('')
const showAddModal = ref(false)
const students = ref<any[]>([])
const { getIdToken } = useAuth()

const form = reactive({
  name: '',
  studentId: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  keterangan: '',
})

const items = ref<any[]>([])

const today = new Date().toISOString().split('T')[0]
const currentMonth = today.substring(0, 7)

const totalAll = computed(() => items.value.reduce((sum: number, r: any) => sum + Number(r.amount), 0))
const totalToday = computed(() => items.value.filter((r: any) => r.date === today).reduce((sum: number, r: any) => sum + Number(r.amount), 0))
const totalMonth = computed(() => items.value.filter((r: any) => r.date?.startsWith(currentMonth)).reduce((sum: number, r: any) => sum + Number(r.amount), 0))

const stats = computed(() => [
  { label: 'Total Terkumpul', icon: 'account_balance', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: `Rp ${totalAll.value.toLocaleString()}` },
  { label: 'Hari Ini', icon: 'today', bg: 'bg-green-100', iconColor: 'text-green-600', valueColor: 'text-green-700', value: `Rp ${totalToday.value.toLocaleString()}` },
  { label: 'Bulan Ini', icon: 'calendar_month', bg: 'bg-blue-100', iconColor: 'text-blue-600', valueColor: 'text-blue-700', value: `Rp ${totalMonth.value.toLocaleString()}` },
  { label: 'Total Transaksi', icon: 'receipt_long', bg: 'bg-amber-100', iconColor: 'text-amber-600', valueColor: 'text-amber-700', value: items.value.length.toString() },
])

const filteredRecords = computed(() => {
  return items.value.filter(r => {
    const matchSearch = !filterSearch.value || r.name.toLowerCase().includes(filterSearch.value.toLowerCase())
    const matchDate = !filterDate.value || r.date === filterDate.value
    return matchSearch && matchDate
  })
})

async function fetchStudents() {
  try {
    const token = await getIdToken()
    const data = await $fetch('/api/students', {
      headers: { Authorization: `Bearer ${token}` }
    })
    students.value = data || []
  } catch (e: any) {
    console.error('Gagal memuat santri', e)
  }
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/ibadah/infaq')
    items.value = data || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

async function submitRecord() {
  try {
    await $fetch('/api/ibadah/infaq', {
      method: 'POST',
      body: { ...form, amount: Number(form.amount), studentId: form.studentId },
    })
    showAddModal.value = false
    form.name = ''
    form.studentId = ''
    form.amount = 0
    form.date = new Date().toISOString().split('T')[0]
    form.keterangan = ''
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function deleteRecord(id: string) {
  if (!confirm('Yakin ingin menghapus?')) return
  try {
    await $fetch(`/api/ibadah/infaq/${id}`, { method: 'DELETE' })
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => {
  fetchStudents()
  fetchData()
})
</script>
