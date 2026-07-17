<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Jurnalistik & Mading</h2>
      <p class="text-on-surface-variant text-body-md">Kelola tim media, publikasi, dan bulletin madrasah diniyah.</p>
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
            <label class="text-label-sm text-on-surface-variant">Divisi:</label>
            <select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" v-model="filterDivisi">
              <option value="">Semua</option>
              <option value="Jurnalistik">Jurnalistik</option>
              <option value="Mading">Mading</option>
              <option value="Fotografi">Fotografi</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-label-sm text-on-surface-variant">Cari:</label>
            <input class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary outline-none" placeholder="Nama tim..." v-model="searchQuery" />
          </div>
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Tim
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Tim</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Divisi</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Pembina</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Anggota</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Publikasi</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="t in filteredItems" :key="t.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-6 py-4 text-label-md font-medium text-on-surface">{{ t.nama }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 rounded text-label-sm font-bold', t.divisi === 'Jurnalistik' ? 'bg-blue-100 text-blue-700' : t.divisi === 'Mading' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700']">{{ t.divisi }}</span>
              </td>
              <td class="px-6 py-4 text-label-md">{{ t.pembina }}</td>
              <td class="px-6 py-4 text-label-md">{{ t.anggota }} santri</td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ t.publikasi }}</td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', t.status === 'Aktif' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant']">{{ t.status }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button class="text-on-surface-variant hover:text-primary transition-colors" @click="openEditItem(t)">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button class="text-on-surface-variant hover:text-error transition-colors" @click="deleteItem(t.id)">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Tidak ada tim ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-outline-variant/20 flex items-center justify-between">
        <span class="text-on-surface-variant text-label-md">Menampilkan {{ filteredItems.length }} dari {{ items.length }} tim</span>
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
              <h2 class="font-display text-headline-md">{{ editingId ? 'Edit Tim Media' : 'Tambah Tim Media' }}</h2>
              <p class="text-[11px] text-on-primary/80 uppercase tracking-widest">Ekstrakurikuler &bull; Jurnalistik & Mading</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="saveItem">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Tim</label>
              <input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" v-model="form.nama" required />
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Divisi</label>
                <select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" v-model="form.divisi">
                  <option value="Jurnalistik">Jurnalistik</option>
                  <option value="Mading">Mading</option>
                  <option value="Fotografi">Fotografi</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Pembina</label>
                <select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" v-model="form.pembina" required @change="form.guruId = (teachers.find(t => t.nama === form.pembina)?._id) || ''">
                  <option value="" disabled>Pilih Pembina</option>
                  <option v-for="t in teachers" :key="t._id" :value="t.nama">{{ t.nama }}</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Jumlah Anggota</label>
                <input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" type="number" v-model.number="form.anggota" required />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Jumlah Publikasi</label>
                <input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" type="number" v-model.number="form.publikasi" required />
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
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const loading = ref(true)
const error = ref('')
const items = ref<any[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)
const filterDivisi = ref('')
const searchQuery = ref('')

const students = ref<any[]>([])
const teachers = ref<any[]>([])
const { getIdToken } = useAuth()
async function fetchStudents() {
  try { const token = await getIdToken(); const res = await fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) students.value = await res.json() } catch(e) { console.error(e) }
}
async function fetchTeachers() {
  try { const token = await getIdToken(); const res = await fetch('/api/guru', { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) teachers.value = await res.json() } catch(e) { console.error(e) }
}

const form = reactive({ nama: '', divisi: 'Jurnalistik', pembina: '', anggota: 10, publikasi: 5, status: 'Aktif', guruId: '' })

function resetForm() {
  form.nama = ''
  form.divisi = 'Jurnalistik'
  form.pembina = ''
  form.guruId = ''
  form.anggota = 10
  form.publikasi = 5
  form.status = 'Aktif'
}

function openAddModal() {
  editingId.value = null
  resetForm()
  showModal.value = true
}

function openEditItem(item: any) {
  editingId.value = item._id || null
  form.nama = item.nama
  form.divisi = item.divisi
  form.pembina = item.pembina
  form.guruId = item.guruId || ''
  form.anggota = item.anggota
  form.publikasi = item.publikasi
  form.status = item.status
  showModal.value = true
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/extracurricular/media')
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
      await $fetch(`/api/extracurricular/media/${editingId.value}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/extracurricular/media', { method: 'POST', body: { ...form } })
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
    await $fetch(`/api/extracurricular/media/${id}`, { method: 'DELETE' })
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

const filteredItems = computed(() => items.value.filter(t => {
  if (filterDivisi.value && t.divisi !== filterDivisi.value) return false
  if (searchQuery.value && !t.nama.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
  return true
}))

const stats = computed(() => {
  const total = items.value.length
  const totalAnggota = items.value.reduce((sum, t) => sum + (Number(t.anggota) || 0), 0)
  const totalPublikasi = items.value.reduce((sum, t) => sum + (Number(t.publikasi) || 0), 0)
  const aktif = items.value.filter(t => t.status === 'Aktif').length
  return [
    { label: 'Total Tim', icon: 'groups', iconColor: 'text-primary', valueColor: 'text-primary', value: String(total), subtext: `${aktif} aktif` },
    { label: 'Total Anggota', icon: 'people', iconColor: 'text-secondary', valueColor: 'text-secondary', value: String(totalAnggota), subtext: 'Aktif semua' },
    { label: 'Total Publikasi', icon: 'article', iconColor: 'text-primary-container', valueColor: 'text-on-background', value: String(totalPublikasi), subtext: 'Buku & Mading' },
    { label: 'Edisi Mading', icon: 'newspaper', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: String(items.value.filter(t => t.divisi === 'Mading').length), subtext: 'Tim mading' },
  ]
})

onMounted(() => { fetchData(); fetchTeachers() })
</script>
