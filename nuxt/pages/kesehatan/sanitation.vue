<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary">sync</span>
      <span class="ml-2 text-on-surface-variant">Memuat data...</span>
    </div>
    <div v-else-if="error" class="bg-error-container text-on-error-container p-stack-md rounded-xl mb-stack-lg">{{ error }}</div>
    <template v-else>
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Sanitasi & Kebersihan</h2>
      <p class="text-on-surface-variant text-body-md">Jadwal fogging, kebersihan MCK, dan inspeksi lingkungan.</p>
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
            <select v-model="filterKegiatan" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
              <option value="">Semua Kegiatan</option>
              <option v-for="k in kegiatanOptions" :key="k" :value="k">{{ k }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-on-surface-variant">calendar_today</span>
            <input type="date" v-model="filterDate" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" />
          </div>
        </div>
        <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="showAddModal = true">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Kegiatan
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Lokasi</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Jenis Kegiatan</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Petugas</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="record in filteredRecords" :key="record.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-3 text-label-md font-medium">{{ record.date }}</td>
              <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ record.location }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-0.5 rounded text-[11px] font-bold', kegiatanBadge(record.kegiatan)]">{{ record.kegiatan }}</span>
              </td>
              <td class="px-4 py-3 text-label-sm">{{ record.officer }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 text-[11px] font-bold rounded-full', record.status === 'Selesai' ? 'bg-green-100 text-green-700' : record.status === 'Dalam Proses' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700']">{{ record.status }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <button class="text-error hover:text-red-700 transition-colors" @click="deleteItem(record.id)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
            <tr v-if="filteredRecords.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td>
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
              <h2 class="font-display text-headline-md">Tambah Kegiatan</h2>
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
              <label class="text-label-md text-on-surface-variant">Lokasi</label>
              <input v-model="form.location" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Lokasi kegiatan" required />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Jenis Kegiatan</label>
              <select v-model="form.kegiatan" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option v-for="k in kegiatanOptions" :key="k" :value="k">{{ k }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Petugas</label>
              <select v-model="form.officer" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required>
                <option value="">-- Pilih Petugas --</option>
                <option v-for="t in teachers" :key="t.id" :value="t.name">{{ t.name }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Status</label>
              <select v-model="form.status" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="Selesai">Selesai</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Terjadwal">Terjadwal</option>
              </select>
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
const filterKegiatan = ref('')
const filterDate = ref(new Date().toISOString().split('T')[0])
const showAddModal = ref(false)
const editingId = ref<string | null>(null)

const kegiatanOptions = ['Fogging', 'Kebersihan MCK', 'Inspeksi Sanitasi', 'Pengecekan Air', 'Pembersihan Lingkungan']

const form = reactive({
  date: new Date().toISOString().split('T')[0],
  location: '',
  kegiatan: 'Kebersihan MCK',
  officer: '',
  status: 'Terjadwal',
})

const items = ref<any[]>([])
const teachers = ref<any[]>([])
const { getIdToken } = useAuth()

async function fetchTeachers() {
  try {
    const token = await getIdToken.value?.()
    const res = await $fetch('/api/guru', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    teachers.value = res || []
  } catch (e: any) {
    console.error('Gagal memuat daftar guru', e)
  }
}

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    items.value = await $fetch('/api/kesehatan/sanitation') || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const month = new Date().toISOString().slice(0, 7)
  const bulanIni = items.value.filter((r: any) => r.date?.startsWith(month))
  const selesai = items.value.filter((r: any) => r.status === 'Selesai')
  const dalamProses = items.value.filter((r: any) => r.status === 'Dalam Proses')
  return [
    { label: 'Inspeksi Bulan Ini', icon: 'assignment_turned_in', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: bulanIni.length },
    { label: 'Lokasi Terjadwal', icon: 'location_on', bg: 'bg-blue-100', iconColor: 'text-blue-600', valueColor: 'text-blue-700', value: items.value.filter((r: any) => r.status === 'Terjadwal').length },
    { label: 'Selesai', icon: 'check_circle', bg: 'bg-green-100', iconColor: 'text-green-600', valueColor: 'text-green-700', value: selesai.length },
    { label: 'Dalam Proses', icon: 'sync', bg: 'bg-amber-100', iconColor: 'text-amber-600', valueColor: 'text-amber-700', value: dalamProses.length },
  ]
})

const filteredRecords = computed(() => {
  return items.value.filter(r => {
    const matchKegiatan = !filterKegiatan.value || r.kegiatan === filterKegiatan.value
    return matchKegiatan
  })
})

function kegiatanBadge(kegiatan: string) {
  switch (kegiatan) {
    case 'Fogging': return 'bg-purple-100 text-purple-700'
    case 'Kebersihan MCK': return 'bg-cyan-100 text-cyan-700'
    case 'Inspeksi Sanitasi': return 'bg-orange-100 text-orange-700'
    case 'Pengecekan Air': return 'bg-blue-100 text-blue-700'
    case 'Pembersihan Lingkungan': return 'bg-green-100 text-green-700'
    default: return 'bg-surface-container text-on-surface-variant'
  }
}

function openAddModal() {
  editingId.value = null
  form.date = new Date().toISOString().split('T')[0]
  form.location = ''
  form.kegiatan = 'Kebersihan MCK'
  form.officer = ''
  form.status = 'Terjadwal'
  showAddModal.value = true
}

async function saveItem() {
  try {
    if (editingId.value) {
      await $fetch(`/api/kesehatan/sanitation/${editingId.value}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/kesehatan/sanitation', { method: 'POST', body: { ...form } })
    }
    showAddModal.value = false; await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function deleteItem(id: string) {
  if (!confirm('Yakin ingin menghapus?')) return
  try {
    await $fetch(`/api/kesehatan/sanitation/${id}`, { method: 'DELETE' }); await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => { fetchData(); fetchTeachers() })
</script>
