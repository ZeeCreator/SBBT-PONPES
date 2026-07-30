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

const settings = reactive({ enabled: false, autoReply: true, welcomeMessage: '' })
const conversations = ref<any[]>([])
const syncing = ref(false)
const syncResult = ref('')
const webhookUrl = ref('')

async function load() {
  try {
    const [s, convs] = await Promise.all([getBotSettings(), getConversations()])
    Object.assign(settings, s)
    conversations.value = convs
    webhookUrl.value = window.location.origin + '/api/wa-gateway/webhook'
  } catch (e) {
    console.error(e)
  }
}

function toggleBot() {
  settings.enabled = !settings.enabled
}

async function saveSettings() {
  try {
    await updateBotSettings({ enabled: settings.enabled, autoReply: settings.autoReply, welcomeMessage: settings.welcomeMessage })
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

load()
</script>
