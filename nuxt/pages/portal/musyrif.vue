<template>
  <div>
    <!-- Welcome Header -->
    <div class="flex items-center justify-between mb-stack-lg">
      <div>
        <h2 class="font-display text-headline-lg text-primary">Portal Musyrif/Musyrifah</h2>
        <p class="text-body-md text-on-surface-variant">Selamat datang, {{ userName }} — pantau aktivitas santri di asrama.</p>
      </div>
      <span class="text-label-sm text-on-surface-variant">{{ currentDate }}</span>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
      <GlassCard hover borderColor="border-primary">
        <div class="flex justify-between items-start mb-4">
          <div class="bg-primary-fixed p-2 rounded-lg text-on-primary-fixed">
            <span class="material-symbols-outlined">bed</span>
          </div>
          <span class="text-primary font-bold text-label-sm">Asrama</span>
        </div>
        <p class="text-label-md text-on-surface-variant">Santri Binaan</p>
        <h3 class="font-display text-display-lg text-primary-container leading-none my-2">{{ stats.totalStudents }}</h3>
        <p class="text-label-sm text-on-surface-variant/70 italic">{{ stats.dormitory }}</p>
      </GlassCard>
      <GlassCard hover borderColor="border-secondary-container">
        <div class="flex justify-between items-start mb-4">
          <div class="bg-secondary-fixed p-2 rounded-lg text-on-secondary-fixed">
            <span class="material-symbols-outlined">fact_check</span>
          </div>
          <span class="text-secondary font-bold text-label-sm">Hari Ini</span>
        </div>
        <p class="text-label-md text-on-surface-variant">Laporan Mutaaba'ah</p>
        <h3 class="font-display text-display-lg text-primary-container leading-none my-2">{{ stats.todayReports }}</h3>
        <p class="text-label-sm text-on-surface-variant/70 italic">{{ stats.reportPercentage }}% dari total santri</p>
      </GlassCard>
      <GlassCard hover borderColor="border-primary-fixed-dim">
        <div class="flex justify-between items-start mb-4">
          <div class="bg-primary-fixed-dim/30 p-2 rounded-lg text-primary">
            <span class="material-symbols-outlined">pending_actions</span>
          </div>
          <span class="text-primary font-bold text-label-sm">Menunggu</span>
        </div>
        <p class="text-label-md text-on-surface-variant">Approval Izin</p>
        <h3 class="font-display text-display-lg text-primary-container leading-none my-2">{{ stats.pendingApprovals }}</h3>
        <p class="text-label-sm text-on-surface-variant/70 italic">{{ stats.approvedToday }} disetujui hari ini</p>
      </GlassCard>
      <GlassCard hover borderColor="border-error">
        <div class="flex justify-between items-start mb-4">
          <div class="bg-error-container p-2 rounded-lg text-on-error-container">
            <span class="material-symbols-outlined">gavel</span>
          </div>
          <span class="text-error font-bold text-label-sm">7 Hari</span>
        </div>
        <p class="text-label-md text-on-surface-variant">Pelanggaran</p>
        <h3 class="font-display text-display-lg text-error leading-none my-2">{{ String(stats.violationsThisWeek).padStart(2, '0') }}</h3>
        <p class="text-label-sm text-on-surface-variant/70 italic">{{ stats.severeViolations }} berat | {{ stats.minorViolations }} ringan</p>
      </GlassCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
      <!-- Daily Student Report (Mutaaba'ah) -->
      <section class="lg:col-span-2 glass-card rounded-xl shadow-sm flex flex-col h-full">
        <div class="p-6 border-b border-white/20 flex justify-between items-center">
          <div>
            <h4 class="font-display text-title-lg text-primary">Mutaaba'ah Santri Hari Ini</h4>
            <p class="text-label-md text-on-surface-variant">Laporan harian ibadah dan aktivitas santri</p>
          </div>
          <button class="text-primary-container hover:bg-primary-fixed/30 px-3 py-1 rounded-lg transition-colors text-label-md">Lihat Semua</button>
        </div>
        <div class="flex-1 p-6 space-y-4 max-h-[420px] overflow-y-auto custom-scrollbar">
          <div v-for="(report, idx) in dailyReports" :key="idx" class="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-white/50">
            <div :class="['w-10 h-10 rounded-full flex items-center justify-center shrink-0', report.avatarBg]">
              <span class="text-label-sm font-bold">{{ report.initials }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-label-md font-medium text-on-surface">{{ report.name }}</p>
              <div class="flex flex-wrap gap-2 mt-1">
                <span v-for="(badge, bidx) in report.badges" :key="bidx" :class="['text-[10px] px-2 py-0.5 rounded-full font-medium', badge.class]">
                  {{ badge.label }}
                </span>
              </div>
            </div>
            <div class="shrink-0">
              <span :class="['text-label-sm font-bold', report.score >= 90 ? 'text-green-600' : report.score >= 75 ? 'text-amber-600' : 'text-red-600']">{{ report.score }}</span>
              <p class="text-[10px] text-on-surface-variant text-right">skor</p>
            </div>
          </div>
          <div v-if="dailyReports.length === 0" class="text-center py-8 text-on-surface-variant text-label-md">
            Belum ada laporan mutaaba'ah hari ini.
          </div>
        </div>
      </section>

      <!-- Right Column -->
      <div class="space-y-gutter">
        <!-- Monitoring Card -->
        <section class="glass-card rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-display text-title-lg text-primary">Monitoring Hari Ini</h4>
            <span class="material-symbols-outlined text-on-surface-variant/40">monitoring</span>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center">
                  <span class="material-symbols-outlined text-sm text-primary">mosque</span>
                </div>
                <div>
                  <p class="text-label-md text-on-surface">Sholat Berjamaah</p>
                  <p class="text-[10px] text-on-surface-variant">Subuh, Dzuhur, Ashar, Maghrib, Isya</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-label-sm font-bold text-primary">{{ monitoring.prayerAttendance }}%</p>
                <p class="text-[10px] text-on-surface-variant">rata-rata</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-secondary-fixed flex items-center justify-center">
                  <span class="material-symbols-outlined text-sm text-secondary">cleaning_services</span>
                </div>
                <div>
                  <p class="text-label-md text-on-surface">Piket Kebersihan</p>
                  <p class="text-[10px] text-on-surface-variant">{{ monitoring.piketDone }} dari {{ monitoring.piketTotal }} selesai</p>
                </div>
              </div>
              <div :class="['text-label-sm font-bold', monitoring.piketDone === monitoring.piketTotal ? 'text-green-600' : 'text-amber-600']">
                {{ monitoring.piketDone }}/{{ monitoring.piketTotal }}
              </div>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-error-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-sm text-error">gavel</span>
                </div>
                <div>
                  <p class="text-label-md text-on-surface">Pelanggaran</p>
                  <p class="text-[10px] text-on-surface-variant">{{ monitoring.todayViolations }} kejadian hari ini</p>
                </div>
              </div>
              <span class="text-label-sm font-bold text-error">{{ monitoring.todayViolations }}</span>
            </div>
          </div>
        </section>

        <!-- Approval Queue -->
        <section class="glass-card rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-display text-title-lg text-primary">Izin Santri</h4>
            <span class="w-6 h-6 rounded-full bg-error-container flex items-center justify-center">
              <span class="text-[10px] font-bold text-on-error-container">{{ permits.length }}</span>
            </span>
          </div>
          <div class="space-y-3">
            <div v-for="(permit, idx) in permits" :key="idx" class="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low">
              <div class="w-9 h-9 rounded-full bg-primary-fixed-dim/30 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-sm text-primary">person</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-label-md text-on-surface truncate">{{ permit.name }}</p>
                <p class="text-[10px] text-on-surface-variant">{{ permit.reason }} &bull; {{ permit.time }}</p>
                <p class="text-[10px] text-surface-variant italic">{{ permit.date }}</p>
              </div>
              <div class="flex gap-1 shrink-0">
                <button class="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  <span class="material-symbols-outlined text-sm">check</span>
                </button>
                <button class="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                  <span class="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
            <div v-if="permits.length === 0" class="text-center py-4 text-on-surface-variant text-label-md">
              Tidak ada izin yang menunggu.
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Quick Actions -->
    <section class="mt-stack-lg glass-card rounded-xl shadow-sm p-6">
      <h4 class="font-display text-title-lg text-primary mb-4">Aksi Cepat</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button class="flex items-center gap-3 w-full p-4 bg-primary text-on-primary rounded-xl hover:bg-primary-container transition-all active:scale-95 text-left">
          <span class="material-symbols-outlined">how_to_reg</span>
          <div>
            <p class="text-label-md">Rekam Absensi</p>
            <p class="text-[10px] opacity-70">Catat kehadiran harian santri</p>
          </div>
        </button>
        <button class="flex items-center gap-3 w-full p-4 bg-white border border-primary text-primary rounded-xl hover:bg-primary-fixed/10 transition-all active:scale-95 text-left">
          <span class="material-symbols-outlined">add_alert</span>
          <div>
            <p class="text-label-md">Lapor Pelanggaran</p>
            <p class="text-[10px] text-on-surface-variant">Catat pelanggaran santri</p>
          </div>
        </button>
        <button class="flex items-center gap-3 w-full p-4 bg-white border border-outline-variant text-on-background rounded-xl hover:bg-surface-container-low transition-all active:scale-95 text-left">
          <span class="material-symbols-outlined">approval</span>
          <div>
            <p class="text-label-md">Approve Izin</p>
            <p class="text-[10px] text-on-surface-variant">Setujui atau tolak permohonan izin</p>
          </div>
        </button>
      </div>
    </section>

    <!-- Recent Activity Feed -->
    <section class="mt-stack-lg glass-card rounded-xl shadow-sm flex flex-col h-full">
      <div class="p-6 border-b border-white/20 flex justify-between items-center">
        <div>
          <h4 class="font-display text-title-lg text-primary">Aktivitas Terbaru</h4>
          <p class="text-label-md text-on-surface-variant">Log aktivitas harian asrama</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span class="text-label-sm text-on-surface-variant">Langsung</span>
        </div>
      </div>
      <div class="flex-1 p-6 space-y-6 max-h-[300px] overflow-y-auto custom-scrollbar">
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
          Belum ada aktivitas hari ini.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'kesantrian', requiredRole: 'kesantrian' })

const { user } = useAuth()
const userName = computed(() => {
  if (user.value?.displayName) return user.value.displayName
  if (user.value?.email) return user.value.email.split('@')[0]
  return 'Musyrif'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
})

const stats = {
  totalStudents: 48,
  dormitory: 'Al-Ghazali Lantai 3',
  todayReports: 42,
  reportPercentage: 88,
  pendingApprovals: 5,
  approvedToday: 8,
  violationsThisWeek: 7,
  severeViolations: 2,
  minorViolations: 5,
}

const dailyReports = [
  {
    name: 'Ahmad Farhan', initials: 'AF', avatarBg: 'bg-primary-fixed text-primary', score: 95,
    badges: [
      { label: 'Subuh ✅', class: 'bg-green-100 text-green-700' },
      { label: 'Tahfidz 📖', class: 'bg-blue-100 text-blue-700' },
    ],
  },
  {
    name: 'Muhammad Rizky', initials: 'MR', avatarBg: 'bg-secondary-fixed text-secondary', score: 88,
    badges: [
      { label: 'Subuh ✅', class: 'bg-green-100 text-green-700' },
      { label: 'Piket 🧹', class: 'bg-purple-100 text-purple-700' },
    ],
  },
  {
    name: 'Zidni Fikri', initials: 'ZF', avatarBg: 'bg-primary-fixed-dim text-primary', score: 72,
    badges: [
      { label: 'Subuh ❌', class: 'bg-red-100 text-red-700' },
      { label: 'Maghrib ✅', class: 'bg-green-100 text-green-700' },
    ],
  },
  {
    name: 'Abdullah Nazri', initials: 'AN', avatarBg: 'bg-error-container text-error', score: 65,
    badges: [
      { label: 'Subuh ❌', class: 'bg-red-100 text-red-700' },
      { label: 'Piket ❌', class: 'bg-red-100 text-red-700' },
    ],
  },
  {
    name: 'Hafidz Al-Fatih', initials: 'HF', avatarBg: 'bg-primary-fixed text-primary', score: 98,
    badges: [
      { label: 'Subuh ✅', class: 'bg-green-100 text-green-700' },
      { label: 'Tahajjud 🌙', class: 'bg-indigo-100 text-indigo-700' },
    ],
  },
]

const monitoring = {
  prayerAttendance: 85,
  piketDone: 10,
  piketTotal: 12,
  todayViolations: 3,
}

const permits = [
  { name: 'Ahmad Farhan', reason: 'Izin pulang (acara keluarga)', time: '10:30 - 16:00', date: 'Besok, 15 Jul 2026' },
  { name: 'Muhammad Rizky', reason: 'Berobat ke klinik', time: '08:00 - 11:00', date: 'Hari ini, 14 Jul 2026' },
  { name: 'Hafidz Al-Fatih', reason: 'Izin keluar (urusan pribadi)', time: '09:00 - 12:00', date: 'Hari ini, 14 Jul 2026' },
  { name: 'Zidni Fikri', reason: 'Konsultasi psikolog', time: '13:00 - 15:00', date: 'Besok, 15 Jul 2026' },
  { name: 'Abdullah Nazri', reason: 'Menjenguk orang tua sakit', time: '07:00 - 17:00', date: 'Lusa, 16 Jul 2026' },
]

const activities = [
  { icon: 'fact_check', bg: 'bg-primary-fixed', iconColor: 'text-primary', title: '<strong>42</strong> santri mengisi laporan mutaaba\'ah hari ini', time: '10 menit lalu' },
  { icon: 'approval', bg: 'bg-secondary-fixed', iconColor: 'text-secondary', title: '<strong>Izin Ahmad Farhan</strong> — pulang acara keluarga menunggu approval', time: '25 menit lalu' },
  { icon: 'gavel', bg: 'bg-error-container', iconColor: 'text-error', title: '<strong>Abdullah Nazri</strong> — pelanggaran: tidak ikut sholat Subuh berjamaah', time: '1 jam lalu' },
  { icon: 'cleaning_services', bg: 'bg-purple-100', iconColor: 'text-purple-700', title: '<strong>Piket kebersihan</strong> — 10 dari 12 santri sudah melaksanakan piket', time: '2 jam lalu' },
  { icon: 'check_circle', bg: 'bg-green-100', iconColor: 'text-green-700', title: '<strong>Izin Muhammad Rizky</strong> — berobat ke klinik telah disetujui', time: '3 jam lalu' },
]
</script>
