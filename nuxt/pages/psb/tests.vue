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
        <h2 class="font-display text-headline-md text-primary">Tes & Seleksi Masuk</h2>
        <p class="text-on-surface-variant text-body-md">Kelola hasil tes akademik, BTQ, dan hafalan calon santri.</p>
      </div>
      <div class="flex items-center gap-stack-sm">
        <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md transition-all shadow-md active:scale-95" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Nilai
        </button>
      </div>
    </div>
    <div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nama</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nilai Akademik</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nilai BTQ</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nilai Hafalan</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Rata-rata</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-variant/30">
            <tr v-for="t in tests" :key="t.id" class="hover:bg-primary-container/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(t.id)" @change="toggleOne(t.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-bold">{{ t.initials }}</div>
                  <p class="text-label-md text-on-surface">{{ t.name }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ t.academic }}</td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ t.btq }}</td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ t.memorization }}</td>
              <td class="px-6 py-4">
                <span :class="['font-bold', avgColor(t.average)]">{{ t.average }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', t.average >= 70 ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-error-container text-on-error-container']">
                  {{ t.average >= 70 ? 'Lulus' : 'Tidak' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button class="text-error hover:text-red-700 transition-colors" @click="deleteItem(t.id)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
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
              <h2 class="font-display text-headline-md">Tambah Nilai Tes</h2>
              <p class="text-[11px] text-on-primary-container uppercase tracking-widest">PSB Module &bull; Tes Seleksi</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="saveItem">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Calon Santri</label>
              <input v-model="form.name" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required />
            </div>
            <div class="grid grid-cols-3 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Akademik</label>
                <input v-model.number="form.academic" type="number" min="0" max="100" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">BTQ</label>
                <input v-model.number="form.btq" type="number" min="0" max="100" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Hafalan</label>
                <input v-model.number="form.memorization" type="number" min="0" max="100" class="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md outline-none" required />
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
  </template>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => tests)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const loading = ref(true)
const error = ref('')
const showModal = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  name: '',
  academic: 0,
  btq: 0,
  memorization: 0,
})

const items = ref<any[]>([])

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    items.value = await $fetch('/api/psb/tests') || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const len = items.value.length
  const avgFn = (key: string) => len ? (items.value.reduce((acc: number, t: any) => acc + (Number(t[key]) || 0), 0) / len).toFixed(1) : '0'
  return [
    { label: 'Total Tes', icon: 'assignment', value: len, subtext: 'Calon santri dites', iconColor: 'text-primary', valueColor: 'text-primary' },
    { label: 'Rata Akademik', icon: 'psychology', value: avgFn('academic'), subtext: 'Nilai rata-rata', iconColor: 'text-secondary', valueColor: 'text-secondary' },
    { label: 'Rata BTQ', icon: 'book', value: avgFn('btq'), subtext: 'Baca Tulis Quran', iconColor: 'text-tertiary-container', valueColor: 'text-on-background' },
    { label: 'Lulus Seleksi', icon: 'fact_check', value: items.value.filter((t: any) => (t.average || 0) >= 70).length, subtext: 'Dari ' + len + ' peserta', iconColor: 'text-primary', valueColor: 'text-primary' },
  ]
})

function avgColor(val: number) {
  if (val >= 85) return 'text-primary'
  if (val >= 70) return 'text-secondary'
  return 'text-error'
}

function openAddModal() {
  editingId.value = null
  form.name = ''
  form.academic = 0
  form.btq = 0
  form.memorization = 0
  showModal.value = true
}

async function saveItem() {
  try {
    if (editingId.value) {
      await $fetch(`/api/psb/tests/${editingId.value}`, { method: 'PATCH', body: { ...form } })
    } else {
      await $fetch('/api/psb/tests', { method: 'POST', body: { ...form } })
    }
    showModal.value = false; await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function deleteItem(id: string) {
  if (!confirm('Yakin ingin menghapus?')) return
  try {
    await $fetch(`/api/psb/tests/${id}`, { method: 'DELETE' }); await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => fetchData())
</script>
