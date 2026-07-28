<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <NuxtLink to="/wa-gateway" class="inline-flex items-center gap-1 text-primary text-label-md hover:underline mb-2">
        <span class="material-symbols-outlined text-sm">arrow_back</span> Kembali
      </NuxtLink>
      <h2 class="font-display text-headline-lg text-primary">Pengaturan WA Gateway</h2>
      <p class="text-on-surface-variant text-body-md">Konfigurasi provider WhatsApp Gateway</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
      <div class="lg:col-span-2 space-y-gutter">
        <div class="glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-6">Konfigurasi Provider</h3>
          <form @submit.prevent="saveSettings" class="space-y-5">
            <div class="flex items-center gap-4 mb-4">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="form.isActive" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <div>
                <p class="text-label-md font-bold">Aktifkan Gateway</p>
                <p class="text-label-sm text-on-surface-variant">Aktifkan/nonaktifkan pengiriman pesan</p>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Pilih Provider</label>
              <select v-model="form.provider" @change="onProviderChange" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none">
                <option v-for="p in providerOptions" :key="p.id" :value="p.id">{{ p.label }}</option>
              </select>
              <p class="text-label-sm text-on-surface-variant mt-1">{{ selectedProvider?.description }}</p>
              <a v-if="selectedProvider?.docsUrl" :href="selectedProvider.docsUrl" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-primary text-label-sm hover:underline mt-1">
                <span class="material-symbols-outlined text-xs">open_in_new</span> Dokumentasi {{ selectedProvider.label }}
              </a>
            </div>

            <template v-if="selectedProvider">
              <div v-for="field in selectedProvider.configFields" :key="field.key" class="space-y-1">
                <label class="text-label-md text-on-surface-variant">
                  {{ field.label }}
                  <span v-if="field.required" class="text-error">*</span>
                </label>
                <input v-if="field.type === 'password'"
                  v-model="form[field.key as keyof typeof form]"
                  :type="field.type"
                  :required="field.required"
                  :placeholder="field.placeholder"
                  class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
                <input v-else
                  v-model="form[field.key as keyof typeof form]"
                  :type="field.type"
                  :required="field.required"
                  :placeholder="field.placeholder"
                  class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
                <p v-if="field.helpText" class="text-label-sm text-on-surface-variant mt-1">{{ field.helpText }}</p>
              </div>
            </template>

            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Webhook Secret</label>
              <input v-model="form.webhookSecret" type="text" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="Untuk verifikasi callback dari provider" />
              <p class="text-label-sm text-on-surface-variant mt-1">Gunakan untuk verifikasi webhook dari provider</p>
            </div>

            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Batas Harian</label>
              <input v-model.number="form.dailyLimit" type="number" min="1" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
              <p class="text-label-sm text-on-surface-variant mt-1">Batas maksimal pengiriman per hari</p>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button type="submit" :disabled="saving" class="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-body-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60">
                <span v-if="saving" class="material-symbols-outlined animate-spin text-sm">refresh</span>
                {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
              </button>
              <span v-if="saved" class="text-green-600 text-label-md flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">check_circle</span> Tersimpan
              </span>
            </div>
            <p v-if="err" class="text-error text-label-sm">{{ err }}</p>
          </form>
        </div>
      </div>

      <div class="space-y-gutter">
        <div class="glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-4">Webhook URL</h3>
          <p class="text-label-sm text-on-surface-variant mb-3">Atur URL ini di dashboard provider WA untuk menerima status pengiriman:</p>
          <div class="bg-primary-container/10 rounded-lg p-3">
            <code class="text-label-sm text-primary break-all">{{ webhookUrl }}</code>
          </div>
          <button @click="copyUrl" class="mt-3 text-primary text-label-sm hover:underline flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">content_copy</span> Salin URL
          </button>
        </div>

        <div class="glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-4">Provider Tersedia</h3>
          <div class="space-y-3">
            <div v-for="p in providerOptions" :key="p.id"
              @click="form.provider = p.id; onProviderChange()"
              class="p-3 rounded-xl cursor-pointer transition-all border-2"
              :class="form.provider === p.id ? 'border-primary bg-primary-fixed/10' : 'border-transparent bg-surface-container-low hover:border-outline-variant/30'">
              <p class="text-label-md font-bold">{{ p.label }}</p>
              <p class="text-label-sm text-on-surface-variant">{{ p.description }}</p>
            </div>
          </div>
        </div>

        <div class="glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-4">Informasi</h3>
          <div class="space-y-3 text-label-sm text-on-surface-variant">
            <p>Pilih provider yang tersedia. Setiap provider membutuhkan konfigurasi API Key yang valid.</p>
            <p>Webhook digunakan untuk menerima status pengiriman dan pesan masuk dari provider.</p>
            <p>Simpan API Key dengan aman. Jangan bagikan ke pihak tidak berwenang.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })
const { getSettings, updateSettings, getProviders } = useWaGateway()

interface ProviderOption {
  id: string
  label: string
  description: string
  docsUrl?: string
  configFields: { key: string; label: string; type: string; required: boolean; placeholder?: string; helpText?: string }[]
}

interface FormState {
  provider: string
  apiKey: string
  endpointUrl: string
  webhookSecret: string
  isActive: boolean
  senderName: string
  dailyLimit: number
  deviceId: string
}

const providerOptions = ref<ProviderOption[]>([])
const selectedProvider = computed(() => providerOptions.value.find(p => p.id === form.provider) || null)

const form = reactive<FormState>({
  provider: 'fonnte',
  apiKey: '',
  endpointUrl: '',
  webhookSecret: '',
  isActive: false,
  senderName: 'PONPES SBBT',
  dailyLimit: 500,
  deviceId: '',
})
const saving = ref(false)
const saved = ref(false)
const err = ref('')
const webhookUrl = ref('')

function copyUrl() {
  navigator.clipboard.writeText(webhookUrl.value)
}

function onProviderChange() {
  const p = selectedProvider.value
  if (!p) return
  const definedKeys = p.configFields.map(f => f.key)
  const defaults: Record<string, string> = { senderName: '', endpointUrl: '', apiKey: '', deviceId: '' }
  for (const [key, val] of Object.entries(defaults)) {
    if (!definedKeys.includes(key)) (form as any)[key] = val
  }
}

async function load() {
  try {
    const [s, providers] = await Promise.all([
      getSettings(),
      getProviders(),
    ])
    providerOptions.value = providers
    Object.assign(form, s)
    webhookUrl.value = `${window.location.origin}/api/wa/webhook`
  } catch (e: any) {
    err.value = e.message
  }
}

async function saveSettings() {
  saving.value = true
  saved.value = false
  err.value = ''
  try {
    await updateSettings({ ...form })
    saved.value = true
    setTimeout(() => saved.value = false, 3000)
  } catch (e: any) {
    err.value = e.message
  } finally {
    saving.value = false
  }
}

load()
</script>
