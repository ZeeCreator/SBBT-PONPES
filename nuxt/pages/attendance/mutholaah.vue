<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div v-if="error" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ error }}</div>
    <div v-if="success" class="mb-stack-lg p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-label-md">{{ success }}</div>
    <div class="flex items-center justify-between mb-stack-lg flex-wrap gap-4">
      <div>
        <h2 class="font-display text-headline-lg text-primary">Absensi Muthola'ah</h2>
        <p class="text-on-surface-variant text-body-md">Catat dan kelola kehadiran muthola'ah santri per bulan (semua kelas)</p>
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
            <span v-for="s in STATUS_OPTIONS" :key="s.value" class="px-1.5 py-0.5 rounded bg-surface-container-low">{{ s.label }}</span>
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
          <span class="material-symbols-outlined">bar_chart</span> Rekap Absensi Muthola'ah
          <span class="text-label-sm text-on-surface-variant font-normal">{{ selectedMonth }}</span>
        </h3>
      </div>
      <div class="p-stack-md">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
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
        <table class="w-full text-left" style="min-width:1400px">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-2 py-2 text-label-xs text-on-surface-variant w-8 text-center">#</th>
              <th class="px-2 py-2 text-label-xs text-on-surface-variant sticky left-0 bg-surface-container-low z-10" style="min-width:120px">Nama Santri</th>
              <th class="px-2 py-2 text-label-xs text-on-surface-variant" style="min-width:80px">Kelas</th>
              <th v-for="d in 31" :key="d" class="px-0.5 py-2 text-label-xs text-on-surface-variant text-center" :style="{ minWidth: dayColWidth + 'px', width: dayColWidth + 'px' }">{{ d }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="(student, idx) in students" :key="student.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-2 py-1 text-label-xs text-on-surface-variant text-center">{{ idx + 1 }}</td>
              <td class="px-2 py-1 text-label-xs font-medium sticky left-0 bg-surface z-10">{{ student.name }}</td>
              <td class="px-2 py-1 text-label-xs text-on-surface-variant">{{ student.class || '-' }}</td>
              <td v-for="d in 31" :key="d" class="px-0.5 py-1 text-center">
                <select v-model="attendanceData[student.id][String(d)]" class="bg-surface-container-low border rounded text-[10px] py-1 px-0.5 focus:ring-primary outline-none w-full" :class="statusClass(attendanceData[student.id][String(d)])">
                  <option v-for="s in STATUS_OPTIONS" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-outline-variant/20 flex flex-wrap justify-end gap-3">
        <button class="bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl text-label-sm hover:brightness-110 transition-all flex items-center gap-2" @click="exportExcel">
          <span class="material-symbols-outlined text-sm">table_chart</span> Excel
        </button>
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

    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showDeleteConfirm = false">
        <div class="bg-surface rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
          <div class="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-error text-3xl">delete</span>
          </div>
          <h3 class="font-display text-title-lg text-primary mb-2">Hapus Absensi Muthola'ah?</h3>
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

const { getIdToken } = useAuth()

const route = useRoute()
const router = useRouter()

const STATUS_OPTIONS = [
  { value: 'present', label: '✓' },
  { value: 'sick', label: 'S' },
  { value: 'permit', label: 'I' },
  { value: 'absent', label: 'A' },
]
const DEFAULT_STATUS = 'present'

const SUMMARY_CONFIG = [
  { key: 'present', label: 'Hadir', bg: 'bg-green-50', labelColor: 'text-green-700', valueColor: 'text-green-600', barColor: 'bg-green-500' },
  { key: 'sick', label: 'Sakit', bg: 'bg-amber-50', labelColor: 'text-amber-700', valueColor: 'text-amber-600', barColor: 'bg-amber-500' },
  { key: 'permit', label: 'Izin', bg: 'bg-blue-50', labelColor: 'text-blue-700', valueColor: 'text-blue-600', barColor: 'bg-blue-500' },
  { key: 'absent', label: 'Alpa', bg: 'bg-red-50', labelColor: 'text-red-700', valueColor: 'text-red-600', barColor: 'bg-red-500' },
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
const dayColWidth = 32

const summary = computed(() => {
  const daysInMonth = new Date(parseInt(selectedMonth.value.split('-')[0]), parseInt(selectedMonth.value.split('-')[1]), 0).getDate()
  const totalDays = Math.min(daysInMonth, 31)
  const total = students.value.length * totalDays
  const counts: Record<string, number> = {}
  for (const s of students.value) {
    const d = attendanceData.value[s.id]
    if (!d) continue
    for (let day = 1; day <= totalDays; day++) {
      const key = String(day)
      if (d[key]) counts[d[key]] = (counts[d[key]] || 0) + 1
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
    for (let d = 1; d <= 31; d++) marks[String(d)] = DEFAULT_STATUS
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
    const res = await fetch(`/api/attendance/mutholaah?month=${encodeURIComponent(selectedMonth.value)}`, {
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
        for (let d = 1; d <= 31; d++) marks[String(d)] = found?.marks?.[String(d)] || DEFAULT_STATUS
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
    const url = editingId.value ? `/api/attendance/mutholaah/${editingId.value}` : '/api/attendance/mutholaah'
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
      success.value = 'Absensi Muthola\'ah berhasil disimpan'
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
    const res = await fetch(`/api/attendance/mutholaah/${editingId.value}`, {
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
    present: 'border-green-300 text-green-700',
    sick: 'border-amber-300 text-amber-700',
    permit: 'border-blue-300 text-blue-700',
    absent: 'border-red-300 text-red-700',
  }
  return map[val] || ''
}

function exportExcel() {
  if (students.value.length === 0) return
  const statusLabel: Record<string, string> = {}
  for (const s of STATUS_OPTIONS) statusLabel[s.value] = s.label
  const cols = Array.from({ length: 31 }, (_, i) => i + 1)
  let html = `<table border="1"><tr><th>No</th><th>Nama</th><th>Kelas</th>${cols.map(d => `<th>${d}</th>`).join('')}</tr>`
  students.value.forEach((s, i) => {
    const d = attendanceData.value[s.id] || {}
    html += `<tr><td>${i + 1}</td><td>${s.name}</td><td>${s.class || ''}</td>${cols.map(dd => `<td style="text-align:center">${statusLabel[d[String(dd)]] || statusLabel[DEFAULT_STATUS]}</td>`).join('')}</tr>`
  })
  html += '</table>'
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Absensi_Mutholaah_${selectedMonth.value}.xls`
  a.click()
  URL.revokeObjectURL(url)
}

function printAttendance() {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  const statusLabel: Record<string, string> = {}
  for (const s of STATUS_OPTIONS) statusLabel[s.value] = s.label
  const dayCols = Array.from({ length: 31 }, (_, i) => i + 1)
  const colNo = 25, colNama = 120, colKelas = 45, dateColWidth = 15
  const tableWidth = colNo + colNama + colKelas + dayCols.length * dateColWidth
  const hasSavedData = !!editingId.value
  const dataRows = students.value.map((s, idx) => {
    const d = attendanceData.value[s.id] || {}
    const mark = (dd: number) => (hasSavedData ? (statusLabel[d[String(dd)]] || '') : '')
    return `<tr style="height:18px">
      <td style="padding:1px 2px;border:1px solid #000;text-align:center;font-size:7pt;font-family:'Times New Roman',serif;width:${colNo}px">${idx + 1}</td>
      <td style="padding:1px 2px;border:1px solid #000;font-size:7pt;font-family:'Times New Roman',serif">${s.name}</td>
      <td style="padding:1px 2px;border:1px solid #000;text-align:center;font-size:7pt;font-family:'Times New Roman',serif">${s.class || ''}</td>
      ${dayCols.map(dd => `<td style="padding:1px 1px;border:1px solid #000;text-align:center;font-size:6pt;font-family:'Times New Roman',serif;width:${dateColWidth}px;height:18px">${mark(dd)}</td>`).join('')}
    </tr>`
  }).join('')
  const logoUrl = window.location.origin + '/image/logo.png'
  const monthName = selectedMonth.value ? new Date(selectedMonth.value + '-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : selectedMonth.value
  printWindow.document.write(`<!DOCTYPE html>
<html><head><title>Absensi Muthola'ah</title>
<style>
  @page { size: A4 portrait; margin: 10mm 10mm; }
  body { margin: 0; padding: 0; font-family: 'Times New Roman', Times, serif; color: #000; font-size: 10pt; }
  .header { position: relative; width: ${tableWidth}px; margin: 0 auto; padding-bottom: 4px; }
  .header-left { position: absolute; top: 2px; left: 0; font-size: 8pt; }
  .header-right { position: absolute; top: 2px; right: 0; font-size: 9pt; white-space: nowrap; }
  .header-center { text-align: center; }
  .header-inner { display: inline-flex; align-items: center; justify-content: center; gap: 12px; }
  .logo-img { width: 36px; height: auto; object-fit: contain; }
  .title-group { text-align: center; }
  .title-group .line1 { font-size: 11pt; font-weight: bold; letter-spacing: 2px; }
  .title-group .line2 { font-size: 18pt; font-weight: bold; letter-spacing: 3px; }
  .title-group .line3 { font-size: 8pt; }
  .hr { border: none; border-top: 2.5px solid #000; margin: 2px auto 0 auto; width: ${tableWidth}px; }
  .table-wrap { width: ${tableWidth}px; margin: 0 auto; }
  table { width: ${tableWidth}px; border-collapse: collapse; table-layout: fixed; }
  th { border: 1px solid #000; font-weight: bold; }
  thead { display: table-header-group; }
  .th-no { width: ${colNo}px; font-size: 7pt; padding: 2px 1px; text-align: center; }
  .th-nama { width: ${colNama}px; font-size: 7pt; padding: 2px 2px; text-align: center; }
  .th-kelas { width: ${colKelas}px; font-size: 7pt; padding: 2px 2px; text-align: center; }
  .th-tanggal { font-size: 7pt; padding: 2px 0; text-align: center; border-left: 1px solid #000; border-right: 1px solid #000; }
  .th-day { font-size: 6pt; padding: 1px 0; text-align: center; width: ${dateColWidth}px; font-weight: normal; }
  td { font-size: 7pt; }
  .signature { margin-top: 16px; display: flex; justify-content: space-around; width: ${tableWidth}px; margin-left: auto; margin-right: auto; padding-top: 8px; }
  .signature div { text-align: center; font-size: 9pt; }
  .signature .line { margin-top: 36px; width: 140px; border-top: 1px solid #000; display: block; }
  .signature p { margin: 2px 0; }
</style></head><body>
<div class="header">
  <div class="header-left">INV. DINIYAH/ABSEN MUTHOLA'AH</div>
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
      <th class="th-no" rowspan="2">NO</th>
      <th class="th-nama" rowspan="2">NAMA</th>
      <th class="th-kelas" rowspan="2">KLS</th>
      <th class="th-tanggal" colspan="31">TANGGAL</th>
    </tr>
    <tr>
      ${dayCols.map(d => `<th class="th-day">${d}</th>`).join('')}
    </tr>
  </thead>
  <tbody>${dataRows}</tbody>
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
