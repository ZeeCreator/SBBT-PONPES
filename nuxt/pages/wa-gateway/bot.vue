<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <NuxtLink to="/wa-gateway" class="inline-flex items-center gap-1 text-primary text-label-md hover:underline mb-2">
      <span class="material-symbols-outlined text-sm">arrow_back</span> Kembali
    </NuxtLink>
    <h2 class="font-display text-headline-lg text-primary mb-stack-md">Bot AI WhatsApp</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
      <div class="glass-card rounded-xl p-6 shadow-sm space-y-4">
        <h3 class="font-display text-title-lg text-primary">Pengaturan Bot</h3>

        <div class="flex items-center justify-between">
          <div>
            <p class="text-label-md font-bold">Aktifkan Bot</p>
            <p class="text-label-sm text-on-surface-variant">Balas otomatis pesan WA wali santri</p>
          </div>
          <button @click="toggleBot"
            class="w-12 h-7 rounded-full transition-all flex items-center px-0.5"
            :class="settings.enabled ? 'bg-primary justify-end' : 'bg-outline-variant/30 justify-start'">
            <span class="w-5 h-5 rounded-full bg-white shadow-sm transition-all"></span>
          </button>
        </div>

        <div>
          <label class="text-label-sm text-on-surface-variant block mb-1">Pesan Sambutan</label>
          <textarea v-model="settings.welcomeMessage" rows="2"
            class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2.5 text-label-sm focus:ring-2 focus:ring-primary outline-none"></textarea>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="text-label-md font-bold">Sync Data Santri ke Qdrant</p>
            <p class="text-label-sm text-on-surface-variant">Sinkronisasi data santri dari database ke vector search</p>
          </div>
          <button @click="syncStudents" :disabled="syncing"
            class="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-sm hover:brightness-110 transition-all disabled:opacity-60 flex items-center gap-1">
            <span v-if="syncing" class="material-symbols-outlined animate-spin text-sm">refresh</span>
            Sync
          </button>
        </div>
        <p v-if="syncResult" class="text-label-sm text-green-700">{{ syncResult }}</p>

        <div class="border-t border-outline-variant/10 pt-4">
          <p class="text-label-md font-bold mb-2 text-primary">Konfigurasi AI</p>
          <div class="flex gap-2 mb-3">
            <button @click="useOpenRouter" type="button"
              class="px-3 py-1.5 rounded-lg text-label-sm font-bold border border-primary text-primary hover:bg-primary hover:text-on-primary transition-all">OpenRouter</button>
            <button @click="useApifreellm" type="button"
              class="px-3 py-1.5 rounded-lg text-label-sm font-bold border border-outline-variant/30 text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all">apifreellm</button>
          </div>
          <div class="mb-2">
            <label class="text-label-sm text-on-surface-variant block mb-1">API URL</label>
            <input v-model="settings.aiUrl" type="url" placeholder="https://apifreellm.com/api/v1/chat"
              class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-label-sm focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div class="mb-2">
            <label class="text-label-sm text-on-surface-variant block mb-1">API Key</label>
            <input v-model="settings.aiKey" type="password" placeholder="apf_... / sk-or-..."
              class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-label-sm focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div class="mb-2">
            <label class="text-label-sm text-on-surface-variant block mb-1">Model (wajib untuk OpenRouter/OpenAI)</label>
            <input v-model="settings.aiModel" type="text" placeholder="google/gemma-4-26b-a4b-it:free"
              class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-label-sm focus:ring-2 focus:ring-primary outline-none" />
          </div>
        </div>

        <button @click="saveSettings"
          class="w-full bg-primary text-on-primary py-2.5 rounded-xl font-bold text-label-md hover:brightness-110 transition-all">
          Simpan Pengaturan
        </button>
      </div>

      <div class="glass-card rounded-xl p-6 shadow-sm space-y-4">
        <h3 class="font-display text-title-lg text-primary">Cara Kerja</h3>
        <ol class="space-y-2 text-label-sm text-on-surface-variant list-decimal list-inside">
          <li>Wali santri kirim pesan WA ke nomor pondok</li>
          <li>Webhook menerima pesan dan Bot AI memproses</li>
          <li>Sistem cari data santri di Qdrant berdasarkan nama</li>
          <li>Absensi & program diambil dari database</li>
          <li>AI (apifreellm) generate jawaban ramah</li>
          <li>Balasan dikirim otomatis ke wali santri</li>
        </ol>
        <div class="p-3 bg-primary-fixed/10 rounded-xl">
          <p class="text-label-sm text-primary font-bold">Webhook URL</p>
          <code class="text-[11px] text-on-surface-variant break-all">{{ webhookUrl }}</code>
          <p class="text-[10px] text-on-surface-variant mt-1">Set URL ini di dashboard provider WA (Fonnte/Flowkirim)</p>
        </div>
      </div>

      <div class="lg:col-span-2 glass-card rounded-xl p-6 shadow-sm space-y-4">
        <h3 class="font-display text-title-lg text-primary">Riwayat Percakapan</h3>
        <div v-if="conversations.length === 0" class="text-center py-6 text-on-surface-variant text-label-sm">
          Belum ada percakapan.
        </div>
        <div v-for="conv in conversations" :key="conv.phone" class="border border-outline-variant/10 rounded-xl p-3">
          <p class="text-label-sm font-bold text-primary mb-2">{{ conv.phone }}</p>
          <div v-for="(msg, i) in conv.messages.slice(-6)" :key="i"
            class="text-label-sm py-1"
            :class="msg.role === 'user' ? 'text-on-surface-variant' : 'text-primary'">
            <span class="text-[10px] uppercase mr-1" :class="msg.role === 'user' ? 'text-on-surface-variant/50' : 'text-primary/50'">{{ msg.role }}:</span>
            {{ msg.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })
const { getBotSettings, updateBotSettings, getConversations } = useWaGateway()

const settings = reactive({ enabled: false, autoReply: true, welcomeMessage: '', aiUrl: DEFAULT_AI_URL, aiKey: '', aiModel: '' })
const DEFAULT_AI_URL = 'https://apifreellm.com/api/v1/chat'
const DEFAULT_OPENROUTER_URL = 'https://openrouter.ai/api/v1'
const DEFAULT_OPENROUTER_MODEL = 'google/gemma-4-26b-a4b-it:free'

function useOpenRouter() {
  settings.aiUrl = DEFAULT_OPENROUTER_URL
  settings.aiModel = DEFAULT_OPENROUTER_MODEL
}

function useApifreellm() {
  settings.aiUrl = DEFAULT_AI_URL
  settings.aiKey = ''
  settings.aiModel = ''
}
const conversations = ref<any[]>([])
const syncing = ref(false)
const syncResult = ref('')
const webhookUrl = ref('')

async function load() {
  try {
    const [s, convs] = await Promise.all([getBotSettings(), getConversations()])
    Object.assign(settings, s)
    if (s.ai) { settings.aiUrl = s.ai.url; settings.aiKey = s.ai.key; settings.aiModel = s.ai.model || '' }
    conversations.value = convs
    webhookUrl.value = window.location.origin + '/api/wa-gateway/webhook'
  } catch (e) {
    console.error(e)
  }
}

onMounted(load)

function toggleBot() {
  settings.enabled = !settings.enabled
}

async function saveSettings() {
  try {
    await updateBotSettings({
      enabled: settings.enabled,
      autoReply: settings.autoReply,
      welcomeMessage: settings.welcomeMessage,
      ai: { url: settings.aiUrl, key: settings.aiKey, model: settings.aiModel || undefined },
    })
    alert('Pengaturan disimpan')
  } catch (e: any) {
    alert('Gagal: ' + e.message)
  }
}

async function syncStudents() {
  syncing.value = true
  syncResult.value = ''
  try {
    const res = await updateBotSettings({ syncStudents: true })
    syncResult.value = `Sinkronisasi selesai: ${res.synced} santri`
  } catch (e: any) {
    syncResult.value = 'Gagal: ' + e.message
  } finally {
    syncing.value = false
  }
}

</script>
