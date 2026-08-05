<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Pidato & Muhadhoroh</h2>
      <p class="text-on-surface-variant text-body-md">Kelola latihan pidato 3 bahasa (Arab, Inggris, Indonesia) dan muhadhoroh.</p>
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
            <label class="text-label-sm text-on-surface-variant">Bahasa:</label>
            <select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" v-model="filterBahasa">
              <option value="">Semua</option>
              <option value="Arab">Arab</option>
              <option value="Inggris">Inggris</option>
              <option value="Indonesia">Indonesia</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-label-sm text-on-surface-variant">Status:</label>
            <select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" v-model="filterStatus">
              <option value="">Semua</option>
              <option value="Lulus">Lulus</option>
              <option value="Dalam Latihan">Dalam Latihan</option>
              <option value="Belum">Belum</option>
            </select>
          </div>
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Latihan
        </button>
      </div>
      <BulkActionBar :selected-count="selectedCount" @clear="clearSelection">
        <template #actions>
          <button class="flex items-center gap-1 px-3 py-1.5 bg-error text-on-error rounded-lg text-label-sm hover:brightness-110 transition-all" @click="bulkDelete">
            <span class="material-symbols-outlined text-sm">delete</span> Hapus
          </button>
        </template>
      </BulkActionBar>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Santri</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Bahasa</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nilai</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Mentor</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="s in filteredItems" :key="s.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(s.id)" @change="toggleOne(s.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
              <td class="px-6 py-4 text-label-md font-medium text-on-surface">{{ s.santri }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 rounded text-label-sm font-bold', s.bahasa === 'Arab' ? 'bg-green-100 text-green-700' : s.bahasa === 'Inggris' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700']">{{ s.bahasa }}</span>
              </td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ s.tanggal }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-1.5 w-16 bg-surface-container-highest rounded-full overflow-hidden">
                    <div class="h-full rounded-full bg-primary-container" :style="{ width: s.nilai + '%' }"></div>
                  </div>
                  <span class="text-label-sm font-bold" :class="s.nilai >= 85 ? 'text-primary' : s.nilai >= 70 ? 'text-secondary' : 'text-error'">{{ s.nilai }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-label-md">{{ s.mentor }}</td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', s.status === 'Lulus' ? 'bg-primary-fixed text-on-primary-fixed' : s.status === 'Dalam Latihan' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container text-on-surface-variant']">{{ s.status }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button class="text-on-surface-variant hover:text-primary transition-colors" @click="openEditItem(s)">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button class="text-on-surface-variant hover:text-error transition-colors" @click="deleteItem(s.id)">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="99"  class="px-6 py-12 text-center text-on-surface-variant text-label-md">Tidak ada sesi ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-outline-variant/20 flex items-center justify-between">
        <span class="text-on-surface-variant text-label-md">Menampilkan {{ filteredItems.length }} dari {{ items.length }} sesi</span>
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
              <h2 class="font-display text-headline-md">{{ editingId ? 'Edit Sesi Latihan' : 'Tambah Sesi Latihan' }}</h2>
              <p class="text-[11px] text-on-primary/80 uppercase tracking-widest">Ekstrakurikuler &bull; Pidato & Muhadhoroh</p>
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
                <label class="text-label-md text-on-surface-variant">Bahasa</label>
                <select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" v-model="form.bahasa">
                  <option value="Arab">Arab</option>
                  <option value="Inggris">Inggris</option>
                  <option value="Indonesia">Indonesia</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Tanggal</label>
                <input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" type="date" v-model="form.tanggal" required />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Nilai (0-100)</label>
                <input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" type="number" min="0" max="100" v-model.number="form.nilai" required />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Mentor</label>
                <select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" v-model="form.mentor" required @change="form.guruId = (teachers.find(t => t.nama === form.mentor)?._id) || ''">
                  <option value="" disabled>Pilih Mentor</option>
                  <option v-for="t in teachers" :key="t._id" :value="t.nama">{{ t.nama }}</option>
                </select>
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Status</label>
              <select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" v-model="form.status">
                <option value="Lulus">Lulus</option>
                <option value="Dalam Latihan">Dalam Latihan</option>
                <option value="Belum">Belum</option>
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
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredItems)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const loading = ref(true)
const error = ref('')
const items = ref<any[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)
const filterBahasa = ref('')
const filterStatus = ref('')

const students = ref<any[]>([])
const teachers = ref<any[]>([])
const { getIdToken } = useAuth()
async function fetchStudents() {
  try { const token = await getIdToken(); const res = await fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) students.value = await res.json() } catch(e) { console.error(e) }
}
async function fetchTeachers() {
  try { const token = await getIdToken(); const res = await fetch('/api/guru', { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) teachers.value = await res.json() } catch(e) { console.error(e) }
}

const form = reactive({ santri: '', bahasa: 'Arab', tanggal: '', nilai: 75, mentor: '', status: 'Dalam Latihan', studentId: '', guruId: '' })

function resetForm() {
  form.santri = ''
  form.studentId = ''
  form.bahasa = 'Arab'
  form.tanggal = ''
  form.nilai = 75
  form.mentor = ''
  form.guruId = ''
  form.status = 'Dalam Latihan'
}

function openAddModal() {
  editingId.value = null
  resetForm()
  showModal.value = true
}

function openEditItem(item: any) {
  editingId.value = item.id || null
  form.santri = item.santri
  form.studentId = item.studentId || ''
  form.bahasa = item.bahasa
  form.tanggal = item.tanggal
  form.nilai = item.nilai
  form.mentor = item.mentor
  form.guruId = item.guruId || ''
  form.status = item.status
  showModal.value = true
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/extracurricular/public-speaking')
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
      await $fetch(`/api/extracurricular/public-speaking/${editingId.value}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/extracurricular/public-speaking', { method: 'POST', body: { ...form } })
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
    await $fetch(`/api/extracurricular/public-speaking/${id}`, { method: 'DELETE' })
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

const filteredItems = computed(() => items.value.filter(s => {
  if (filterBahasa.value && s.bahasa !== filterBahasa.value) return false
  if (filterStatus.value && s.status !== filterStatus.value) return false
  return true
}))

const stats = computed(() => {
  const total = items.value.length
  const lulus = items.value.filter(s => s.status === 'Lulus').length
  const rataNilai = total ? Math.round(items.value.reduce((sum, s) => sum + (Number(s.nilai) || 0), 0) / total) : 0
  const mentorSet = new Set(items.value.map(s => s.mentor))
  return [
    { label: 'Total Peserta', icon: 'record_voice_over', iconColor: 'text-primary', valueColor: 'text-primary', value: String(total), subtext: `${lulus} lulus` },
    { label: 'Sesi Bulan Ini', icon: 'event', iconColor: 'text-secondary', valueColor: 'text-secondary', value: String(total), subtext: 'Total sesi' },
    { label: 'Rata-rata Nilai', icon: 'trending_up', iconColor: 'text-primary-container', valueColor: 'text-on-background', value: String(rataNilai), subtext: '3 bahasa' },
    { label: 'Mentor', icon: 'coach', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: String(mentorSet.size), subtext: 'Pembimbing' },
  ]
})

async function bulkDelete() {
  if (!confirm(`Yakin ingin menghapus ${selectedCount} data?`)) return
  try {
    await Promise.all(selected.value.map(id => $fetch(`/api/extracurricular/public-speaking/${id}`, { method: 'DELETE' })))
    clearSelection()
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => { fetchData(); fetchStudents(); fetchTeachers() })
</script>
