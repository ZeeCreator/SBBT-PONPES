<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Registrasi Wali Santri</h2>
      <p class="text-body-md text-on-surface-variant">Buat akun wali santri yang terhubung dengan NIS santri. Login menggunakan NIS tanpa password.</p>
    </div>

    <div v-if="message" class="mb-stack-md p-4 rounded-xl text-label-sm font-medium" :class="message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">{{ message }}</div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
      <div class="glass-card rounded-2xl p-stack-md shadow-sm">
        <h3 class="font-display text-title-lg text-primary mb-4">Buat Akun Baru</h3>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="space-y-1">
            <label class="text-label-md text-on-surface-variant">NIS Santri <span class="text-error">*</span></label>
            <div class="flex gap-2">
              <input v-model="form.nis" type="text" maxlength="8" required class="flex-1 bg-surface-container-low border-none rounded-lg text-body-md p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="8 digit NIS" />
              <button type="button" class="px-3 py-2 bg-surface-container-high text-label-sm rounded-lg hover:bg-surface-container-higher transition-all" @click="lookupNIS">Cari</button>
            </div>
          </div>

          <div v-if="studentInfo" class="p-3 bg-surface-container-low rounded-lg">
            <p class="text-label-sm font-semibold text-primary">{{ studentInfo.name }}</p>
            <p class="text-label-xs text-on-surface-variant">NIS: {{ studentInfo.nis }} • Kelas: {{ studentInfo.class || '-' }}</p>
          </div>

          <button type="submit" :disabled="saving" class="w-full bg-primary text-on-primary py-3 rounded-xl text-label-md font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-60">
            {{ saving ? 'Mendaftarkan...' : 'Daftarkan Wali Santri' }}
          </button>
          <p class="text-label-xs text-on-surface-variant">Wali santri login menggunakan NIS tanpa password.</p>
        </form>
      </div>

      <div class="glass-card rounded-2xl p-stack-md shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-display text-title-lg text-primary">Akun Terdaftar</h3>
          <button class="p-2 text-on-surface-variant hover:text-primary transition-colors" @click="fetchAccounts">
            <span class="material-symbols-outlined">refresh</span>
          </button>
        </div>
        <div v-if="accounts.length === 0" class="text-center py-8 text-on-surface-variant text-label-sm">Belum ada akun wali santri terdaftar.</div>
        <div v-else class="space-y-3 max-h-96 overflow-y-auto">
          <div v-for="acct in accounts" :key="acct.nis" class="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
            <div>
              <p class="text-label-sm font-semibold">{{ acct.parentName || acct.studentName }}</p>
              <p class="text-label-xs text-on-surface-variant">NIS: {{ acct.nis }} • {{ acct.email }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">Active</span>
              <button class="p-1 text-on-surface-variant hover:text-error transition-colors" @click="removeAccount(acct)" title="Hapus akun">
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const form = reactive({ nis: '' })
const message = ref('')
const saving = ref(false)
const studentInfo = ref<any>(null)
const accounts = ref<any[]>([])

async function lookupNIS() {
  studentInfo.value = null
  if (!form.nis.trim()) return
  try {
    const students: any[] = await $fetch('/api/students')
    const found = students.find(s => s.nis === form.nis.trim())
    if (found) studentInfo.value = found
    else message.value = '❌ NIS tidak ditemukan di database santri'
  } catch (e: any) {
    message.value = `❌ Gagal mencari: ${e.message}`
  }
  setTimeout(() => { message.value = '' }, 4000)
}

async function handleRegister() {
  if (!studentInfo.value) {
    message.value = '❌ Cari NIS terlebih dahulu'
    return
  }
  saving.value = true
  try {
    const res: any = await $fetch('/api/auth/register-nis', {
      method: 'POST',
      body: { nis: form.nis.trim() },
    })
    message.value = `✅ Akun wali santri berhasil dibuat: ${res.email}`
    form.nis = ''
    studentInfo.value = null
    await fetchAccounts()
  } catch (e: any) {
    message.value = `❌ ${e.data?.statusMessage || e.message}`
  } finally { saving.value = false }
  setTimeout(() => { message.value = '' }, 5000)
}

async function fetchAccounts() {
  try {
    const all: any[] = await $fetch('/api/auth/nis-map?list=true')
    accounts.value = Array.isArray(all) ? all : []
  } catch { accounts.value = [] }
}

async function removeAccount(acct: any) {
  if (!confirm(`Hapus akun wali santri NIS ${acct.nis} (${acct.parentName})?`)) return
  try {
    await $fetch(`/api/auth/nis-map/${acct.nis}`, { method: 'DELETE' })
    message.value = `✅ Akun ${acct.email} berhasil dihapus`
    await fetchAccounts()
  } catch (e: any) {
    message.value = `❌ ${e.data?.statusMessage || e.message}`
  }
  setTimeout(() => { message.value = '' }, 5000)
}

onMounted(fetchAccounts)
</script>
