<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <NuxtLink to="/wa-gateway" class="inline-flex items-center gap-1 text-primary text-label-md hover:underline mb-2">
        <span class="material-symbols-outlined text-sm">arrow_back</span> Kembali
      </NuxtLink>
      <h2 class="font-display text-headline-lg text-primary">Broadcast Pesan</h2>
      <p class="text-on-surface-variant text-body-md">Kirim pesan massal ke banyak nomor WhatsApp</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-gutter">
      <div class="lg:col-span-3 space-y-gutter">
        <div class="glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-4">1. Pilih Template</h3>
          <div class="space-y-2 mb-6">
            <div v-for="tpl in templates" :key="tpl.id"
              @click="selectTemplate(tpl)"
              class="p-3 rounded-xl border-2 transition-all cursor-pointer"
              :class="selectedTemplate?.id === tpl.id ? 'border-primary bg-primary-fixed/10' : 'border-transparent bg-surface-container-low hover:border-outline-variant/30'">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-sm">{{ categoryIcon(tpl.category) }}</span>
                  <span class="text-label-md font-bold">{{ tpl.label }}</span>
                </div>
                <span class="text-label-sm text-on-surface-variant">{{ tpl.category }}</span>
              </div>
              <pre class="text-label-sm text-on-surface-variant mt-2 truncate font-sans">{{ tpl.body }}</pre>
            </div>
            <p v-if="templates.length === 0" class="text-center py-4 text-on-surface-variant text-label-sm">
              Belum ada template. <NuxtLink to="/wa-gateway/templates" class="text-primary hover:underline">Buat template</NuxtLink>
            </p>
          </div>

          <h3 class="font-display text-title-lg text-primary mb-4">2. Pesan</h3>
          <div class="space-y-1 mb-4" v-if="selectedTemplate">
            <label class="text-label-md text-on-surface-variant">Isi Variabel Template</label>
            <div v-for="v in selectedTemplate.variables" :key="v" class="flex items-center gap-2 mb-2">
              <span class="text-label-sm text-primary font-mono w-40">{{ v }}</span>
              <input v-model="templateVars[v]" type="text" :placeholder="`Nilai untuk ${v}`"
                class="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-label-sm focus:ring-primary outline-none" />
            </div>
            <div class="mt-3 p-3 bg-primary-fixed/10 rounded-lg">
              <p class="text-label-sm text-on-surface-variant mb-1">Pratinjau:</p>
              <pre class="text-label-sm text-primary whitespace-pre-wrap font-sans">{{ previewMessage || 'Isi variabel untuk melihat pratinjau' }}</pre>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-label-md text-on-surface-variant">Atau tulis pesan manual</label>
            <textarea v-model="customMessage" rows="4"
              class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"
              placeholder="Tulis pesan langsung di sini..."></textarea>
          </div>
        </div>

        <div class="glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-4">3. Daftar Penerima</h3>

          <div class="flex items-center gap-2 mb-4">
            <button @click="importMode = 'manual'"
              class="px-3 py-1.5 rounded-lg text-label-sm transition-all"
              :class="importMode === 'manual' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'">Input Manual</button>
            <button @click="importMode = 'batch'"
              class="px-3 py-1.5 rounded-lg text-label-sm transition-all"
              :class="importMode === 'batch' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'">Paste Batch</button>
          </div>

          <div v-if="importMode === 'manual'">
            <div class="flex items-center gap-2 mb-3">
              <input v-model="manualPhone" type="text" placeholder="08xxxxxxxxxx"
                class="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-label-sm focus:ring-primary outline-none" />
              <button @click="addManualRecipient" class="bg-primary-container text-primary px-3 py-2 rounded-lg text-label-sm hover:bg-primary hover:text-on-primary transition-all">
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>

          <div v-if="importMode === 'batch'">
            <div class="space-y-1 mb-3">
              <textarea v-model="batchInput" rows="4"
                class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"
                placeholder="08xxxxxxxxxx|Pesan custom&#10;08xxxxxxxxxx|Pesan custom&#10;Format: nomor|pesan (opsional)"></textarea>
              <p class="text-label-sm text-on-surface-variant">Satu nomor per baris. Gunakan format: <code class="text-primary">nomor|pesan</code> untuk pesan custom</p>
              <button @click="processBatch" class="bg-primary-container text-primary px-3 py-2 rounded-lg text-label-sm hover:bg-primary hover:text-on-primary transition-all">
                Proses
              </button>
            </div>
          </div>

          <div v-if="recipients.length > 0" class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <p class="text-label-md text-on-surface-variant">Total: {{ recipients.length }} penerima</p>
              <button @click="recipients = []" class="text-error text-label-sm hover:underline">Hapus semua</button>
            </div>
            <div class="max-h-40 overflow-y-auto space-y-1">
              <div v-for="(r, i) in recipients" :key="i" class="flex items-center justify-between bg-surface-container-low rounded-lg px-3 py-2">
                <span class="text-label-sm font-mono">{{ r.phone }}</span>
                <button @click="recipients.splice(i, 1)" class="text-error hover:text-error/70">
                  <span class="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="glass-card rounded-xl p-6 shadow-sm sticky top-24">
          <h3 class="font-display text-title-lg text-primary mb-4">Ringkasan</h3>
          <div class="space-y-3 text-label-sm">
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Provider</span>
              <span class="font-bold">{{ providerLabel }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Status</span>
              <span class="flex items-center gap-1" :class="settings.isActive ? 'text-green-700' : 'text-red-500'">
                <span class="w-2 h-2 rounded-full" :class="settings.isActive ? 'bg-green-500' : 'bg-red-400'"></span>
                {{ settings.isActive ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Penerima</span>
              <span class="font-bold">{{ recipients.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Template</span>
              <span>{{ selectedTemplate?.label || 'Manual' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Pesan</span>
              <span class="truncate max-w-[150px]">{{ previewMessage || customMessage || '-' }}</span>
            </div>
          </div>
          <button @click="sendBroadcast"
            :disabled="sending || recipients.length === 0 || !(previewMessage || customMessage)"
            class="w-full mt-6 bg-primary text-on-primary py-3.5 rounded-xl font-bold text-body-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            <span v-if="sending" class="material-symbols-outlined animate-spin text-sm">refresh</span>
            <span v-else class="material-symbols-outlined text-sm">send</span>
            {{ sending ? 'Mengirim...' : `Kirim ke ${recipients.length} penerima` }}
          </button>

          <div v-if="result" class="mt-4 p-4 rounded-xl" :class="result.failed > 0 ? 'bg-red-50' : 'bg-green-50'">
            <p class="text-label-md font-bold" :class="result.failed > 0 ? 'text-error' : 'text-green-700'">Selesai!</p>
            <p class="text-label-sm text-on-surface-variant mt-1">
              Berhasil: {{ result.success }} | Gagal: {{ result.failed }}
            </p>
            <div v-if="result.errors?.length" class="mt-2 max-h-24 overflow-y-auto text-label-sm text-error">
              <p v-for="e in result.errors" :key="e">{{ e }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })
const { getTemplates, getSettings, getProviders, sendBroadcast: sendBc } = useWaGateway()

const templates = ref<any[]>([])
const selectedTemplate = ref<any>(null)
const templateVars = reactive<Record<string, string>>({})
const customMessage = ref('')
const importMode = ref<'manual' | 'batch'>('manual')
const manualPhone = ref('')
const batchInput = ref('')
const recipients = ref<{ phone: string; message: string }[]>([])
const sending = ref(false)
const result = ref<any>(null)
const providers = ref<{ id: string; label: string }[]>([])
const settings = reactive({ isActive: false, provider: 'fonnte' })
const providerLabel = computed(() => {
  const p = providers.value.find(p => p.id === settings.provider)
  return p?.label || settings.provider
})

const categories = [
  { value: 'keuangan', label: 'Keuangan', icon: 'payments' },
  { value: 'akademik', label: 'Akademik', icon: 'school' },
  { value: 'absensi', label: 'Absensi', icon: 'calendar_month' },
  { value: 'tahfidz', label: 'Tahfidz', icon: 'menu_book' },
  { value: 'pengumuman', label: 'Pengumuman', icon: 'campaign' },
  { value: 'izin', label: 'Izin Santri', icon: 'passport' },
]

const previewMessage = computed(() => {
  if (!selectedTemplate.value) return ''
  let msg = selectedTemplate.value.body
  for (const [key, val] of Object.entries(templateVars)) {
    if (val) msg = msg.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val)
  }
  return msg
})

function categoryIcon(cat: string) {
  const found = categories.find(c => c.value === cat)
  return found?.icon || 'more_horiz'
}

function selectTemplate(tpl: any) {
  selectedTemplate.value = tpl
  customMessage.value = ''
  Object.keys(templateVars).forEach(k => delete templateVars[k])
}

function addManualRecipient() {
  const phone = manualPhone.value.trim()
  if (!phone) return
  const msg = previewMessage.value || customMessage.value || ''
  recipients.value.push({ phone, message: msg })
  manualPhone.value = ''
}

function processBatch() {
  const lines = batchInput.value.trim().split('\n').filter(Boolean)
  for (const line of lines) {
    const parts = line.split('|')
    const phone = parts[0].trim()
    if (!phone) continue
    const msg = parts[1]?.trim() || previewMessage.value || customMessage.value || ''
    recipients.value.push({ phone, message: msg })
  }
  batchInput.value = ''
}

async function sendBroadcast() {
  if (recipients.value.length === 0) return
  sending.value = true
  result.value = null
  try {
    result.value = await sendBc(recipients.value)
    recipients.value = []
  } catch (e: any) {
    result.value = { success: 0, failed: recipients.value.length, errors: [e.message] }
  } finally {
    sending.value = false
  }
}

async function load() {
  try {
    const [tpls, settingsData, provs] = await Promise.all([
      getTemplates(),
      getSettings(),
      getProviders(),
    ])
    templates.value = tpls
    Object.assign(settings, settingsData)
    providers.value = provs
  } catch (e) {
    console.error('Gagal memuat data:', e)
  }
}

load()
</script>
