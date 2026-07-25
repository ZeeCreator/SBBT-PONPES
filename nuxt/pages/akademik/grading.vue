<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg flex flex-wrap items-center justify-between gap-stack-md">
      <div>
        <h2 class="font-display text-headline-lg text-primary">Management Penilaian</h2>
        <p class="text-on-surface-variant text-body-md">Kelola nilai santri per mata pelajaran dan cetak rapor.</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Nilai
        </button>
        <button class="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all" @click="printRekap">
          <span class="material-symbols-outlined text-sm">print</span> Cetak Rekap
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4 mb-stack-lg">
      <div class="flex items-center gap-2">
        <label class="text-label-sm text-on-surface-variant whitespace-nowrap">Kelas:</label>
        <select v-model="selectedClass" class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary min-w-[160px]" @change="fetchData">
          <option value="">-- Semua Kelas --</option>
          <option v-for="c in classes" :key="c.id" :value="c.name || c.nama">{{ c.name || c.nama }}</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-label-sm text-on-surface-variant whitespace-nowrap">Semester:</label>
        <select v-model="selectedSemester" class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary" @change="fetchData">
          <option value="Ganjil">Ganjil</option>
          <option value="Genap">Genap</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-label-sm text-on-surface-variant whitespace-nowrap">Tahun Ajaran:</label>
        <select v-model="selectedAcademicYear" class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary min-w-[130px]" @change="fetchData">
          <option v-for="ay in academicYears" :key="ay.id" :value="ay.name || ay.code">{{ ay.name || ay.code }}</option>
        </select>
      </div>
    </div>

    <div v-if="error" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ error }}</div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
    </div>

    <template v-if="!loading">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
        <div v-for="s in stats" :key="s.label" class="glass-card p-stack-md rounded-xl shadow-sm text-center">
          <p class="font-display text-headline-md" :class="s.color">{{ s.value }}</p>
          <p class="text-label-sm text-on-surface-variant">{{ s.label }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
        <div class="lg:col-span-2 glass-card rounded-xl p-6 shadow-sm overflow-hidden">
          <h3 class="font-display text-title-lg text-primary mb-4">Daftar Nilai</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
                  <th class="px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap sticky left-0 bg-surface-container-low z-10">Santri</th>
                  <th v-for="s in subjects" :key="s.id" class="px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap text-center">{{ s.name }}</th>
                  <th class="px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap text-center">Rata-rata</th>
                  <th class="px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap text-center">Status</th>
                  <th class="px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-if="filteredStudents.length === 0">
                  <td :colspan="subjects.length + 4" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Belum ada data santri. Pilih kelas terlebih dahulu.</td>
                </tr>
                <tr v-for="row in studentRows" :key="row.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(row.id)" @change="toggleOne(row.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                  <td class="px-3 py-2 text-label-md font-medium sticky left-0 bg-surface z-10">{{ row.name }}</td>
                  <td v-for="s in subjects" :key="s.id" class="px-2 py-2 text-center cursor-pointer" @click="openEditGrade(row, s.name)">
                    <span v-if="row.scores[s.name] !== undefined && row.scores[s.name] !== null"
                      :class="['px-2 py-0.5 rounded text-label-sm font-bold', row.scores[s.name] >= 90 ? 'bg-green-100 text-green-700' : row.scores[s.name] >= 80 ? 'bg-primary-fixed text-on-primary-fixed' : row.scores[s.name] >= 70 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700']">
                      {{ row.scores[s.name] }}
                    </span>
                    <span v-else class="text-on-surface-variant/40 text-label-sm">-</span>
                  </td>
                  <td class="px-3 py-2 text-center font-bold text-primary">{{ row.average }}</td>
                  <td class="px-3 py-2 text-center">
                    <span :class="['px-2 py-1 text-[10px] font-bold rounded-full uppercase whitespace-nowrap', row.passed ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-700']">
                      {{ row.passed ? 'Lulus' : 'Remedial' }}
                    </span>
                  </td>
                  <td class="px-3 py-2 text-center">
                    <button class="text-error hover:text-red-700 transition-colors p-1" title="Hapus semua nilai santri" @click="confirmDeleteStudent(row)">
                      <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="space-y-gutter">
          <div class="glass-card rounded-xl p-6 shadow-sm">
            <h3 class="font-display text-title-lg text-primary mb-4">Distribusi Nilai</h3>
            <div v-if="gradeDistribution.length === 0" class="text-on-surface-variant text-label-md">Belum ada data</div>
            <div v-for="dist in gradeDistribution" :key="dist.label" class="space-y-1 mb-3">
              <div class="flex justify-between text-label-sm">
                <span class="text-on-surface-variant">{{ dist.label }}</span>
                <span class="font-bold">{{ dist.percentage }}%</span>
              </div>
              <div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" :class="dist.barColor" :style="{ width: dist.percentage + '%' }"></div>
              </div>
            </div>
          </div>
          <div class="glass-card rounded-xl p-6 shadow-sm">
            <h3 class="font-display text-title-lg text-primary mb-4">Cetak per Santri</h3>
            <div class="space-y-3">
              <select v-model="printStudentId" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary">
                <option value="">-- Pilih Santri --</option>
                <option v-for="s in filteredStudents" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
              <button class="w-full bg-tertiary text-on-tertiary py-2 rounded-lg text-label-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40" :disabled="!printStudentId" @click="printNilaiSantri">
                <span class="material-symbols-outlined text-sm">badge</span> Cetak Nilai Santri
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <Teleport to="body">
      <div v-if="showGradeModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showGradeModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-modal-enter">
          <div class="bg-primary px-gutter py-stack-md flex justify-between items-center">
            <h2 class="font-display text-headline-md text-on-primary">{{ gradeForm.id ? 'Edit Nilai' : 'Tambah Nilai' }}</h2>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showGradeModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="saveGrade">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Santri</label>
              <select v-model="gradeForm.studentId" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required :disabled="!!gradeForm.id">
                <option value="">-- Pilih Santri --</option>
                <option v-for="s in filteredStudents" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Mata Pelajaran</label>
              <select v-model="gradeForm.subject" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required>
                <option value="">-- Pilih Mapel --</option>
                <option v-for="s in subjects" :key="s.id" :value="s.name">{{ s.name }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nilai (0-100)</label>
              <input type="number" min="0" max="100" v-model.number="gradeForm.score" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
            </div>
            <div class="flex justify-end gap-stack-sm pt-stack-sm">
              <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="showGradeModal = false">Batal</button>
              <button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="showDeleteModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showDeleteModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-modal-enter">
          <div class="p-6 text-center">
            <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
            </div>
            <h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Semua Nilai</h3>
            <p class="text-on-surface-variant text-label-md">Yakin ingin menghapus semua nilai <strong>{{ deleteTarget?.name }}</strong>?</p>
          </div>
          <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="showDeleteModal = false">Batal</button>
            <button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="doDeleteStudentGrades">Hapus</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(studentRows)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const loading = ref(true)
const error = ref('')

const classes = ref<any[]>([])
const academicYears = ref<any[]>([])
const students = ref<any[]>([])
const subjects = ref<any[]>([])
const grades = ref<any[]>([])

const selectedClass = ref('')
const selectedSemester = ref('Ganjil')
const selectedAcademicYear = ref('2025/2026')
const printStudentId = ref('')

const showGradeModal = ref(false)
const showDeleteModal = ref(false)
const deleteTarget = ref<any>(null)
const gradeForm = reactive({ id: '', studentId: '', subject: '', score: 0 })

const filteredStudents = computed(() =>
  selectedClass.value ? students.value.filter(s => s.class === selectedClass.value) : students.value
)

interface StudentRow {
  id: string
  name: string
  nis: string
  scores: Record<string, number | null>
  gradeIds: Record<string, string>
  average: string
  passed: boolean
}

const studentRows = computed<StudentRow[]>(() => {
  const gradeMap: Record<string, Record<string, { score: number; gradeId: string }>> = {}
  grades.value.forEach((g: any) => {
    if (!gradeMap[g.studentId]) gradeMap[g.studentId] = {}
    gradeMap[g.studentId][g.subject] = { score: Number(g.score) || 0, gradeId: g.id }
  })

  return filteredStudents.value.map(s => {
    const studentGrades = gradeMap[s.id] || {}
    const scores: Record<string, number | null> = {}
    const gradeIds: Record<string, string> = {}
    subjects.value.forEach(sub => {
      if (studentGrades[sub.name]) {
        scores[sub.name] = studentGrades[sub.name].score
        gradeIds[sub.name] = studentGrades[sub.name].gradeId
      } else {
        scores[sub.name] = null
      }
    })
    const vals = Object.values(scores).filter((v): v is number => v !== null)
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    return {
      id: s.id,
      name: s.name,
      nis: s.nis || '',
      scores,
      gradeIds,
      average: avg ? avg.toFixed(1) : '-',
      passed: avg >= 75,
    }
  })
})

const stats = computed(() => {
  const rows = studentRows.value
  const total = rows.length
  const allAverages = rows.map(r => parseFloat(r.average)).filter(v => !isNaN(v))
  const overallAvg = allAverages.length ? (allAverages.reduce((a, b) => a + b, 0) / allAverages.length) : 0
  const passedCount = rows.filter(r => r.passed).length
  return [
    { label: 'Total Santri', value: total.toString(), color: 'text-primary' },
    { label: 'Rata-rata Kelas', value: overallAvg ? overallAvg.toFixed(1) : '-', color: 'text-secondary' },
    { label: 'Tingkat Kelulusan', value: total ? Math.round(passedCount / total * 100) + '%' : '-', color: 'text-tertiary' },
    { label: 'Mata Pelajaran', value: subjects.value.length.toString(), color: 'text-green-600' },
  ]
})

const gradeDistribution = computed(() => {
  const allScores: number[] = []
  studentRows.value.forEach(row => {
    Object.values(row.scores).forEach(v => {
      if (v !== null) allScores.push(v)
    })
  })
  const total = allScores.length
  if (!total) return []
  const a = allScores.filter(v => v >= 90).length
  const b = allScores.filter(v => v >= 80 && v < 90).length
  const c = allScores.filter(v => v >= 70 && v < 80).length
  const d = allScores.filter(v => v < 70).length
  return [
    { label: 'A (90-100)', percentage: Math.round(a / total * 100), barColor: 'bg-green-500' },
    { label: 'B (80-89)', percentage: Math.round(b / total * 100), barColor: 'bg-primary-container' },
    { label: 'C (70-79)', percentage: Math.round(c / total * 100), barColor: 'bg-amber-500' },
    { label: 'D (<70)', percentage: Math.round(d / total * 100), barColor: 'bg-red-500' },
  ]
})

function openAddModal() {
  gradeForm.id = ''
  gradeForm.studentId = ''
  gradeForm.subject = ''
  gradeForm.score = 0
  showGradeModal.value = true
}

function openEditGrade(row: StudentRow, subject: string) {
  gradeForm.id = row.gradeIds[subject] || ''
  gradeForm.studentId = row.id
  gradeForm.subject = subject
  gradeForm.score = row.scores[subject] || 0
  showGradeModal.value = true
}

async function saveGrade() {
  if (!gradeForm.studentId || !gradeForm.subject || gradeForm.score === undefined) return
  error.value = ''
  try {
    const student = students.value.find(s => s.id === gradeForm.studentId)
    const body = {
      studentId: gradeForm.studentId,
      studentName: student?.name || '',
      subject: gradeForm.subject,
      score: gradeForm.score,
      semester: selectedSemester.value,
      academicYear: selectedAcademicYear.value,
      class: student?.class || selectedClass.value || '',
    }
    if (gradeForm.id) {
      await $fetch(`/api/akademik/grades/${gradeForm.id}`, { method: 'PUT', body })
    } else {
      await $fetch('/api/akademik/grades', { method: 'POST', body })
    }
    showGradeModal.value = false
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan nilai'
  }
}

function confirmDeleteStudent(row: StudentRow) {
  deleteTarget.value = row
  showDeleteModal.value = true
}

async function doDeleteStudentGrades() {
  if (!deleteTarget.value) return
  error.value = ''
  try {
    const ids = Object.values(deleteTarget.value.gradeIds).filter(Boolean)
    await Promise.all(ids.map((id: string) => $fetch(`/api/akademik/grades/${id}`, { method: 'DELETE' })))
    showDeleteModal.value = false
    deleteTarget.value = null
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus nilai'
  }
}

async function printRekap() {
  error.value = ''
  try {
    const rows = studentRows.value
    if (!rows.length) { error.value = 'Tidak ada data untuk dicetak'; return }
    const allSubjects = subjects.value.map(s => s.name)

    const headerCells = allSubjects.map(s =>
      `<th style="padding:6px 8px;border:1px solid #333;font-size:10pt;text-align:center;background:#f0f0f0;">${s}</th>`
    ).join('')

    const tbodyRows = rows.map((r, i) => {
      const scoreCells = allSubjects.map(s =>
        `<td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${r.scores[s] !== null ? r.scores[s] : '-'}</td>`
      ).join('')
      const statusText = r.passed ? 'LULUS' : 'REMEDIAL'
      const statusColor = r.passed ? '#16a34a' : '#dc2626'
      return `<tr>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${i + 1}</td>
        <td style="padding:4px 6px;border:1px solid #333;font-size:10pt;">${r.name}</td>
        ${scoreCells}
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;font-weight:bold;">${r.average}</td>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;font-weight:bold;color:${statusColor};">${statusText}</td>
      </tr>`
    }).join('')

    const totalAvg = stats.value[1].value
    const passRate = stats.value[2].value

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
<html><head><title>Rekap Nilai - ${selectedClass.value || 'Semua Kelas'}</title>
<style>
  @page { size: landscape; margin: 12mm 15mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 15px; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 16px; }
  .kop .logo { max-height: 55px; vertical-align: middle; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 13pt; margin: 14px 0; text-decoration: underline; }
  .info { margin-bottom: 10px; }
  .info td { padding: 2px 6px; font-size: 10pt; }
  table.data { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table.data th { padding: 6px; border: 1px solid #333; font-size: 10pt; }
  table.data td { padding: 4px 6px; border: 1px solid #333; font-size: 10pt; }
  .ttd { margin-top: 30px; display: flex; justify-content: space-around; }
  .ttd div { text-align: center; width: 180px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 50px; }
  .ttd .nama { font-size: 11pt; font-weight: bold; text-decoration: underline; }
</style></head><body>
<div class="kop">
  <table style="width:100%;"><tr>
    <td style="width:70px;text-align:center;">
      <img src="/image/logo.png" class="logo" style="max-height:55px;" onerror="this.style.display='none'" />
    </td>
    <td style="text-align:center;">
      <div class="kop-title">YAYASAN PONDOK PESANTREN<br>AL FATAH PANEKAN</div>
      <div class="kop-alamat">Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</div>
    </td>
  </tr></table>
</div>

<h2>REKAP NILAI SANTRI</h2>

<table class="info">
  <tr><td>Kelas</td><td>: ${selectedClass.value || 'Semua Kelas'}</td></tr>
  <tr><td>Semester</td><td>: ${selectedSemester.value}</td></tr>
  <tr><td>Tahun Ajaran</td><td>: ${selectedAcademicYear.value}</td></tr>
  <tr><td>Jumlah Santri</td><td>: ${rows.length}</td></tr>
  <tr><td>Rata-rata Kelas</td><td>: ${totalAvg}</td></tr>
  <tr><td>Tingkat Kelulusan</td><td>: ${passRate}</td></tr>
</table>

<table class="data">
  <thead>
    <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
      <th style="width:32px;">No</th>
      <th style="width:140px;">Nama Santri</th>
      ${headerCells}
      <th style="width:55px;">Rata-rata</th>
      <th style="width:65px;">Status</th>
    </tr>
  </thead>
  <tbody>${tbodyRows}</tbody>
</table>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>`)
    win.document.close()
    setTimeout(() => win.print(), 500)
  } catch (e: any) {
    error.value = e.message || 'Gagal mencetak'
  }
}

async function printNilaiSantri() {
  if (!printStudentId.value) return
  error.value = ''
  try {
    const student = students.value.find(s => s.id === printStudentId.value)
    if (!student) { error.value = 'Santri tidak ditemukan'; return }

    const studentGradeEntries = grades.value.filter((g: any) => g.studentId === printStudentId.value)
    const total = studentGradeEntries.reduce((s: number, g: any) => s + (Number(g.score) || 0), 0)
    const avg = studentGradeEntries.length ? total / studentGradeEntries.length : 0
    const passed = avg >= 75
    const statusText = passed ? 'LULUS' : 'REMEDIAL'
    const statusColor = passed ? '#16a34a' : '#dc2626'

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
<html><head><title>Nilai Santri - ${student.name}</title>
<style>
  @page { size: A4; margin: 15mm 20mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 0; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 16px; }
  .kop .logo { max-height: 55px; vertical-align: middle; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 13pt; margin: 14px 0; text-decoration: underline; }
  table.info { margin-bottom: 12px; width: 100%; }
  table.info td { padding: 2px 6px; font-size: 10pt; vertical-align: top; }
  table.info .label { width: 120px; }
  table.data { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table.data th { background: #f0f0f0; padding: 6px; border: 1px solid #333; font-size: 10pt; }
  table.data td { padding: 4px 6px; border: 1px solid #333; font-size: 10pt; text-align: center; }
  table.data td.left { text-align: left; }
  .summary { margin-top: 8px; font-size: 10pt; }
  .ttd { margin-top: 30px; display: flex; justify-content: space-around; }
  .ttd div { text-align: center; width: 180px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 50px; }
  .ttd .nama { font-size: 11pt; font-weight: bold; text-decoration: underline; }
</style></head><body>
<div class="kop">
  <table style="width:100%;"><tr>
    <td style="width:70px;text-align:center;">
      <img src="/image/logo.png" class="logo" style="max-height:55px;" onerror="this.style.display='none'" />
    </td>
    <td style="text-align:center;">
      <div class="kop-title">YAYASAN PONDOK PESANTREN<br>AL FATAH PANEKAN</div>
      <div class="kop-alamat">Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</div>
    </td>
  </tr></table>
</div>

<h2>DAFTAR NILAI SANTRI</h2>

<table class="info">
  <tr><td class="label">Nama Santri</td><td>: ${student.name}</td></tr>
  ${student.nis ? `<tr><td>NIS</td><td>: ${student.nis}</td></tr>` : ''}
  <tr><td>Kelas</td><td>: ${student.class || '-'}</td></tr>
  <tr><td>Semester</td><td>: ${selectedSemester.value}</td></tr>
  <tr><td>Tahun Ajaran</td><td>: ${selectedAcademicYear.value}</td></tr>
</table>

<table class="data">
  <thead>
    <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
      <th style="width:32px;">No</th>
      <th style="width:160px;">Mata Pelajaran</th>
      <th style="width:70px;">Nilai</th>
      <th>Keterangan</th>
    </tr>
  </thead>
  <tbody>
    ${studentGradeEntries.map((g: any, i: number) => `
    <tr>
      <td>${i + 1}</td>
      <td class="left">${g.subject}</td>
      <td style="font-weight:bold;">${g.score}</td>
      <td class="left">${g.score >= 75 ? 'LULUS' : 'REMEDIAL'}</td>
    </tr>`).join('')}
    ${studentGradeEntries.length === 0 ? '<tr><td  "  style="text-align:center;">Belum ada nilai</td></tr>' : ''}
  </tbody>
</table>

<table class="summary">
  <tr><td>Jumlah Mata Pelajaran</td><td>: ${studentGradeEntries.length}</td></tr>
  <tr><td>Total Nilai</td><td>: ${total}</td></tr>
  <tr><td>Rata-rata Nilai</td><td>: ${avg.toFixed(1)}</td></tr>
  <tr><td>Status</td><td>: <span style="font-weight:bold;color:${statusColor};">${statusText}</span></td></tr>
</table>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>`)
    win.document.close()
    setTimeout(() => win.print(), 500)
  } catch (e: any) {
    error.value = e.message || 'Gagal mencetak'
  }
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const [cls, ays, stds, subs, grds, imtihanList] = await Promise.all([
      $fetch('/api/master-data/classes'),
      $fetch('/api/master-data/academic-years'),
      $fetch('/api/students'),
      $fetch('/api/akademik/subjects'),
      $fetch('/api/akademik/grades', { query: { semester: selectedSemester.value, academicYear: selectedAcademicYear.value } }),
      $fetch('/api/akademik/imtihan'),
    ])
    classes.value = cls || []
    academicYears.value = ays || []
    students.value = stds || []
    subjects.value = subs || []
    grades.value = grds || []

    const imtihanGrades: any[] = []
    if (imtihanList && imtihanList.length > 0) {
      const examDetails = await Promise.all(
        imtihanList.map((e: any) => $fetch(`/api/akademik/imtihan/${e.id}`).catch(() => null))
      )
      examDetails.filter(Boolean).forEach((exam: any) => {
        if (!exam.scores) return
        Object.entries(exam.scores).forEach(([studentId, data]: [string, any]) => {
          const existing = grades.value.find((g: any) => g.studentId === studentId && g.subject === exam.subject)
          if (!existing) {
            imtihanGrades.push({
              id: `imtihan_${exam.id}_${studentId}`,
              studentId,
              studentName: data.studentName || studentId,
              subject: exam.subject,
              score: Number(data.score) || 0,
              semester: selectedSemester.value,
              academicYear: selectedAcademicYear.value,
              class: exam.kelas || '',
              createdAt: exam.date || exam.createdAt || '',
              sesi: exam.sesi || '',
            })
          }
        })
      })
      grades.value = [...grades.value, ...imtihanGrades]
    }

    if (!selectedClass.value && classes.value.length > 0) {
      selectedClass.value = classes.value[0].name || classes.value[0].nama || ''
    }
    if (academicYears.value.length > 0 && !academicYears.value.some((a: any) => (a.name || a.code) === selectedAcademicYear.value)) {
      selectedAcademicYear.value = academicYears.value[0].name || academicYears.value[0].code || selectedAcademicYear.value
    }
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchData())
</script>
