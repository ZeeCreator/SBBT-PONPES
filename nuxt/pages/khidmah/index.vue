<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Pengabdian & Khidmah Santri</h2>
      <p class="text-on-surface-variant text-body-md">Kelola tugas khidmah, pembagian shift, dan jadwal pengabdian santri.</p>
    </div>
    <div v-if="errorS" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ errorS }}</div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
    </div>
    <template v-else>
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
            <select v-model="filterTugas" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
              <option value="">Semua Tugas</option>
              <option v-for="t in tugasList" :key="t" :value="t">{{ t }}</option>
            </select>
            <select v-model="filterShift" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
              <option value="">Semua Shift</option>
              <option value="Pagi">Pagi</option>
              <option value="Siang">Siang</option>
              <option value="Sore">Sore</option>
              <option value="Malam">Malam</option>
            </select>
          </div>
          <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="openAddModal">
            <span class="material-symbols-outlined text-sm">add</span> Assign Khidmah
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-surface-container-low">
              <tr>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tugas</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Shift</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Jam</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Hari</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              <tr v-for="item in filteredKhidmah" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
                <td class="px-4 py-3 text-label-md font-medium">{{ item.santri }}</td>
                <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', tugasClass(item.tugas)]">{{ item.tugas }}</span></td>
                <td class="px-4 py-3"><span class="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-surface-container-low text-on-surface-variant">{{ item.shift }}</span></td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.jam }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.hari }}</td>
                <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', item.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">{{ item.status }}</span></td>
                <td class="px-4 py-3 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button class="text-primary hover:text-blue-700 transition-colors" @click="openEditModal(item)"><span class="material-symbols-outlined text-sm">edit</span></button>
                    <button class="text-error hover:text-red-700 transition-colors" @click="deleteKhidmah(item.id)"><span class="material-symbols-outlined text-sm">delete</span></button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredKhidmah.length === 0"><td colspan="7" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter">
          <div class="bg-primary px-gutter py-stack-md flex justify-between items-center">
            <div class="text-on-primary">
              <h2 class="font-display text-headline-md">{{ editingId ? 'Edit Tugas Khidmah' : 'Assign Tugas Khidmah' }}</h2>
              <p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Khidmah Module</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="submitForm">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Santri</label>
              <select v-model="form.santri" @change="form.studentId = students.find(s => s.name === form.santri)?.id || ''" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required>
                <option value="">-- Pilih Santri --</option>
                <option v-for="s in students" :key="s.id" :value="s.name">{{ s.name }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Tugas Khidmah</label>
              <select v-model="form.tugas" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option v-for="t in tugasList" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Shift</label>
                <select v-model="form.shift" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option value="Pagi">Pagi</option>
                  <option value="Siang">Siang</option>
                  <option value="Sore">Sore</option>
                  <option value="Malam">Malam</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Jam</label>
                <input type="time" v-model="form.jam" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Hari</label>
                <select v-model="form.hari" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option v-for="h in hariList" :key="h" :value="h">{{ h }}</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Status</label>
                <select v-model="form.status" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end gap-stack-sm pt-stack-sm">
              <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="showModal = false">Batal</button>
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

const { getIdToken } = useAuth()

interface KhidmahItem {
  id: number
  santri: string
  tugas: string
  shift: string
  jam: string
  hari: string
  status: string
}

const filterSearch = ref('')
const filterTugas = ref('')
const filterShift = ref('')
const showModal = ref(false)
const loading = ref(true)
const errorS = ref('')
const editingId = ref<string | null>(null)
const khidmah = ref<KhidmahItem[]>([])
const students = ref<any[]>([])

const form = reactive({
  santri: '',
  studentId: '',
  tugas: 'Kebersihan',
  shift: 'Pagi',
  jam: '06:00',
  hari: 'Senin',
  status: 'Aktif',
})

const tugasList = ['Kebersihan', 'Keamanan', 'Koperasi', 'Dapur', 'Taman', 'Perpustakaan', 'Kantin']
const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad']

const stats = computed(() => {
  const aktif = khidmah.value.filter(k => k.status === 'Aktif')
  return [
    { label: 'Total Santri Bertugas', icon: 'groups', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: aktif.length.toString() },
    { label: 'Shift Pagi Ini', icon: 'wb_sunny', bg: 'bg-amber-100', iconColor: 'text-amber-600', valueColor: 'text-amber-700', value: aktif.filter(k => k.shift === 'Pagi').length.toString() },
    { label: 'Kebersihan', icon: 'cleaning_services', bg: 'bg-green-100', iconColor: 'text-green-600', valueColor: 'text-green-700', value: aktif.filter(k => k.tugas === 'Kebersihan').length.toString() },
    { label: 'Keamanan', icon: 'shield', bg: 'bg-blue-100', iconColor: 'text-blue-600', valueColor: 'text-blue-700', value: aktif.filter(k => k.tugas === 'Keamanan').length.toString() },
  ]
})

const filteredKhidmah = computed(() => khidmah.value.filter(k =>
  (!filterSearch.value || k.santri.toLowerCase().includes(filterSearch.value.toLowerCase())) &&
  (!filterTugas.value || k.tugas === filterTugas.value) &&
  (!filterShift.value || k.shift === filterShift.value)
))

function tugasClass(tugas: string) {
  const map: Record<string, string> = {
    'Kebersihan': 'bg-green-100 text-green-700',
    'Keamanan': 'bg-blue-100 text-blue-700',
    'Koperasi': 'bg-amber-100 text-amber-700',
    'Dapur': 'bg-orange-100 text-orange-700',
    'Taman': 'bg-emerald-100 text-emerald-700',
    'Perpustakaan': 'bg-purple-100 text-purple-700',
    'Kantin': 'bg-pink-100 text-pink-700',
  }
  return map[tugas] || 'bg-surface-container text-on-surface-variant'
}

async function fetchData() {
  loading.value = true; errorS.value = ''
  try {
    const params: Record<string, string> = {}
    if (filterSearch.value) params.search = filterSearch.value
    if (filterTugas.value) params.tugas = filterTugas.value
    if (filterShift.value) params.shift = filterShift.value
    const qs = new URLSearchParams(params).toString()
    khidmah.value = await $fetch<KhidmahItem[]>(`/api/khidmah${qs ? '?' + qs : ''}`) || []
  } catch (e: any) { errorS.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

watch([filterSearch, filterTugas, filterShift], () => fetchData())

function openAddModal() {
  editingId.value = null
  form.santri = ''
  form.studentId = ''
  form.tugas = 'Kebersihan'
  form.shift = 'Pagi'
  form.jam = '06:00'
  form.hari = 'Senin'
  form.status = 'Aktif'
  showModal.value = true
}

function openEditModal(item: KhidmahItem) {
  editingId.value = item.id.toString()
  form.santri = item.santri
  form.studentId = students.value.find(s => s.name === item.santri)?.id || ''
  form.tugas = item.tugas
  form.shift = item.shift
  form.jam = item.jam
  form.hari = item.hari
  form.status = item.status
  showModal.value = true
}

async function submitForm() {
  try {
    const body = {
      santri: form.santri,
      studentId: form.studentId,
      tugas: form.tugas,
      shift: form.shift,
      jam: form.jam + ' - ' + (form.shift === 'Pagi' ? '08:00' : form.shift === 'Siang' ? '14:00' : form.shift === 'Sore' ? '17:00' : '22:00'),
      hari: form.hari,
      status: form.status,
    }
    if (editingId.value) {
      await $fetch(`/api/khidmah/${editingId.value}`, { method: 'PUT', body })
    } else {
      await $fetch('/api/khidmah', { method: 'POST', body })
    }
    showModal.value = false; await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menyimpan' }
}

async function deleteKhidmah(id: number) {
  if (!confirm('Yakin ingin menghapus data khidmah ini?')) return
  try { await $fetch(`/api/khidmah/${id}`, { method: 'DELETE' }); await fetchData() }
  catch (e: any) { errorS.value = e.message || 'Gagal menghapus' }
}

async function fetchStudents() {
  try {
    const token = await getIdToken()
    const res = await fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) students.value = await res.json()
  } catch (e) { console.error(e) }
}

onMounted(() => { fetchData(); fetchStudents() })
</script>
