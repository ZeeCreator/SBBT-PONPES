<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div v-if="error" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ error }}</div>
    <div v-if="success" class="mb-stack-lg p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-label-md">{{ success }}</div>
    <div class="flex items-center justify-between mb-stack-lg flex-wrap gap-4">
      <div>
        <h2 class="font-display text-headline-lg text-primary">Absensi Program Pagi &amp; Malam</h2>
        <p class="text-on-surface-variant text-body-md">Catat kehadiran santri sesi Pagi (P) dan Malam (M) per bulan</p>
      </div>
      <button v-if="editingId" class="bg-error text-on-error px-4 py-2 rounded-xl text-label-sm hover:brightness-110 transition-all flex items-center gap-2" @click="confirmDelete">
        <span class="material-symbols-outlined text-sm">delete</span> Hapus Absensi Bulan Ini
      </button>
    </div>

    <div class="glass-card rounded-xl shadow-sm overflow-hidden mb-stack-lg">
      <div class="p-4 border-b border-outline-variant/20 flex flex-wrap gap-4 items-end">
        <div class="space-y-1">
          <label class="text-label-xs text-on-surface-variant">Bulan</label>
          <input v-model="selectedMonth" type="month" class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-sm py-2 px-3 focus:ring-primary outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-label-xs text-on-surface-variant">Legenda</label>
          <div class="flex gap-2 text-label-xs">
            <span v-for="s in STATUS_OPTIONS" :key="s.value" class="px-1.5 py-0.5 rounded bg-surface-container-low">{{ s.symbol }} {{ s.label }}</span>
          </div>
        </div>
        <button class="bg-primary text-on-primary px-5 py-2 rounded-xl text-label-sm hover:brightness-110 transition-all flex items-center gap-2" @click="loadSession">
          <span class="material-symbols-outlined text-sm">search</span> Cari
        </button>
      </div>
    </div>

    <div v-if="Object.keys(attendanceData).length > 0" class="glass-card rounded-xl shadow-sm overflow-hidden mb-stack-lg">
      <div class="p-stack-md border-b border-outline-variant/20">
        <h3 class="font-display text-title-lg text-primary flex items-center gap-2">
          <span class="material-symbols-outlined">bar_chart</span> Rekap Absensi Program Pagi &amp; Malam
          <span class="text-label-sm text-on-surface-variant font-normal">{{ selectedMonth }}</span>
        </h3>
      </div>
      <div class="p-stack-md">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div v-for="s in summary" :key="s.label" class="p-3 rounded-xl" :class="s.bg">
            <p class="text-[10px] uppercase font-semibold" :class="s.labelColor">{{ s.label }}</p>
            <p class="text-title-lg font-bold" :class="s.valueColor">{{ s.count }} <span class="text-label-sm font-normal">/ {{ s.total }}</span></p>
            <div class="w-full h-1.5 bg-white/30 rounded-full mt-1 overflow-hidden">
              <div class="h-full rounded-full transition-all" :class="s.barColor" :style="{ width: s.percent + '%' }"></div>
            </div>
            <p class="text-[11px] mt-0.5" :class="s.labelColor">{{ s.percent }}%</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="students.length > 0" class="glass-card rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto" id="print-area">
        <table class="w-full text-left" style="min-width:2200px">
          <thead class="bg-surface-container-low">
            <tr>
              <th rowspan="4" class="px-2 py-2 text-label-xs text-on-surface-variant w-8 text-center align-middle">NO</th>
              <th rowspan="4" class="px-2 py-2 text-label-xs text-on-surface-variant sticky left-0 bg-surface-container-low z-10 align-middle" style="min-width:120px">NAMA</th>
              <th rowspan="4" class="px-2 py-2 text-label-xs text-on-surface-variant align-middle" style="min-width:44px">KLS</th>
              <th :colspan="totalDays * 2" class="px-0.5 py-1 text-label-xs text-on-surface-variant text-center border-l border-outline-variant/20 font-bold">TANGGAL</th>
            </tr>
            <tr>
              <th v-for="d in totalDays" :key="'h' + d" colspan="2" class="px-0.5 py-1 text-label-xs text-on-surface-variant text-center border-l border-outline-variant/20 font-medium">{{ d }}</th>
            </tr>
            <tr>
              <template v-for="d in totalDays" :key="'s' + d">
                <th class="px-0.5 py-1 text-[10px] text-on-surface-variant text-center font-normal border-l border-outline-variant/10">P</th>
                <th class="px-0.5 py-1 text-[10px] text-on-surface-variant text-center font-normal">M</th>
              </template>
            </tr>
            <tr>
              <th v-for="d in totalDays" :key="'hari' + d" colspan="2" class="px-0.5 py-0.5 text-[9px] text-on-surface-variant text-center font-medium border-l border-outline-variant/10" :class="dayCodeClass(dayCodes[d-1])" :title="dayFullName(d)">{{ dayCodes[d-1] }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="(student, idx) in sortedStudents" :key="student.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-2 py-1 text-label-xs text-on-surface-variant text-center">{{ idx + 1 }}</td>
              <td class="px-2 py-1 text-label-xs font-medium sticky left-0 bg-surface z-10">{{ student.name }}</td>
              <td class="px-2 py-1 text-label-xs text-on-surface-variant">{{ shortClass(student.class) || '-' }}</td>
              <template v-for="d in totalDays" :key="'pm' + d">
                <td class="px-0.5 py-1 text-center border-l border-outline-variant/10">
                  <select v-model="attendanceData[student.id][dayKey(d, 'P')]" class="bg-surface-container-low border rounded text-[10px] py-1 px-0.5 focus:ring-primary outline-none w-full" :class="statusClass(attendanceData[student.id][dayKey(d, 'P')])">
                    <option v-for="s in SELECT_OPTIONS" :key="s.value" :value="s.value">{{ s.symbol }}</option>
                  </select>
                </td>
                <td class="px-0.5 py-1 text-center">
                  <select v-model="attendanceData[student.id][dayKey(d, 'M')]" class="bg-surface-container-low border rounded text-[10px] py-1 px-0.5 focus:ring-primary outline-none w-full" :class="statusClass(attendanceData[student.id][dayKey(d, 'M')])">
                    <option v-for="s in SELECT_OPTIONS" :key="s.value" :value="s.value">{{ s.symbol }}</option>
                  </select>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-outline-variant/20 flex flex-wrap justify-end gap-3">
        <button class="bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl text-label-sm hover:brightness-110 transition-all flex items-center gap-2" @click="exportExcel">
          <span class="material-symbols-outlined text-sm">table_chart</span> Excel
        </button>
        <button class="bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl text-label-sm hover:brightness-110 transition-all flex items-center gap-2" @click="triggerOcrUpload">
          <span class="material-symbols-outlined text-sm">image</span> OCR
        </button>
        <input ref="ocrInput" type="file" accept="image/*" class="hidden" @change="uploadOcrImage" />
        <button class="bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl text-label-sm" @click="resetForm">Reset</button>
        <button class="bg-secondary-container text-on-secondary-container px-4 py-2.5 rounded-xl text-label-sm font-bold hover:brightness-110 transition-all flex items-center gap-2" @click="printAttendance">
          <span class="material-symbols-outlined text-sm">print</span> Cetak
        </button>
        <button :disabled="saving" class="bg-primary text-on-primary px-4 py-2.5 rounded-xl text-label-sm font-bold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-60" @click="saveAttendance">
          <span v-if="saving" class="material-symbols-outlined animate-spin text-sm">refresh</span>
          {{ saving ? 'Menyimpan...' : editingId ? 'Update' : 'Simpan' }}
        </button>
      </div>
    </div>

    <div v-if="selectedMonth && students.length === 0 && !loadingStudents" class="glass-card rounded-xl shadow-sm p-8 text-center">
      <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-3">people</span>
      <p class="text-label-md text-on-surface-variant">Tidak ada santri terdaftar</p>
    </div>

    <div v-if="loadingStudents" class="text-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
      <p class="text-label-sm text-on-surface-variant mt-2">Memuat data...</p>
    </div>

    <div v-if="ocrLoading" class="glass-card rounded-xl shadow-sm p-6 mb-stack-lg text-center mt-4">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl mb-3">image</span>
      <p class="text-label-md text-primary font-semibold">Memproses OCR...</p>
      <div class="w-full max-w-md mx-auto bg-surface-container-low rounded-full h-2 mt-3 overflow-hidden">
        <div class="h-full bg-primary rounded-full transition-all" :style="{ width: ocrProgress + '%' }"></div>
      </div>
      <p class="text-label-sm text-on-surface-variant mt-2">{{ ocrProgress }}%</p>
    </div>

    <Teleport to="body">
      <div v-if="showOcrModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showOcrModal = false">
        <div class="bg-surface rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-display text-title-lg text-primary">Hasil OCR Pagi-Malam</h3>
            <button class="text-on-surface-variant hover:text-primary" @click="showOcrModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p class="text-label-xs text-on-surface-variant mb-1">Gambar Asli</p>
              <img :src="ocrImageBase64" alt="Original" class="w-full rounded-lg border border-outline-variant/30" />
            </div>
            <div>
              <p class="text-label-xs text-on-surface-variant mb-1">Gambar Diproses</p>
              <img :src="ocrProcessedBase64 || ocrImageBase64" alt="Processed" class="w-full rounded-lg border border-outline-variant/30" />
            </div>
            <div>
              <p class="text-label-xs text-on-surface-variant mb-1">Teks Terdeteksi</p>
              <pre class="w-full h-48 overflow-y-auto bg-surface-container-low rounded-lg p-3 text-label-sm font-mono whitespace-pre-wrap border border-outline-variant/30">{{ ocrResult || 'Tidak ada teks terdeteksi' }}</pre>
            </div>
          </div>
          <div v-if="ocrParsedRows.length > 0" class="mb-4">
            <p class="text-label-xs text-on-surface-variant mb-2">Hasil Parsing ({{ ocrParsedRows.length }} santri):</p>
            <div class="max-h-32 overflow-y-auto bg-surface-container-low rounded-lg border border-outline-variant/30 divide-y divide-outline-variant/10">
              <div v-for="row in ocrParsedRows" :key="row.name" class="flex items-center justify-between px-3 py-1.5 text-label-sm">
                <span class="font-medium truncate mr-2">{{ row.name }}</span>
                <span class="text-label-xs text-on-surface-variant">{{ row.markSummary }}</span>
              </div>
            </div>
          </div>
          <div v-else-if="ocrResult && !ocrLoading" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-label-sm">
            Teks OCR tidak dapat dicocokkan dengan data santri. Periksa format tabel atau coba gambar lain.
          </div>
          <div class="flex justify-end gap-3">
            <button class="bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-label-sm" @click="showOcrModal = false">Tutup</button>
            <button class="bg-primary text-on-primary px-4 py-2 rounded-xl text-label-sm font-bold" :disabled="ocrParsedRows.length === 0" @click="applyOcrResult">Terapkan ke Absensi</button>
          </div>
        </div>
      </div>

      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showDeleteConfirm = false">
        <div class="bg-surface rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
          <div class="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-error text-3xl">delete</span>
          </div>
          <h3 class="font-display text-title-lg text-primary mb-2">Hapus Absensi Program Pagi &amp; Malam?</h3>
          <p class="text-label-md text-on-surface-variant mb-6">Yakin ingin menghapus absensi bulan <strong>{{ selectedMonth }}</strong>?</p>
          <div class="flex gap-3">
            <button class="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl text-label-md" @click="showDeleteConfirm = false">Batal</button>
            <button class="flex-1 bg-error text-on-error py-3 rounded-xl text-label-md font-bold hover:brightness-110 transition-all" @click="doDelete">Hapus</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

import { parseOcrAttendancePM } from '~/composables/useOcrParser'

const { getIdToken } = useAuth()

const route = useRoute()
const router = useRouter()

const STATUS_OPTIONS = [
  { value: 'hadir', symbol: '✓', label: 'Hadir' },
  { value: 'datang', symbol: '•', label: 'Datang' },
  { value: 'bolos', symbol: 'B', label: 'Bolos' },
  { value: 'alpa', symbol: 'A', label: 'Alpa' },
  { value: 'sakit', symbol: 'S', label: 'Sakit' },
  { value: 'izin', symbol: 'I', label: 'Izin' },
  { value: 'pulang', symbol: 'P', label: 'Pulang' },
]
const SELECT_OPTIONS = [{ value: '', symbol: '–', label: '' }, ...STATUS_OPTIONS]

const SUMMARY_CONFIG = [
  { key: 'hadir', label: 'Hadir', bg: 'bg-green-50', labelColor: 'text-green-700', valueColor: 'text-green-600', barColor: 'bg-green-500' },
  { key: 'datang', label: 'Datang', bg: 'bg-teal-50', labelColor: 'text-teal-700', valueColor: 'text-teal-600', barColor: 'bg-teal-500' },
  { key: 'bolos', label: 'Bolos', bg: 'bg-orange-50', labelColor: 'text-orange-700', valueColor: 'text-orange-600', barColor: 'bg-orange-500' },
  { key: 'alpa', label: 'Alpa', bg: 'bg-red-50', labelColor: 'text-red-700', valueColor: 'text-red-600', barColor: 'bg-red-500' },
  { key: 'izin', label: 'Izin', bg: 'bg-blue-50', labelColor: 'text-blue-700', valueColor: 'text-blue-600', barColor: 'bg-blue-500' },
  { key: 'sakit', label: 'Sakit', bg: 'bg-amber-50', labelColor: 'text-amber-700', valueColor: 'text-amber-600', barColor: 'bg-amber-500' },
  { key: 'pulang', label: 'Pulang', bg: 'bg-purple-50', labelColor: 'text-purple-700', valueColor: 'text-purple-600', barColor: 'bg-purple-500' },
]

const now = new Date()
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
const selectedMonth = ref((route.query.month as string) || currentMonth)
const students = ref<any[]>([])
const loadingStudents = ref(false)
const saving = ref(false)
const editingId = ref('')
const error = ref('')
const success = ref('')
const showDeleteConfirm = ref(false)
const attendanceData = ref<Record<string, Record<string, string>>>({})
const skipWatchReload = ref(false)
const ocrInput = ref<HTMLInputElement | null>(null)
const ocrLoading = ref(false)
const ocrResult = ref('')
const ocrProgress = ref(0)
const showOcrModal = ref(false)
const ocrImageBase64 = ref('')
const ocrProcessedBase64 = ref('')

const ocrParsedRows = computed(() => {
  if (!ocrResult.value || students.value.length === 0) return []
  const parsed = parseOcrAttendancePM(ocrResult.value, students.value)
  if (!parsed) return []
  return Object.entries(parsed).map(([id, marks]) => {
    const student = students.value.find(s => s.id === id)
    const total = Object.keys(marks).length
    const filled = Object.values(marks).filter(v => v).length
    return { id, name: student?.name || id, markSummary: `${filled}/${total} sesi terisi`, marks }
  })
})

const API_BASE = '/api/attendance/program-pm'

const totalDays = computed(() => {
  if (!selectedMonth.value) return 31
  const [y, m] = selectedMonth.value.split('-').map(Number)
  return Math.min(new Date(y, m, 0).getDate(), 31)
})

// Kode hari 2 huruf Indonesia: SN SL RB KM JM SB MG — tidak merusak susunan, hanya baris tambahan
const DAY_CODE_2 = ['MG', 'SN', 'SL', 'RB', 'KM', 'JM', 'SB'] as const
const DAY_FULL = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const
const dayCodes = computed(() => {
  if (!selectedMonth.value) return Array.from({ length: totalDays.value }, () => '–')
  const [y, m] = selectedMonth.value.split('-').map(Number)
  return Array.from({ length: totalDays.value }, (_, i) => {
    const dow = new Date(y, m - 1, i + 1).getDay()
    return DAY_CODE_2[dow]
  })
})
function dayFullName(d: number): string {
  const code = dayCodes.value[d - 1] || ''
  const idx = (DAY_CODE_2 as readonly string[]).indexOf(code)
  return idx >= 0 ? DAY_FULL[idx] : ''
}
function dayCodeClass(code: string): string {
  if (code === 'SB' || code === 'MG') return 'bg-amber-50 text-amber-700'
  if (code === 'JM') return 'bg-green-50 text-green-700'
  return ''
}

function dayKey(d: number, session: 'P' | 'M') {
  return `${d}${session}`
}

function shortClass(c: any) {
  return String(c || '').replace(/^KELAS\s*/i, '').trim()
}

const sortedStudents = computed(() => {
  return [...students.value].sort((a, b) => {
    const ca = String(a.class || '').toLowerCase()
    const cb = String(b.class || '').toLowerCase()
    if (ca !== cb) return ca.localeCompare(cb, 'id', { numeric: true })
    return String(a.name || '').localeCompare(String(b.name || ''), 'id')
  })
})

const summary = computed(() => {
  const days = totalDays.value
  const total = students.value.length * days * 2
  const counts: Record<string, number> = {}
  for (const s of students.value) {
    const d = attendanceData.value[s.id]
    if (!d) continue
    for (let day = 1; day <= days; day++) {
      for (const sess of ['P', 'M'] as const) {
        const v = d[dayKey(day, sess)]
        if (v) counts[v] = (counts[v] || 0) + 1
      }
    }
  }
  return SUMMARY_CONFIG.map(c => {
    const count = counts[c.key] || 0
    return { ...c, count, total, percent: total ? Math.round(count / total * 100) : 0 }
  })
})

async function loadStudents() {
  loadingStudents.value = true
  try {
    const token = await getIdToken()
    const res = await fetch('/api/students', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) students.value = await res.json()
  } catch (e) {
    console.error(e)
  } finally {
    loadingStudents.value = false
  }
}

function initAttendanceData() {
  const data: Record<string, Record<string, string>> = {}
  for (const s of students.value) {
    const marks: Record<string, string> = {}
    for (let d = 1; d <= totalDays.value; d++) {
      marks[dayKey(d, 'P')] = ''
      marks[dayKey(d, 'M')] = ''
    }
    data[s.id] = marks
  }
  attendanceData.value = data
}

async function loadSession() {
  if (!selectedMonth.value) return
  error.value = ''
  await loadStudents()
  if (students.value.length === 0) return
  initAttendanceData()
  try {
    const token = await getIdToken()
    const res = await fetch(`${API_BASE}?month=${encodeURIComponent(selectedMonth.value)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Gagal memuat data' }))
      error.value = err.message || 'Gagal memuat data absensi'
      return
    }
    const records = await res.json()
    if (records.length > 0) {
      const existing = records[0]
      editingId.value = existing.id
      const recordMap = (existing.records || []) as any[]
      const merged: Record<string, Record<string, string>> = {}
      for (const s of students.value) {
        const found = recordMap.find((r: any) => r.studentId === s.id)
        const marks: Record<string, string> = {}
        for (let d = 1; d <= totalDays.value; d++) {
          marks[dayKey(d, 'P')] = found?.marks?.[dayKey(d, 'P')] || ''
          marks[dayKey(d, 'M')] = found?.marks?.[dayKey(d, 'M')] || ''
        }
        merged[s.id] = marks
      }
      attendanceData.value = merged
    } else {
      editingId.value = ''
    }
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data absensi'
    console.error(e)
  }
}

async function saveAttendance() {
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    const token = await getIdToken()
    const records = students.value.map(s => ({
      studentId: s.id,
      name: s.name,
      nis: s.nis,
      class: s.class,
      marks: attendanceData.value[s.id] || {},
    }))
    const monthParts = selectedMonth.value.split('-')
    const body = { year: parseInt(monthParts[0]), month: parseInt(monthParts[1]), monthId: selectedMonth.value, class: 'Semua', records }
    const url = editingId.value ? `${API_BASE}/${editingId.value}` : API_BASE
    const method = editingId.value ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const result = await res.json()
      editingId.value = result.id
      skipWatchReload.value = true
      await router.replace({ query: { month: selectedMonth.value } })
      skipWatchReload.value = false
      success.value = 'Absensi Program Pagi & Malam berhasil disimpan'
      await loadSession()
    } else {
      const err = await res.json().catch(() => ({ message: 'Gagal menyimpan' }))
      error.value = err.message || 'Gagal menyimpan absensi'
    }
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan absensi'
    console.error(e)
  } finally {
    saving.value = false
  }
  setTimeout(() => { success.value = '' }, 3000)
}

function confirmDelete() {
  showDeleteConfirm.value = true
}

async function doDelete() {
  if (!editingId.value) return
  try {
    const token = await getIdToken()
    const res = await fetch(`${API_BASE}/${editingId.value}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      showDeleteConfirm.value = false
      editingId.value = ''
      initAttendanceData()
      success.value = 'Absensi berhasil dihapus'
    } else {
      error.value = 'Gagal menghapus'
    }
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
  setTimeout(() => { success.value = '' }, 3000)
}

function resetForm() {
  initAttendanceData()
  editingId.value = ''
}

function statusClass(val: string) {
  const map: Record<string, string> = {
    hadir: 'border-green-300 text-green-700',
    datang: 'border-teal-300 text-teal-700',
    bolos: 'border-orange-300 text-orange-700',
    alpa: 'border-red-300 text-red-700',
    izin: 'border-blue-300 text-blue-700',
    sakit: 'border-amber-300 text-amber-700',
    pulang: 'border-purple-300 text-purple-700',
  }
  return map[val] || 'border-outline-variant/30 text-on-surface-variant'
}

function triggerOcrUpload() { ocrInput.value?.click() }
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
function preprocessImage(base64: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const maxDim = 1800 // diperbesar agar titik • kecil tidak hilang
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1)
      const w = Math.round(img.width * scale), h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas 2D context not available'))
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      // filter untuk perjelas titik kecil Datang (•) yang sering miss
      ctx.filter = 'contrast(1.35) brightness(1.08) grayscale(1)'
      ctx.drawImage(img, 0, 0, w, h)
      ctx.filter = 'none'
      // peningkatan kontras pixel-level agar titik • lebih pekat vs background
      try {
        const imgData = ctx.getImageData(0, 0, w, h)
        const data = imgData.data
        const factor = 1.25
        for (let i = 0; i < data.length; i += 4) {
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
          const val = Math.max(0, Math.min(255, (lum - 128) * factor + 128))
          data[i] = data[i + 1] = data[i + 2] = val
        }
        ctx.putImageData(imgData, 0, 0)
      } catch {}
      resolve(canvas.toDataURL('image/jpeg', 0.92))
    }
    img.onerror = reject
    img.src = base64
  })
}
async function ocrSpace(base64: string): Promise<string> {
  const token = await getIdToken()
  if (!token) throw new Error('Sesi login habis, silakan login ulang')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)
  try {
    const res = await fetch('/api/ocr/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ image: base64 }),
      signal: controller.signal,
    })
    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(errText || `Server error ${res.status}`)
    }
    const json = await res.json()
    return json.text || ''
  } finally { clearTimeout(timeout) }
}
async function uploadOcrImage(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  const file = input.files[0]
  error.value = ''; success.value = ''; ocrResult.value = ''; ocrProgress.value = 0; ocrLoading.value = true; ocrProcessedBase64.value = ''
  try {
    const rawBase64 = await fileToBase64(file)
    ocrImageBase64.value = rawBase64
    ocrProgress.value = 20
    const processed = await preprocessImage(rawBase64)
    ocrProcessedBase64.value = processed
    ocrProgress.value = 40
    ocrResult.value = await ocrSpace(processed)
    ocrProgress.value = 80
    const token = await getIdToken()
    await fetch('/api/attendance/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ image: processed, ocrText: ocrResult.value, month: selectedMonth.value, class: 'Pagi-Malam' }),
    }).catch(() => {})
    ocrProgress.value = 100
    showOcrModal.value = true
    success.value = 'OCR berhasil — tinjau dan Terapkan'
  } catch (e: any) {
    error.value = e.message || 'Gagal proses OCR'; console.error(e)
  } finally { ocrLoading.value = false }
  input.value = ''
  setTimeout(() => { success.value = '' }, 3000)
}
function applyOcrResult() {
  showOcrModal.value = false
  if (!ocrResult.value || students.value.length === 0) { success.value = 'Tidak ada data OCR'; setTimeout(() => success.value = '', 3000); return }
  const parsed = parseOcrAttendancePM(ocrResult.value, students.value)
  if (parsed && Object.keys(parsed).length > 0) {
    const fresh = { ...attendanceData.value }
    let applied = 0
    for (const sid of Object.keys(parsed)) if (fresh[sid]) { fresh[sid] = { ...fresh[sid], ...parsed[sid] }; applied++ }
    attendanceData.value = fresh
    success.value = `${applied} santri terisi dari OCR (Pagi-Malam)`
  } else success.value = 'Tidak dapat mencocokkan OCR dengan santri'
  setTimeout(() => success.value = '', 3000)
}

function exportExcel() {
  if (students.value.length === 0) return
  const symbolOf: Record<string, string> = {}
  for (const s of STATUS_OPTIONS) symbolOf[s.value] = s.symbol
  const days = Array.from({ length: totalDays.value }, (_, i) => i + 1)
  const codes = dayCodes.value
  let html = '<table border="1"><tr><th rowspan="4">NO</th><th rowspan="4">NAMA</th><th rowspan="4">KLS</th><th colspan="' + (days.length * 2) + '">TANGGAL</th></tr><tr>'
  for (const d of days) html += `<th colspan="2">${d}</th>`
  html += '</tr><tr>'
  for (const _ of days) html += '<th>P</th><th>M</th>'
  html += '</tr><tr>'
  for (let i = 0; i < days.length; i++) html += `<th colspan="2" style="font-size:8px">${codes[i] || ''}</th>`
  html += '</tr>'
  students.value.slice().sort((a, b) => {
    const ca = String(a.class || '').toLowerCase()
    const cb = String(b.class || '').toLowerCase()
    if (ca !== cb) return ca.localeCompare(cb, 'id', { numeric: true })
    return String(a.name || '').localeCompare(String(b.name || ''), 'id')
  }).forEach((s, i) => {
    const d = attendanceData.value[s.id] || {}
    html += `<tr><td>${i + 1}</td><td>${s.name}</td><td>${shortClass(s.class)}</td>`
    for (const dd of days) {
      for (const sess of ['P', 'M'] as const) {
        const v = d[dayKey(dd, sess)]
        html += `<td style="text-align:center">${v ? (symbolOf[v] || '') : ''}</td>`
      }
    }
    html += '</tr>'
  })
  html += '</table>'
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Absensi_Program_Pagi_Malam_${selectedMonth.value}.xls`
  a.click()
  URL.revokeObjectURL(url)
}

function printAttendance() {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  const symbolOf: Record<string, string> = {}
  for (const s of STATUS_OPTIONS) symbolOf[s.value] = s.symbol
  const days = Array.from({ length: totalDays.value }, (_, i) => i + 1)
  const colNo = 20, colNama = 92, colKelas = 22, dateColWidth = 13
  const tableWidth = colNo + colNama + colKelas + days.length * 2 * dateColWidth
  const hasSavedData = !!editingId.value
  const sorted = [...students.value].sort((a, b) => {
    const ca = String(a.class || '').toLowerCase()
    const cb = String(b.class || '').toLowerCase()
    if (ca !== cb) return ca.localeCompare(cb, 'id', { numeric: true })
    return String(a.name || '').localeCompare(String(b.name || ''), 'id')
  })
  const dataRows = sorted.map((s, idx) => {
    const d = attendanceData.value[s.id] || {}
    const cellStyle = 'padding:0px;border:1px solid #000;text-align:center;font-size:6.5pt;font-family:\'Times New Roman\',serif'
    let row = `<tr style="height:13px">
      <td style="${cellStyle}width:${colNo}px">${idx + 1}</td>
      <td style="${cellStyle}text-align:left;padding-left:2px">${s.name}</td>
      <td style="${cellStyle}width:${colKelas}px">${String(s.class || '').replace(/^KELAS\s*/i, '').trim()}</td>`
    for (const dd of days) {
      for (const sess of ['P', 'M'] as const) {
        const v = hasSavedData ? (symbolOf[d[dayKey(dd, sess)]] || '') : ''
        row += `<td style="${cellStyle}width:${dateColWidth}px;height:13px">${v}</td>`
      }
    }
    row += '</tr>'
    return row
  }).join('')
  const logoUrl = window.location.origin + '/image/logo.png'
  const monthName = selectedMonth.value ? new Date(selectedMonth.value + '-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : selectedMonth.value
  printWindow.document.write(`<!DOCTYPE html>
<html><head><title>Absensi Program Pagi &amp; Malam</title>
<style>
  @page { size: A4 landscape; margin: 6mm; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; padding: 0; font-family: 'Times New Roman', Times, serif; color: #000; font-size: 10pt; }
  .header { position: relative; width: ${tableWidth}px; margin: 0 auto; padding-bottom: 2px; }
  .header-left { position: absolute; top: 2px; left: 0; font-size: 7.5pt; }
  .header-right { position: absolute; top: 2px; right: 0; font-size: 8.5pt; white-space: nowrap; }
  .header-center { text-align: center; }
  .header-inner { display: inline-flex; align-items: center; justify-content: center; gap: 10px; }
  .logo-img { width: 30px; height: auto; object-fit: contain; }
  .title-group { text-align: center; line-height: 1.1; }
  .title-group .line1 { font-size: 9.5pt; font-weight: bold; letter-spacing: 2px; }
  .title-group .line2 { font-size: 15pt; font-weight: bold; letter-spacing: 3px; }
  .title-group .line3 { font-size: 7pt; }
  .hr { border: none; border-top: 2px solid #000; margin: 2px auto 0 auto; width: ${tableWidth}px; }
  .table-wrap { width: ${tableWidth}px; margin: 0 auto; }
  table { width: ${tableWidth}px; border-collapse: collapse; table-layout: fixed; }
  th { border: 1px solid #000; font-weight: bold; }
  thead { display: table-header-group; }
  .th-no { width: ${colNo}px; font-size: 7pt; padding: 2px 1px; text-align: center; }
  .th-nama { width: ${colNama}px; font-size: 7pt; padding: 2px 2px; text-align: center; }
  .th-kelas { width: ${colKelas}px; font-size: 7pt; padding: 2px 2px; text-align: center; }
  .th-tanggal { font-size: 7pt; padding: 2px 0; text-align: center; }
  .th-day { font-size: 6pt; padding: 1px 0; text-align: center; font-weight: normal; }
  .th-pm { font-size: 6pt; padding: 0; text-align: center; font-weight: normal; width: ${dateColWidth}px; }
  td { font-size: 7pt; }
  .legend { width: ${tableWidth}px; margin: 4px auto 0 auto; font-size: 7pt; }
  .legend table { width: auto; border-collapse: collapse; }
  .legend th, .legend td { border: 1px solid #000; padding: 0px 5px; font-size: 7pt; text-align: left; }
  .signature { margin-top: 4px; display: flex; justify-content: space-around; width: ${tableWidth}px; margin-left: auto; margin-right: auto; padding-top: 2px; }
  .signature div { text-align: center; font-size: 8.5pt; }
  .signature .line { margin-top: 26px; width: 140px; border-top: 1px solid #000; display: block; }
  .signature p { margin: 0; }
</style></head><body>
<div class="header">
  <div class="header-left">ABSEN PROGRAM PAGI &amp; MALAM</div>
  <div class="header-right">BULAN : ${monthName}</div>
  <div class="header-center">
    <div class="header-inner">
      <img src="${logoUrl}" alt="Logo" class="logo-img" />
      <div class="title-group">
        <div class="line1">YAYASAN PONDOK PESANTREN</div>
        <div class="line2">AL FATAH PANEKAN</div>
        <div class="line3">Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</div>
      </div>
    </div>
  </div>
</div>
<hr class="hr" />
<div class="table-wrap">
<table>
  <thead>
    <tr>
      <th class="th-no" rowspan="4">NO</th>
      <th class="th-nama" rowspan="4">NAMA</th>
      <th class="th-kelas" rowspan="4">KLS</th>
      <th class="th-tanggal" colspan="${days.length * 2}">TANGGAL</th>
    </tr>
    <tr>
      ${days.map(d => `<th class="th-day" colspan="2">${d}</th>`).join('')}
    </tr>
    <tr>
      ${days.map(() => `<th class="th-pm">P</th><th class="th-pm">M</th>`).join('')}
    </tr>
    <tr>
      ${(() => {
        const codes = ['MG','SN','SL','RB','KM','JM','SB']
        const [yy, mm] = (selectedMonth.value || '').split('-').map(Number)
        return days.map(d => {
          const dow = selectedMonth.value ? new Date(yy, mm - 1, d).getDay() : 0
          const c = codes[dow] || ''
          const bg = c==='SB'||c==='MG' ? 'background:#fef3c7;' : c==='JM' ? 'background:#dcfce7;' : ''
          return `<th class="th-pm" style="font-size:5.5pt;${bg}">${c}</th><th class="th-pm" style="font-size:5.5pt;${bg}">${c}</th>`
        }).join('')
      })()}
    </tr>
  </thead>
  <tbody>${dataRows}</tbody>
</table>
</div>
<div class="legend">
  <table>
    <tr><th>Keterangan</th><td>&#10003; Hadir</td><td>&#8226; Datang</td><td>B Bolos</td><td>A Alpa</td><td>I Izin</td><td>S Sakit</td><td>P Pulang</td></tr>
  </table>
</div>
<div class="signature">
  <div><p>Mengetahui,</p><p>Kepala Pondok</p><span class="line"></span></div>
</div>
<script>window.onload = function() { window.print(); } <\/script>
</body></html>`)
  printWindow.document.close()
}

watch(selectedMonth, (month) => {
  if (skipWatchReload.value) {
    skipWatchReload.value = false
    return
  }
  router.replace({ query: { month } })
  if (month) loadSession()
})

onMounted(() => {
  if (selectedMonth.value) loadSession()
})
</script>
