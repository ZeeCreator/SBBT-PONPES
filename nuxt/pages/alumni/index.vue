<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary">sync</span>
      <span class="ml-2 text-on-surface-variant">Memuat data...</span>
    </div>
    <div v-else-if="error" class="bg-error-container text-on-error-container p-stack-md rounded-xl mb-stack-lg">{{ error }}</div>
    <template v-else>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
      <div v-for="stat in stats" :key="stat.label" class="glass-card p-stack-md rounded-xl shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-on-surface-variant text-label-md">{{ stat.label }}</span>
          <span class="material-symbols-outlined" :class="stat.iconColor">{{ stat.icon }}</span>
        </div>
        <p class="font-display text-headline-md" :class="stat.valueColor">{{ stat.value }}</p>
        <div class="flex items-center gap-1 mt-1">
          <span class="text-on-surface-variant text-[10px]">{{ stat.subtext }}</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-stack-md mb-stack-md">
      <div>
        <h2 class="font-display text-headline-md text-primary">Alumni Tracking</h2>
        <p class="text-on-surface-variant text-body-md">Manage alumni data and track their post-graduation status.</p>
      </div>
      <div class="flex items-center gap-stack-sm">
        <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md transition-all shadow-md active:scale-95" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Add Alumni
        </button>
      </div>
    </div>
    <div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50">
      <div class="p-stack-md border-b border-surface-variant/30 flex flex-wrap items-center gap-stack-md">
        <div class="flex items-center gap-2">
          <label class="text-label-sm text-on-surface-variant">Tahun Lulus:</label>
          <select v-model="filterYear" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3">
            <option value="">Semua</option>
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-label-sm text-on-surface-variant">Status:</label>
          <select v-model="filterStatus" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3">
            <option value="">Semua</option>
            <option value="Kuliah">Kuliah</option>
            <option value="Kerja">Kerja</option>
            <option value="Wirausaha">Wirausaha</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <div class="ml-auto flex items-center gap-2">
          <span class="text-on-surface-variant text-[12px] italic flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span> {{ filteredAlumni.length }} alumni
          </span>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nama</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Tahun Lulus</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Institusi</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Kontak</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-variant/30">
            <tr v-for="a in filteredAlumni" :key="a.id" class="hover:bg-primary-container/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(a.id)" @change="toggleOne(a.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-bold">{{ a.initials }}</div>
                  <p class="text-label-md text-on-surface">{{ a.name }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ a.graduationYear }}</td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', statusClass(a.status)]">{{ a.status }}</span>
              </td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ a.institution }}</td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ a.contact }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button class="text-on-surface-variant hover:text-primary transition-colors" @click="openEditModal(a)">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button class="text-error hover:text-red-700 transition-colors" @click="deleteItem(a.id)">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter">
          <div class="bg-primary-container px-gutter py-stack-md flex justify-between items-center">
            <div class="text-on-primary">
              <h2 class="font-display text-headline-md">{{ editingId ? 'Edit' : 'Tambah' }} Alumni</h2>
              <p class="text-[11px] text-on-primary-container uppercase tracking-widest">Alumni Module</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
            <form class="p-gutter space-y-stack-md" @submit.prevent="saveItem">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Lengkap</label>
              <input v-model="form.name" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required />
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Tahun Lulus</label>
                <select v-model="form.graduationYear" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Status</label>
                <select v-model="form.status" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option value="Kuliah">Kuliah</option>
                  <option value="Kerja">Kerja</option>
                  <option value="Wirausaha">Wirausaha</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Institusi / Perusahaan</label>
              <input v-model="form.institution" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Kontak</label>
              <input v-model="form.contact" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" />
            </div>
            <div class="flex justify-end gap-stack-sm pt-stack-sm">
              <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="showModal = false">Batal</button>
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
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredAlumni)
definePageMeta({ layout: 'alumni', requiredRole: 'alumni' })

const loading = ref(true)
const error = ref('')
const filterYear = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  name: '',
  graduationYear: 2026,
  status: 'Kuliah',
  institution: '',
  contact: '',
})

const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
const items = ref<any[]>([])

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    items.value = await $fetch('/api/alumni') || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

const stats = computed(() => [
  { label: 'Total Alumni', icon: 'groups', value: items.value.length, subtext: 'Tercatat semua angkatan', iconColor: 'text-primary', valueColor: 'text-primary' },
  { label: 'Kuliah', icon: 'school', value: items.value.filter(a => a.status === 'Kuliah').length, subtext: 'Melanjutkan pendidikan', iconColor: 'text-secondary', valueColor: 'text-secondary' },
  { label: 'Bekerja', icon: 'work', value: items.value.filter(a => a.status === 'Kerja').length, subtext: 'Sudah bekerja', iconColor: 'text-tertiary-container', valueColor: 'text-on-background' },
  { label: 'Wirausaha', icon: 'store', value: items.value.filter(a => a.status === 'Wirausaha').length, subtext: 'Berwirausaha', iconColor: 'text-error', valueColor: 'text-on-background' },
])

const filteredAlumni = computed(() =>
  items.value.filter(a =>
    (!filterYear.value || a.graduationYear === Number(filterYear.value)) &&
    (!filterStatus.value || a.status === filterStatus.value)
  )
)

function statusClass(status: string) {
  const map: Record<string, string> = {
    'Kuliah': 'bg-primary-fixed text-on-primary-fixed',
    'Kerja': 'bg-secondary-fixed text-on-secondary-fixed',
    'Wirausaha': 'bg-tertiary-fixed text-on-tertiary-fixed',
    'Lainnya': 'bg-surface-container text-on-surface-variant',
  }
  return map[status] || 'bg-surface-container text-on-surface-variant'
}

function openAddModal() {
  editingId.value = null
  form.name = ''
  form.graduationYear = 2026
  form.status = 'Kuliah'
  form.institution = ''
  form.contact = ''
  showModal.value = true
}

function openEditModal(a: any) {
  editingId.value = a.id
  form.name = a.name
  form.graduationYear = a.graduationYear
  form.status = a.status
  form.institution = a.institution
  form.contact = a.contact
  showModal.value = true
}

async function saveItem() {
  try {
    if (editingId.value) {
      await $fetch(`/api/alumni/${editingId.value}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/alumni', { method: 'POST', body: { ...form } })
    }
    showModal.value = false; await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function deleteItem(id: string) {
  if (!confirm('Yakin ingin menghapus?')) return
  try {
    await $fetch(`/api/alumni/${id}`, { method: 'DELETE' }); await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => fetchData())
</script>
