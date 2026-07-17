<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-headline-lg font-bold">Master Data</h1>
    </div>
    <p class="text-body-md text-on-surface/60 max-w-2xl">
      Kelola data inti pondok — kelas, kamar, guru, mata pelajaran, dan pengaturan tahun ajaran.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="card in cards"
        :key="card.to"
        :to="card.to"
        class="group block rounded-xl border border-outline/20 bg-surface p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-primary text-2xl">{{ card.icon }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-body-lg group-hover:text-primary transition-colors">{{ card.label }}</h3>
            <p class="text-body-sm text-on-surface/50 mt-1">{{ card.desc }}</p>
          </div>
          <span class="material-symbols-outlined text-on-surface/30 group-hover:text-primary/60 transition-colors">chevron_right</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin' })

const cards = [
  { label: 'Kelas & Tingkatan', icon: 'layers', to: '/master-data/classes', desc: 'Atur kelas, tingkatan, dan rombongan belajar' },
  { label: 'Gedung & Kamar', icon: 'domain', to: '/master-data/dormitories', desc: 'Kelola gedung, lantai, dan kamar santri' },
  { label: 'Tahun Ajaran', icon: 'calendar_today', to: '/master-data/academic-years', desc: 'Tentukan tahun ajaran aktif' },
  { label: 'Periode', icon: 'date_range', to: '/master-data/periods', desc: 'Atur periode dalam tahun ajaran' },
  { label: 'Guru / Ustadz', icon: 'badge', to: '/settings/teachers', desc: 'Data tenaga pengajar dan wali kelas' },
  { label: 'Mata Pelajaran', icon: 'menu_book', to: '/akademik/curriculum', desc: 'Kurikulum dan daftar mata pelajaran' },
]
</script>
