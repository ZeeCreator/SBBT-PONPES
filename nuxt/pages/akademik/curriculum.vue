<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Academic Curriculum Management</h2>
      <p class="text-on-surface-variant text-body-md">Manage curriculum structure, subjects, and class schedules.</p>
    </div>
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
          <div class="flex items-center gap-2">
            <label class="text-label-sm text-on-surface-variant">Department:</label>
            <select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
              <option>All Departments</option>
              <option>Diniyah</option>
              <option>Tahfidz</option>
              <option>Umum</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-label-sm text-on-surface-variant">Grade:</label>
            <select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
              <option>All Levels</option>
              <option>Grade 10</option>
              <option>Grade 11</option>
              <option>Grade 12</option>
            </select>
          </div>
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Add Subject
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Subject Code</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Subject Name</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Department</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Hours/Week</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Teacher</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-if="loading">
              <td colspan="99"  class="px-6 py-8 text-center text-on-surface-variant text-label-md">Memuat data...</td>
            </tr>
            <tr v-else-if="error">
              <td colspan="99"  class="px-6 py-8 text-center text-red-500 text-label-md">{{ error }}</td>
            </tr>
            <tr v-for="subject in subjects" :key="subject.id || subject.code" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(subject.id)" @change="toggleOne(subject.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
              <td class="px-6 py-4 text-label-sm font-mono text-on-surface-variant">{{ subject.code }}</td>
              <td class="px-6 py-4 text-label-md text-on-surface font-medium">{{ subject.name }}</td>
              <td class="px-6 py-4"><span class="bg-surface-container-low px-2 py-1 rounded text-label-sm text-on-surface-variant">{{ subject.dept }}</span></td>
              <td class="px-6 py-4 text-label-md">{{ subject.hours }}</td>
              <td class="px-6 py-4 text-label-md">{{ subject.teacher }}</td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', subject.active ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant']">
                  {{ subject.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit" @click="openEditModal(subject)">
                    <span class="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus" @click="confirmDelete(subject)">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && subjects.length === 0">
              <td colspan="99"  class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data mata pelajaran. Klik "Add Subject" untuk menambahkan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter">
          <div class="px-gutter py-stack-md border-b border-outline-variant/20 flex justify-between items-center">
            <h3 class="font-display text-title-lg text-primary">{{ isEditing ? 'Edit Subject' : 'Tambah Subject' }}</h3>
            <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-gutter space-y-stack-md">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Kode Mata Pelajaran</label>
              <input v-model="form.code" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Contoh: QUR-101" />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Mata Pelajaran</label>
              <input v-model="form.name" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Nama mata pelajaran" />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Departemen</label>
              <select v-model="form.dept" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="">Pilih Departemen</option>
                <option value="Diniyah">Diniyah</option>
                <option value="Tahfidz">Tahfidz</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Jam/Minggu</label>
              <input v-model="form.hours" type="number" min="1" max="40" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Pengajar</label>
              <select v-model="form.teacher" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="">-- Pilih Pengajar --</option>
                <option v-for="t in teachers" :key="t.id" :value="t.name">{{ t.name }}</option>
              </select>
            </div>
            <div class="flex items-center gap-3">
              <label class="text-label-md text-on-surface-variant">Status Aktif</label>
              <button @click="form.active = !form.active" :class="['w-10 h-5 rounded-full transition-colors relative', form.active ? 'bg-primary' : 'bg-surface-container-highest']">
                <span :class="['absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form.active ? 'translate-x-5' : 'translate-x-0.5']"></span>
              </button>
            </div>
          </div>
          <div class="px-gutter py-stack-md border-t border-outline-variant/20 flex justify-end gap-stack-sm">
            <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="closeModal">Batal</button>
            <button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" @click="saveItem">Simpan</button>
          </div>
        </div>
      </div>

      <div v-if="showDeleteModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showDeleteModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter p-6 text-center">
          <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
          </div>
          <h3 class="font-display text-title-lg mb-2">Hapus Subject</h3>
          <p class="text-label-md text-on-surface-variant mb-1">Apakah Anda yakin ingin menghapus subject berikut?</p>
          <p class="font-bold text-body-md">{{ deleteTarget?.name }}</p>
          <div class="flex gap-3 mt-6">
            <button class="flex-1 py-2.5 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-high transition-all" @click="showDeleteModal = false">Batal</button>
            <button class="flex-1 py-2.5 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="doDelete">Hapus</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => subjects)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const teachers = ref<any[]>([])
const { getIdToken } = useAuth()

const subjects = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const showDeleteModal = ref(false)
const deleteTarget = ref<any>(null)

const form = reactive({
  id: '',
  code: '',
  name: '',
  dept: '',
  hours: 0,
  teacher: '',
  guruId: null as number | null,
  active: true,
})

watch(() => form.teacher, (val) => {
  const found = teachers.value.find(t => t.name === val)
  form.guruId = found ? found.id : null
})

const stats = computed(() => {
  const total = subjects.value.length
  const depts = new Set(subjects.value.map(s => s.dept)).size
  const teachers = new Set(subjects.value.map(s => s.teacher)).size
  const totalHours = subjects.value.reduce((sum, s) => sum + (Number(s.hours) || 0), 0)
  return [
    { label: 'Total Subjects', icon: 'menu_book', iconColor: 'text-primary', valueColor: 'text-primary', value: String(total) },
    { label: 'Active Teachers', icon: 'school', iconColor: 'text-secondary', valueColor: 'text-secondary', value: String(teachers) },
    { label: 'Class Hours/Week', icon: 'schedule', iconColor: 'text-primary-container', valueColor: 'text-on-background', value: String(totalHours) },
    { label: 'Departments', icon: 'account_tree', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: String(depts) },
  ]
})

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/akademik/subjects')
    subjects.value = data || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

async function fetchTeachers() {
  try {
    const token = await getIdToken()
    const res = await fetch('/api/guru', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) teachers.value = await res.json()
  } catch (e) { console.error(e) }
}

function openAddModal() {
  isEditing.value = false
  Object.assign(form, { id: '', code: '', name: '', dept: '', hours: 0, teacher: '', guruId: null, active: true })
  showModal.value = true
}

function openEditModal(item: any) {
  isEditing.value = true
  Object.assign(form, { ...item })
  showModal.value = true
}

async function saveItem() {
  if (!form.code || !form.name || !form.dept || !form.teacher) return
  try {
    if (isEditing.value) {
      await $fetch(`/api/akademik/subjects/${form.id}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/akademik/subjects', { method: 'POST', body: { ...form } })
    }
    showModal.value = false
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

function confirmDelete(item: any) {
  deleteTarget.value = item
  showDeleteModal.value = true
}

async function doDelete() {
  if (!deleteTarget.value) return
  try {
    await $fetch(`/api/akademik/subjects/${deleteTarget.value.id}`, { method: 'DELETE' })
    showDeleteModal.value = false
    deleteTarget.value = null
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

function closeModal() {
  showModal.value = false
}

onMounted(() => {
  fetchData()
  fetchTeachers()
})
</script>
