<template>
  <div class="min-h-screen bg-background overflow-hidden relative">
    <div class="absolute inset-0 bg-mesh pointer-events-none" />
    <div class="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
    <div class="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center p-gutter">
      <div class="text-center mb-12 animate-modal-enter">
        <div class="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20 ring-4 ring-primary/10">
          <span class="material-symbols-outlined text-on-primary text-5xl">school</span>
        </div>
        <h1 class="font-display text-display-lg text-primary mb-3 tracking-tight">SIM-PPT</h1>
        <p class="text-on-surface-variant text-body-lg max-w-md mx-auto leading-relaxed">Sistem Informasi Manajemen Pondok Pesantren Terpadu</p>
      </div>

      <div class="w-full max-w-sm animate-modal-enter" style="animation-delay: 0.15s">
        <div class="glass-card rounded-3xl p-8 shadow-xl shadow-black/5">
          <div class="text-center mb-8">
            <div class="w-12 h-12 bg-primary-fixed/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-primary text-2xl">login</span>
            </div>
            <h2 class="font-display text-title-lg text-on-surface mb-1">Masuk ke Aplikasi</h2>
            <p class="text-on-surface-variant text-label-md">Pilih portal sesuai peran Anda</p>
          </div>

          <div class="space-y-3">
            <NuxtLink to="/auth/login" class="flex items-center gap-4 w-full p-4 rounded-2xl bg-primary text-on-primary hover:brightness-110 transition-all shadow-md shadow-primary/20 group">
              <span class="material-symbols-outlined text-2xl">admin_panel_settings</span>
              <div class="text-left flex-1">
                <p class="font-bold text-label-md">Admin & Staff</p>
                <p class="text-[11px] opacity-80">Dashboard Manajemen</p>
              </div>
              <span class="material-symbols-outlined text-lg opacity-60 group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <p class="mt-10 text-[11px] text-on-surface-variant/50 text-center">&copy; {{ new Date().getFullYear() }} SIM-PPT &mdash; Pondok Pesantren Terpadu</p>
    </div>
  </div>
</template>
