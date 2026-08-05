<template>
  <div>
    <!-- Welcome Header -->
    <div class="flex items-center justify-between mb-stack-lg">
      <div>
        <h2 class="font-display text-headline-lg text-primary">Portal Guru</h2>
        <p class="text-body-md text-on-surface-variant">Selamat datang, {{ userName }} — ringkasan aktivitas mengajar hari ini.</p>
      </div>
      <span class="text-label-sm text-on-surface-variant">{{ currentDate }}</span>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
      <GlassCard hover borderColor="border-primary">
        <div class="flex justify-between items-start mb-4">
          <div class="bg-primary-fixed p-2 rounded-lg text-on-primary-fixed">
            <span class="material-symbols-outlined">school</span>
          </div>
          <span class="text-primary font-bold text-label-sm">Hari Ini</span>
        </div>
        <p class="text-label-md text-on-surface-variant">Kelas Diajar</p>
        <h3 class="font-display text-display-lg text-primary-container leading-none my-2">{{ stats.classesToday }}</h3>
        <p class="text-label-sm text-on-surface-variant/70 italic">{{ stats.totalStudents }} total santri</p>
      </GlassCard>
      <GlassCard hover borderColor="border-secondary-container">
        <div class="flex justify-between items-start mb-4">
          <div class="bg-secondary-fixed p-2 rounded-lg text-on-secondary-fixed">
            <span class="material-symbols-outlined">group</span>
          </div>
          <span class="text-secondary font-bold text-label-sm">Aktif</span>
        </div>
        <p class="text-label-md text-on-surface-variant">Santri Bimbingan</p>
        <h3 class="font-display text-display-lg text-primary-container leading-none my-2">{{ stats.mentoredStudents }}</h3>
        <p class="text-label-sm text-on-surface-variant/70 italic">{{ stats.classes }} kelas</p>
      </GlassCard>
      <GlassCard hover borderColor="border-primary-fixed-dim">
        <div class="flex justify-between items-start mb-4">
          <div class="bg-primary-fixed-dim/30 p-2 rounded-lg text-primary">
            <span class="material-symbols-outlined">assignment</span>
          </div>
          <span class="text-primary font-bold text-label-sm">Menunggu</span>
        </div>
        <p class="text-label-md text-on-surface-variant">Verifikasi Hafalan</p>
        <h3 class="font-display text-display-lg text-primary-container leading-none my-2">{{ stats.pendingVerifications }}</h3>
        <p class="text-label-sm text-on-surface-variant/70 italic">{{ stats.completedToday }} selesai hari ini</p>
      </GlassCard>
      <GlassCard hover borderColor="border-error">
        <div class="flex justify-between items-start mb-4">
          <div class="bg-error-container p-2 rounded-lg text-on-error-container">
            <span class="material-symbols-outlined">fact_check</span>
          </div>
          <span class="text-error font-bold text-label-sm">Hari Ini</span>
        </div>
        <p class="text-label-md text-on-surface-variant">Absensi Santri</p>
        <h3 class="font-display text-display-lg text-error leading-none my-2">{{ stats.absentToday }}</h3>
        <p class="text-label-sm text-on-surface-variant/70 italic">{{ stats.presentToday }} hadir</p>
      </GlassCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
      <!-- Today's Schedule -->
      <section class="lg:col-span-2 glass-card rounded-xl shadow-sm flex flex-col h-full">
        <div class="p-6 border-b border-white/20 flex justify-between items-center">
          <div>
            <h4 class="font-display text-title-lg text-primary">Jadwal Mengajar Hari Ini</h4>
            <p class="text-label-md text-on-surface-variant">{{ schedule.length }} sesi pelajaran</p>
          </div>
          <button class="text-primary-container hover:bg-primary-fixed/30 px-3 py-1 rounded-lg transition-colors text-label-md">Lihat Semua</button>
        </div>
        <div class="flex-1 p-6 space-y-4">
          <div v-for="(item, idx) in schedule" :key="idx" class="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-white/50">
            <div class="text-center min-w-[56px]">
              <p class="text-label-sm font-bold text-primary">{{ item.time }}</p>
              <span :class="['text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block', item.status === 'Berlangsung' ? 'bg-green-100 text-green-700' : item.status === 'Selesai' ? 'bg-surface-container-high text-on-surface-variant' : 'bg-blue-100 text-blue-700']">{{ item.status }}</span>
            </div>
            <div class="flex-1">
              <p class="text-label-md font-medium text-on-surface">{{ item.subject }}</p>
              <p class="text-label-sm text-on-surface-variant">{{ item.class }} &bull; {{ item.room }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-label-sm text-on-surface-variant">{{ item.students }} santri</span>
              <button class="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                <span class="material-symbols-outlined text-sm text-primary">arrow_forward</span>
              </button>
            </div>
          </div>
          <div v-if="schedule.length === 0" class="text-center py-8 text-on-surface-variant text-label-md">
            Tidak ada jadwal mengajar hari ini.
          </div>
        </div>
      </section>

      <!-- Right Column -->
      <div class="space-y-gutter">
        <!-- Quick Input Nilai -->
        <section class="glass-card rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-display text-title-lg text-primary">Input Nilai Cepat</h4>
            <span class="material-symbols-outlined text-on-surface-variant/40">edit_note</span>
          </div>
          <div class="space-y-3">
            <div v-for="(cls, idx) in quickGradeClasses" :key="idx" class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer">
              <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                <span class="material-symbols-outlined text-sm text-primary">description</span>
              </div>
              <div class="flex-1">
                <p class="text-label-md text-on-surface">{{ cls.name }}</p>
                <p class="text-[11px] text-on-surface-variant">{{ cls.subject }} &bull; {{ cls.count }} santri</p>
              </div>
              <button class="px-4 py-1.5 bg-primary text-on-primary text-[11px] font-bold rounded-lg hover:bg-primary-container transition-colors">Nilai</button>
            </div>
          </div>
        </section>

        <!-- Verifikasi Setoran Hafalan -->
        <section class="glass-card rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-display text-title-lg text-primary">Verifikasi Hafalan</h4>
            <span class="w-6 h-6 rounded-full bg-error-container flex items-center justify-center">
              <span class="text-[10px] font-bold text-on-error-container">{{ tahfidzPending.length }}</span>
            </span>
          </div>
          <div class="space-y-3">
            <div v-for="(item, idx) in tahfidzPending" :key="idx" class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
              <div class="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center">
                <span class="material-symbols-outlined text-sm text-secondary">menu_book</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-label-md text-on-surface truncate">{{ item.name }}</p>
                <p class="text-[11px] text-on-surface-variant">{{ item.surah }} {{ item.ayat }} &bull; {{ item.time }}</p>
              </div>
              <div class="flex gap-1">
                <button class="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  <span class="material-symbols-outlined text-sm">check</span>
                </button>
                <button class="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                  <span class="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
            <div v-if="tahfidzPending.length === 0" class="text-center py-4 text-on-surface-variant text-label-md">
              Tidak ada verifikasi menunggu.
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Menu Cards & Activity Feed -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
      <!-- Menu Cards -->
      <div class="grid grid-cols-2 gap-gutter">
        <NuxtLink to="/akademik/grading" class="glass-card rounded-xl p-6 shadow-sm hover:scale-[1.02] transition-transform text-center flex flex-col items-center gap-3 border-l-4 border-primary">
          <div class="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center">
            <span class="material-symbols-outlined text-primary">edit_note</span>
          </div>
          <h5 class="font-display text-title-lg text-primary">Input Nilai</h5>
          <p class="text-label-sm text-on-surface-variant">Kelola penilaian akademik</p>
        </NuxtLink>
        <NuxtLink to="/attendance" class="glass-card rounded-xl p-6 shadow-sm hover:scale-[1.02] transition-transform text-center flex flex-col items-center gap-3 border-l-4 border-secondary-container">
          <div class="w-12 h-12 bg-secondary-fixed rounded-xl flex items-center justify-center">
            <span class="material-symbols-outlined text-secondary">how_to_reg</span>
          </div>
          <h5 class="font-display text-title-lg text-secondary">Absensi</h5>
          <p class="text-label-sm text-on-surface-variant">Rekam kehadiran santri</p>
        </NuxtLink>
        <NuxtLink to="/jadwal" class="glass-card rounded-xl p-6 shadow-sm hover:scale-[1.02] transition-transform text-center flex flex-col items-center gap-3 border-l-4 border-primary-fixed-dim">
          <div class="w-12 h-12 bg-primary-fixed-dim/30 rounded-xl flex items-center justify-center">
            <span class="material-symbols-outlined text-primary">calendar_month</span>
          </div>
          <h5 class="font-display text-title-lg text-primary">Jadwal Mengajar</h5>
          <p class="text-label-sm text-on-surface-variant">Lihat jadwal pelajaran</p>
        </NuxtLink>
        <NuxtLink to="/tahfidz" class="glass-card rounded-xl p-6 shadow-sm hover:scale-[1.02] transition-transform text-center flex flex-col items-center gap-3 border-l-4 border-error">
          <div class="w-12 h-12 bg-error-container rounded-xl flex items-center justify-center">
            <span class="material-symbols-outlined text-error">menu_book</span>
          </div>
          <h5 class="font-display text-title-lg text-error">Tahfidz</h5>
          <p class="text-label-sm text-on-surface-variant">Verifikasi setoran hafalan</p>
        </NuxtLink>
      </div>

      <!-- Recent Activity Feed -->
      <section class="lg:col-span-2 glass-card rounded-xl shadow-sm flex flex-col h-full">
        <div class="p-6 border-b border-white/20 flex justify-between items-center">
          <div>
            <h4 class="font-display text-title-lg text-primary">Aktivitas Terbaru</h4>
            <p class="text-label-md text-on-surface-variant">Log aktivitas mengajar dan bimbingan</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span class="text-label-sm text-on-surface-variant">Langsung</span>
            <button class="text-primary-container hover:bg-primary-fixed/30 px-3 py-1 rounded-lg transition-colors text-label-md">Refresh</button>
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
            Belum ada aktivitas hari ini.
          </div>
        </div>
      </section>
    </div>

    <!-- Quick Actions -->
    <section class="mt-stack-lg glass-card rounded-xl shadow-sm p-6">
      <h4 class="font-display text-title-lg text-primary mb-4">Aksi Cepat</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <NuxtLink to="/akademik/grading" class="flex items-center gap-3 w-full p-4 bg-primary text-on-primary rounded-xl hover:bg-primary-container transition-all active:scale-95 text-left">
          <span class="material-symbols-outlined">edit_note</span>
          <div>
            <p class="text-label-md">Input Nilai</p>
            <p class="text-[10px] opacity-70">Beri penilaian untuk kelas</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/attendance" class="flex items-center gap-3 w-full p-4 bg-white border border-primary text-primary rounded-xl hover:bg-primary-fixed/10 transition-all active:scale-95 text-left">
          <span class="material-symbols-outlined">how_to_reg</span>
          <div>
            <p class="text-label-md">Rekam Absensi</p>
            <p class="text-[10px] text-on-surface-variant">Catat kehadiran santri</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/tahfidz" class="flex items-center gap-3 w-full p-4 bg-white border border-outline-variant text-on-background rounded-xl hover:bg-surface-container-low transition-all active:scale-95 text-left">
          <span class="material-symbols-outlined">menu_book</span>
          <div>
            <p class="text-label-md">Verifikasi Hafalan</p>
            <p class="text-[10px] text-on-surface-variant">Setoran tahfidz santri</p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'ustadz', requiredRole: 'ustadz' })

const { user } = useAuth()
const userName = computed(() => {
  if (user.value?.displayName) return user.value.displayName
  if (user.value?.email) return user.value.email.split('@')[0]
  return 'Ustadz'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
})

const stats = {
  classesToday: 4,
  totalStudents: 98,
  mentoredStudents: 42,
  classes: 3,
  pendingVerifications: 7,
  completedToday: 12,
  absentToday: 3,
  presentToday: 95,
}

const schedule = [
  { time: '07:00 - 08:30', subject: "Al-Qur'an & Tajwid", class: 'Kelas 11-A', room: 'Ruang 3', students: 24, status: 'Selesai' },
  { time: '08:45 - 10:15', subject: 'Hadits & Fiqih', class: 'Kelas 12-B', room: 'Ruang 5', students: 22, status: 'Selesai' },
  { time: '10:30 - 12:00', subject: 'Tahfidz Program', class: 'Kelas 11-A', room: 'Lab Tahfidz', students: 24, status: 'Berlangsung' },
  { time: '13:00 - 14:30', subject: 'Sejarah Kebudayaan Islam', class: 'Kelas 10-C', room: 'Ruang 2', students: 28, status: 'Akan Datang' },
]

const quickGradeClasses = [
  { name: 'Kelas 11-A', subject: "Al-Qur'an & Tajwid", count: 24 },
  { name: 'Kelas 12-B', subject: 'Hadits & Fiqih', count: 22 },
  { name: 'Kelas 10-C', subject: 'SKI', count: 28 },
]

const tahfidzPending = [
  { name: 'Ahmad Farhan', surah: 'Al-Mulk', ayat: '1-10', time: '5 menit lalu' },
  { name: 'Muhammad Rizky', surah: 'Yasin', ayat: '1-15', time: '12 menit lalu' },
  { name: 'Zidni Fikri', surah: "Ar-Rahman", ayat: '1-20', time: '30 menit lalu' },
  { name: 'Abdullah Nazri', surah: "Al-Kahfi", ayat: '1-10', time: '1 jam lalu' },
]

const activities = [
  { icon: 'assignment', bg: 'bg-primary-fixed', iconColor: 'text-primary', title: 'Input nilai untuk <strong>Kelas 11-A</strong> — Al-Qur\'an & Tajwid', time: '10 menit lalu' },
  { icon: 'how_to_reg', bg: 'bg-secondary-fixed', iconColor: 'text-secondary', title: 'Absensi <strong>Kelas 12-B</strong> selesai — 22 hadir, 1 izin', time: '30 menit lalu' },
  { icon: 'menu_book', bg: 'bg-error-container', iconColor: 'text-error', title: '<strong>Ahmad Farhan</strong> setoran hafalan Al-Mulk ayat 1-10 — menunggu verifikasi', time: '45 menit lalu' },
  { icon: 'check_circle', bg: 'bg-green-100', iconColor: 'text-green-700', title: '<strong>Muhammad Rizky</strong> verifikasi tahfidz disetujui — Yasin 1-15', time: '1 jam lalu' },
  { icon: 'warning', bg: 'bg-amber-100', iconColor: 'text-amber-700', title: '<strong>Abdullah Nazri</strong> terlambat masuk kelas — poin pelanggaran: -5', time: '2 jam lalu' },
]
</script>
