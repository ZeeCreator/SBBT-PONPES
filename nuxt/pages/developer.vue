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

onMounted(() => {
  checkHealth()
  fetchSystemInfo()
  fetchUptimeLogs()
  fetchLogs()
  fetchBackups()
})
</script>
