<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="flex items-center justify-between mb-stack-lg">
      <div>
        <h2 class="font-display text-headline-lg text-primary">Manajemen Guru / Ustadz</h2>
        <p class="text-on-surface-variant text-body-md">Kelola data pengajar dan tenaga pendidik</p>
      </div>
      <button class="bg-primary-container text-on-primary px-6 py-2.5 rounded-xl text-label-md hover:bg-primary transition-all flex items-center gap-2 shadow-md" @click="openAddModal">
        <span class="material-symbols-outlined text-sm">person_add</span> Tambah Guru
      </button>
    </div>

    <div class="glass-card rounded-xl shadow-sm overflow-hidden">
      <div class="p-4 border-b border-outline-variant/20 flex flex-wrap gap-3 items-center">
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input v-model="searchQuery" type="text" placeholder="Cari nama atau email..." class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-sm py-2 pl-9 pr-3 focus:ring-primary outline-none" />
        </div>
        <select v-model="filterSpecialization" class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-sm py-2 px-3 focus:ring-primary">
          <option value="">Semua Spesialisasi</option>
          <option value="Tahfidz">Tahfidz</option>
          <option value="Kitab Kuning">Kitab Kuning</option>
          <option value="Umum">Umum</option>
          <option value="Bahasa Arab">Bahasa Arab</option>
          <option value="Mahir">Mahir</option>
        </select>
        <select v-model="filterStatus" class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-sm py-2 px-3 focus:ring-primary">
          <option value="">Semua Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="resigned">Resigned</option>
        </select>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Email</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Spesialisasi</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Mapel</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="teacher in filteredTeachers" :key="teacher.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-label-sm font-bold">
                    {{ teacher.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-label-md font-medium">{{ teacher.name }}</p>
                    <p v-if="teacher.nuptk" class="text-[10px] text-on-surface-variant">NUPTK: {{ teacher.nuptk }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ teacher.email }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 text-[10px] font-bold rounded-full" :class="specializationClass(teacher.specialization)">{{ teacher.specialization }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1">
                  <span v-for="subj in (teacher.subjects || []).slice(0, 2)" :key="subj" class="px-2 py-0.5 bg-surface-container-high text-on-surface rounded text-[9px]">
                    {{ subj }}
                  </span>
                  <span v-if="(teacher.subjects || []).length > 2" class="text-[9px] text-on-surface-variant">+{{ teacher.subjects.length - 2 }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="flex items-center gap-1 text-label-sm" :class="teacher.status === 'active' ? 'text-green-600' : teacher.status === 'resigned' ? 'text-error' : 'text-on-surface-variant'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="teacher.status === 'active' ? 'bg-green-500' : teacher.status === 'resigned' ? 'bg-error' : 'bg-outline'"></span>
                  {{ teacher.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button class="text-primary text-label-sm hover:underline" @click="openEditModal(teacher)">Edit</button>
                  <button class="text-error text-label-sm hover:underline" @click="confirmDelete(teacher)">Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="loading" class="text-center py-8 text-on-surface-variant text-label-sm">Loading...</p>
        <p v-if="!loading && filteredTeachers.length === 0" class="text-center py-8 text-on-surface-variant text-label-sm">Tidak ada data guru</p>
      </div>
    </div>

    <!-- Modal Add/Edit Teacher -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showModal = false">
        <div class="bg-surface rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-display text-title-lg text-primary">{{ editingId ? 'Edit Guru' : 'Tambah Guru Baru' }}</h3>
            <button class="text-on-surface-variant hover:text-on-surface" @click="showModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form @submit.prevent="saveTeacher" class="space-y-4">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Lengkap</label>
              <input v-model="form.name" type="text" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Email</label>
              <input v-model="form.email" type="email" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">No. Telepon</label>
                <input v-model="form.phone" type="text" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">NUPTK <span class="text-xs text-on-surface-variant">(otomatis)</span></label>
                <input v-model="form.nuptk" type="text" disabled class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md outline-none opacity-60 cursor-not-allowed" :placeholder="editingId ? 'Nomor induk' : 'Akan digenerate otomatis'" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Spesialisasi</label>
              <select v-model="form.specialization" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none">
                <option value="Tahfidz">Tahfidz</option>
                <option value="Kitab Kuning">Kitab Kuning</option>
                <option value="Umum">Umum</option>
                <option value="Bahasa Arab">Bahasa Arab</option>
                <option value="Mahir">Mahir</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Mata Pelajaran (pisahkan dengan koma)</label>
              <input v-model="subjectsInput" type="text" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="Tahfidz, Nahwu, Shorof" />
            </div>
            <div v-if="editingId" class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Status</label>
              <select v-model="form.status" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="resigned">Resigned</option>
              </select>
            </div>
            <button type="submit" :disabled="saving" class="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-body-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              <span v-if="saving" class="material-symbols-outlined animate-spin text-sm">refresh</span>
              {{ saving ? 'Menyimpan...' : editingId ? 'Update Guru' : 'Tambah Guru' }}
            </button>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <div v-if="showDelete" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showDelete = false">
        <div class="bg-surface rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
          <div class="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-error text-3xl">delete</span>
          </div>
          <h3 class="font-display text-title-lg text-primary mb-2">Hapus Guru?</h3>
          <p class="text-label-md text-on-surface-variant mb-6">Yakin ingin menghapus <strong>{{ deleteTarget?.name }}</strong>? Tindakan ini tidak bisa dibatalkan.</p>
          <p v-if="deleteError" class="text-label-sm text-error mb-4">{{ deleteError }}</p>
          <div class="flex gap-3">
            <button class="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl text-label-md" @click="showDelete = false">Batal</button>
            <button class="flex-1 bg-error text-on-error py-3 rounded-xl text-label-md font-bold hover:brightness-110 transition-all" @click="doDelete">Hapus</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const teachers = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const showDelete = ref(false)
const editingId = ref('')
const deleteTarget = ref<any>(null)
const deleteError = ref('')
const searchQuery = ref('')
const filterSpecialization = ref('')
const filterStatus = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  specialization: 'Umum',
  subjects: [] as string[],
  nuptk: '',
  status: 'active',
})
const subjectsInput = ref('')

const filteredTeachers = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return teachers.value.filter((t) => {
    if (filterSpecialization.value && t.specialization !== filterSpecialization.value) return false
    if (filterStatus.value && t.status !== filterStatus.value) return false
    if (q && !t.name.toLowerCase().includes(q) && !t.email.toLowerCase().includes(q) && !(t.nuptk || '').toLowerCase().includes(q)) return false
    return true
  })
})

function specializationClass(spec: string) {
  const map: Record<string, string> = {
    Tahfidz: 'bg-green-100 text-green-700',
    'Kitab Kuning': 'bg-amber-100 text-amber-700',
    Umum: 'bg-blue-100 text-blue-700',
    'Bahasa Arab': 'bg-purple-100 text-purple-700',
    Mahir: 'bg-error-container text-error',
  }
  return map[spec] || 'bg-surface-container text-on-surface'
}

async function fetchTeachers() {
  loading.value = true
  try {
    const { getIdToken } = useAuth()
    const token = await getIdToken()
    const res = await fetch('/api/guru', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) teachers.value = await res.json()
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  editingId.value = ''
  form.name = ''
  form.email = ''
  form.phone = ''
  form.specialization = 'Umum'
  form.nuptk = ''
  form.status = 'active'
  subjectsInput.value = ''
  showModal.value = true
}

function openEditModal(teacher: any) {
  editingId.value = teacher.id
  form.name = teacher.name
  form.email = teacher.email
  form.phone = teacher.phone || ''
  form.specialization = teacher.specialization
  form.nuptk = teacher.nuptk || ''
  form.status = teacher.status || 'active'
  subjectsInput.value = (teacher.subjects || []).join(', ')
  showModal.value = true
}

async function saveTeacher() {
  saving.value = true
  try {
    const { getIdToken } = useAuth()
    const token = await getIdToken()
    form.subjects = subjectsInput.value.split(',').map((s: string) => s.trim()).filter(Boolean)

    const url = editingId.value
      ? `/api/guru/${editingId.value}`
      : '/api/guru'
    const method = editingId.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      showModal.value = false
      await fetchTeachers()
    }
  } finally {
    saving.value = false
  }
}

function confirmDelete(teacher: any) {
  deleteTarget.value = teacher
  deleteError.value = ''
  showDelete.value = true
}

async function doDelete() {
  if (!deleteTarget.value) return
  try {
    const { getIdToken } = useAuth()
    const token = await getIdToken()
    const res = await fetch(`/api/guru/${deleteTarget.value.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      showDelete.value = false
      deleteTarget.value = null
      await fetchTeachers()
    }
  } catch (e: any) {
    deleteError.value = e.message || 'Gagal menghapus'
  }
}

fetchTeachers()
</script>
