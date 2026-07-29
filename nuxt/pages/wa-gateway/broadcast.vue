<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <NuxtLink to="/wa-gateway" class="inline-flex items-center gap-1 text-primary text-label-md hover:underline mb-2">
        <span class="material-symbols-outlined text-sm">arrow_back</span> Kembali
      </NuxtLink>
      <h2 class="font-display text-headline-lg text-primary">Broadcast Pesan</h2>
      <p class="text-on-surface-variant text-body-md">Kirim pesan massal ke wali santri, guru, atau kelas tertentu</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-gutter">
      <div class="lg:col-span-3 space-y-gutter">

        <!-- Step 1: Template -->
        <div class="glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-4">
            <span class="bg-primary text-on-primary text-xs rounded-full px-2 py-0.5 mr-2">1</span>
            Pilih Template
          </h3>
          <div class="space-y-2 mb-4">
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

          <button @click="selectedTemplate = null; customMessage = ''"
            class="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
            :class="!selectedTemplate ? 'text-primary font-bold' : ''">
            Tulis pesan manual
          </button>
        </div>

        <!-- Step 2: Variables -->
        <div v-if="selectedTemplate" class="glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-4">
            <span class="bg-primary text-on-primary text-xs rounded-full px-2 py-0.5 mr-2">2</span>
            Isi Variabel Template
          </h3>

          <div v-if="selectedTemplate.variables.length > 0" class="space-y-3">
            <div v-for="v in selectedTemplate.variables" :key="v" class="flex items-center gap-3">
              <span class="text-label-sm text-primary font-mono w-44 shrink-0">{{ v }}</span>
              <input v-model="templateVars[v]"
                type="text"
                :placeholder="variableHint(v)"
                :class="autoFilledVars.has(v) ? 'bg-primary-fixed/10 border-primary/30' : ''"
                class="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2.5 text-label-sm focus:ring-2 focus:ring-primary outline-none" />
              <span v-if="autoFilledVars.has(v)" class="material-symbols-outlined text-xs text-primary" title="Otomatis dari data">auto_fix_high</span>
            </div>
          </div>
          <p v-else class="text-label-sm text-on-surface-variant">Template ini tidak memiliki variabel.</p>

          <div class="mt-4 p-4 bg-primary-fixed/10 rounded-xl">
            <p class="text-label-sm text-on-surface-variant mb-1.5">Pratinjau:</p>
            <pre class="text-label-sm text-primary whitespace-pre-wrap font-sans">{{ previewMessage || 'Isi variabel untuk melihat pratinjau' }}</pre>
          </div>
        </div>

        <!-- Step 2b: Manual Message -->
        <div v-if="!selectedTemplate" class="glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-4">Pesan Manual</h3>
          <textarea v-model="customMessage" rows="5"
            class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"
            placeholder="Tulis pesan langsung di sini..."></textarea>
        </div>

        <!-- Step 3: Recipients -->
        <div class="glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-4">
            <span class="bg-primary text-on-primary text-xs rounded-full px-2 py-0.5 mr-2">3</span>
            Tujuan Penerima
          </h3>

          <div class="flex flex-wrap gap-2 mb-6">
            <button v-for="opt in recipientOptions" :key="opt.id" @click="switchRecipientType(opt.id)"
              class="px-4 py-2 rounded-xl text-label-sm font-medium transition-all border-2 flex items-center gap-2"
              :class="recipientType === opt.id ? 'border-primary bg-primary-fixed/10 text-primary' : 'border-transparent bg-surface-container-low text-on-surface-variant hover:border-outline-variant/30'">
              <span class="material-symbols-outlined text-sm">{{ opt.icon }}</span>
              {{ opt.label }}
            </button>
          </div>

          <!-- Manual Input -->
          <div v-if="recipientType === 'manual'" class="space-y-3">
            <div class="flex items-center gap-2">
              <input v-model="manualPhone" type="text" placeholder="08xxxxxxxxxx" @keyup.enter="addManualRecipient"
                class="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2.5 text-label-sm focus:ring-primary outline-none" />
              <button @click="addManualRecipient" class="bg-primary-container text-primary px-4 py-2.5 rounded-lg text-label-sm hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">add</span> Tambah
              </button>
            </div>
            <div class="space-y-1">
              <textarea v-model="batchInput" rows="3"
                class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"
                placeholder="08xxxxxxxxxx|Pesan custom&#10;08xxxxxxxxxx|Pesan custom"></textarea>
              <p class="text-label-sm text-on-surface-variant">Format: <code class="text-primary">nomor|pesan</code> (satu per baris)</p>
              <button @click="processBatch" class="bg-primary-container text-primary px-4 py-2 rounded-lg text-label-sm hover:bg-primary hover:text-on-primary transition-all">Proses Batch</button>
            </div>
          </div>

          <!-- Wali Santri -->
            <div v-if="recipientType === 'walisantri'" class="space-y-3">
            <div class="flex items-center gap-3">
              <button @click="fetchContacts('walisantri')" :disabled="loadingContacts"
                class="bg-primary text-on-primary px-4 py-2.5 rounded-lg text-label-sm hover:brightness-110 transition-all flex items-center gap-1 disabled:opacity-60">
                <span v-if="loadingContacts" class="material-symbols-outlined animate-spin text-sm">refresh</span>
                <span class="material-symbols-outlined text-sm">refresh</span> Muat Data Wali Santri
              </button>
              <span class="text-label-sm text-on-surface-variant">{{ contacts.length }} kontak</span>
            </div>
            <div v-if="contacts.length > 0" class="max-h-48 overflow-y-auto space-y-1 border border-outline-variant/10 rounded-xl p-2">
              <div v-for="(c, i) in contacts" :key="c.id"
                class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-primary-fixed/5 transition-colors">
                <div class="flex items-center gap-2">
                  <input type="checkbox" :checked="isContactSelected(c.id)" @change="toggleContact(c.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                  <span class="text-label-sm font-medium">{{ c.name }}</span>
                  <span class="text-label-sm text-on-surface-variant">({{ c.studentName }})</span>
                  <span class="text-[10px] text-on-surface-variant/50 font-mono">{{ c.phone }}</span>
                </div>
                <span v-if="autoFilledVars.has('nama_wali') && c.variables?.nama_wali" class="text-[10px] text-primary flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-[10px]">auto_fix_high</span> otomatis
                </span>
              </div>
            </div>
            <button v-if="selectedContactIds.size > 0" @click="addSelectedContacts"
              class="w-full mt-2 bg-primary text-on-primary py-2 rounded-lg text-label-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-sm">playlist_add</span>
              Tambah {{ selectedContactIds.size }} kontak ke penerima
            </button>
            <p v-if="!loadingContacts && contacts.length === 0" class="text-label-sm text-on-surface-variant text-center py-4">
              Klik "Muat Data Wali Santri" untuk mengambil daftar wali santri.
            </p>
          </div>

            <!-- Guru -->
          <div v-if="recipientType === 'guru'" class="space-y-3">
            <div class="flex items-center gap-3">
              <button @click="fetchContacts('guru')" :disabled="loadingContacts"
                class="bg-primary text-on-primary px-4 py-2.5 rounded-lg text-label-sm hover:brightness-110 transition-all flex items-center gap-1 disabled:opacity-60">
                <span v-if="loadingContacts" class="material-symbols-outlined animate-spin text-sm">refresh</span>
                <span class="material-symbols-outlined text-sm">refresh</span> Muat Data Guru
              </button>
              <span class="text-label-sm text-on-surface-variant">{{ contacts.length }} kontak</span>
            </div>
            <div v-if="contacts.length > 0" class="max-h-48 overflow-y-auto space-y-1 border border-outline-variant/10 rounded-xl p-2">
              <div v-for="c in contacts" :key="c.id"
                class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-primary-fixed/5 transition-colors">
                <div class="flex items-center gap-2">
                  <input type="checkbox" :checked="isContactSelected(c.id)" @change="toggleContact(c.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                  <span class="text-label-sm font-medium">{{ c.name }}</span>
                  <span class="text-[10px] text-on-surface-variant/50 font-mono">{{ c.phone }}</span>
                </div>
              </div>
            </div>
            <button v-if="selectedContactIds.size > 0" @click="addSelectedContacts"
              class="w-full mt-2 bg-primary text-on-primary py-2 rounded-lg text-label-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-sm">playlist_add</span>
              Tambah {{ selectedContactIds.size }} kontak ke penerima
            </button>
            <p v-if="!loadingContacts && contacts.length === 0" class="text-label-sm text-on-surface-variant text-center py-4">
              Klik "Muat Data Guru" untuk mengambil daftar guru.
            </p>
          </div>

            <!-- Per Kelas -->
          <div v-if="recipientType === 'kelas'" class="space-y-3">
            <div class="flex items-center gap-3">
              <select v-model="selectedClassId" @change="fetchContacts('kelas')"
                class="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-label-sm focus:ring-primary outline-none">
                <option value="">-- Pilih Kelas --</option>
                <option v-for="cls in classList" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
              </select>
              <span class="text-label-sm text-on-surface-variant">{{ contacts.length }} wali santri</span>
            </div>
            <div v-if="contacts.length > 0" class="max-h-48 overflow-y-auto space-y-1 border border-outline-variant/10 rounded-xl p-2">
              <div v-for="c in contacts" :key="c.id"
                class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-primary-fixed/5 transition-colors">
                <div class="flex items-center gap-2">
                  <input type="checkbox" :checked="isContactSelected(c.id)" @change="toggleContact(c.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                  <span class="text-label-sm">{{ c.name }}</span>
                  <span class="text-label-sm text-on-surface-variant">({{ c.studentName }})</span>
                  <span class="text-[10px] text-on-surface-variant/50 font-mono">{{ c.phone }}</span>
                </div>
              </div>
            </div>
            <button v-if="selectedContactIds.size > 0" @click="addSelectedContacts"
              class="w-full mt-2 bg-primary text-on-primary py-2 rounded-lg text-label-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-sm">playlist_add</span>
              Tambah {{ selectedContactIds.size }} kontak ke penerima
            </button>
            <p v-if="selectedClassId && !loadingContacts && contacts.length === 0" class="text-label-sm text-on-surface-variant text-center py-4">
              Tidak ada wali santri dengan nomor HP di kelas ini.
            </p>
          </div>

          <!-- Per Santri -->
          <div v-if="recipientType === 'santri'" class="space-y-3">
            <div class="flex items-center gap-3">
              <select v-model="selectedStudentId" @change="fetchContacts('santri')"
                class="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-label-sm focus:ring-primary outline-none">
                <option value="">-- Pilih Santri --</option>
                <option v-for="s in santriList" :key="s.id" :value="s.id">{{ s.name }} ({{ s.className }})</option>
              </select>
            </div>
            <div v-if="contacts.length > 0" class="flex items-center justify-between px-3 py-2 rounded-lg bg-primary-fixed/10">
              <div class="flex items-center gap-2">
                <input type="checkbox" checked disabled class="w-4 h-4 rounded border-outline-variant text-primary" />
                <span class="text-label-sm font-medium">{{ contacts[0].name }}</span>
                <span class="text-[10px] text-on-surface-variant/50 font-mono">{{ contacts[0].phone }}</span>
              </div>
              <button @click="addSelectedContacts" class="text-primary text-label-sm hover:underline">Gunakan kontak ini</button>
            </div>
          </div>

          <!-- Per Guru -->
          <div v-if="recipientType === 'guru-single'" class="space-y-3">
            <div class="flex items-center gap-3">
              <select v-model="selectedGuruId" @change="fetchContacts('guru-single')"
                class="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-label-sm focus:ring-primary outline-none">
                <option value="">-- Pilih Guru --</option>
                <option v-for="g in guruList" :key="g.id" :value="g.id">{{ g.name }}</option>
              </select>
            </div>
            <div v-if="contacts.length > 0" class="flex items-center justify-between px-3 py-2 rounded-lg bg-primary-fixed/10">
              <div class="flex items-center gap-2">
                <input type="checkbox" checked disabled class="w-4 h-4 rounded border-outline-variant text-primary" />
                <span class="text-label-sm font-medium">{{ contacts[0].name }}</span>
                <span class="text-[10px] text-on-surface-variant/50 font-mono">{{ contacts[0].phone }}</span>
              </div>
              <button @click="addSelectedContacts" class="text-primary text-label-sm hover:underline">Gunakan kontak ini</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar: Ringkasan -->
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
              <span class="text-on-surface-variant">Template</span>
              <span>{{ selectedTemplate?.label || 'Manual' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Tipe Penerima</span>
              <span>{{ recipientLabel }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Penerima</span>
              <span class="font-bold">{{ recipients.length }}</span>
            </div>

            <!-- Delay -->
            <div class="pt-3 border-t border-outline-variant/10">
              <label class="text-label-sm text-on-surface-variant block mb-2">Jeda Antar Pesan</label>
              <div class="flex items-center gap-2">
                <input type="range" v-model.number="delayMs" min="500" max="10000" step="500" class="flex-1 accent-primary" />
                <span class="text-label-sm font-mono w-12 text-right">{{ (delayMs / 1000).toFixed(1) }}s</span>
              </div>
              <p class="text-[10px] text-on-surface-variant mt-1">Jeda 1-3 detik dianjurkan agar nomor tidak kesuspend</p>
            </div>

            <!-- Media -->
            <div class="pt-3 border-t border-outline-variant/10">
              <label class="text-label-sm text-on-surface-variant block mb-2">Lampiran Media</label>
              <input ref="fileInput" type="file" accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx" class="hidden" @change="handleFileSelect" />
              <div v-if="!mediaUrl">
                <button @click="fileInput?.click()" :disabled="uploadingMedia"
                  class="w-full border-2 border-dashed border-outline-variant/30 rounded-xl py-4 px-3 text-center hover:border-primary/40 transition-all cursor-pointer disabled:opacity-60"
                  :class="uploadingMedia ? 'opacity-60' : ''">
                  <div v-if="uploadingMedia" class="flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined animate-spin text-sm">refresh</span>
                    <span class="text-label-sm text-on-surface-variant">Mengupload...</span>
                  </div>
                  <div v-else>
                    <span class="material-symbols-outlined text-2xl text-on-surface-variant">add_photo_alternate</span>
                    <p class="text-label-sm text-on-surface-variant mt-1">Klik untuk upload<br>Gambar / Video / Dokumen</p>
                  </div>
                </button>
              </div>
              <div v-else class="bg-surface-container-low rounded-xl p-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary-fixed/20 flex items-center justify-center shrink-0 overflow-hidden">
                    <img v-if="mediaType?.startsWith('image/')" :src="mediaUrl" class="w-full h-full object-cover" />
                    <span v-else-if="mediaType?.startsWith('video/')" class="material-symbols-outlined text-primary">play_circle</span>
                    <span v-else class="material-symbols-outlined text-primary">description</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-label-sm truncate font-medium">{{ mediaFileName }}</p>
                    <p class="text-[10px] text-on-surface-variant">{{ mediaType }}</p>
                  </div>
                  <button @click="clearMedia" class="text-error hover:text-red-700 transition-colors">
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button @click="sendBroadcast"
            :disabled="sending || recipients.length === 0 || !currentMessage"
            class="w-full mt-6 bg-primary text-on-primary py-3.5 rounded-xl font-bold text-body-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            <span v-if="sending" class="material-symbols-outlined animate-spin text-sm">refresh</span>
            <span v-else class="material-symbols-outlined text-sm">send</span>
            {{ sending ? `Mengirim ${sentCount}/${recipients.length}...` : `Kirim ke ${recipients.length} penerima` }}
          </button>

          <div v-if="sending" class="mt-3">
            <div class="w-full bg-surface-container-low rounded-full h-2">
              <div class="bg-primary h-2 rounded-full transition-all duration-500" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>

          <div v-if="result" class="mt-4 p-4 rounded-xl" :class="result.failed > 0 ? 'bg-red-50' : 'bg-green-50'">
            <p class="text-label-md font-bold" :class="result.failed > 0 ? 'text-error' : 'text-green-700'">Selesai!</p>
            <p class="text-label-sm text-on-surface-variant mt-1">
              Berhasil: {{ result.success }} | Gagal: {{ result.failed }}
            </p>
            <div v-if="result.errors?.length" class="mt-2 max-h-32 overflow-y-auto text-label-sm text-error space-y-1">
              <p v-for="(e, i) in result.errors" :key="i" class="text-[11px]">{{ e }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })
const { getTemplates, getSettings, getProviders, getContacts, sendBroadcast: sendBc, uploadMedia } = useWaGateway()

const templates = ref<any[]>([])
const selectedTemplate = ref<any>(null)
const templateVars = reactive<Record<string, string>>({})
const customMessage = ref('')
const providersList = ref<{ id: string; label: string }[]>([])
const settings = reactive({ isActive: false, provider: 'fonnte' })
const providerLabel = computed(() => providersList.value.find(p => p.id === settings.provider)?.label || settings.provider)

// Recipient type
const recipientOptions = [
  { id: 'manual', label: 'Manual', icon: 'edit_note' },
  { id: 'walisantri', label: 'Wali Santri', icon: 'family_history' },
  { id: 'guru', label: 'Guru', icon: 'badge' },
  { id: 'kelas', label: 'Per Kelas', icon: 'school' },
  { id: 'santri', label: 'Per Santri', icon: 'person' },
  { id: 'guru-single', label: 'Per Guru', icon: 'person_search' },
]
const recipientType = ref('manual')
const recipientLabel = computed(() => recipientOptions.find(o => o.id === recipientType.value)?.label || 'Manual')

// Recipients data
const recipients = ref<{ phone: string; message: string }[]>([])
const contacts = ref<any[]>([])
const selectedContactIds = ref<Set<string>>(new Set())
const loadingContacts = ref(false)
const manualPhone = ref('')
const batchInput = ref('')

// Class selector
const classList = ref<any[]>([])
const selectedClassId = ref('')

// Santri selector
const santriList = ref<any[]>([])
const selectedStudentId = ref('')

// Guru single selector
const guruList = ref<any[]>([])
const selectedGuruId = ref('')

// Auto-filled vars tracking
const autoFilledVars = ref<Set<string>>(new Set())

// Delay
const delayMs = ref(2000)

// Media
const mediaUrl = ref('')
const mediaType = ref('')
const mediaFileName = ref('')
const uploadingMedia = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Sending
const sending = ref(false)
const sentCount = ref(0)
const result = ref<any>(null)

const currentMessage = computed(() => {
  return previewMessage.value || customMessage.value || ''
})

const previewMessage = computed(() => {
  if (!selectedTemplate.value) return ''
  let msg = selectedTemplate.value.body
  for (const [key, val] of Object.entries(templateVars)) {
    if (val) msg = msg.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val)
  }
  return msg
})

const progressPercent = computed(() => {
  if (recipients.value.length === 0) return 0
  return (sentCount.value / recipients.value.length) * 100
})

function categoryIcon(cat: string) {
  const icons: Record<string, string> = {
    keuangan: 'payments', akademik: 'school', absensi: 'calendar_month',
    tahfidz: 'menu_book', pengumuman: 'campaign', izin: 'passport',
    mutasi: 'swap_horiz', kegiatan: 'sports_kabaddi', kesehatan: 'medical_services',
  }
  return icons[cat] || 'more_horiz'
}

function variableHint(v: string): string {
  const hints: Record<string, string> = {
    nama_wali: 'Otomatis dari data santri',
    nama_santri: 'Otomatis dari data santri',
    bulan: 'Contoh: Juli',
    jumlah: 'Contoh: 60000',
    tanggal_jatuh_tempo: 'Contoh: 10',
    nama_pondok: settings.senderName || 'PONPES SBBT',
    nama_kegiatan: 'Contoh: Hadroh',
    keperluan: 'Contoh: Pulang',
    hari: 'Contoh: Senin',
    tanggal: 'Contoh: 2024-07-15',
    jam: 'Contoh: 14:00',
    isi_pengumuman: 'Tulis pengumuman',
    jenis_tagihan: 'Contoh: Bangunan',
    kelas_lama: 'Kelas sebelumnya',
    kelas_baru: 'Kelas baru',
    alasan: 'Alasan mutasi',
    tempat: 'Tempat kegiatan',
    nama_ujian: 'Nama ujian',
    daftar_nilai: 'Nilai per mapel',
    rata_rata: 'Rata-rata nilai',
    hafalan_baru: 'Juz/halaman baru',
    murojaah: 'Murojaah',
    juz: 'Juz',
    catatan: 'Catatan ustadz',
  }
  return hints[v] || `Masukkan ${v}`
}

function selectTemplate(tpl: any) {
  selectedTemplate.value = tpl
  customMessage.value = ''
  Object.keys(templateVars).forEach(k => delete templateVars[k])
  autoFilledVars.value = new Set()

  if (tpl.variables.includes('nama_pondok')) {
    templateVars.nama_pondok = settings.senderName || 'PONPES SBBT'
    autoFilledVars.value.add('nama_pondok')
  }
  if (tpl.variables.includes('bulan')) {
    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
    templateVars.bulan = months[new Date().getMonth()]
    autoFilledVars.value.add('bulan')
  }
}

function autoFillFromContact(contact: any) {
  if (!selectedTemplate.value || !contact.variables) return
  for (const key of selectedTemplate.value.variables) {
    if (contact.variables[key] && !templateVars[key]) {
      templateVars[key] = contact.variables[key]
      autoFilledVars.value.add(key)
    }
  }
}

function switchRecipientType(type: string) {
  recipientType.value = type
  contacts.value = []
  selectedContactIds.value = new Set()
  selectedClassId.value = ''
  selectedStudentId.value = ''
  selectedGuruId.value = ''

  if (type === 'kelas') loadClassList()
  if (type === 'santri') loadSantriList()
  if (type === 'guru-single') loadGuruList()
}

async function loadClassList() {
  try {
    classList.value = await getContacts('classes')
  } catch (e) { console.error(e) }
}

async function loadSantriList() {
  try {
    santriList.value = await getContacts('santri-list')
  } catch (e) { console.error(e) }
}

async function loadGuruList() {
  try {
    guruList.value = await getContacts('guru-list')
  } catch (e) { console.error(e) }
}

async function fetchContacts(type: string) {
  loadingContacts.value = true
  selectedContactIds.value = new Set()
  try {
    let data: any[]
    if (type === 'kelas') {
      if (!selectedClassId.value) { contacts.value = []; return }
      data = await getContacts('kelas', { classId: selectedClassId.value })
    } else if (type === 'santri') {
      if (!selectedStudentId.value) { contacts.value = []; return }
      data = await getContacts('santri', { studentId: selectedStudentId.value })
    } else if (type === 'guru-single') {
      if (!selectedGuruId.value) { contacts.value = []; return }
      data = await getContacts('guru-single', { guruId: selectedGuruId.value })
    } else {
      data = await getContacts(type)
    }
    contacts.value = data

    if (selectedTemplate.value && data.length > 0) {
      autoFillFromContact(data[0])
    }

    if (type === 'santri' || type === 'guru-single') {
      if (data.length > 0) {
        selectedContactIds.value = new Set([data[0].id])
      }
    }
  } catch (e) {
    console.error('Gagal memuat kontak:', e)
  } finally {
    loadingContacts.value = false
  }
}

function isContactSelected(id: string) {
  return selectedContactIds.value.has(id)
}

function toggleContact(id: string) {
  const s = new Set(selectedContactIds.value)
  if (s.has(id)) { s.delete(id) } else { s.add(id) }
  selectedContactIds.value = s
}

function addSelectedContacts() {
  const selected = contacts.value.filter(c => selectedContactIds.value.has(c.id))
  for (const c of selected) {
    let msg = currentMessage.value
    if (c.variables && selectedTemplate.value) {
      msg = selectedTemplate.value.body
      const allVars = { ...templateVars, ...c.variables }
      for (const [key, val] of Object.entries(allVars)) {
        if (val) msg = msg.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val)
      }
    }
    recipients.value.push({ phone: c.phone, message: msg, mediaUrl: mediaUrl.value || undefined, mediaType: mediaType.value || undefined })
  }
  selectedContactIds.value = new Set()
  contacts.value = []
}

function addManualRecipient() {
  const phone = manualPhone.value.trim()
  if (!phone) return
  const msg = currentMessage.value
  recipients.value.push({ phone, message: msg, mediaUrl: mediaUrl.value || undefined, mediaType: mediaType.value || undefined })
  manualPhone.value = ''
}

function processBatch() {
  const lines = batchInput.value.trim().split('\n').filter(Boolean)
  for (const line of lines) {
    const parts = line.split('|')
    const phone = parts[0].trim()
    if (!phone) continue
    const msg = parts[1]?.trim() || currentMessage.value
    recipients.value.push({ phone, message: msg, mediaUrl: mediaUrl.value || undefined, mediaType: mediaType.value || undefined })
  }
  batchInput.value = ''
}

async function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadingMedia.value = true
  try {
    const result = await uploadMedia(file)
    mediaUrl.value = result.url
    mediaType.value = result.type
    mediaFileName.value = file.name
  } catch (e: any) {
    console.error('Upload gagal:', e)
    alert('Gagal upload media: ' + e.message)
  } finally {
    uploadingMedia.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function clearMedia() {
  mediaUrl.value = ''
  mediaType.value = ''
  mediaFileName.value = ''
}

async function sendBroadcast() {
  if (recipients.value.length === 0) return
  sending.value = true
  sentCount.value = 0
  result.value = null

  try {
    const total = recipients.value.length
    const batch = recipients.value.map((r) => ({ phone: r.phone, message: r.message, mediaUrl: r.mediaUrl, mediaType: r.mediaType }))

    for (let i = 0; i < batch.length; i++) {
      const r = batch[i]
      try {
        const res = await sendBc([r], delayMs.value)
        sentCount.value = i + 1
        if (!res.success || res.failed > 0) {
          console.error('Gagal:', r.phone, res.errors?.[0])
        }
      } catch (e: any) {
        console.error('Error:', r.phone, e.message)
      }
      if (i < batch.length - 1 && delayMs.value > 0) {
        await new Promise(r => setTimeout(r, delayMs.value))
      }
    }

    result.value = { success: sentCount.value, failed: Math.max(0, total - sentCount.value), errors: [] }
    recipients.value = []
  } catch (e: any) {
    result.value = { success: sentCount.value, failed: recipients.value.length - sentCount.value, errors: [e.message] }
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
    providersList.value = provs
    loadClassList()
    loadSantriList()
    loadGuruList()
  } catch (e) {
    console.error('Gagal memuat data:', e)
  }
}

load()
</script>
