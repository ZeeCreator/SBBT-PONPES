<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Tahfidzul Qur'an</h2>
      <p class="text-on-surface-variant text-body-md">Kelola hafalan Al-Qur'an santri, ziyadah, dan murojaah.</p>
    </div>
    <div v-if="errorS" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ errorS }}</div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
    </div>
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
        <div v-for="stat in stats" :key="stat.label" class="glass-card p-6 rounded-xl shadow-sm text-center">
          <div class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" :class="stat.bg">
            <span class="material-symbols-outlined" :class="stat.iconColor">{{ stat.icon }}</span>
          </div>
          <p class="font-display text-headline-md" :class="stat.valueColor">{{ stat.value }}</p>
          <p class="text-label-sm text-on-surface-variant">{{ stat.label }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 mb-4">
        <button v-for="tab in tabs" :key="tab.id"
          class="px-5 py-2 rounded-lg text-label-md font-medium transition-all"
          :class="activeTab === tab.id ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-higher'"
          @click="activeTab = tab.id">
          <span class="material-symbols-outlined text-sm align-middle mr-1">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <select v-model="filterSantri" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
          <option value="">Semua Santri</option>
          <option v-for="s in students" :key="s.id" :value="s.name">{{ s.name }}</option>
        </select>
      </div>
      <div class="glass-card rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-4">
          <h3 class="font-display text-title-lg text-primary">{{ activeTab === 'ziyadah' ? 'Ziyadah (Setoran Baru)' : 'Murojaah (Mengulang)' }}</h3>
          <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
            <span class="material-symbols-outlined text-sm">add</span> Tambah {{ activeTab === 'ziyadah' ? 'Ziyadah' : 'Murojaah' }}
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-surface-container-low">
              <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Santri</th>
                <th v-if="activeTab === 'ziyadah'" class="px-6 py-4 text-label-md text-on-surface-variant">Surah</th>
                <th v-if="activeTab === 'ziyadah'" class="px-6 py-4 text-label-md text-on-surface-variant">Ayat</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Juz</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Halaman</th>
                <th v-if="activeTab === 'ziyadah'" class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              <tr v-for="item in filteredRecords" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                <td class="px-6 py-4 text-label-md font-medium">{{ item.santri }}</td>
                <td v-if="activeTab === 'ziyadah'" class="px-6 py-4 text-label-md">{{ item.surah || '-' }}</td>
                <td v-if="activeTab === 'ziyadah'" class="px-6 py-4 text-label-sm text-on-surface-variant">{{ item.ayat || '-' }}</td>
                <td class="px-6 py-4"><span class="bg-surface-container-low px-2 py-1 rounded text-label-sm text-on-surface-variant">{{ item.juz }}</span></td>
                <td class="px-6 py-4 text-label-sm text-on-surface-variant">{{ item.halaman }}</td>
                <td v-if="activeTab === 'ziyadah'" class="px-6 py-4">
                  <span :class="['px-3 py-1 text-[11px] font-bold rounded-full', item.status === 'Lancar' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700']">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-label-sm text-on-surface-variant">{{ item.tanggal }}</td>
                <td class="px-6 py-4">
                  <button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus" @click="deleteRecord(item.id)">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredRecords.length === 0">
                <td :colspan="activeTab === 'ziyadah' ? 8 : 5" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter">
          <div class="px-gutter py-stack-md border-b border-outline-variant/20 flex justify-between items-center">
            <h3 class="font-display text-title-lg text-primary">Tambah {{ activeTab === 'ziyadah' ? 'Ziyadah' : 'Murojaah' }}</h3>
            <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-gutter space-y-stack-md">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Santri</label>
              <select v-model="form.santri" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="">Pilih Santri</option>
                <option v-for="s in students" :key="s.id" :value="s.name">{{ s.name }}</option>
              </select>
            </div>
            <div v-if="activeTab === 'ziyadah'" class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Surah</label>
              <input v-model="form.surah" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Nama surah" />
            </div>
            <div v-if="activeTab === 'ziyadah'" class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Ayat</label>
              <input v-model="form.ayat" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="1-10" />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Juz</label>
              <select v-model.number="form.juz" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="">Pilih Juz</option>
                <option v-for="j in 30" :key="j" :value="j">Juz {{ j }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Halaman</label>
              <input v-model.number="form.halaman" type="number" min="1" max="604" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="1" />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Tanggal</label>
              <input v-model="form.tanggal" type="date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" />
            </div>
            <div v-if="activeTab === 'ziyadah'" class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Status</label>
              <select v-model="form.status" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="Lancar">Lancar</option>
                <option value="Perlu Ulang">Perlu Ulang</option>
              </select>
            </div>
          </div>
          <div class="px-gutter py-stack-md border-t border-outline-variant/20 flex justify-end gap-stack-sm">
            <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="closeModal">Batal</button>
            <button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" @click="saveRecord">Simpan</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredRecords)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

interface TahfidzRecord {
  id: number
  santri: string
  surah?: string
  ayat?: string
  juz: number
  halaman: number
  status?: string
  tanggal: string
  type: 'ziyadah' | 'murojaah'
}

const tabs = [
  { id: 'ziyadah', label: 'Ziyadah', icon: 'add_circle' },
  { id: 'murojaah', label: 'Murojaah', icon: 'autorenew' },
]

const activeTab = ref('ziyadah')
const filterSantri = ref('')
const loading = ref(true)
const errorS = ref('')
const records = ref<TahfidzRecord[]>([])
const showModal = ref(false)

const students = ref<any[]>([])
const { getIdToken } = useAuth()

async function fetchStudents() {
  try {
    const token = await getIdToken()
    const res = await fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) students.value = await res.json()
  } catch (e) { console.error(e) }
}

const filteredRecords = computed(() =>
  records.value.filter(r =>
    r.type === activeTab.value &&
    (!filterSantri.value || r.santri === filterSantri.value)
  )
)

const stats = computed(() => {
  const setoran = records.value.filter(r => r.type === 'ziyadah').length
  const totalSantri = new Set(records.value.map(r => r.santri)).size
  const lancar = records.value.filter(r => r.type === 'ziyadah' && r.status === 'Lancar').length
  return [
    { label: 'Setoran Bulan Ini', icon: 'trending_up', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: setoran.toString() },
    { label: 'Total Setoran', icon: 'auto_stories', bg: 'bg-secondary-fixed', iconColor: 'text-secondary', valueColor: 'text-secondary', value: records.value.length.toString() },
    { label: 'Progress Lancar', icon: 'percent', bg: 'bg-tertiary-fixed', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: setoran > 0 ? `${Math.round(lancar / setoran * 100)}%` : '0%' },
    { label: 'Santri Aktif', icon: 'groups', bg: 'bg-error-container', iconColor: 'text-error', valueColor: 'text-on-background', value: totalSantri.toString() },
  ]
})

async function fetchData() {
  loading.value = true; errorS.value = ''
  try {
    const promises: Promise<TahfidzRecord[]>[] = []
    const params = filterSantri.value ? `?studentId=${encodeURIComponent(filterSantri.value)}` : ''
    if (activeTab.value === 'ziyadah') {
      promises.push($fetch<TahfidzRecord[]>(`/api/tahfidz/ziyadah${params}`))
      const murojaah = await $fetch<TahfidzRecord[]>('/api/tahfidz/murojaah') || []
      records.value = [...(await promises[0] || []), ...murojaah.map(r => ({ ...r, type: 'murojaah' as const }))]
    } else {
      promises.push($fetch<TahfidzRecord[]>('/api/tahfidz/ziyadah'))
      const murojaahParams = filterSantri.value ? `?studentId=${encodeURIComponent(filterSantri.value)}` : ''
      const murojaah = await $fetch<TahfidzRecord[]>(`/api/tahfidz/murojaah${murojaahParams}`) || []
      const ziyadah = await $fetch<TahfidzRecord[]>('/api/tahfidz/ziyadah') || []
      records.value = [...ziyadah.map(r => ({ ...r, type: 'ziyadah' as const })), ...murojaah.map(r => ({ ...r, type: 'murojaah' as const }))]
    }
  } catch (e: any) { errorS.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

watch(activeTab, () => fetchData())
watch(filterSantri, () => fetchData())

const defaultForm = () => ({
  id: 0,
  santri: '',
  surah: '',
  ayat: '',
  juz: '',
  halaman: '',
  status: 'Lancar',
  tanggal: new Date().toISOString().split('T')[0],
  type: 'ziyadah' as const,
})

const form = reactive(defaultForm())

watch(activeTab, () => { form.type = activeTab.value })

function openAddModal() {
  Object.assign(form, { ...defaultForm(), type: activeTab.value })
  if (activeTab.value === 'murojaah') { form.surah = ''; form.ayat = ''; form.status = '' }
  showModal.value = true
}

function closeModal() { showModal.value = false }

async function saveRecord() {
  if (!form.santri || !form.juz || !form.halaman || !form.tanggal) return
  if (activeTab.value === 'ziyadah' && (!form.surah)) return
  try {
    const payload: any = { santri: form.santri, juz: Number(form.juz), halaman: Number(form.halaman), tanggal: form.tanggal }
    const endpoint = activeTab.value === 'ziyadah' ? '/api/tahfidz/ziyadah' : '/api/tahfidz/murojaah'
    if (activeTab.value === 'ziyadah') {
      payload.surah = form.surah; payload.ayat = form.ayat; payload.status = form.status
    }
    await $fetch(endpoint, { method: 'POST', body: payload })
    closeModal(); await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menyimpan' }
}

async function deleteRecord(id: number) {
  if (!confirm('Yakin ingin menghapus data tahfidz ini?')) return
  try {
    const endpoint = activeTab.value === 'ziyadah' ? '/api/tahfidz/ziyadah' : '/api/tahfidz/murojaah'
    await $fetch(`${endpoint}/${id}`, { method: 'DELETE' })
    await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menghapus' }
}

onMounted(() => { fetchData(); fetchStudents() })
</script>
