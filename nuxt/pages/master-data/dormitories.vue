<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Manajemen Gedung & Kamar</h2>
      <p class="text-on-surface-variant text-body-md">Kelola data gedung, kamar, dan pembina asrama.</p>
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
        <h3 class="font-display text-title-lg text-primary">Daftar Gedung</h3>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Gedung
        </button>
      </div>
      <div v-if="loading" class="p-8 text-center text-on-surface-variant text-label-md">Memuat data...</div>
      <div v-else-if="error" class="p-8 text-center text-red-500 text-label-md">{{ error }}</div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Gedung</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Gender</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Pembina</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Jumlah Kamar</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="item in items" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-6 py-4 text-label-md text-on-surface font-medium">{{ item.name }}</td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', item.gender === 'Putra' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700']">
                  {{ item.gender }}
                </span>
              </td>
              <td class="px-6 py-4 text-label-md">{{ item.supervisor }}</td>
              <td class="px-6 py-4">
                <button class="text-label-sm text-primary hover:underline font-semibold flex items-center gap-1" @click="openRoomManager(item)">
                  <span class="material-symbols-outlined text-sm">meeting_room</span>
                  {{ (item.rooms || []).length }} Kamar
                </button>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit" @click="openEditModal(item)">
                    <span class="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus" @click="confirmDelete(item)">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data gedung. Klik "Tambah Gedung" untuk menambahkan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter">
          <div class="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <h3 class="font-display text-title-lg text-primary">{{ isEditing ? 'Edit Gedung' : 'Tambah Gedung' }}</h3>
            <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Nama Gedung</label>
              <input v-model="form.name" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Contoh: Al-Ghazali" />
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Gender</label>
              <select v-model="form.gender" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                <option value="">Pilih Gender</option>
                <option value="Putra">Putra</option>
                <option value="Putri">Putri</option>
              </select>
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Pembina</label>
              <select v-model="form.supervisor" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                <option value="">-- Pilih Pembina --</option>
                <option v-for="t in teachers" :key="t.id" :value="t.name">{{ t.name }}</option>
              </select>
            </div>
          </div>
          <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="closeModal">Batal</button>
            <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="saveItem">Simpan</button>
          </div>
        </div>
      </div>

      <div v-if="showRoomModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="showRoomModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter">
          <div class="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <h3 class="font-display text-title-lg text-primary">Kelola Kamar - {{ roomDormitory?.name }}</h3>
            <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="showRoomModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <input v-model="newRoomName" type="text" class="flex-1 bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary" placeholder="Nama kamar baru" @keyup.enter="addRoom" />
              <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm flex items-center gap-1" @click="addRoom">
                <span class="material-symbols-outlined text-sm">add</span> Tambah
              </button>
            </div>
            <div v-if="roomDormitory && (roomDormitory.rooms || []).length > 0" class="flex items-center justify-between mb-3 px-1">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" :checked="selectedRooms.length === (roomDormitory.rooms || []).length" @change="toggleAllRooms" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                <span class="text-label-sm text-on-surface-variant font-semibold">Pilih Semua</span>
              </label>
              <button v-if="selectedRooms.length > 0" class="text-label-sm text-error hover:text-red-700 flex items-center gap-1" @click="removeSelectedRooms">
                <span class="material-symbols-outlined text-sm">delete</span> Hapus {{ selectedRooms.length }} Terpilih
              </button>
            </div>
            <div v-if="roomDormitory" class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              <div v-for="(room, idx) in (roomDormitory.rooms || [])" :key="idx" class="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                <div class="flex items-center gap-3">
                  <input type="checkbox" :checked="selectedRooms.includes(room)" @change="toggleRoom(room)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                  <span class="material-symbols-outlined text-primary text-sm">meeting_room</span>
                  <span class="text-label-md text-on-surface">{{ room }}</span>
                </div>
                <button class="p-1 rounded-lg hover:bg-red-50 text-red-500 transition-colors" @click="removeRoom(room)">
                  <span class="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <p v-if="(roomDormitory.rooms || []).length === 0" class="text-center text-on-surface-variant text-label-sm py-8">Belum ada kamar. Tambahkan kamar baru.</p>
            </div>
          </div>
          <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <button v-if="selectedRooms.length > 0" class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="removeSelectedRooms">Hapus {{ selectedRooms.length }} Terpilih</button>
            <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="showRoomModal = false">Selesai</button>
          </div>
        </div>
      </div>

      <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="showDeleteModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter">
          <div class="p-6 text-center">
            <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
            </div>
            <h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Gedung</h3>
            <p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus gedung berikut?</p>
            <p class="font-bold text-on-surface text-body-md">{{ deleteTarget?.name }}</p>
            <p v-if="deleteTarget && (deleteTarget.rooms || []).length > 0" class="text-xs text-red-500 mt-2 flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-xs">warning</span>
              {{ (deleteTarget.rooms || []).length }} kamar di dalamnya juga akan dihapus.
            </p>
          </div>
          <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="showDeleteModal = false">Batal</button>
            <button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="doDelete">Hapus</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const teachers = ref<any[]>([])
const { getIdToken } = useAuth()

interface Dormitory {
  id: number
  name: string
  gender: string
  supervisor: string
  rooms: string[]
}

const loading = ref(true)
const error = ref('')
const items = ref<Dormitory[]>([])
const showModal = ref(false)
const isEditing = ref(false)
const showDeleteModal = ref(false)
const deleteTarget = ref<Dormitory | null>(null)

const showRoomModal = ref(false)
const roomDormitory = ref<Dormitory | null>(null)
const newRoomName = ref('')
const selectedRooms = ref<string[]>([])

const stats = computed(() => {
  const totalUnits = items.value.length
  const totalRooms = items.value.reduce((sum, d) => sum + (d.rooms?.length || 0), 0)
  return [
    { label: 'Total Gedung', icon: 'domain', iconColor: 'text-primary', valueColor: 'text-primary', value: String(totalUnits) },
    { label: 'Total Kamar', icon: 'door_front', iconColor: 'text-secondary', valueColor: 'text-secondary', value: String(totalRooms) },
    { label: 'Pembina', icon: 'supervisor_account', iconColor: 'text-primary-container', valueColor: 'text-on-background', value: String(totalUnits) },
    { label: 'Kapasitas', icon: 'bed', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: String(totalRooms * 8) },
  ]
})

const defaultForm = () => ({
  id: 0,
  name: '',
  gender: '',
  supervisor: '',
  supervisorId: null as number | null,
  rooms: [] as string[],
})

const form = reactive(defaultForm())

watch(() => form.supervisor, (val) => {
  const found = teachers.value.find(t => t.name === val)
  form.supervisorId = found ? found.id : null
})

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/master-data/dormitories')
    items.value = data || []
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

async function saveItem() {
  if (!form.name || !form.gender || !form.supervisor) return
  try {
    if (isEditing.value) {
      await $fetch(`/api/master-data/dormitories/${form.id}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/master-data/dormitories', { method: 'POST', body: { ...form } })
    }
    showModal.value = false
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function addRoom() {
  if (!roomDormitory.value || !newRoomName.value.trim()) return
  try {
    await $fetch(`/api/master-data/dormitories/${roomDormitory.value.id}/rooms`, {
      method: 'POST',
      body: { name: newRoomName.value.trim() }
    })
    newRoomName.value = ''
    await fetchData()
    roomDormitory.value = items.value.find(d => d.id === roomDormitory.value!.id) || roomDormitory.value
  } catch (e: any) {
    error.value = e.message || 'Gagal menambah kamar'
  }
}

async function removeRoom(roomName: string) {
  if (!roomDormitory.value) return
  if (!confirm(`Yakin ingin menghapus kamar "${roomName}"?`)) return
  try {
    await $fetch(`/api/master-data/dormitories/${roomDormitory.value.id}/rooms/${encodeURIComponent(roomName)}`, {
      method: 'DELETE'
    })
    await fetchData()
    roomDormitory.value = items.value.find(d => d.id === roomDormitory.value!.id) || roomDormitory.value
    selectedRooms.value = selectedRooms.value.filter(r => r !== roomName)
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus kamar'
  }
}

function toggleRoom(room: string) {
  if (selectedRooms.value.includes(room)) {
    selectedRooms.value = selectedRooms.value.filter(r => r !== room)
  } else {
    selectedRooms.value.push(room)
  }
}

function toggleAllRooms() {
  const rooms = roomDormitory.value?.rooms || []
  if (selectedRooms.value.length === rooms.length) {
    selectedRooms.value = []
  } else {
    selectedRooms.value = [...rooms]
  }
}

async function removeSelectedRooms() {
  if (!roomDormitory.value || selectedRooms.value.length === 0) return
  if (!confirm(`Yakin ingin menghapus ${selectedRooms.value.length} kamar terpilih?`)) return
  try {
    await Promise.all(selectedRooms.value.map(room =>
      $fetch(`/api/master-data/dormitories/${roomDormitory.value!.id}/rooms/${encodeURIComponent(room)}`, {
        method: 'DELETE'
      })
    ))
    selectedRooms.value = []
    await fetchData()
    roomDormitory.value = items.value.find(d => d.id === roomDormitory.value!.id) || roomDormitory.value
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus kamar'
  }
}

async function doDelete() {
  if (!deleteTarget.value) return
  try {
    await $fetch(`/api/master-data/dormitories/${deleteTarget.value.id}`, { method: 'DELETE' })
    showDeleteModal.value = false
    deleteTarget.value = null
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

function openAddModal() {
  isEditing.value = false
  Object.assign(form, defaultForm())
  showModal.value = true
}

function openEditModal(item: Dormitory) {
  isEditing.value = true
  Object.assign(form, { ...item, rooms: [...item.rooms] })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function openRoomManager(item: Dormitory) {
  roomDormitory.value = item
  newRoomName.value = ''
  showRoomModal.value = true
}

function confirmDelete(item: Dormitory) {
  deleteTarget.value = item
  showDeleteModal.value = true
}

onMounted(() => {
  fetchData()
  fetchTeachers()
})
</script>
