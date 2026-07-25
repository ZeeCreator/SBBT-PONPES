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
        <h2 class="font-display text-headline-md text-primary mb-2">Masuk</h2>
        <p class="text-on-surface-variant text-label-md mb-8">Silakan masuk menggunakan akun Anda.</p>
          <form @submit.prevent="handleLogin" class="space-y-5">
            <div v-if="error" class="p-3 rounded-lg bg-error-container text-on-error-container text-label-sm flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">error</span>
              {{ error }}
            </div>

            <div class="flex bg-surface-container-low rounded-lg p-1">
              <button type="button" class="flex-1 py-2 text-center text-label-sm font-medium rounded-md transition-all" :class="loginMode === 'email' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'" @click="loginMode = 'email'">Email</button>
              <button type="button" class="flex-1 py-2 text-center text-label-sm font-medium rounded-md transition-all" :class="loginMode === 'nis' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'" @click="loginMode = 'nis'">NIS Wali Santri</button>
            </div>

            <div v-if="loginMode === 'email'" class="space-y-4">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Email</label>
                <input v-model="email" type="email" class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="admin@pesantren.sch.id" required />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Kata Sandi</label>
                <div class="relative">
                  <input v-model="password" :type="showPassword ? 'text' : 'password'" class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none pr-12" required />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" @click="showPassword = !showPassword">
                    <span class="material-symbols-outlined text-sm">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="space-y-1">
              <label class="text-label-md text-on-surface-variant">NIS Santri</label>
              <input v-model="nis" type="text" maxlength="8" class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="8 digit NIS" required />
              <p class="text-label-xs text-on-surface-variant">Masuk tanpa password menggunakan NIS santri/wali santri.</p>
            </div>

          <button type="submit" :disabled="submitting" class="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-body-md hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            <span v-if="submitting" class="material-symbols-outlined animate-spin">refresh</span>
            <span v-else class="material-symbols-outlined">login</span>
            {{ submitting ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>
        <div class="mt-8 pt-6 border-t border-outline-variant/20">
          <p class="text-center text-label-sm text-on-surface-variant mb-3">Demo Akses Cepat</p>
          <div class="grid grid-cols-3 gap-2">
            <button class="p-2 rounded-xl bg-primary-fixed/30 text-on-primary-fixed-variant text-label-sm font-semibold hover:bg-primary-fixed/50 transition-colors" @click="quickLogin('superadmin')">Admin</button>
            <button class="p-2 rounded-xl bg-secondary-fixed/30 text-on-secondary-fixed-variant text-label-sm font-semibold hover:bg-secondary-fixed/50 transition-colors" @click="quickLogin('ustadz')">Ustadz</button>
            <button class="p-2 rounded-xl bg-surface-container-high text-on-surface text-label-sm font-semibold hover:bg-surface-container-highest transition-colors" @click="quickLogin('alumni')">Alumni</button>
            <button class="p-2 rounded-xl bg-primary/10 text-primary text-label-sm font-semibold hover:bg-primary/20 transition-colors" @click="quickLogin('bendahara')">Bendahara</button>
            <button class="p-2 rounded-xl bg-primary-fixed/20 text-primary-fixed-variant text-label-sm font-semibold hover:bg-primary-fixed/40 transition-colors" @click="quickLogin('kesantrian')">Kesantrian</button>
            <button class="p-2 rounded-xl bg-secondary/10 text-secondary text-label-sm font-semibold hover:bg-secondary/20 transition-colors" @click="quickLogin('wali')">Wali</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loginMode = ref<'email' | 'nis'>('email')
const email = ref('')
const nis = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const submitting = ref(false)

const roleRoutes: Record<string, string> = {
  super_admin: '/super-admin/dashboard',
  bendahara: '/super-admin/dashboard',
  kesantrian: '/kesantrian/students',
  ustadz: '/akademik/grading',
  wali_santri: '/wali-santri/dashboard',
  alumni: '/student/dashboard',
}

async function handleLogin() {
  error.value = ''
  submitting.value = true
  try {
    const { login, loginWithNis, refreshRole, role } = useAuth()

    if (loginMode.value === 'nis') {
      const nisVal = nis.value.trim()
      if (!nisVal || nisVal.length < 4) {
        error.value = 'Masukkan NIS yang valid'
        submitting.value = false
        return
      }
      await loginWithNis(nisVal)
    } else {
      await login(email.value, password.value)
    }

    await refreshRole()
    const route = roleRoutes[role.value || '']
    if (route) navigateTo(route)
    else navigateTo('/wali-santri/dashboard')
  } catch (e: any) {
    console.error('Login error:', e)
    if (e.response?.status === 404) {
      error.value = 'NIS tidak ditemukan'
    } else if (e.response?.status === 401) {
      error.value = 'Email atau password salah'
    } else if (e.code === 'auth/invalid-email') {
      error.value = 'Format email tidak valid'
    } else if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
      error.value = 'NIS/Email atau password salah'
    } else if (e.code === 'auth/invalid-api-key') {
      error.value = 'Konfigurasi Firebase tidak valid. Restart server dan coba lagi.'
    } else if (e.code === 'auth/network-request-failed') {
      error.value = 'Koneksi internet bermasalah'
    } else {
      error.value = e.data?.statusMessage || e.message || 'Gagal masuk. Silakan coba lagi.'
    }
  } finally {
    submitting.value = false
  }
}

const roleAlias: Record<string, string> = {
  superadmin: 'super_admin',
  wali: 'wali_santri',
}

function quickLogin(role: string) {
  const resolved = roleAlias[role] || role
  const route = roleRoutes[resolved]
  if (route) navigateTo(route)
}
</script>
