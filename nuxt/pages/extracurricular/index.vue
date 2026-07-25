<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Ekstrakurikuler</h2>
      <p class="text-on-surface-variant text-body-md">Kelola kegiatan ekstrakurikuler, pembina, dan anggota.</p>
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
      <div class="glass-card rounded-xl shadow-sm overflow-hidden mb-stack-lg p-4">
        <div class="flex items-center gap-4">
          <span class="material-symbols-outlined text-primary">add_circle</span>
          <input v-model="newJenis" class="flex-1 bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary" placeholder="Tambah jenis ekstrakurikuler baru..." @keyup.enter="addJenis" />
          <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110" @click="addJenis">Tambah Jenis</button>
          <button class="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher" @click="resetJenis">Reset</button>
        </div>
        <div v-if="jenisList.length > 0" class="flex flex-wrap gap-2 mt-3">
          <span v-for="j in jenisList" :key="j" class="inline-flex items-center gap-1 bg-primary-fixed/20 text-primary px-3 py-1 rounded-full text-label-sm">
            {{ j }}
            <button class="hover:text-red-500" @click="hapusJenis(j)">&times;</button>
          </span>
        </div>
      </div>
    </div>
    <div class="glass-card rounded-xl shadow-sm overflow-hidden">
      <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-label-sm text-on-surface-variant">Jenis:</label>
            <select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" v-model="filterJenis">
              <option value="">Semua</option>
              <option v-for="j in jenisList" :key="j" :value="j">{{ j }}</option>
            </select>
          </div>
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Kegiatan
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Kegiatan</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Jenis</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Pembina</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Anggota</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Jadwal</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="k in filteredItems" :key="k.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(k.id)" @change="toggleOne(k.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
              <td class="px-6 py-4 text-label-md font-medium text-on-surface">{{ k.nama }}</td>
              <td class="px-6 py-4">
                <span class="bg-surface-container-low px-2 py-1 rounded text-label-sm text-on-surface-variant">{{ k.jenis }}</span>
              </td>
              <td class="px-6 py-4 text-label-md">{{ k.pembina }}</td>
              <td class="px-6 py-4 text-label-md">{{ k.anggota }} santri</td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ k.jadwal }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button class="text-on-surface-variant hover:text-primary transition-colors" @click="openEditItem(k)">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button class="text-on-surface-variant hover:text-error transition-colors" @click="deleteItem(k.id)">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="99"  class="px-6 py-12 text-center text-on-surface-variant text-label-md">Tidak ada kegiatan ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-outline-variant/20 flex items-center justify-between">
        <span class="text-on-surface-variant text-label-md">Menampilkan {{ filteredItems.length }} dari {{ items.length }} kegiatan</span>
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
              <h2 class="font-display text-headline-md">{{ editingId ? 'Edit Kegiatan' : 'Tambah Kegiatan' }}</h2>
              <p class="text-[11px] text-on-primary/80 uppercase tracking-widest">Ekstrakurikuler</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="saveItem">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Kegiatan</label>
              <input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" v-model="form.nama" required />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Jenis Ekstrakurikuler</label>
              <div class="flex gap-2">
                <input class="flex-1 bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" v-model="form.jenis" list="jenis-datalist" required placeholder="Ketik atau pilih jenis..." />
                <datalist id="jenis-datalist">
                  <option v-for="j in jenisList" :key="j" :value="j" />
                </datalist>
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Pembina</label>
              <select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" v-model="form.pembina" required @change="form.guruId = (teachers.find(t => t.nama === form.pembina)?._id) || ''">
                <option value="" disabled>Pilih Pembina</option>
                <option v-for="t in teachers" :key="t._id" :value="t.nama">{{ t.nama }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Jumlah Anggota</label>
                <input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" type="number" v-model.number="form.anggota" required />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Jadwal</label>
                <input class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary outline-none p-3" v-model="form.jadwal" required />
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
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredItems)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const loading = ref(true)
const error = ref('')
const items = ref<any[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)
const filterJenis = ref('')
const newJenis = ref('')
const jenisList = ref<string[]>(['Pramuka', 'Pencak Silat', 'Hadroh', 'Seni', 'Media', 'Public Speaking'])

const students = ref<any[]>([])
const teachers = ref<any[]>([])
const { getIdToken } = useAuth()
async function fetchStudents() {
  try { const token = await getIdToken(); const res = await fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) students.value = await res.json() } catch(e) { console.error(e) }
}
async function fetchTeachers() {
  try { const token = await getIdToken(); const res = await fetch('/api/guru', { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) teachers.value = await res.json() } catch(e) { console.error(e) }
}

const form = reactive({ nama: '', jenis: '', pembina: '', anggota: 20, jadwal: '', guruId: '' })

function addJenis() {
  const j = newJenis.value.trim()
  if (j && !jenisList.value.includes(j)) {
    jenisList.value.push(j)
    newJenis.value = ''
  }
}

function hapusJenis(jenis: string) {
  jenisList.value = jenisList.value.filter(j => j !== jenis)
}

function resetJenis() {
  jenisList.value = ['Pramuka', 'Pencak Silat', 'Hadroh', 'Seni', 'Media', 'Public Speaking']
}

function resetForm() {
  form.nama = ''
  form.jenis = ''
  form.pembina = ''
  form.guruId = ''
  form.anggota = 20
  form.jadwal = ''
}

function openAddModal() {
  editingId.value = null
  resetForm()
  showModal.value = true
}

function openEditItem(item: any) {
  editingId.value = item.id || null
  form.nama = item.nama
  form.jenis = item.jenis
  form.pembina = item.pembina
  form.guruId = item.guruId || ''
  form.anggota = item.anggota
  form.jadwal = item.jadwal
  showModal.value = true
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/extracurricular/extracurricular')
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
      await $fetch(`/api/extracurricular/extracurricular/${editingId.value}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/extracurricular/extracurricular', { method: 'POST', body: { ...form } })
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
    await $fetch(`/api/extracurricular/extracurricular/${id}`, { method: 'DELETE' })
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

const filteredItems = computed(() => items.value.filter(k => {
  if (filterJenis.value && k.jenis !== filterJenis.value) return false
  return true
}))

const stats = computed(() => {
  const total = items.value.length
  const totalAnggota = items.value.reduce((sum, k) => sum + (Number(k.anggota) || 0), 0)
  const pembinaSet = new Set(items.value.map(k => k.pembina))
  const jenisCount = new Set(items.value.map(k => k.jenis)).size
  return [
    { label: 'Total Kegiatan', icon: 'fitness_center', iconColor: 'text-primary', valueColor: 'text-primary', value: String(total), subtext: `${jenisCount} jenis ekstrakurikuler` },
    { label: 'Total Anggota', icon: 'people', iconColor: 'text-secondary', valueColor: 'text-secondary', value: String(totalAnggota), subtext: 'Seluruh kegiatan' },
    { label: 'Pembina Aktif', icon: 'school', iconColor: 'text-primary-container', valueColor: 'text-on-background', value: String(pembinaSet.size), subtext: 'Terdaftar' },
    { label: 'Jenis Ekstra', icon: 'category', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: String(jenisCount), subtext: 'Bisa ditambah sendiri' },
  ]
})

onMounted(() => { fetchData(); fetchTeachers() })
</script>
