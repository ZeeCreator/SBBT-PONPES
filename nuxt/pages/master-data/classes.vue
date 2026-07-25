<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Manajemen Kelas & Tingkatan</h2>
      <p class="text-on-surface-variant text-body-md">Kelola data kelas dan tingkatan untuk santri.</p>
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
        <h3 class="font-display text-title-lg text-primary">Daftar Kelas</h3>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Kelas
        </button>
      </div>

      <div v-if="loading" class="p-8 text-center text-on-surface-variant text-label-md">Memuat data...</div>
      <div v-else-if="error" class="p-8 text-center text-red-500 text-label-md">{{ error }}</div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Kelas</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Tingkat</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Group</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="item in items" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
              <td class="px-6 py-4 text-label-md text-on-surface font-medium">{{ item.name }}</td>
              <td class="px-6 py-4 text-label-sm text-on-surface-variant">{{ item.level }}</td>
              <td class="px-6 py-4"><span class="bg-surface-container-low px-2 py-1 rounded text-label-sm text-on-surface-variant">{{ item.group }}</span></td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', item.active ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant']">
                  {{ item.active ? 'Aktif' : 'Nonaktif' }}
                </span>
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
              <td colspan="99"  class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data kelas. Klik "Tambah Kelas" untuk menambahkan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter">
          <div class="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <h3 class="font-display text-title-lg text-primary">{{ isEditing ? 'Edit Kelas' : 'Tambah Kelas' }}</h3>
            <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Nama Kelas</label>
              <input v-model="form.name" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Contoh: 8A" />
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Tingkat</label>
              <select v-model="form.level" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                <option value="">Pilih Tingkat</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Group</label>
              <select v-model="form.group" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                <option value="">Pilih Group</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div class="flex items-center gap-3">
              <label class="text-label-sm text-on-surface-variant">Status Aktif</label>
              <button @click="form.active = !form.active" :class="['w-10 h-5 rounded-full transition-colors relative', form.active ? 'bg-primary' : 'bg-surface-container-highest']">
                <span :class="['absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form.active ? 'translate-x-5' : 'translate-x-0.5']"></span>
              </button>
            </div>
          </div>
          <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="closeModal">Batal</button>
            <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="saveItem">Simpan</button>
          </div>
        </div>
      </div>

      <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="showDeleteModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter">
          <div class="p-6 text-center">
            <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
            </div>
            <h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Kelas</h3>
            <p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus kelas berikut?</p>
            <p class="font-bold text-on-surface text-body-md">{{ deleteTarget?.name }}</p>
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
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(items)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

interface ClassItem {
  id: number
  name: string
  level: string
  group: string
  active: boolean
}

const loading = ref(true)
const error = ref('')
const items = ref<ClassItem[]>([])
const showModal = ref(false)
const isEditing = ref(false)
const showDeleteModal = ref(false)
const deleteTarget = ref<ClassItem | null>(null)

const stats = computed(() => {
  const total = items.value.length
  const levels = new Set(items.value.map(i => i.level)).size
  return [
    { label: 'Total Kelas', icon: 'meeting_room', iconColor: 'text-primary', valueColor: 'text-primary', value: String(total) },
    { label: 'Total Santri', icon: 'groups', iconColor: 'text-secondary', valueColor: 'text-secondary', value: '-' },
    { label: 'Tingkatan', icon: 'layers', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: String(levels) },
  ]
})

const defaultForm = () => ({
  id: 0,
  name: '',
  level: '',
  group: '',
  active: true,
})

const form = reactive(defaultForm())

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/master-data/classes')
    items.value = data || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

async function saveItem() {
  if (!form.name || !form.level || !form.group) return
  try {
    if (isEditing.value) {
      await $fetch(`/api/master-data/classes/${form.id}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/master-data/classes', { method: 'POST', body: { ...form } })
    }
    showModal.value = false
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function doDelete() {
  if (!deleteTarget.value) return
  try {
    await $fetch(`/api/master-data/classes/${deleteTarget.value.id}`, { method: 'DELETE' })
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

function openEditModal(item: ClassItem) {
  isEditing.value = true
  Object.assign(form, { ...item })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function confirmDelete(item: ClassItem) {
  deleteTarget.value = item
  showDeleteModal.value = true
}

onMounted(() => {
  fetchData()
})
</script>
