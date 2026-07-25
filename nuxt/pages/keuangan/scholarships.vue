<template>
  <div class="bg-mesh min-h-screen" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="px-gutter max-w-container-max mx-auto">
      <div class="mb-stack-lg">
        <h2 class="font-display text-headline-lg text-primary mb-2">Beasiswa & Diskon SPP</h2>
        <p class="text-on-surface-variant text-body-md">Kelola jenis beasiswa, diskon SPP, dan penugasan penerima beasiswa.</p>
      </div>
      <div v-if="errorS" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ errorS }}</div>
      <div v-if="loading" class="flex items-center justify-center py-12">
        <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
      </div>
      <template v-else>
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
          <div class="p-stack-md border-b border-outline-variant/20 flex items-center justify-between gap-stack-md">
            <h3 class="font-display text-title-lg text-primary">Daftar Beasiswa</h3>
            <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
              <span class="material-symbols-outlined text-sm">add</span> Tambah Beasiswa
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Beasiswa</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Tipe</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Diskon</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Syarat & Ketentuan</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Penerima</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="item in scholarships" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                  <td class="px-6 py-4 text-label-md text-on-surface font-medium">{{ item.name }}</td>
                  <td class="px-6 py-4">
                    <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', typeClass(item.type)]">{{ item.typeLabel }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-bold text-secondary text-label-md">{{ item.discount }}%</span>
                  </td>
                  <td class="px-6 py-4 text-label-md text-on-surface-variant max-w-xs truncate">{{ item.terms }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <span class="text-label-md text-on-surface">{{ item.recipients }}</span>
                      <button class="text-primary hover:text-primary-container transition-colors" title="Atur Penerima" @click="openAssignModal(item)">
                        <span class="material-symbols-outlined text-sm">person_add</span>
                      </button>
                    </div>
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
                <tr v-if="scholarships.length === 0">
                  <td colspan="99"  class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data beasiswa.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
      <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="closeModal">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter">
            <div class="p-6 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 class="font-display text-title-lg text-primary">{{ isEditing ? 'Edit Beasiswa' : 'Tambah Beasiswa' }}</h3>
              <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="closeModal">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">Nama Beasiswa</label>
                <input v-model="form.name" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Contoh: Beasiswa Tahfidz" />
              </div>
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">Tipe Beasiswa</label>
                <select v-model="form.type" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                  <option value="yatim">Yatim</option>
                  <option value="tahfidz">Tahfidz (per Juz)</option>
                  <option value="prestasi">Prestasi Akademik</option>
                </select>
              </div>
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">Diskon (%)</label>
                <input v-model.number="form.discount" type="number" min="0" max="100" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="0-100" />
              </div>
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">Syarat & Ketentuan</label>
                <textarea v-model="form.terms" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" rows="3" placeholder="Deskripsi syarat beasiswa..."></textarea>
              </div>
            </div>
            <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
              <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="closeModal">Batal</button>
              <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="saveScholarship">Simpan</button>
            </div>
          </div>
        </div>
        <div v-if="showAssignModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="showAssignModal = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter">
            <div class="p-6 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 class="font-display text-title-lg text-primary">Atur Penerima Beasiswa</h3>
              <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="showAssignModal = false">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="p-6">
              <p class="text-label-md text-on-surface-variant mb-4">Beasiswa: <span class="font-bold text-on-surface">{{ assignTarget?.name }}</span></p>
              <div class="space-y-2 max-h-60 overflow-y-auto">
                <label v-for="s in availableStudents" :key="s.id" class="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors"
                  :class="{ 'bg-primary-fixed/20': assignedStudents.includes(s.id) }">
                  <input type="checkbox" :value="s.id" v-model="assignedStudents" class="w-4 h-4 text-primary focus:ring-primary border-outline-variant rounded" />
                  <div>
                    <p class="text-label-md text-on-surface">{{ s.name }}</p>
                    <p class="text-label-sm text-on-surface-variant">{{ s.nis }} &bull; {{ s.class }}</p>
                  </div>
                </label>
              </div>
            </div>
            <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
              <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="showAssignModal = false">Batal</button>
              <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="saveAssign">Simpan</button>
            </div>
          </div>
        </div>
        <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="showDeleteModal = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter">
            <div class="p-6 text-center">
              <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
              </div>
              <h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Beasiswa</h3>
              <p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus beasiswa berikut?</p>
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
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(scholarships)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

interface Scholarship {
  id: number
  name: string
  type: string
  typeLabel: string
  discount: number
  terms: string
  recipients: number
}

interface Student {
  id: number
  name: string
  nis: string
  class: string
}

const loading = ref(true)
const errorS = ref('')
const scholarships = ref<Scholarship[]>([])

const availableStudents: Student[] = [
  { id: 1, name: 'Ahmad Zaki', nis: '20241001', class: '8A' },
  { id: 2, name: 'Budi Prasetyo', nis: '20241002', class: '8A' },
  { id: 3, name: 'Citra Dewi', nis: '20241003', class: '8B' },
  { id: 4, name: 'Dimas Ardian', nis: '20241004', class: '9A' },
  { id: 5, name: 'Eka Putri', nis: '20241005', class: '9A' },
  { id: 6, name: 'Fajar Hidayat', nis: '20241006', class: '7A' },
  { id: 7, name: 'Gita Nurul', nis: '20241007', class: '7B' },
  { id: 8, name: 'Hadi Firmansyah', nis: '20241008', class: '10A' },
]

const stats = computed(() => [
  { label: 'Total Beasiswa', icon: 'school', iconColor: 'text-primary', valueColor: 'text-primary', value: scholarships.value.length },
  { label: 'Total Penerima', icon: 'group', iconColor: 'text-secondary', valueColor: 'text-secondary', value: scholarships.value.reduce((a, b) => a + b.recipients, 0) },
  { label: 'Diskon Tertinggi', icon: 'trending_up', iconColor: 'text-primary-container', valueColor: 'text-on-background', value: scholarships.value.length > 0 ? `${Math.max(...scholarships.value.map(s => s.discount))}%` : '0%' },
  { label: 'Tipe Beasiswa', icon: 'category', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: `${new Set(scholarships.value.map(s => s.type)).size} jenis` },
])

function typeClass(type: string) {
  const map: Record<string, string> = {
    'yatim': 'bg-secondary-fixed text-on-secondary-fixed',
    'tahfidz': 'bg-tertiary-container text-on-tertiary-container',
    'prestasi': 'bg-primary-fixed text-on-primary-fixed',
  }
  return map[type] || 'bg-surface-container text-on-surface-variant'
}

async function fetchData() {
  loading.value = true; errorS.value = ''
  try { scholarships.value = await $fetch<Scholarship[]>('/api/keuangan/scholarships') || [] }
  catch (e: any) { errorS.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

const showModal = ref(false)
const isEditing = ref(false)
const showDeleteModal = ref(false)
const deleteTarget = ref<Scholarship | null>(null)
const showAssignModal = ref(false)
const assignTarget = ref<Scholarship | null>(null)
const assignedStudents = ref<number[]>([])

const defaultForm = () => ({
  id: 0,
  name: '',
  type: 'yatim',
  typeLabel: 'Yatim',
  discount: 0,
  terms: '',
  recipients: 0,
})

const form = reactive(defaultForm())

const typeLabels: Record<string, string> = {
  yatim: 'Yatim',
  tahfidz: 'Tahfidz',
  prestasi: 'Prestasi',
}

function openAddModal() {
  isEditing.value = false
  Object.assign(form, defaultForm())
  showModal.value = true
}

function openEditModal(item: Scholarship) {
  isEditing.value = true
  Object.assign(form, { ...item })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveScholarship() {
  if (!form.name || form.discount <= 0) return
  form.typeLabel = typeLabels[form.type] || form.type
  try {
    if (isEditing.value) {
      await $fetch(`/api/keuangan/scholarships/${form.id}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/keuangan/scholarships', { method: 'POST', body: { ...form } })
    }
    closeModal(); await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menyimpan' }
}

function openAssignModal(item: Scholarship) {
  assignTarget.value = item
  assignedStudents.value = []
  showAssignModal.value = true
}

async function saveAssign() {
  if (assignTarget.value) {
    try {
      await $fetch(`/api/keuangan/scholarships/${assignTarget.value.id}`, { method: 'PUT', body: { ...assignTarget.value, recipients: assignedStudents.value.length } })
      await fetchData()
      showAssignModal.value = false
    } catch (e: any) { errorS.value = e.message || 'Gagal menyimpan' }
  }
}

function confirmDelete(item: Scholarship) {
  deleteTarget.value = item
  showDeleteModal.value = true
}

async function doDelete() {
  if (deleteTarget.value) {
    try {
      await $fetch(`/api/keuangan/scholarships/${deleteTarget.value.id}`, { method: 'DELETE' })
      await fetchData()
      showDeleteModal.value = false
      deleteTarget.value = null
    } catch (e: any) { errorS.value = e.message || 'Gagal menghapus' }
  }
}

onMounted(() => fetchData())
</script>
