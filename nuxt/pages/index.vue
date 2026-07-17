<template>
  <div class="min-h-screen bg-mesh flex items-center justify-center p-gutter">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <div class="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span class="material-symbols-outlined text-on-primary text-4xl">school</span>
        </div>
        <h1 class="font-display text-headline-lg text-primary">SIM-PPT</h1>
        <p class="text-on-surface-variant text-body-md">Sistem Informasi Manajemen Pondok Pesantren Terpadu</p>
      </div>
      <div class="glass-card rounded-2xl p-8 shadow-xl">
        <h2 class="font-display text-headline-md text-primary mb-6">Selamat Datang</h2>
        <p class="text-on-surface-variant text-label-md mb-8">Pilih portal untuk melanjutkan:</p>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink to="/auth/login" class="p-6 rounded-2xl bg-primary text-on-primary hover:brightness-110 transition-all text-center">
            <span class="material-symbols-outlined text-3xl mb-2">admin_panel_settings</span>
            <p class="font-bold text-label-md">Admin</p>
            <p class="text-[10px] opacity-80">Dashboard Manajemen</p>
          </NuxtLink>
          <NuxtLink to="/wali-santri/dashboard" class="p-6 rounded-2xl bg-primary-container text-on-primary-container hover:brightness-110 transition-all text-center">
            <span class="material-symbols-outlined text-3xl mb-2">family_history</span>
            <p class="font-bold text-label-md">Wali Santri</p>
            <p class="text-[10px] opacity-80">Portal Orang Tua</p>
          </NuxtLink>
          <NuxtLink to="/student/dashboard" class="p-6 rounded-2xl bg-secondary-fixed text-on-secondary-fixed hover:brightness-110 transition-all text-center">
            <span class="material-symbols-outlined text-3xl mb-2">school</span>
            <p class="font-bold text-label-md">Santri</p>
            <p class="text-[10px] opacity-80">Portal Santri</p>
          </NuxtLink>
          <NuxtLink to="/kesantrian/students" class="p-6 rounded-2xl bg-surface-container-high text-on-surface hover:brightness-110 transition-all text-center">
            <span class="material-symbols-outlined text-3xl mb-2">gavel</span>
            <p class="font-bold text-label-md">Kesantrian</p>
            <p class="text-[10px] opacity-80">Manajemen Santri</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
