<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg flex flex-wrap items-center justify-between gap-stack-md">
      <div>
        <button class="text-label-sm text-primary hover:underline mb-1 flex items-center gap-1" @click="navigateTo('/akademik/imtihan')">
          <span class="material-symbols-outlined text-sm">arrow_back</span> Kembali
        </button>
        <h2 class="font-display text-headline-lg text-primary capitalize">{{ type }} - {{ className }}</h2>
        <p class="text-on-surface-variant text-body-md">{{ type === 'imtihan' ? 'Kelola jadwal dan nilai ujian' : 'Catatan iktibar harian santri' }}</p>
      </div>
      <div v-if="type === 'imtihan'" class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <select v-model="selectedStudentId" class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary max-w-[200px]">
            <option value="">-- Pilih Santri --</option>
            <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <button class="flex items-center gap-2 px-4 py-2 bg-tertiary text-on-tertiary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-40" :disabled="!selectedStudentId" @click="printNilaiSantri">
            <span class="material-symbols-outlined text-sm">badge</span> Cetak Nilai
          </button>
        </div>
        <button class="flex items-center gap-2 px-6 py-2.5 bg-secondary text-on-secondary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="printRanking">
          <span class="material-symbols-outlined text-sm">print</span> Cetak Nilai & Ranking
        </button>
        <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="showAddModal = true">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Ujian
        </button>
      </div>
    </div>
    <div v-if="error" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ error }}</div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
    </div>

    <template v-else-if="type === 'imtihan'">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
        <div v-for="s in examStats" :key="s.label" class="glass-card p-stack-md rounded-xl shadow-sm text-center">
          <p class="font-display text-headline-md" :class="s.color">{{ s.value }}</p>
          <p class="text-label-sm text-on-surface-variant">{{ s.label }}</p>
        </div>
      </div>
      <div class="glass-card rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-surface-container-low">
              <tr>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Sesi</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Mata Pelajaran</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Durasi</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Nilai Rata-rata</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              <tr v-for="exam in exams" :key="exam.id" class="hover:bg-primary-fixed/5 transition-colors">
                <td class="px-4 py-3 text-label-sm text-on-surface-variant text-center font-semibold">Imtihan {{ exam.sesi || '-' }}</td>
                <td class="px-4 py-3 text-label-md font-medium">{{ exam.subject }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ exam.date }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ exam.duration }} menit</td>
                <td class="px-4 py-3 text-label-md">{{ exam.averageScore || '-' }}</td>
                <td class="px-4 py-3 text-center">
                  <button class="text-primary hover:text-primary-fixed mr-2 transition-colors" @click="navigateTo(`/akademik/imtihan/${kelas}/nilai/${exam.id}`)"><span class="material-symbols-outlined">visibility</span></button>
                  <button class="text-error hover:text-red-700 transition-colors" @click="deleteExam(exam.id)"><span class="material-symbols-outlined">delete</span></button>
                </td>
              </tr>
              <tr v-if="exams.length === 0"><td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Belum ada data ujian</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="mb-stack-lg flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-on-surface-variant">calendar_today</span>
          <input type="date" v-model="iktibarDate" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" />
        </div>
        <input v-model="iktibarSearch" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary flex-1 max-w-xs" placeholder="Cari santri..." />
      </div>
      <div class="glass-card rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-surface-container-low">
              <tr>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Catatan Iktibar</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              <tr v-for="item in filteredIktibar" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
                <td class="px-4 py-3 text-label-md font-medium">{{ item.santri }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant max-w-xs truncate">{{ item.catatan }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.date }}</td>
                <td class="px-4 py-3 text-center">
                  <button class="text-primary hover:text-primary-fixed mr-2 transition-colors" @click="editIktibar(item)"><span class="material-symbols-outlined">edit</span></button>
                  <button class="text-error hover:text-red-700 transition-colors" @click="deleteIktibar(item.id)"><span class="material-symbols-outlined">delete</span></button>
                </td>
              </tr>
              <tr v-if="filteredIktibar.length === 0"><td colspan="4" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Belum ada catatan iktibar</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-stack-lg glass-card rounded-xl p-6 shadow-sm">
        <h3 class="font-display text-title-md text-primary mb-4">Tambah Catatan Iktibar</h3>
        <form @submit.prevent="submitIktibar" class="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
          <select v-model="iktibarForm.santri" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required>
            <option value="">-- Pilih Santri --</option>
            <option v-for="s in students" :key="s.id" :value="s.name">{{ s.name }}</option>
          </select>
          <input type="date" v-model="iktibarForm.date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
          <button class="px-6 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button>
          <div class="md:col-span-3">
            <textarea v-model="iktibarForm.catatan" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none min-h-[80px]" placeholder="Catatan iktibar..." required></textarea>
          </div>
        </form>
      </div>
    </template>

    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showAddModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter">
          <div class="bg-primary px-gutter py-stack-md flex justify-between items-center">
            <h2 class="font-display text-headline-md text-on-primary">Tambah Ujian</h2>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showAddModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="submitExam">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Sesi</label>
              <select v-model="examForm.sesi" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required>
                <option value="">-- Pilih Sesi --</option>
                <option v-for="n in 4" :key="n" :value="n">Imtihan {{ n }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Mata Pelajaran</label>
              <select v-model="examForm.subject" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required>
                <option value="">-- Pilih Mata Pelajaran --</option>
                <option v-for="s in subjects" :key="s.id" :value="s.name">{{ s.name }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Tanggal</label>
                <input type="date" v-model="examForm.date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Durasi (menit)</label>
                <input type="number" v-model="examForm.duration" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
              </div>
            </div>
            <div class="flex justify-end gap-stack-sm pt-stack-sm">
              <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="showAddModal = false">Batal</button>
              <button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const route = useRoute()
const kelas = route.params.kelas as string
const type = route.params.type as string

const loading = ref(true)
const error = ref('')
const className = ref('')
const exams = ref<any[]>([])
const iktibarList = ref<any[]>([])
const students = ref<any[]>([])
const subjects = ref<any[]>([])

const selectedStudentId = ref('')
const showAddModal = ref(false)
const examForm = reactive({ sesi: '', subject: '', date: '', duration: 90 })
const iktibarDate = ref(new Date().toISOString().split('T')[0])
const iktibarSearch = ref('')
const iktibarForm = reactive({ santri: '', catatan: '', date: new Date().toISOString().split('T')[0] })

const examStats = computed(() => [
  { label: 'Total Ujian', value: exams.value.length.toString(), color: 'text-primary' },
  { label: 'Rata-rata Nilai', value: exams.value.length ? (exams.value.reduce((s, e) => s + (Number(e.averageScore) || 0), 0) / exams.value.length).toFixed(1) : '-', color: 'text-secondary' },
  { label: 'Mata Pelajaran', value: [...new Set(exams.value.map(e => e.subject))].length.toString(), color: 'text-tertiary' },
  { label: 'Nilai Tertinggi', value: exams.value.length ? Math.max(...exams.value.map(e => Number(e.averageScore) || 0)).toString() : '-', color: 'text-green-600' },
])

const filteredIktibar = computed(() => iktibarList.value.filter(i =>
  (!iktibarSearch.value || i.santri.toLowerCase().includes(iktibarSearch.value.toLowerCase())) &&
  (!iktibarDate.value || i.date === iktibarDate.value)
))

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    const classes = await $fetch<any[]>('/api/master-data/classes')
    const cls = classes.find((c: any) => c.id === kelas)
    className.value = cls?.name || cls?.nama || kelas

    if (type === 'imtihan') {
      exams.value = await $fetch(`/api/akademik/imtihan?kelas=${kelas}`) || []
    } else {
      iktibarList.value = await $fetch(`/api/akademik/iktibar?kelas=${kelas}`) || []
    }
    students.value = await $fetch(`/api/students?class=${encodeURIComponent(cls?.name || kelas)}`) || []
    subjects.value = await $fetch(`/api/akademik/subjects`) || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

async function submitExam() {
  try {
    await $fetch('/api/akademik/imtihan', { method: 'POST', body: { ...examForm, kelas } })
    showAddModal.value = false; examForm.sesi = ''; examForm.subject = ''; examForm.date = ''; examForm.duration = 90
    await fetchData()
  } catch (e: any) { error.value = e.message || 'Gagal menyimpan' }
}

async function printNilaiSantri() {
  if (!selectedStudentId.value) return
  error.value = ''
  try {
    const allExams = await $fetch<any[]>(`/api/akademik/imtihan?kelas=${kelas}`) || []
    if (!allExams.length) { error.value = 'Belum ada data ujian'; return }

    const examDetails = await Promise.all(
      allExams.map((e: any) => $fetch<any>(`/api/akademik/imtihan/${e.id}`).catch(() => null))
    )
    const valid = examDetails.filter(Boolean)
    if (!valid.length) { error.value = 'Gagal memuat detail nilai'; return }

    const student = students.value.find(s => s.id === selectedStudentId.value)
    if (!student) { error.value = 'Santri tidak ditemukan'; return }

    const studentScores: { subject: string; date: string; score: string; notes: string }[] = []
    valid.forEach((exam: any) => {
      if (!exam.scores) return
      const data = exam.scores[selectedStudentId.value]
      if (data) {
        studentScores.push({ subject: exam.subject, date: exam.date, score: data.score || '-', notes: data.notes || '' })
      }
    })

    const total = studentScores.reduce((s, r) => s + (Number(r.score) || 0), 0)
    const avg = studentScores.length ? (total / studentScores.length) : 0
    const subjectNames = valid.map(e => e.subject)

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
<html><head><title>Nilai IMTIHAN - ${student.name}</title>
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
  .summary td { padding: 2px 8px; }
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

<h2>DAFTAR NILAI IMTIHAN</h2>

<table class="info">
  <tr><td class="label">Nama Santri</td><td>: ${student.name}</td></tr>
  ${student.nis ? `<tr><td>NIS</td><td>: ${student.nis}</td></tr>` : ''}
  <tr><td>Kelas</td><td>: ${className.value}</td></tr>
  <tr><td>Mata Pelajaran Diujikan</td><td>: ${subjectNames.join(', ')}</td></tr>
</table>

<table class="data">
  <thead>
    <tr>
      <th style="width:32px;">No</th>
      <th style="width:160px;">Mata Pelajaran</th>
      <th style="width:100px;">Tanggal</th>
      <th style="width:70px;">Nilai</th>
      <th>Keterangan</th>
    </tr>
  </thead>
  <tbody>
    ${studentScores.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td class="left">${r.subject}</td>
      <td>${r.date}</td>
      <td style="font-weight:bold;">${r.score}</td>
      <td class="left">${r.notes || '-'}</td>
    </tr>`).join('')}
  </tbody>
</table>

<table class="summary">
  <tr><td>Jumlah Mata Pelajaran</td><td>: ${studentScores.length}</td></tr>
  <tr><td>Total Nilai</td><td>: ${total}</td></tr>
  <tr><td>Rata-rata Nilai</td><td>: ${avg.toFixed(1)}</td></tr>
</table>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>
`)
    win.document.close()
    setTimeout(() => win.print(), 500)
  } catch (e: any) {
    error.value = e.message || 'Gagal mencetak'
  }
}

async function printRanking() {
  error.value = ''
  try {
    const allExams = await $fetch<any[]>(`/api/akademik/imtihan?kelas=${kelas}`) || []
    if (!allExams.length) { error.value = 'Belum ada data ujian'; return }

    const examDetails = await Promise.all(
      allExams.map((e: any) => $fetch<any>(`/api/akademik/imtihan/${e.id}`).catch(() => null))
    )
    const valid = examDetails.filter(Boolean)
    if (!valid.length) { error.value = 'Gagal memuat detail nilai'; return }

    const classes = await $fetch<any[]>('/api/master-data/classes')
    const cls = classes.find((c: any) => c.id === kelas)
    const students = await $fetch<any[]>(`/api/students?class=${encodeURIComponent(cls?.name || kelas)}`) || []
    const nameMap: Record<string, string> = {}
    students.forEach(s => { nameMap[s.id] = s.name })

    const studentMap: Record<string, Record<string, number>> = {}

    valid.forEach((exam: any) => {
      if (!exam.scores) return
      Object.entries(exam.scores).forEach(([sid, data]: [string, any]) => {
        if (!studentMap[sid]) studentMap[sid] = {}
        studentMap[sid][exam.subject] = Number(data.score) || 0
      })
    })

    interface RankEntry { id: string; name: string; subjects: Record<string, number>; total: number; avg: number }
    const ranked: RankEntry[] = Object.entries(studentMap).map(([id, subs]) => {
      const vals = Object.values(subs)
      const total = vals.reduce((a, b) => a + b, 0)
      return { id, name: nameMap[id] || id, subjects: subs, total, avg: vals.length ? total / vals.length : 0 }
    })
    ranked.sort((a, b) => b.total - a.total || b.avg - a.avg)

    const subjectNames = valid.map(e => e.subject)
    const headerCells = subjectNames.map(s => `<th style="padding:6px 8px;border:1px solid #333;font-size:10pt;text-align:center;">${s}</th>`).join('')
    const rows = ranked.map((r, i) => {
      const scoreCells = subjectNames.map(s =>
        `<td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${r.subjects[s] || '-'}</td>`
      ).join('')
      return `<tr>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${i + 1}</td>
        <td style="padding:4px 6px;border:1px solid #333;font-size:10pt;">${r.name}</td>
        ${scoreCells}
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;font-weight:bold;">${r.total}</td>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${r.avg.toFixed(1)}</td>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;font-weight:bold;">${i + 1}</td>
      </tr>`
    }).join('')

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
<html><head><title>Rekap Nilai & Ranking - ${className.value}</title>
<style>
  @page { size: landscape; margin: 12mm 15mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 15px; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 16px; }
  .kop .logo { max-height: 55px; vertical-align: middle; margin-right: 8px; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 13pt; margin: 14px 0; text-decoration: underline; }
  .info { margin-bottom: 10px; }
  .info td { padding: 2px 6px; font-size: 10pt; }
  table.data { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table.data th { background: #f0f0f0; padding: 6px; border: 1px solid #333; font-size: 10pt; }
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

<h2>REKAP NILAI & RANKING IMTIHAN</h2>

<table class="info">
  <tr><td>Kelas</td><td>: ${className.value}</td></tr>
  <tr><td>Jumlah Ujian</td><td>: ${valid.length}</td></tr>
  <tr><td>Jumlah Santri</td><td>: ${ranked.length}</td></tr>
</table>

<table class="data">
  <thead>
    <tr>
      <th style="width:32px;">No</th>
      <th>Nama Santri</th>
      ${headerCells}
      <th style="width:55px;">Jumlah</th>
      <th style="width:60px;">Rata-rata</th>
      <th style="width:50px;">Rank</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>
`)
    win.document.close()
    setTimeout(() => { win.print() }, 500)
  } catch (e: any) {
    error.value = e.message || 'Gagal mencetak'
  }
}

async function deleteExam(id: string) {
  if (!confirm('Yakin ingin menghapus ujian ini?')) return
  try { await $fetch(`/api/akademik/imtihan/${id}`, { method: 'DELETE' }); await fetchData() }
  catch (e: any) { error.value = e.message || 'Gagal menghapus' }
}

async function submitIktibar() {
  try {
    await $fetch('/api/akademik/iktibar', { method: 'POST', body: { ...iktibarForm, kelas } })
    iktibarForm.santri = ''; iktibarForm.catatan = ''; iktibarForm.date = new Date().toISOString().split('T')[0]
    await fetchData()
  } catch (e: any) { error.value = e.message || 'Gagal menyimpan' }
}

async function editIktibar(item: any) {
  const note = prompt('Edit catatan iktibar:', item.catatan)
  if (!note) return
  try { await $fetch(`/api/akademik/iktibar/${item.id}`, { method: 'PUT', body: { catatan: note } }); await fetchData() }
  catch (e: any) { error.value = e.message || 'Gagal mengupdate' }
}

async function deleteIktibar(id: string) {
  if (!confirm('Yakin ingin menghapus catatan ini?')) return
  try { await $fetch(`/api/akademik/iktibar/${id}`, { method: 'DELETE' }); await fetchData() }
  catch (e: any) { error.value = e.message || 'Gagal menghapus' }
}

onMounted(() => fetchData())
</script>
