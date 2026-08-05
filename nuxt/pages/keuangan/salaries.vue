<template>
  <div class="bg-mesh min-h-screen" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="px-gutter max-w-container-max mx-auto">
      <div class="mb-stack-lg">
        <h2 class="font-display text-headline-lg text-primary mb-2">Syahriyah / Honor Guru</h2>
        <p class="text-on-surface-variant text-body-md">Kelola penggajian bulanan guru, musyrif, dan staf.</p>
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
          <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
            <div class="flex items-center gap-4">
              <h3 class="font-display text-title-lg text-primary">Daftar Penggajian</h3>
              <div class="flex items-center gap-2">
                <label class="text-label-sm text-on-surface-variant">Bulan:</label>
                <select v-model="filterMonth" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
                  <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
                </select>
              </div>
            </div>
            <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
              <span class="material-symbols-outlined text-sm">add</span> Tambah Gaji
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
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Nama</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Jabatan</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Gaji Pokok</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Tunjangan</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Potongan</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Total Diterima</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Bulan</th>
                  <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="item in filteredSalaries" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center text-label-md font-bold">{{ item.initials }}</div>
                      <span class="text-label-md text-on-surface font-medium">{{ item.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ item.position }}</td>
                  <td class="px-6 py-4 text-label-md text-on-surface">Rp {{ formatNumber(item.baseSalary) }}</td>
                  <td class="px-6 py-4 text-label-md text-green-600">+ Rp {{ formatNumber(item.allowance) }}</td>
                  <td class="px-6 py-4 text-label-md text-red-500">- Rp {{ formatNumber(item.deduction) }}</td>
                  <td class="px-6 py-4 font-display text-headline-sm text-primary">Rp {{ formatNumber(item.baseSalary + item.allowance - item.deduction) }}</td>
                  <td class="px-6 py-4">
                    <span class="bg-surface-container-low px-2 py-1 rounded text-label-sm text-on-surface-variant">{{ item.month }}</span>
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
                <tr v-if="filteredSalaries.length === 0">
                  <td colspan="99"  class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data penggajian untuk bulan ini.</td>
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
              <h3 class="font-display text-title-lg text-primary">{{ isEditing ? 'Edit Gaji' : 'Tambah Gaji' }}</h3>
              <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="closeModal">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-label-sm text-on-surface-variant block mb-1">Nama Pegawai</label>
                  <select v-model="form.name" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                    <option value="">-- Pilih Pegawai --</option>
                    <option v-for="t in teachers" :key="t.id" :value="t.name">{{ t.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-label-sm text-on-surface-variant block mb-1">Jabatan</label>
                  <select v-model="form.position" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                    <option value="Guru">Guru</option>
                    <option value="Musyrif">Musyrif</option>
                    <option value="Staf">Staf</option>
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                    <option value="Wakil Kepala">Wakil Kepala</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-label-sm text-on-surface-variant block mb-1">Gaji Pokok</label>
                  <input v-model.number="form.baseSalary" type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp" />
                </div>
                <div>
                  <label class="text-label-sm text-on-surface-variant block mb-1">Tunjangan</label>
                  <input v-model.number="form.allowance" type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp" />
                </div>
              </div>
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">Potongan (Pinjaman, dll)</label>
                <input v-model.number="form.deduction" type="number" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" placeholder="Rp" />
              </div>
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">Periode Bulan</label>
                <select v-model="form.month" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                  <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
                </select>
              </div>
              <div class="bg-primary-fixed/20 rounded-lg p-4 flex items-center justify-between">
                <span class="text-label-md text-on-surface-variant">Total Diterima</span>
                <span class="font-display text-headline-md text-primary">Rp {{ formatNumber(form.baseSalary + form.allowance - form.deduction) }}</span>
              </div>
            </div>
            <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
              <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="closeModal">Batal</button>
              <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="saveSalary">Simpan</button>
            </div>
          </div>
        </div>
        <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="showDeleteModal = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter">
            <div class="p-6 text-center">
              <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
              </div>
              <h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Data Gaji</h3>
              <p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus data gaji berikut?</p>
              <p class="font-bold text-on-surface text-body-md">{{ deleteTarget?.name }} - {{ deleteTarget?.month }}</p>
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
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredSalaries)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const teachers = ref<any[]>([])
const { getIdToken } = useAuth()

interface SalaryItem {
  id: number
  name: string
  initials: string
  position: string
  baseSalary: number
  allowance: number
  deduction: number
  month: string
}

const months = [
  { value: 'Januari 2026', label: 'Januari 2026' },
  { value: 'Februari 2026', label: 'Februari 2026' },
  { value: 'Maret 2026', label: 'Maret 2026' },
  { value: 'April 2026', label: 'April 2026' },
  { value: 'Mei 2026', label: 'Mei 2026' },
  { value: 'Juni 2026', label: 'Juni 2026' },
  { value: 'Juli 2026', label: 'Juli 2026' },
]

const filterMonth = ref('Juli 2026')
const loading = ref(true)
const errorS = ref('')
const salaries = ref<SalaryItem[]>([])

const stats = computed(() => {
  const current = salaries.value.filter(s => s.month === filterMonth.value)
  const totalPayroll = current.reduce((a, b) => a + b.baseSalary + b.allowance - b.deduction, 0)
  return [
    { label: 'Total Payroll', icon: 'payments', iconColor: 'text-primary', valueColor: 'text-primary', value: `Rp ${formatNumber(totalPayroll)}` },
    { label: 'Jumlah Pegawai', icon: 'badge', iconColor: 'text-secondary', valueColor: 'text-secondary', value: current.length },
    { label: 'Rata-rata Gaji', icon: 'bar_chart', iconColor: 'text-primary-container', valueColor: 'text-on-background', value: current.length > 0 ? `Rp ${formatNumber(Math.round(totalPayroll / current.length))}` : 'Rp 0' },
    { label: 'Total Potongan', icon: 'money_off', iconColor: 'text-error', valueColor: 'text-error', value: `Rp ${formatNumber(current.reduce((a, b) => a + b.deduction, 0))}` },
  ]
})

const filteredSalaries = computed(() =>
  salaries.value.filter(s => s.month === filterMonth.value)
)

function formatNumber(n: number) {
  return n.toLocaleString('id-ID')
}

async function fetchData() {
  loading.value = true; errorS.value = ''
  try {
    const params = filterMonth.value ? `?month=${encodeURIComponent(filterMonth.value)}` : ''
    salaries.value = await $fetch<SalaryItem[]>(`/api/keuangan/salaries${params}`) || []
  } catch (e: any) { errorS.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

async function fetchTeachers() {
  try {
    const token = await getIdToken()
    const res = await fetch('/api/guru', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) teachers.value = await res.json()
  } catch (e) { console.error(e) }
}

watch(filterMonth, () => fetchData())

const showModal = ref(false)
const isEditing = ref(false)
const showDeleteModal = ref(false)
const deleteTarget = ref<SalaryItem | null>(null)

const defaultForm = () => ({
  id: 0,
  name: '',
  initials: '',
  position: 'Guru',
  baseSalary: 0,
  allowance: 0,
  deduction: 0,
  month: filterMonth.value,
  guruId: null as number | null,
})

const form = reactive(defaultForm())

watch(() => form.name, (val) => {
  const found = teachers.value.find(t => t.name === val)
  form.guruId = found ? found.id : null
})

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function openAddModal() {
  isEditing.value = false
  Object.assign(form, defaultForm())
  showModal.value = true
}

function openEditModal(item: SalaryItem) {
  isEditing.value = true
  Object.assign(form, { ...item })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveSalary() {
  if (!form.name || form.baseSalary <= 0) return
  form.initials = getInitials(form.name)
  try {
    if (isEditing.value) {
      await $fetch(`/api/keuangan/salaries/${form.id}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/keuangan/salaries', { method: 'POST', body: { ...form } })
    }
    closeModal(); await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menyimpan' }
}

function confirmDelete(item: SalaryItem) {
  deleteTarget.value = item
  showDeleteModal.value = true
}

async function doDelete() {
  if (deleteTarget.value) {
    try {
      await $fetch(`/api/keuangan/salaries/${deleteTarget.value.id}`, { method: 'DELETE' })
      await fetchData()
      showDeleteModal.value = false
      deleteTarget.value = null
    } catch (e: any) { errorS.value = e.message || 'Gagal menghapus' }
  }
}

async function bulkDelete() {
  if (!confirm(`Yakin ingin menghapus ${selectedCount} data?`)) return
  try {
    await Promise.all(selected.value.map(id => $fetch(`/api/keuangan/salaries/${id}`, { method: 'DELETE' })))
    clearSelection()
    await fetchData()
  } catch (e: any) {
    errorS.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => {
  fetchData()
  fetchTeachers()
})
</script>
