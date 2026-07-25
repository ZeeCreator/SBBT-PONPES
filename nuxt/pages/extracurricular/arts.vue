<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Qiroah & Kaligrafi</h2>
      <p class="text-on-surface-variant text-body-md">Kelola pelatihan qiroah dan kaligrafi untuk santri.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
      <div v-for="stat in stats" :key="stat.label" class="glass-card p-stack-md rounded-xl shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-on-surface-variant text-label-md">{{ stat.label }}</span>
          <span class="material-symbols-outlined" :class="stat.iconColor">{{ stat.icon }}</span>
        </div>
        <p class="font-display text-headline-md" :class="stat.valueColor">{{ stat.value }}</p>
        <p class="text-[11px] text-on-surface-variant mt-1">{{ stat.subtext }}</p>
      </div>
    </div>
    <div class="glass-card rounded-xl shadow-sm overflow-hidden">
      <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-label-sm text-on-surface-variant">Jenis:</label>
            <select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" v-model="filterJenis">
              <option value="">Semua</option>
              <option value="Qiroah">Qiroah</option>
              <option value="Kaligrafi">Kaligrafi</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-label-sm text-on-surface-variant">Level:</label>
            <select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" v-model="filterLevel">
              <option value="">Semua</option>
              <option value="Pemula">Pemula</option>
              <option value="Menengah">Menengah</option>
              <option value="Mahir">Mahir</option>
            </select>
          </div>
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Peserta
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Santri</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Jenis</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Level</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Pelatih</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Jadwal</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="p in filteredItems" :key="p.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(p.id)" @change="toggleOne(p.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
              <td class="px-6 py-4 text-label-md font-medium text-on-surface">{{ p.santri }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 rounded text-label-sm font-bold', p.jenis === 'Qiroah' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700']">{{ p.jenis }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', p.level === 'Mahir' ? 'bg-primary-fixed text-on-primary-fixed' : p.level === 'Menengah' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container text-on-surface-variant']">{{ p.level }}</span>
              </td>
              <td class="px-6 py-4 text-label-md">{{ p.pelatih }}</td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ p.jadwal }}</td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', p.status === 'Aktif' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant']">{{ p.status }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button class="text-on-surface-variant hover:text-primary transition-colors" @click="openEditItem(p)">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button class="text-on-surface-variant hover:text-error transition-colors" @click="deleteItem(p.id)">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="99"  class="px-6 py-12 text-center text-on-surface-variant text-label-md">Tidak ada peserta ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-outline-variant/20 flex items-center justify-between">
        <span class="text-on-surface-variant text-label-md">Menampilkan {{ filteredItems.length }} dari {{ items.length }} peserta</span>
        <div class="flex gap-2">
          <button class="p-2 border border-outline-variant/30 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"><span class="material-symbols-outlined">chevron_left</span></button>
          <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md">1</button>
          <button class="p-2 border border-outline-variant/30 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"><span class="material-symbols-outlined">chevron_right</span></button>
        </div>
      </div>
    </div>
    <div v-if="loading" class="flex justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
    </div>
    <div v-if="error" class="mt-4 p-4 bg-error-container text-on-error-container rounded-lg text-label-md">{{ error }}</div>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter">
          <div class="bg-primary px-gutter py-stack-md flex justify-between items-center">
            <div class="text-on-primary">
              <h2 class="font-display text-headline-md">{{ editingId ? 'Edit Peserta' : 'Tambah Peserta' }}</h2>
              <p class="text-[11px] text-on-primary/80 uppercase tracking-widest">Ekstrakurikuler &bull; Qiroah & Kaligrafi</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="saveItem">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Santri</label>
              <select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" v-model="form.santri" required @change="form.studentId = (students.find(s => s.nama === form.santri)?._id) || ''">
                <option value="" disabled>Pilih Santri</option>
                <option v-for="s in students" :key="s._id" :value="s.nama">{{ s.nama }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Jenis</label>
                <select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" v-model="form.jenis">
                  <option value="Qiroah">Qiroah</option>
                  <option value="Kaligrafi">Kaligrafi</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Level</label>
                <select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" v-model="form.level">
                  <option value="Pemula">Pemula</option>
                  <option value="Menengah">Menengah</option>
                  <option value="Mahir">Mahir</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Pelatih</label>
                <select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" v-model="form.pelatih" required @change="form.guruId = (teachers.find(t => t.nama === form.pelatih)?._id) || ''">
                  <option value="" disabled>Pilih Pelatih</option>
                  <option v-for="t in teachers" :key="t._id" :value="t.nama">{{ t.nama }}</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Jadwal</label>
                <input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" v-model="form.jadwal" required />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Status</label>
              <select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" v-model="form.status">
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
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
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(filteredItems)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const loading = ref(true)
const error = ref('')
const items = ref<any[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)
const filterJenis = ref('')
const filterLevel = ref('')

const students = ref<any[]>([])
const teachers = ref<any[]>([])
const { getIdToken } = useAuth()
async function fetchStudents() {
  try { const token = await getIdToken(); const res = await fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) students.value = await res.json() } catch(e) { console.error(e) }
}
async function fetchTeachers() {
  try { const token = await getIdToken(); const res = await fetch('/api/guru', { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) teachers.value = await res.json() } catch(e) { console.error(e) }
}

const form = reactive({ santri: '', jenis: 'Qiroah', level: 'Pemula', pelatih: '', jadwal: '', status: 'Aktif', studentId: '', guruId: '' })

function resetForm() {
  form.santri = ''
  form.studentId = ''
  form.jenis = 'Qiroah'
  form.level = 'Pemula'
  form.pelatih = ''
  form.guruId = ''
  form.jadwal = ''
  form.status = 'Aktif'
}

function openAddModal() {
  editingId.value = null
  resetForm()
  showModal.value = true
}

function openEditItem(item: any) {
  editingId.value = item._id || null
  form.santri = item.santri
  form.studentId = item.studentId || ''
  form.jenis = item.jenis
  form.level = item.level
  form.pelatih = item.pelatih
  form.guruId = item.guruId || ''
  form.jadwal = item.jadwal
  form.status = item.status
  showModal.value = true
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/extracurricular/arts')
    items.value = data || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

async function saveItem() {
  try {
    if (editingId.value) {
      await $fetch(`/api/extracurricular/arts/${editingId.value}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/extracurricular/arts', { method: 'POST', body: { ...form } })
    }
    showModal.value = false
    resetForm()
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function deleteItem(id: string) {
  if (!id) return
  if (!confirm('Yakin ingin menghapus?')) return
  try {
    await $fetch(`/api/extracurricular/arts/${id}`, { method: 'DELETE' })
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

const filteredItems = computed(() => items.value.filter(p => {
  if (filterJenis.value && p.jenis !== filterJenis.value) return false
  if (filterLevel.value && p.level !== filterLevel.value) return false
  return true
}))

const stats = computed(() => {
  const total = items.value.length
  const qiroah = items.value.filter(p => p.jenis === 'Qiroah').length
  const kaligrafi = items.value.filter(p => p.jenis === 'Kaligrafi').length
  const pelatihSet = new Set(items.value.map(p => p.pelatih))
  return [
    { label: 'Total Peserta', icon: 'music_note', iconColor: 'text-primary', valueColor: 'text-primary', value: String(total), subtext: 'Qiroah & Kaligrafi' },
    { label: 'Qiroah', icon: 'mic', iconColor: 'text-secondary', valueColor: 'text-secondary', value: String(qiroah), subtext: 'Santri aktif' },
    { label: 'Kaligrafi', icon: 'brush', iconColor: 'text-primary-container', valueColor: 'text-on-background', value: String(kaligrafi), subtext: 'Santri aktif' },
    { label: 'Pelatih', icon: 'coach', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: String(pelatihSet.size), subtext: 'Bersertifikat' },
  ]
})

onMounted(() => { fetchData(); fetchStudents(); fetchTeachers() })
</script>
