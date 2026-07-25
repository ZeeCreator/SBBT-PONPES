<template>
  <div>
    <div class="mb-stack-lg flex items-center justify-between">
      <div>
        <h2 class="font-display text-headline-lg text-primary">Global Overview</h2>
        <p class="text-body-md text-on-surface-variant">Selamat datang, {{ userName }} — ringkasan ekosistem pondok.</p>
      </div>
      <span class="text-label-sm text-on-surface-variant">{{ currentDate }}</span>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <span class="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
    </div>

    <template v-else-if="error">
      <div class="p-6 rounded-xl bg-error-container text-on-error-container text-label-md">
        {{ error }}
      </div>
    </template>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
        <NuxtLink to="/kesantrian/students" class="block">
          <GlassCard hover borderColor="border-primary">
            <div class="flex justify-between items-start mb-4">
              <div class="bg-primary-fixed p-2 rounded-lg text-on-primary-fixed">
                <span class="material-symbols-outlined">group</span>
              </div>
              <span class="text-primary font-bold text-label-sm flex items-center gap-1">+{{ growthRate }}% <span class="material-symbols-outlined text-sm">trending_up</span></span>
            </div>
            <p class="text-label-md text-on-surface-variant">Total Santri</p>
            <h3 class="font-display text-display-lg text-primary-container leading-none my-2">{{ stats.totalStudents }}</h3>
            <p class="text-label-sm text-on-surface-variant/70 italic">{{ stats.activeStudents }} Aktif | {{ stats.alumniStudents }} Alumni</p>
          </GlassCard>
        </NuxtLink>
        <NuxtLink to="/settings/teachers" class="block">
          <GlassCard hover borderColor="border-secondary-container">
            <div class="flex justify-between items-start mb-4">
              <div class="bg-secondary-fixed p-2 rounded-lg text-on-secondary-fixed">
                <span class="material-symbols-outlined">person_pin</span>
              </div>
              <span class="text-secondary font-bold text-label-sm">Aktif</span>
            </div>
            <p class="text-label-md text-on-surface-variant">Total Guru</p>
            <h3 class="font-display text-display-lg text-primary-container leading-none my-2">{{ stats.totalTeachers }}</h3>
            <p class="text-label-sm text-on-surface-variant/70 italic">1:{{ stats.ratioGuru }} Rasio Guru:Santri</p>
          </GlassCard>
        </NuxtLink>
        <NuxtLink to="/keuangan/spp-payment" class="block">
          <GlassCard hover borderColor="border-primary-fixed-dim">
            <div class="flex justify-between items-start mb-4">
              <div class="bg-primary-fixed-dim/30 p-2 rounded-lg text-primary">
                <span class="material-symbols-outlined">payments</span>
              </div>
              <span class="text-primary font-bold text-label-sm">Bulan Ini</span>
            </div>
            <p class="text-label-md text-on-surface-variant">Kesehatan Keuangan</p>
            <h3 class="font-display text-display-lg text-primary-container leading-none my-2">{{ stats.financialHealth }}<span class="font-display text-headline-md">%</span></h3>
            <div class="w-full bg-surface-container-highest rounded-full h-1.5 mt-2">
              <div class="bg-primary h-1.5 rounded-full" :style="{ width: stats.financialHealth + '%' }"></div>
            </div>
          </GlassCard>
        </NuxtLink>
        <NuxtLink to="/kesantrian/students" class="block">
          <GlassCard hover borderColor="border-error">
            <div class="flex justify-between items-start mb-4">
              <div class="bg-error-container p-2 rounded-lg text-on-error-container">
                <span class="material-symbols-outlined">warning</span>
              </div>
              <span class="text-error font-bold text-label-sm">7 Hari</span>
            </div>
            <p class="text-label-md text-on-surface-variant">Pelanggaran Terbaru</p>
            <h3 class="font-display text-display-lg text-error leading-none my-2">{{ String(stats.recentViolations).padStart(2, '0') }}</h3>
            <p class="text-label-sm text-on-surface-variant/70 italic">{{ stats.pelanggaranBerat }} Berat | {{ stats.pelanggaranRingan }} Ringan</p>
          </GlassCard>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <section class="lg:col-span-2 glass-card rounded-xl shadow-sm flex flex-col h-full">
          <div class="p-6 border-b border-white/20 flex justify-between items-center">
            <div>
              <h4 class="font-display text-title-lg text-primary">Activity Feed</h4>
              <p class="text-label-md text-on-surface-variant">Log aktivitas real-time dari database</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span class="text-label-sm text-on-surface-variant">Langsung</span>
              <button class="text-primary-container hover:bg-primary-fixed/30 px-3 py-1 rounded-lg transition-colors text-label-md" @click="fetchData">Refresh</button>
            </div>
          </div>
          <div class="flex-1 p-6 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
            <div v-for="(activity, idx) in activities" :key="idx" class="flex gap-4 group">
              <div class="relative">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center z-10 relative', activity.bg]">
                  <span class="material-symbols-outlined text-sm" :class="activity.iconColor">{{ activity.icon }}</span>
                </div>
                <div v-if="idx < activities.length - 1" class="absolute top-10 left-1/2 w-0.5 h-full bg-outline-variant/30 -translate-x-1/2"></div>
              </div>
              <div>
                <p class="text-label-md text-on-background" v-html="activity.title" />
                <p class="text-label-sm text-on-surface-variant/70">{{ activity.time }}</p>
              </div>
            </div>
            <div v-if="activities.length === 0" class="text-center py-8 text-on-surface-variant text-label-md">
              Belum ada aktivitas. Mulai kelola data melalui menu sidebar.
            </div>
          </div>
        </section>
        <div class="space-y-gutter">
          <section class="glass-card rounded-xl shadow-sm p-6">
            <h4 class="font-display text-title-lg text-primary mb-4">Aksi Cepat</h4>
            <div class="grid grid-cols-1 gap-3">
              <NuxtLink to="/kesantrian/students" class="flex items-center gap-3 w-full p-4 bg-primary text-on-primary rounded-xl hover:bg-primary-container transition-all active:scale-95 text-left">
                <span class="material-symbols-outlined">person_add</span>
                <div>
                  <p class="text-label-md">Daftarkan Santri Baru</p>
                  <p class="text-[10px] opacity-70">Onboard santri baru ke sistem</p>
                </div>
              </NuxtLink>
              <NuxtLink to="/keuangan/spp-payment" class="flex items-center gap-3 w-full p-4 bg-white border border-primary text-primary rounded-xl hover:bg-primary-fixed/10 transition-all active:scale-95 text-left">
                <span class="material-symbols-outlined">payments</span>
                <div>
                  <p class="text-label-md">Kelola Pembayaran SPP</p>
                  <p class="text-[10px] text-on-surface-variant">Buat tagihan & proses pembayaran</p>
                </div>
              </NuxtLink>
              <NuxtLink to="/settings/rbac" class="flex items-center gap-3 w-full p-4 bg-white border border-outline-variant text-on-background rounded-xl hover:bg-surface-container-low transition-all active:scale-95 text-left">
                <span class="material-symbols-outlined">settings</span>
                <div>
                  <p class="text-label-md">Pengaturan Sistem</p>
                  <p class="text-[10px] text-on-surface-variant">Role & akses pengguna</p>
                </div>
              </NuxtLink>
            </div>
          </section>
          <NuxtLink to="/akademik/grading" class="block relative h-48 rounded-xl overflow-hidden shadow-sm group">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-container/80 to-primary/60 flex flex-col justify-end p-6 hover:brightness-110 transition-all">
              <p class="text-on-primary font-bold text-label-sm uppercase tracking-widest mb-1">Akademik</p>
              <h5 class="text-on-primary font-display text-headline-md mb-2">Input Nilai</h5>
              <div class="flex items-center gap-2 text-on-primary/80">
                <span class="material-symbols-outlined text-[18px]">assignment</span>
                <span class="text-label-sm">{{ classes.length }} kelas tersedia</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <section class="mt-stack-lg glass-card rounded-xl shadow-sm p-6 overflow-hidden">
        <div class="flex justify-between items-center mb-6">
          <h4 class="font-display text-title-lg text-primary">Indeks Performa Akademik</h4>
          <NuxtLink to="/akademik/curriculum" class="text-label-sm text-primary hover:underline">Kelola Kurikulum</NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-label-sm text-on-surface-variant/70 border-b border-outline-variant/20">
                <th class="pb-4 font-semibold uppercase tracking-wider">Kelas</th>
                <th class="pb-4 font-semibold uppercase tracking-wider">Rata-rata Nilai</th>
                <th class="pb-4 font-semibold uppercase tracking-wider">Absensi</th>
                <th class="pb-4 font-semibold uppercase tracking-wider">Progress</th>
                <th class="pb-4 font-semibold uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              <tr v-for="cls in classes" :key="cls.name" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(cls.id)" @change="toggleOne(cls.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                <td class="py-4 text-label-md">{{ cls.name }}</td>
                <td class="py-4"><span class="bg-primary-fixed text-on-primary-fixed px-2 py-1 rounded text-label-sm font-bold">{{ cls.avgGrade }}</span></td>
                <td class="py-4 text-label-md">{{ cls.attendance }}</td>
                <td class="py-4">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 bg-surface-container-highest rounded-full h-1 w-24">
                      <div class="bg-primary h-1 rounded-full" :style="{ width: cls.progress + '%' }"></div>
                    </div>
                    <span class="text-[10px] text-on-surface-variant">{{ cls.progress }}%</span>
                  </div>
                </td>
                <td class="py-4">
                  <NuxtLink to="/kesantrian/students" class="material-symbols-outlined text-outline hover:text-primary transition-colors">more_horiz</NuxtLink>
                </td>
              </tr>
              <tr v-if="classes.length === 0">
                <td colspan="99"  class="py-8 text-center text-on-surface-variant text-label-md">
                  Belum ada data. <NuxtLink to="/kesantrian/students" class="text-primary underline">Tambah santri</NuxtLink> untuk memulai.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(classes)
import { onMounted, onUnmounted } from 'vue'
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const { user } = useAuth()
const userName = computed(() => {
  if (user.value?.displayName) return user.value.displayName
  if (user.value?.email) return user.value.email.split('@')[0]
  return 'Admin'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
})

const loading = ref(true)
const error = ref('')

const stats = reactive({
  totalStudents: 0, activeStudents: 0, alumniStudents: 0,
  totalTeachers: 0, ratioGuru: 18,
  financialHealth: 0,
  recentViolations: 0, totalPelanggaran: 0,
  pelanggaranBerat: 0, pelanggaranRingan: 0,
  attendanceRate: 0,
})

const growthRate = computed(() => {
  return stats.activeStudents > 0 ? Math.round((stats.activeStudents / (stats.totalStudents || 1)) * 100) - 70 : 12
})

const activities = ref<Array<{
  icon: string; bg: string; iconColor: string; title: string; time: string
}>>([])

const classes = ref<Array<{
  name: string; avgGrade: string; attendance: string; progress: number
}>>([])

async function fetchData(showLoader = true) {
  if (showLoader) loading.value = true
  if (showLoader) error.value = ''

  try {
    const data = await $fetch('/api/dashboard-stats')

    stats.totalStudents = data.totalStudents
    stats.activeStudents = data.activeStudents
    stats.alumniStudents = data.alumniStudents
    stats.totalTeachers = data.totalTeachers
    stats.ratioGuru = data.ratioGuru
    stats.financialHealth = data.financialHealth
    stats.recentViolations = data.recentViolations
    stats.totalPelanggaran = data.totalPelanggaran
    stats.pelanggaranBerat = data.pelanggaranBerat
    stats.pelanggaranRingan = data.pelanggaranRingan
    stats.attendanceRate = data.attendanceRate

    activities.value = data.activities || []
    classes.value = data.classes || []
  } catch (e: any) {
    if (showLoader) error.value = 'Gagal memuat data: ' + (e.message || 'Terjadi kesalahan')
  } finally {
    if (showLoader) loading.value = false
  }
}

fetchData()

let pollTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  pollTimer = setInterval(() => fetchData(false), 30_000)
})
onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>
