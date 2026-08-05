<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Laporan & Cetak</h2>
      <p class="text-on-surface-variant text-body-md">Generate dan cetak berbagai laporan akademik dan non-akademik.</p>
    </div>

    <div class="glass-card rounded-xl p-stack-md shadow-sm mb-stack-lg">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-label-sm text-on-surface-variant">Mode:</label>
          <select v-model="mode" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
            <option value="global">Global</option>
            <option value="per-santri">Per Santri</option>
          </select>
        </div>
        <div v-if="mode === 'per-santri'" class="flex items-center gap-2 flex-1 max-w-xs">
          <span class="material-symbols-outlined text-on-surface-variant">search</span>
          <select v-model="selectedSantri" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
            <option value="">-- Pilih Santri --</option>
            <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }} ({{ s.nis || '-' }})</option>
          </select>
        </div>
        <div v-if="mode === 'global'" class="flex items-center gap-2">
          <label class="text-label-sm text-on-surface-variant">Periode:</label>
          <select v-model="selectedPeriod" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
            <option value="">Semua</option>
            <option value="bulanan">Bulanan</option>
            <option value="semester">Semester</option>
            <option value="tahunan">Tahunan</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center text-on-surface-variant py-12 text-label-md">Memuat data laporan...</div>
    <div v-else-if="error" class="text-center text-error py-12 text-label-md">{{ error }}</div>

    <template v-else-if="mode === 'global'">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
        <div v-for="stat in stats" :key="stat.label" class="glass-card p-6 rounded-xl shadow-sm text-center">
          <div class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" :class="stat.bg">
            <span class="material-symbols-outlined" :class="stat.iconColor">{{ stat.icon }}</span>
          </div>
          <p class="font-display text-headline-md" :class="stat.valueColor">{{ stat.value }}</p>
          <p class="text-label-sm text-on-surface-variant">{{ stat.label }}</p>
        </div>
      </div>
      <div v-if="generating" class="mb-stack-lg glass-card rounded-xl p-6 shadow-sm bg-primary-fixed/10 border border-primary/20">
        <div class="flex items-center gap-4">
          <span class="material-symbols-outlined text-primary animate-spin">refresh</span>
          <div>
            <p class="text-label-md font-bold text-primary">Generating {{ generating }}...</p>
            <p class="text-label-sm text-on-surface-variant">Laporan akan tersedia setelah selesai diproses.</p>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        <div v-for="rpt in filteredReports" :key="rpt.id || rpt.title" class="glass-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="rpt.bg">
              <span class="material-symbols-outlined" :class="rpt.iconColor">{{ rpt.icon }}</span>
            </div>
            <span class="text-label-sm text-on-surface-variant bg-surface-container-low px-2 py-1 rounded">{{ rpt.type }}</span>
          </div>
          <h3 class="font-display text-title-lg text-primary mb-1">{{ rpt.title }}</h3>
          <p class="text-label-sm text-on-surface-variant mb-4">{{ rpt.description }}</p>
          <div class="flex items-center justify-between">
            <span class="text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-sm align-middle mr-1">calendar_today</span>
              {{ rpt.period }}
            </span>
            <button class="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm text-sm" @click="generateReport(rpt)">
              <span class="material-symbols-outlined text-sm">download</span> Generate
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="selectedSantri">
      <div class="mb-stack-lg glass-card rounded-xl p-6 shadow-sm">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-2xl">person</span>
          </div>
          <div>
            <h3 class="font-display text-title-lg text-primary">{{ santriDetail?.name || '-' }}</h3>
            <p class="text-label-sm text-on-surface-variant">{{ santriDetail?.nis || '-' }} | {{ santriDetail?.kelas || '-' }} | {{ santriDetail?.kamar || '-' }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="s in santriStats" :key="s.label" class="text-center p-3 bg-surface-container-low rounded-lg">
            <p class="font-display text-headline-sm" :class="s.color">{{ s.value }}</p>
            <p class="text-label-sm text-on-surface-variant">{{ s.label }}</p>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <button v-for="r in santriReports" :key="r.id" class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all" @click="generateSantriReport(r)">
            <span class="material-symbols-outlined text-sm">{{ r.icon }}</span> {{ r.title }}
          </button>
        </div>
      </div>
    </template>
    <div v-else class="text-center py-12 text-on-surface-variant text-label-md">Pilih santri untuk melihat laporan individu</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const mode = ref('global')
const selectedSantri = ref('')
const selectedPeriod = ref('')
const generating = ref('')
const reports = ref<any[]>([])
const students = ref<any[]>([])
const santriDetail = ref<any>(null)
const loading = ref(true)
const error = ref('')

const filteredReports = computed(() => {
  if (!selectedPeriod.value) return reports.value
  return reports.value.filter((r: any) => r.period?.toLowerCase().includes(selectedPeriod.value))
})

const stats = computed(() => [
  { label: 'Total Laporan', icon: 'description', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: String(reports.value.length) },
  { label: 'Santri Aktif', icon: 'groups', bg: 'bg-tertiary-fixed', iconColor: 'text-tertiary', valueColor: 'text-on-background', value: '- ' },
  { label: 'Cetak Tersedia', icon: 'print', bg: 'bg-secondary-fixed', iconColor: 'text-secondary', valueColor: 'text-secondary', value: String(reports.value.filter((r: any) => r.type === 'PDF').length) },
  { label: 'Periode Aktif', icon: 'calendar_month', bg: 'bg-error-container', iconColor: 'text-error', valueColor: 'text-on-background', value: '2024/2025' },
])

const santriReports = [
  { id: 'rapor-individu', title: 'Rapor Individu', icon: 'menu_book' },
  { id: 'absensi-individu', title: 'Absensi', icon: 'calendar_month' },
  { id: 'tahfidz-individu', title: 'Tahfidz', icon: 'menu_book' },
  { id: 'pelanggaran-individu', title: 'Pelanggaran', icon: 'gavel' },
]

const santriStats = computed(() => [
  { label: 'Hadir', value: santriDetail.value?.attendance?.present || '-', color: 'text-green-600' },
  { label: 'Sakit', value: santriDetail.value?.attendance?.sick || '-', color: 'text-amber-600' },
  { label: 'Izin', value: santriDetail.value?.attendance?.permit || '-', color: 'text-blue-600' },
  { label: 'Alpa', value: santriDetail.value?.attendance?.absent || '-', color: 'text-red-600' },
])

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    const [r, s] = await Promise.all([
      $fetch('/api/laporan'),
      $fetch('/api/students')
    ])
    reports.value = r || []
    students.value = s || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data laporan'
  } finally {
    loading.value = false
  }
}

async function generateReport(rpt: any) {
  generating.value = rpt.title
  try {
    await $fetch('/api/laporan/generate', { method: 'POST', body: { reportId: rpt.id, title: rpt.title } })
  } catch (e: any) {
    error.value = e.message || 'Gagal generate laporan'
  }
  setTimeout(() => { generating.value = '' }, 3000)
}

async function generateSantriReport(rpt: any) {
  generating.value = rpt.title
  try {
    await $fetch('/api/laporan/generate', {
      method: 'POST',
      body: { reportId: rpt.id, title: rpt.title, studentId: selectedSantri.value }
    })
  } catch (e: any) {
    error.value = e.message || 'Gagal generate laporan'
  }
  setTimeout(() => { generating.value = '' }, 3000)
}

watch(selectedSantri, async (val) => {
  if (!val) { santriDetail.value = null; return }
  try {
    santriDetail.value = await $fetch(`/api/students/${val}`)
  } catch { santriDetail.value = null }
})

onMounted(() => fetchData())
</script>
