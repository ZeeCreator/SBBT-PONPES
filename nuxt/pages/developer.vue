<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Developer Tools</h2>
      <p class="text-body-md text-on-surface-variant">System monitoring, health checks, dan informasi teknis.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-stack-lg">
      <div class="glass-card rounded-2xl p-stack-md shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center', health.status === 'healthy' ? 'bg-green-100' : 'bg-red-100']">
            <span class="material-symbols-outlined" :class="health.status === 'healthy' ? 'text-green-600' : 'text-red-600'">{{ health.status === 'healthy' ? 'check_circle' : 'warning' }}</span>
          </div>
          <div>
            <p class="text-title-md font-display">Firebase Status</p>
            <p class="text-label-sm text-on-surface-variant">{{ health.status === 'healthy' ? 'All systems operational' : 'Degraded performance' }}</p>
          </div>
          <button class="ml-auto p-2 text-on-surface-variant hover:text-primary transition-colors" @click="checkHealth" title="Refresh">
            <span class="material-symbols-outlined">refresh</span>
          </button>
        </div>
        <div class="space-y-3">
          <div v-for="(svc, name) in health.services" :key="name" class="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" :class="svc.status === 'ok' ? 'bg-green-500' : 'bg-red-500'" />
              <span class="text-label-md font-medium capitalize">{{ name }}</span>
            </div>
            <span class="text-label-sm" :class="svc.status === 'ok' ? 'text-green-600' : 'text-red-600'">{{ svc.status === 'ok' ? svc.latency : svc.message }}</span>
          </div>
        </div>
        <p class="text-label-sm text-on-surface-variant mt-4">Server uptime: {{ serverUptime }}</p>
        <p class="text-label-sm text-on-surface-variant">Terakhir diperiksa: {{ health.timestamp ? new Date(health.timestamp).toLocaleString('id-ID') : '-' }}</p>
      </div>

      <div class="glass-card rounded-2xl p-stack-md shadow-sm">
        <h4 class="font-display text-title-lg text-primary mb-4">System Info</h4>
        <div class="space-y-3">
          <div v-for="(val, key) in systemInfo" :key="key" class="flex justify-between p-3 bg-surface-container-low rounded-lg">
            <span class="text-label-md text-on-surface-variant">{{ key }}</span>
            <span class="text-label-md font-medium max-w-[60%] text-right break-all">{{ val }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-card rounded-2xl p-stack-md shadow-sm mb-stack-lg">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-display text-title-lg text-primary">Uptime History</h4>
        <div class="flex items-center gap-2">
          <span class="text-label-sm text-on-surface-variant">{{ uptimeLogs.length }} record</span>
          <button class="p-2 text-on-surface-variant hover:text-primary transition-colors" @click="fetchUptimeLogs" title="Refresh">
            <span class="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>
      <div v-if="uptimeLogs.length === 0" class="text-center py-6 text-on-surface-variant text-label-sm">Belum ada data uptime. Jalankan cron atau klik "Check Now".</div>
      <div v-else class="overflow-x-auto max-h-96 overflow-y-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-label-sm text-on-surface-variant/70 border-b border-outline-variant/20">
              <th class="pb-2 font-semibold">Waktu</th>
              <th class="pb-2 font-semibold">Status</th>
              <th class="pb-2 font-semibold">RTDB</th>
              <th class="pb-2 font-semibold">Auth</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="log in uptimeLogs" :key="log.id" class="hover:bg-primary-fixed/5 text-label-sm">
              <td class="py-2 text-on-surface-variant">{{ log.timestamp ? new Date(log.timestamp).toLocaleString('id-ID') : '-' }}</td>
              <td class="py-2">
                <span class="px-2 py-0.5 rounded text-label-sm font-bold" :class="log.status === 'healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">{{ log.status }}</span>
              </td>
              <td class="py-2">
                <span v-if="log.services?.rtdb" :class="log.services.rtdb.status === 'ok' ? 'text-green-600' : 'text-red-600'">
                  {{ log.services.rtdb.status === 'ok' ? `✓ ${log.services.rtdb.latency}` : '✗' }}
                </span>
                <span v-else class="text-on-surface-variant">-</span>
              </td>
              <td class="py-2">
                <span v-if="log.services?.auth" :class="log.services.auth.status === 'ok' ? 'text-green-600' : 'text-red-600'">
                  {{ log.services.auth.status === 'ok' ? `✓ ${log.services.auth.latency}` : '✗' }}
                </span>
                <span v-else class="text-on-surface-variant">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4 flex items-center gap-3">
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 active:scale-95 transition-all" @click="runUptimeCheck">
          <span class="material-symbols-outlined text-sm">play_arrow</span> Check Now
        </button>
        <span v-if="uptimeMessage" class="text-label-sm" :class="uptimeMessage.includes('✅') ? 'text-green-600' : 'text-on-surface-variant'">{{ uptimeMessage }}</span>
      </div>
    </div>

    <!-- ── Backup & Restore ─────────────────────────────────── -->
    <div class="glass-card rounded-2xl p-stack-md shadow-sm mb-stack-lg">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-display text-title-lg text-primary">Backup & Restore</h4>
        <div class="flex items-center gap-2">
          <button class="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-label-sm hover:brightness-110 transition-all" @click="createBackup">
            <span class="material-symbols-outlined text-sm">backup</span> Backup Now
          </button>
          <button class="p-2 text-on-surface-variant hover:text-primary transition-colors" @click="fetchBackups" title="Refresh">
            <span class="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>
      <p v-if="backupMessage" class="mb-3 text-label-sm" :class="backupMessage.includes('✅') ? 'text-green-600' : 'text-red-600'">{{ backupMessage }}</p>
      <div v-if="backups.length === 0" class="text-center py-6 text-on-surface-variant text-label-sm">Belum ada backup lokal.</div>
      <div v-else class="overflow-x-auto max-h-60 overflow-y-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-label-sm text-on-surface-variant/70 border-b border-outline-variant/20">
              <th class="pb-2 font-semibold">File</th>
              <th class="pb-2 font-semibold">Ukuran</th>
              <th class="pb-2 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="b in backups" :key="b.name" class="hover:bg-primary-fixed/5 text-label-sm">
              <td class="py-2 max-w-[200px] truncate">{{ b.name }}</td>
              <td class="py-2 text-on-surface-variant">{{ (b.size / 1024).toFixed(1) }} KB</td>
              <td class="py-2">
                <div class="flex items-center gap-2">
                  <button class="text-label-xs px-2 py-1 bg-primary text-on-primary rounded hover:brightness-110 transition-all" @click="previewBackup(b.name)">Preview</button>
                  <button class="text-label-xs px-2 py-1 bg-error text-on-error rounded hover:brightness-110 transition-all" @click="confirmRestore(b.name)">Restore</button>
                  <button class="text-label-xs px-2 py-1 border border-outline-variant rounded hover:bg-surface-container-high transition-all" @click="downloadBackup(b.name)">Download</button>
                  <button class="p-1 text-on-surface-variant hover:text-error transition-colors" @click="deleteBackup(b.name)">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Preview Modal -->
      <Teleport to="body">
        <div v-if="showPreview" class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showPreview = false">
          <div class="bg-surface rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden animate-modal-enter">
            <div class="bg-primary px-gutter py-stack-md flex justify-between items-center">
              <h3 class="font-display text-headline-md text-on-primary">Preview Backup</h3>
              <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showPreview = false">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <pre class="p-gutter overflow-auto max-h-[60vh] text-label-sm text-on-surface bg-surface-container-lowest rounded-lg m-gutter">{{ previewData }}</pre>
          </div>
        </div>
      </Teleport>

      <!-- Restore Confirm Modal -->
      <Teleport to="body">
        <div v-if="showRestoreConfirm" class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showRestoreConfirm = false">
          <div class="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-modal-enter">
            <div class="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-error text-3xl">restore</span>
            </div>
            <h3 class="font-display text-title-lg text-primary mb-2">Restore Database?</h3>
            <p class="text-label-md text-on-surface-variant mb-6">Tindakan ini akan <strong>menimpa seluruh data</strong> di database dengan data dari backup <strong>{{ restoreTarget }}</strong>. Yakin?</p>
            <div class="flex gap-3">
              <button class="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl text-label-md" @click="showRestoreConfirm = false">Batal</button>
              <button class="flex-1 bg-error text-on-error py-3 rounded-xl text-label-md font-bold hover:brightness-110 transition-all" @click="doRestore">{{ restoring ? 'Merestore...' : 'Restore' }}</button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>

    <!-- ── Google Drive ──────────────────────────────────── -->
    <div class="glass-card rounded-2xl p-stack-md shadow-sm mb-stack-lg">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-display text-title-lg text-primary">Google Drive</h4>
        <div class="flex items-center gap-2">
          <button class="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-label-sm hover:brightness-110 transition-all" @click="uploadToDrive">
            <span class="material-symbols-outlined text-sm">cloud_upload</span> Backup & Upload
          </button>
          <button class="p-2 text-on-surface-variant hover:text-primary transition-colors" @click="fetchDriveFiles" title="Refresh">
            <span class="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>
      <p v-if="driveMessage" class="mb-3 text-label-sm" :class="driveMessage.includes('✅') ? 'text-green-600' : 'text-red-600'">{{ driveMessage }}</p>
      <div v-if="driveFiles.length === 0" class="text-center py-6 text-on-surface-variant text-label-sm">Belum ada data. Klik "Backup & Upload" untuk mengupload backup ke Drive.</div>
      <div v-else class="overflow-x-auto max-h-60 overflow-y-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-label-sm text-on-surface-variant/70 border-b border-outline-variant/20">
              <th class="pb-2 font-semibold">Nama File</th>
              <th class="pb-2 font-semibold">Ukuran</th>
              <th class="pb-2 font-semibold">Tanggal</th>
              <th class="pb-2 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="f in driveFiles" :key="f.id" class="hover:bg-primary-fixed/5 text-label-sm">
              <td class="py-2 max-w-[200px] truncate">{{ f.name }}</td>
              <td class="py-2 text-on-surface-variant">{{ (f.size / 1024).toFixed(1) }} KB</td>
              <td class="py-2 text-on-surface-variant">{{ f.createdTime ? new Date(f.createdTime).toLocaleDateString('id-ID') : '-' }}</td>
              <td class="py-2">
                <div class="flex items-center gap-2">
                  <button class="text-label-xs px-2 py-1 bg-error text-on-error rounded hover:brightness-110 transition-all" @click="confirmDriveRestore(f.id, f.name)">Restore</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Drive Restore Confirm Modal -->
      <Teleport to="body">
        <div v-if="showDriveRestore" class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showDriveRestore = false">
          <div class="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-modal-enter">
            <div class="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-error text-3xl">cloud_download</span>
            </div>
            <h3 class="font-display text-title-lg text-primary mb-2">Restore dari Drive?</h3>
            <p class="text-label-md text-on-surface-variant mb-6">Akan menimpa seluruh database dengan data dari file Drive <strong>{{ driveRestoreName }}</strong>. Yakin?</p>
            <div class="flex gap-3">
              <button class="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl text-label-md" @click="showDriveRestore = false">Batal</button>
              <button class="flex-1 bg-error text-on-error py-3 rounded-xl text-label-md font-bold hover:brightness-110 transition-all" @click="doDriveRestore">{{ driveRestoring ? 'Merestore...' : 'Restore' }}</button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>

    <!-- ── Magic Link ──────────────────────────────────────────── -->
    <div class="glass-card rounded-2xl p-stack-md shadow-sm mb-stack-lg">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-display text-title-lg text-primary">Magic Link</h4>
      </div>
      <p class="text-label-md text-on-surface-variant mb-4">Konfigurasi URL download aplikasi untuk fallback saat user membuka magic link dari WhatsApp.</p>
      <div class="space-y-3">
        <div>
          <label class="text-label-sm font-medium text-on-surface-variant block mb-1">Download URL</label>
          <input v-model="magicLinkUrl" type="url" placeholder="https://play.google.com/store/apps/details?id=..." class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-label-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
        </div>
        <div class="flex items-center gap-3">
          <button class="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-xl text-label-md hover:brightness-110 active:scale-95 transition-all" @click="saveMagicLinkConfig">
            <span class="material-symbols-outlined text-sm">save</span> Simpan
          </button>
          <span v-if="magicLinkMessage" class="text-label-sm" :class="magicLinkMessage.includes('✅') ? 'text-green-600' : 'text-red-600'">{{ magicLinkMessage }}</span>
        </div>
      </div>
      <div class="mt-6 p-4 bg-surface-container-low rounded-xl">
        <p class="text-label-sm font-medium text-on-surface-variant mb-2">Preview Link</p>
        <code class="text-label-sm text-primary break-all">{{ origin }}/magic-link/{token}</code>
        <p class="text-label-xs text-on-surface-variant mt-1">Gunakan link ini di pesan WhatsApp. Jika app terinstal, akan otomatis login. Jika tidak, redirect ke download URL.</p>
      </div>
    </div>

    <!-- ── OCR Settings ──────────────────────────────────────────── -->
    <div class="glass-card rounded-2xl p-stack-md shadow-sm mb-stack-lg">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-display text-title-lg text-primary flex items-center gap-2"><span class="material-symbols-outlined">document_scanner</span> OCR Provider Settings</h4>
        <button class="p-2 text-on-surface-variant hover:text-primary transition-colors" @click="fetchOcrConfig" title="Refresh"><span class="material-symbols-outlined">refresh</span></button>
      </div>
      <p class="text-label-sm text-on-surface-variant mb-4">Konfigurasi API key OCR disimpan di RTDB <code class="bg-surface-container-low px-1 py-0.5 rounded">config/ocr</code>. Prioritas: RTDB → env (<code>NUXT_GEMINI_API_KEY</code> dll) → 502 jika kosong. Mendukung Gemini, OpenRouter, OCR.space. Prompt bisa di-custom per kebutuhan pondok.</p>
      <div v-if="ocrConfigLoading" class="text-label-sm text-on-surface-variant py-4 text-center"><span class="material-symbols-outlined animate-spin text-sm mr-2">refresh</span>Memuat...</div>
      <div v-else class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-label-sm font-medium text-on-surface-variant block mb-1">Gemini API Key <span v-if="ocrConfig.hasGemini" class="text-green-600 text-label-xs">● terisi ({{ ocrConfig.geminiApiKeyMasked }})</span></label>
            <input v-model="ocrForm.geminiApiKey" type="password" placeholder="AIza... (kosongkan jika tidak diganti)" class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-label-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            <input v-model="ocrForm.geminiModel" type="text" placeholder="gemini-2.0-flash" class="w-full mt-2 px-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-label-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            <p class="text-label-xs text-on-surface-variant mt-1">Model gemini (default: gemini-2.0-flash, fallback otomatis ke lite/flash-latest/2.5). <span class="text-amber-600">gemini-1.5-flash sudah deprecated 404.</span></p>
          </div>
          <div>
            <label class="text-label-sm font-medium text-on-surface-variant block mb-1">OpenRouter API Key <span v-if="ocrConfig.hasOpenrouter" class="text-green-600 text-label-xs">● terisi ({{ ocrConfig.openrouterApiKeyMasked }})</span></label>
            <input v-model="ocrForm.openrouterApiKey" type="password" placeholder="sk-or-... (kosongkan jika tidak diganti)" class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-label-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            <input v-model="ocrForm.openrouterModel" type="text" placeholder="qwen/qwen2.5-vl-32b-instruct:free" class="w-full mt-2 px-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-label-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            <p class="text-label-xs text-on-surface-variant mt-1">Model OpenRouter (gratis vision). Rekomendasi: <code>qwen/qwen2.5-vl-32b-instruct:free</code> atau <code>google/gemma-3-4b-it:free</code>. Fallback otomatis coba 6 model free jika 404.</p>
          </div>
        </div>
        <div>
          <label class="text-label-sm font-medium text-on-surface-variant block mb-1">OCR.space API Key <span v-if="ocrConfig.hasOcrSpace" class="text-green-600 text-label-xs">● terisi ({{ ocrConfig.ocrSpaceApiKeyMasked }})</span></label>
          <input v-model="ocrForm.ocrSpaceApiKey" type="password" placeholder="helloworld / apikey (kosongkan jika tidak diganti)" class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-label-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
        </div>
        <div>
          <label class="text-label-sm font-medium text-on-surface-variant block mb-1">Provider Order (drag / urutan prioritas)</label>
          <div class="flex gap-2 flex-wrap">
            <label v-for="p in ['gemini','openrouter','ocrspace']" :key="p" class="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant cursor-pointer">
              <input type="checkbox" :value="p" v-model="ocrForm.providerOrder" class="accent-primary" />
              <span class="text-label-sm capitalize">{{ p }}</span>
            </label>
          </div>
          <p class="text-label-xs text-on-surface-variant mt-1">Centang & urutan sesuai prioritas fallback saat OCR analyze</p>
        </div>
        <div>
          <label class="text-label-sm font-medium text-on-surface-variant block mb-1">Custom OCR Prompt (opsional)</label>
          <textarea v-model="ocrForm.ocrPrompt" rows="7" placeholder="Kosongkan untuk memakai prompt default. Prompt dikirim ke Gemini/OpenRouter." class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-label-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"></textarea>
          <p class="text-label-xs text-on-surface-variant mt-1">Sudah mencakup simbol B/P/I/S/A/✓/• . Ubah hanya jika format kertas berbeda.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-xl text-label-md hover:brightness-110 active:scale-95 transition-all" @click="saveOcrConfig">
            <span class="material-symbols-outlined text-sm">save</span> Simpan OCR Config
          </button>
          <button class="px-4 py-2 border border-outline-variant rounded-xl text-label-md hover:bg-surface-container-high transition-all" @click="testOcrProvider">Test Provider</button>
          <span v-if="ocrMessage" class="text-label-sm" :class="ocrMessage.includes('✅') ? 'text-green-600' : ocrMessage.includes('…') ? 'text-on-surface-variant' : 'text-red-600'">{{ ocrMessage }}</span>
        </div>
        <p class="text-label-xs text-on-surface-variant">RTDB path: <code>config/ocr</code> — API: <code>/api/ocr/config</code> (GET/PUT) & <code>/api/ocr/analyze</code> (POST). Setelah simpan, coba upload gambar di halaman Absensi untuk verifikasi.</p>
      </div>
    </div>

    <!-- ── Activity Logs Preview ──────────────────────────────────── -->
    <div class="glass-card rounded-2xl p-stack-md shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-display text-title-lg text-primary">Activity Logs Preview</h4>
        <button class="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-label-sm hover:brightness-110 transition-all" @click="testLog">
          <span class="material-symbols-outlined text-sm">bug_report</span> Test Log
        </button>
      </div>
      <div class="overflow-x-auto max-h-80 overflow-y-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-label-sm text-on-surface-variant/70 border-b border-outline-variant/20">
              <th class="pb-2 font-semibold">Action</th>
              <th class="pb-2 font-semibold">Description</th>
              <th class="pb-2 font-semibold">Icon</th>
              <th class="pb-2 font-semibold">Timestamp</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-primary-fixed/5 text-label-sm">
              <td class="py-2">{{ log.action }}</td>
              <td class="py-2 text-on-surface-variant">{{ log.description }}</td>
              <td class="py-2"><span class="material-symbols-outlined text-sm">{{ log.icon }}</span></td>
              <td class="py-2 text-on-surface-variant">{{ log.timestamp ? new Date(log.timestamp).toLocaleString('id-ID') : '-' }}</td>
            </tr>
            <tr v-if="logs.length === 0">
              <td colspan="4" class="py-4 text-center text-on-surface-variant">Belum ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin' })

const { getIdToken } = useAuth()

const health = reactive({
  status: 'checking...',
  timestamp: '',
  services: {} as Record<string, any>,
})

const serverUptime = ref('-')
const uptimeLogs = ref<any[]>([])
const uptimeMessage = ref('')

const systemInfo = ref<Record<string, string>>({})
const logs = ref<any[]>([])

// ── Magic Link ───────────────────────────────────────────
const magicLinkUrl = ref('')
const magicLinkMessage = ref('')
const origin = ref('')

async function fetchMagicLinkConfig() {
  try {
    const token = await getIdToken()
    const res: any = await $fetch('/api/magic-link/config', { headers: { Authorization: `Bearer ${token}` } })
    magicLinkUrl.value = res.downloadUrl || ''
    origin.value = window.location.origin
  } catch {}
}

async function saveMagicLinkConfig() {
  if (!magicLinkUrl.value.trim()) {
    magicLinkMessage.value = '❌ URL download tidak boleh kosong'
    setTimeout(() => { magicLinkMessage.value = '' }, 5000)
    return
  }
  try {
    const token = await getIdToken()
    await $fetch('/api/magic-link/config', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: { downloadUrl: magicLinkUrl.value.trim() },
    })
    magicLinkMessage.value = '✅ URL download berhasil disimpan'
  } catch (e: any) {
    magicLinkMessage.value = `❌ Gagal: ${e.data?.statusMessage || e.message}`
  }
  setTimeout(() => { magicLinkMessage.value = '' }, 5000)
}

// ── Backup & Restore ─────────────────────────────────────
const backups = ref<any[]>([])
const backupMessage = ref('')
const showPreview = ref(false)
const previewData = ref('')
const showRestoreConfirm = ref(false)
const restoreTarget = ref('')
const restoring = ref(false)

async function fetchBackups() {
  try { backups.value = await $fetch('/api/backup') } catch { backups.value = [] }
}

async function createBackup() {
  backupMessage.value = 'Membuat backup...'
  try {
    const res: any = await $fetch('/api/backup', { method: 'POST' })
    backupMessage.value = `✅ Backup berhasil: ${res.name} (${(res.size / 1024).toFixed(1)} KB)`
    await fetchBackups()
  } catch (e: any) {
    backupMessage.value = `❌ Gagal: ${e.data?.statusMessage || e.message || 'Unknown error'}`
  }
  setTimeout(() => { backupMessage.value = '' }, 5000)
}

async function previewBackup(name: string) {
  try {
    const data = await $fetch(`/api/backup/download/${encodeURIComponent(name)}`)
    previewData.value = JSON.stringify(data, null, 2).slice(0, 5000) + (JSON.stringify(data).length > 5000 ? '\n\n... (truncated)' : '')
    showPreview.value = true
  } catch (e: any) {
    backupMessage.value = `❌ Gagal preview: ${e.message}`
  }
}

function confirmRestore(name: string) {
  restoreTarget.value = name
  showRestoreConfirm.value = true
}

async function doRestore() {
  restoring.value = true
  try {
    const data = await $fetch(`/api/backup/download/${encodeURIComponent(restoreTarget.value)}`)
    await $fetch('/api/backup/restore', { method: 'POST', body: { data, confirm: true } })
    backupMessage.value = `✅ Restore berhasil dari ${restoreTarget.value}`
    showRestoreConfirm.value = false
  } catch (e: any) {
    backupMessage.value = `❌ Gagal restore: ${e.data?.statusMessage || e.message}`
  } finally { restoring.value = false }
  setTimeout(() => { backupMessage.value = '' }, 5000)
}

async function downloadBackup(name: string) {
  try {
    const data = await $fetch(`/api/backup/download/${encodeURIComponent(name)}`)
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  } catch (e: any) {
    backupMessage.value = `❌ Gagal download: ${e.message}`
  }
}

async function deleteBackup(name: string) {
  try {
    await $fetch(`/api/backup/${encodeURIComponent(name)}`, { method: 'DELETE' })
    backupMessage.value = `✅ Backup ${name} dihapus`
    await fetchBackups()
  } catch (e: any) {
    backupMessage.value = `❌ Gagal hapus: ${e.message}`
  }
  setTimeout(() => { backupMessage.value = '' }, 5000)
}

// ── Google Drive ─────────────────────────────────────────
const driveFiles = ref<any[]>([])
const driveMessage = ref('')
const showDriveRestore = ref(false)
const driveRestoreId = ref('')
const driveRestoreName = ref('')
const driveRestoring = ref(false)

async function fetchDriveFiles() {
  driveMessage.value = 'Memuat daftar file...'
  try {
    driveFiles.value = await $fetch('/api/backup/drive/list')
    driveMessage.value = `✅ ${driveFiles.value.length} file ditemukan`
  } catch (e: any) {
    driveMessage.value = `❌ Gagal: ${e.data?.statusMessage || e.message}`
  }
  setTimeout(() => { driveMessage.value = '' }, 5000)
}

async function uploadToDrive() {
  driveMessage.value = 'Membuat backup & upload ke Drive...'
  try {
    const res: any = await $fetch('/api/backup/drive/upload', { method: 'POST' })
    driveMessage.value = `✅ Backup ${res.driveFile?.name || ''} berhasil diupload ke Drive`
    await fetchDriveFiles()
  } catch (e: any) {
    driveMessage.value = `❌ Gagal: ${e.data?.statusMessage || e.message}`
  }
  setTimeout(() => { driveMessage.value = '' }, 5000)
}

function confirmDriveRestore(fileId: string, fileName: string) {
  driveRestoreId.value = fileId
  driveRestoreName.value = fileName
  showDriveRestore.value = true
}

async function doDriveRestore() {
  driveRestoring.value = true
  try {
    await $fetch('/api/backup/drive/restore', { method: 'POST', body: { fileId: driveRestoreId.value, confirm: true } })
    driveMessage.value = `✅ Restore berhasil dari ${driveRestoreName.value}`
    showDriveRestore.value = false
  } catch (e: any) {
    driveMessage.value = `❌ Gagal restore: ${e.data?.statusMessage || e.message}`
  } finally { driveRestoring.value = false }
  setTimeout(() => { driveMessage.value = '' }, 5000)
}

function fmtUptime(seconds: number) {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${d}d ${h}h ${m}m`
}

async function checkHealth() {
  try {
    const res: any = await $fetch('/api/health')
    health.status = res.status
    health.timestamp = res.timestamp
    Object.assign(health.services, res.services)
    serverUptime.value = fmtUptime(res.uptime || 0)
  } catch (e: any) {
    health.status = 'unreachable'
    health.timestamp = new Date().toISOString()
    health.services = { api: { status: 'error', message: e.message || 'Cannot reach server' } }
  }
}

async function fetchSystemInfo() {
  const nav = navigator as any
  const info: Record<string, string> = {
    Platform: nav?.platform || '-',
    'User Agent': (nav?.userAgent || '-').substring(0, 80),
    Language: nav?.language || '-',
    'Screen Size': `${window?.innerWidth || '-'}x${window?.innerHeight || '-'}`,
    'Node Env': import.meta.dev ? 'development' : 'production',
  }
  systemInfo.value = info
}

async function fetchUptimeLogs() {
  try {
    uptimeLogs.value = await $fetch('/api/uptime/logs?limit=30')
  } catch { uptimeLogs.value = [] }
}

async function runUptimeCheck() {
  uptimeMessage.value = 'Memeriksa...'
  try {
    const res: any = await $fetch('/api/uptime/check')
    uptimeMessage.value = `✅ Selesai — Status: ${res.status} (${res.timestamp ? new Date(res.timestamp).toLocaleTimeString('id-ID') : ''})`
    await fetchUptimeLogs()
    await checkHealth()
  } catch (e: any) {
    uptimeMessage.value = `❌ Gagal: ${e.message || 'Unknown error'}`
  }
  setTimeout(() => { uptimeMessage.value = '' }, 5000)
}

async function fetchLogs() {
  try {
    const token = await getIdToken()
    const res = await fetch('/api/activity-logs', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) logs.value = (await res.json()).slice(0, 20)
  } catch {}
}

async function testLog() {
  try {
    await $fetch('/api/activity-logs', {
      method: 'POST',
      body: {
        action: 'Test Log',
        description: 'Developer page test entry',
        icon: 'bug_report',
        color: '#9b4500',
        userName: 'Developer',
      },
    })
    await fetchLogs()
  } catch {}
}

// ── OCR Settings ───────────────────────────────────────────
const ocrConfig = ref<any>({ hasGemini: false, hasOpenrouter: false, hasOcrSpace: false, geminiModel: 'gemini-2.0-flash', openrouterModel: 'qwen/qwen2.5-vl-32b-instruct:free', providerOrder: ['gemini','openrouter','ocrspace'] })
const ocrForm = reactive({ geminiApiKey: '', geminiModel: 'gemini-2.0-flash', openrouterApiKey: '', openrouterModel: 'qwen/qwen2.5-vl-32b-instruct:free', ocrSpaceApiKey: '', ocrPrompt: '', providerOrder: ['gemini','openrouter','ocrspace'] as string[] })
const ocrConfigLoading = ref(false)
const ocrMessage = ref('')

async function fetchOcrConfig() {
  ocrConfigLoading.value = true
  try {
    const token = await getIdToken()
    const res: any = await $fetch('/api/ocr/config', { headers: { Authorization: `Bearer ${token}` } })
    ocrConfig.value = res
    ocrForm.geminiModel = res.geminiModel || 'gemini-2.0-flash'
    ocrForm.openrouterModel = res.openrouterModel || 'qwen/qwen2.5-vl-32b-instruct:free'
    ocrForm.ocrPrompt = res.ocrPrompt || ''
    ocrForm.providerOrder = res.providerOrder || ['gemini','openrouter','ocrspace']
    ocrForm.geminiApiKey = ''; ocrForm.openrouterApiKey = ''; ocrForm.ocrSpaceApiKey = ''
  } catch (e: any) { ocrMessage.value = `❌ Gagal load: ${e.data?.statusMessage || e.message}`; setTimeout(() => ocrMessage.value='',4000) }
  finally { ocrConfigLoading.value = false }
}
async function saveOcrConfig() {
  ocrMessage.value = 'Menyimpan…'
  try {
    const token = await getIdToken()
    const body: any = { geminiModel: ocrForm.geminiModel, openrouterModel: ocrForm.openrouterModel, ocrPrompt: ocrForm.ocrPrompt, providerOrder: ocrForm.providerOrder }
    if (ocrForm.geminiApiKey.trim()) body.geminiApiKey = ocrForm.geminiApiKey.trim()
    if (ocrForm.openrouterApiKey.trim()) body.openrouterApiKey = ocrForm.openrouterApiKey.trim()
    if (ocrForm.ocrSpaceApiKey.trim()) body.ocrSpaceApiKey = ocrForm.ocrSpaceApiKey.trim()
    // jika kosong tapi ingin hapus: user harus kirim string kosong explicit -> handle via checkbox? Untuk sekarang hanya update jika ada input
    // Untuk menghapus key, isi dengan '-' lalu kami interpretasikan sebagai hapus (tidak implement, butuh explicit '')
    await $fetch('/api/ocr/config', { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body })
    ocrMessage.value = '✅ OCR config berhasil disimpan'
    await fetchOcrConfig()
  } catch (e: any) { ocrMessage.value = `❌ Gagal simpan: ${e.data?.statusMessage || e.message}` }
  setTimeout(() => ocrMessage.value='',5000)
}
async function testOcrProvider() {
  ocrMessage.value = 'Mengecek provider…'
  try {
    const token = await getIdToken()
    const res: any = await $fetch('/api/ocr/config', { headers: { Authorization: `Bearer ${token}` } })
    const providers = []
    if (res.hasGemini) providers.push('Gemini ✓')
    if (res.hasOpenrouter) providers.push('OpenRouter ✓')
    if (res.hasOcrSpace) providers.push('OCR.space ✓')
    ocrMessage.value = providers.length ? `✅ Provider aktif: ${providers.join(', ')}` : '❌ Tidak ada provider terkonfigurasi — isi minimal satu API key'
  } catch (e: any) { ocrMessage.value = `❌ ${e.message}` }
  setTimeout(() => ocrMessage.value='',5000)
}

onMounted(() => {
  checkHealth()
  fetchSystemInfo()
  fetchUptimeLogs()
  fetchLogs()
  fetchBackups()
  fetchMagicLinkConfig()
  fetchOcrConfig()
})
</script>
