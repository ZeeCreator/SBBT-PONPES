<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg flex flex-wrap items-center justify-between gap-stack-md">
      <div>
        <button class="text-label-sm text-primary hover:underline mb-1 flex items-center gap-1" @click="navigateTo(`/akademik/imtihan/${kelas}/imtihan`)">
          <span class="material-symbols-outlined text-sm">arrow_back</span> Kembali
        </button>
        <h2 class="font-display text-headline-lg text-primary">Input Nilai {{ exam?.subject }}</h2>
        <p class="text-on-surface-variant text-body-md">{{ className }} — {{ exam?.date }} ({{ exam?.duration }} menit) {{ exam?.sesi ? `— Imtihan ${exam?.sesi}` : '' }}</p>
      </div>
      <div class="flex gap-3">
        <button class="flex items-center gap-2 px-6 py-2.5 bg-secondary text-on-secondary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="printScores">
          <span class="material-symbols-outlined text-sm">print</span> Cetak
        </button>
        <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="saveScores">
          <span class="material-symbols-outlined text-sm">save</span> Simpan Nilai
        </button>
      </div>
    </div>

    <div v-if="error" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ error }}</div>
    <div v-if="success" class="mb-stack-lg p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-label-md">{{ success }}</div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
    </div>

    <template v-else>
      <div class="glass-card rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-surface-container-low">
              <tr>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant w-12 text-center">No</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama Santri</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant w-24 text-center">Nilai</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Keterangan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              <tr v-for="(s, i) in studentScores" :key="s.id" class="hover:bg-primary-fixed/5 transition-colors">
                <td class="px-4 py-3 text-label-sm text-on-surface-variant text-center">{{ i + 1 }}</td>
                <td class="px-4 py-3 text-label-md font-medium">{{ s.name }}</td>
                <td class="px-4 py-3 text-center">
                  <input type="number" min="0" max="100" v-model="s.score"
                    class="w-20 bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-md py-1.5 px-2 text-center focus:ring-primary" />
                </td>
                <td class="px-4 py-3">
                  <input v-model="s.notes" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-label-md py-1.5 px-2 focus:ring-primary" placeholder="—" />
                </td>
              </tr>
              <tr v-if="studentScores.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada santri di kelas ini</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-stack-lg glass-card rounded-xl p-6 shadow-sm">
        <div class="flex items-center gap-6 text-label-md text-on-surface-variant">
          <span>Rata-rata: <strong class="text-primary text-title-md">{{ average }}</strong></span>
          <span>Tertinggi: <strong class="text-green-600">{{ highest }}</strong></span>
          <span>Terendah: <strong class="text-red-600">{{ lowest }}</strong></span>
          <span>Jumlah Santri: <strong>{{ studentScores.length }}</strong></span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const route = useRoute()
const kelas = route.params.kelas as string
const examId = route.params.examId as string

const loading = ref(true)
const error = ref('')
const success = ref('')
const exam = ref<any>(null)
const className = ref('')
const studentScores = ref<any[]>([])

const average = computed(() => {
  const vals = studentScores.value.map(s => Number(s.score) || 0).filter(v => v > 0)
  return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '-'
})
const highest = computed(() => {
  const vals = studentScores.value.map(s => Number(s.score) || 0).filter(v => v > 0)
  return vals.length ? Math.max(...vals).toString() : '-'
})
const lowest = computed(() => {
  const vals = studentScores.value.map(s => Number(s.score) || 0).filter(v => v > 0)
  return vals.length ? Math.min(...vals).toString() : '-'
})

async function fetchData() {
  loading.value = true; error.value = ''; success.value = ''
  try {
    exam.value = await $fetch(`/api/akademik/imtihan/${examId}`)

    const classes = await $fetch<any[]>('/api/master-data/classes')
    const cls = classes.find((c: any) => c.id === kelas)
    className.value = cls?.name || cls?.nama || kelas

    const classField = cls?.name || kelas
    const students = await $fetch<any[]>(`/api/students?class=${encodeURIComponent(classField)}`)

    const existingScores = exam.value?.scores || {}
    studentScores.value = students.map((s: any) => ({
      id: s.id,
      name: s.name,
      score: existingScores[s.id]?.score ?? '',
      notes: existingScores[s.id]?.notes ?? '',
    }))
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

async function saveScores() {
  error.value = ''; success.value = ''
  const scores: Record<string, any> = {}
  for (const s of studentScores.value) {
    const sc = Number(s.score)
    scores[s.id] = {
      studentName: s.name,
      score: isNaN(sc) ? 0 : sc,
      notes: s.notes || '',
    }
  }
  try {
    await $fetch(`/api/akademik/imtihan/${examId}`, {
      method: 'PUT',
      body: { scores },
    })
    await fetchData()
    success.value = 'Nilai berhasil disimpan'
    setTimeout(() => success.value = '', 3000)
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan nilai'
  }
}

function printScores() {
  const vals = studentScores.value.map(s => Number(s.score) || 0).filter(v => v > 0)
  const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '-'
  const max = vals.length ? Math.max(...vals) : '-'
  const min = vals.length ? Math.min(...vals) : '-'

  const rows = studentScores.value.map((s, i) => `
    <tr>
      <td style="text-align:center;padding:6px 8px;border:1px solid #333;">${i + 1}</td>
      <td style="padding:6px 8px;border:1px solid #333;">${s.name}</td>
      <td style="text-align:center;padding:6px 8px;border:1px solid #333;">${s.score || '-'}</td>
      <td style="padding:6px 8px;border:1px solid #333;">${s.notes || '-'}</td>
    </tr>
  `).join('')

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`
<html><head><title>Nilai Imtihan - ${exam.value?.subject}</title>
<style>
  @page { size: landscape; margin: 15mm 20mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 20px; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 20px; }
  .kop .logo { max-height: 60px; vertical-align: middle; margin-right: 10px; }
  .kop .kop-title { font-size: 16pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 10pt; }
  h2 { text-align: center; font-size: 14pt; margin: 16px 0; text-decoration: underline; }
  .info { margin-bottom: 12px; }
  .info td { padding: 2px 8px; font-size: 11pt; }
  table.data { width: 100%; border-collapse: collapse; margin: 12px 0; }
  table.data th { background: #f0f0f0; padding: 8px; border: 1px solid #333; font-size: 11pt; }
  table.data td { padding: 6px 8px; border: 1px solid #333; font-size: 11pt; }
  .ringkasan { margin: 12px 0; font-size: 11pt; }
  .ttd { margin-top: 40px; display: flex; justify-content: space-between; }
  .ttd div { text-align: center; width: 200px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 60px; }
  .ttd .nama { font-size: 11pt; font-weight: bold; text-decoration: underline; }
</style></head><body>
<div class="kop">
  <table style="width:100%;"><tr>
    <td style="width:80px;text-align:center;">
      <img src="/image/logo.png" class="logo" style="max-height:60px;" onerror="this.style.display='none'" />
    </td>
    <td style="text-align:center;">
      <div class="kop-title">YAYASAN PONDOK PESANTREN<br>AL FATAH PANEKAN</div>
      <div class="kop-alamat">Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</div>
    </td>
  </tr></table>
</div>

<h2>DAFTAR NILAI IMTIHAN ${exam.value?.sesi ? `${exam.value.sesi}` : ''}</h2>

<table class="info">
  <tr><td>Mata Pelajaran</td><td>: ${exam.value?.subject || '-'}</td></tr>
  <tr><td>Kelas</td><td>: ${className.value}</td></tr>
  <tr><td>Tanggal</td><td>: ${exam.value?.date || '-'}</td></tr>
  <tr><td>Durasi</td><td>: ${exam.value?.duration || '-'} menit</td></tr>
  ${exam.value?.sesi ? `<tr><td>Sesi</td><td>: Imtihan ${exam.value.sesi}</td></tr>` : ''}
</table>

<table class="data">
  <thead>
    <tr><th style="width:40px;">No</th><th>Nama Santri</th><th style="width:80px;">Nilai</th><th>Keterangan</th></tr>
  </thead>
  <tbody>${rows}</tbody>
</table>

<div class="ringkasan">
  Rata-rata: <strong>${avg}</strong> |
  Tertinggi: <strong>${max}</strong> |
  Terendah: <strong>${min}</strong> |
  Jumlah Santri: <strong>${studentScores.value.length}</strong>
</div>

<div class="ttd">
  <div>
    <div class="jabatan">Kepala Pondok,</div>
    <div class="nama">_____________________</div>
  </div>
</div>
</body></html>
`)
  win.document.close()
  setTimeout(() => { win.print() }, 500)
}

onMounted(() => fetchData())
</script>
