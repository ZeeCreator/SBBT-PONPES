<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg flex flex-wrap items-center justify-between gap-stack-md">
      <div>
        <h2 class="font-display text-headline-lg text-primary">Jadwal Pelajaran</h2>
        <p class="text-on-surface-variant text-body-md">Atur jadwal pelajaran terintegrasi master data.</p>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="filterClass" class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-4 focus:ring-primary min-w-[160px]">
          <option value="">Semua Kelas</option>
          <option v-for="k in classes" :key="k.id" :value="k.name">{{ k.name }}</option>
        </select>
        <select v-model="filterTeacher" class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-4 focus:ring-primary min-w-[160px]">
          <option value="">Semua Pengajar</option>
          <option v-for="t in teachers" :key="t.id" :value="t.name">{{ t.name }}</option>
        </select>
        <button class="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="printSchedule">
          <span class="material-symbols-outlined text-sm">print</span> Cetak
        </button>
        <button class="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Jadwal
        </button>
      </div>
    </div>

    <div v-if="error" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ error }}</div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-gutter mb-stack-lg">
        <div v-for="stat in stats" :key="stat.label" class="glass-card p-4 rounded-xl shadow-sm text-center">
          <p class="font-display text-headline-sm" :class="stat.color">{{ stat.value }}</p>
          <p class="text-label-xs text-on-surface-variant">{{ stat.label }}</p>
        </div>
      </div>

      <div class="glass-card rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px]" style="table-layout: fixed;">
            <thead>
              <tr>
                <th class="w-[70px] px-2 py-3 text-label-sm text-on-surface-variant bg-surface-container-low text-center sticky left-0 z-10">Jam</th>
                <th v-for="day in days" :key="day" class="px-2 py-3 text-label-md font-semibold text-primary bg-surface-container-low text-center min-w-[130px]">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="period in maxPeriods" :key="period" class="border-t border-outline-variant/10">
                <td class="px-2 py-1 text-label-xs text-on-surface-variant bg-surface-container-low text-center sticky left-0 z-10 font-medium h-[85px]">Ke-{{ period }}</td>
                <td v-for="day in days" :key="day"
                  class="px-1 py-1 align-top cursor-pointer transition-colors min-h-[85px] relative"
                  :class="dropTarget === `${day}-${period}` ? 'bg-primary-fixed/25 ring-2 ring-primary/40' : 'hover:bg-primary-fixed/5'"
                  @click="openCellAdd(day, period)"
                  @dragover.prevent="onDragOver(day, period)"
                  @dragenter.prevent="onDragEnter(day, period)"
                  @dragleave="onDragLeave(day, period)"
                  @drop.prevent="onDrop(day, period)">
                  <div v-if="cellItems(day, period).length" class="space-y-1">
                    <div v-for="item in cellItems(day, period)" :key="item.id"
                      draggable="true"
                      class="group rounded-md px-1.5 py-1 border-l-[3px] transition-all hover:shadow-sm text-[11px] leading-tight cursor-grab active:cursor-grabbing"
                      :class="{ 'opacity-40': draggedItem?.id === item.id }"
                      :style="{ borderLeftColor: subjectColor(item.mapel), backgroundColor: subjectBg(item.mapel) }"
                      @dragstart.stop="onDragStart(item)"
                      @dragend.stop="onDragEnd"
                      @click.stop>
                      <div class="font-bold truncate">{{ item.mapel }}</div>
                      <div class="text-[10px] text-on-surface-variant truncate">
                        <template v-if="filterTeacher">{{ item.kelas }}</template>
                        <template v-else>{{ item.guru }}</template>
                      </div>
                      <div class="flex items-center justify-between mt-0.5">
                        <span class="text-[9px] text-outline truncate">{{ item.ruang }}</span>
                        <div class="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button class="p-0.5 rounded hover:bg-primary/15 text-primary" @click.stop="openEditModal(item)"><span class="material-symbols-outlined text-[12px]">edit</span></button>
                          <button class="p-0.5 rounded hover:bg-red-100 text-red-500" @click.stop="confirmDelete(item)"><span class="material-symbols-outlined text-[12px]">delete</span></button>
                        </div>
                      </div>
                    </div>
                    <button class="w-full text-[10px] text-primary/60 hover:text-primary flex items-center justify-center gap-0.5 py-0.5 rounded hover:bg-primary-fixed/20 transition-colors" @click.stop="openCellAdd(day, period)">
                      <span class="material-symbols-outlined text-[12px]">add_circle</span> Tambah
                    </button>
                  </div>
                  <div v-else class="h-full min-h-[80px] flex items-center justify-center">
                    <span class="material-symbols-outlined text-outline/20 text-lg">add_circle</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-stack-lg flex items-center gap-4 text-label-sm text-on-surface-variant">
        <span class="font-medium">Legenda:</span>
        <span v-for="(c, i) in legendColors" :key="i" class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm inline-block" :style="{ backgroundColor: c.bg, border: `2px solid ${c.border}` }"></span>
          {{ c.subject }}
        </span>
      </div>
    </template>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter">
          <div class="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <h3 class="font-display text-title-lg text-primary">{{ isEditing ? 'Edit Jadwal' : 'Tambah Jadwal' }}</h3>
            <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="closeModal"><span class="material-symbols-outlined">close</span></button>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">Hari</label>
                <select v-model="form.hari" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                  <option value="">Pilih Hari</option>
                  <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
              <div>
                <label class="text-label-sm text-on-surface-variant block mb-1">Jam Ke-</label>
                <input v-model.number="form.jamKe" type="number" min="1" max="12" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Mata Pelajaran</label>
              <select v-model="form.mapel" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                <option value="">Pilih Mata Pelajaran</option>
                <option v-for="s in subjects" :key="s.id" :value="s.name">{{ s.name }}</option>
              </select>
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Guru / Pengajar</label>
              <select v-model="form.guru" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                <option value="">Pilih Pengajar</option>
                <option v-for="t in teachers" :key="t.id" :value="t.name">{{ t.name }}</option>
              </select>
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Kelas</label>
              <select v-model="form.kelas" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                <option value="">Pilih Kelas</option>
                <option v-for="k in classes" :key="k.id" :value="k.name">{{ k.name }}</option>
              </select>
            </div>
            <div>
              <label class="text-label-sm text-on-surface-variant block mb-1">Ruang</label>
              <select v-model="form.ruang" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2.5 px-3 focus:ring-primary">
                <option value="">Pilih Ruang</option>
                <option v-for="r in rooms" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
          </div>
          <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="closeModal">Batal</button>
            <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="saveSchedule">Simpan</button>
          </div>
        </div>
      </div>

      <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="showDeleteModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter">
          <div class="p-6 text-center">
            <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
            </div>
            <h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Jadwal</h3>
            <p class="text-on-surface-variant text-label-md">Apakah Anda yakin ingin menghapus jadwal ini?</p>
          </div>
          <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="showDeleteModal = false">Batal</button>
            <button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="doDelete">Hapus</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

interface JadwalItem {
  id: string
  hari: string
  jamKe: number
  mapel: string
  guru: string
  kelas: string
  ruang: string
}

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu']

const loading = ref(true)
const error = ref('')
const schedules = ref<JadwalItem[]>([])
const classes = ref<any[]>([])
const teachers = ref<any[]>([])
const subjects = ref<any[]>([])
const rooms = ref<string[]>([])
const filterClass = ref('')
const filterTeacher = ref('')

const { getIdToken } = useAuth()

const filteredSchedules = computed(() => {
  let items = schedules.value
  if (filterClass.value) items = items.filter(s => s.kelas === filterClass.value)
  if (filterTeacher.value) items = items.filter(s => s.guru === filterTeacher.value)
  return items
})

const scheduleMap = computed(() => {
  const map: Record<string, Record<number, JadwalItem[]>> = {}
  for (const item of filteredSchedules.value) {
    if (!map[item.hari]) map[item.hari] = {}
    if (!map[item.hari][item.jamKe]) map[item.hari][item.jamKe] = []
    map[item.hari][item.jamKe].push(item)
  }
  return map
})

function cellItems(day: string, period: number): JadwalItem[] {
  return scheduleMap.value[day]?.[period] || []
}

const maxPeriods = computed(() => {
  let max = 0
  for (const item of filteredSchedules.value) {
    if (item.jamKe > max) max = item.jamKe
  }
  return max || 8
})

const stats = computed(() => {
  const f = filteredSchedules.value
  return [
    { label: 'Total Jadwal', value: f.length.toString(), color: 'text-primary' },
    { label: 'Kelas', value: new Set(f.map(s => s.kelas)).size.toString(), color: 'text-secondary' },
    { label: 'Mapel', value: new Set(f.map(s => s.mapel)).size.toString(), color: 'text-tertiary' },
    { label: 'Pengajar', value: new Set(f.map(s => s.guru)).size.toString(), color: 'text-error' },
    { label: 'Ruang', value: new Set(f.map(s => s.ruang)).size.toString(), color: 'text-green-600' },
  ]
})

const subjectColors = [
  { border: '#4F46E5', bg: '#EEF2FF' },
  { border: '#0891B2', bg: '#ECFEFF' },
  { border: '#059669', bg: '#ECFDF5' },
  { border: '#D97706', bg: '#FFFBEB' },
  { border: '#DC2626', bg: '#FEF2F2' },
  { border: '#7C3AED', bg: '#F5F3FF' },
  { border: '#DB2777', bg: '#FDF2F8' },
  { border: '#2563EB', bg: '#EFF6FF' },
  { border: '#CA8A04', bg: '#FEFCE8' },
  { border: '#16A34A', bg: '#F0FDF4' },
]

const subjectColorIndex: Record<string, number> = {}

function getColorIdx(subject: string): number {
  if (!(subject in subjectColorIndex)) {
    subjectColorIndex[subject] = Object.keys(subjectColorIndex).length % subjectColors.length
  }
  return subjectColorIndex[subject]
}

function subjectColor(subject: string): string {
  return subjectColors[getColorIdx(subject)].border
}
function subjectBg(subject: string): string {
  return subjectColors[getColorIdx(subject)].bg
}

const legendColors = computed(() => {
  const seen = new Set<string>()
  const result: { subject: string; border: string; bg: string }[] = []
  for (const item of filteredSchedules.value) {
    if (!seen.has(item.mapel)) {
      seen.add(item.mapel)
      result.push({ subject: item.mapel, ...subjectColors[getColorIdx(item.mapel)] })
    }
  }
  return result
})

async function fetchClasses() {
  try {
    const token = await getIdToken()
    const res = await fetch('/api/master-data/classes', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) classes.value = await res.json()
  } catch (e) { console.error(e) }
}

async function fetchTeachers() {
  try { teachers.value = await $fetch<any[]>('/api/guru') || [] } catch (e) { console.error(e) }
}

async function fetchSubjects() {
  try { subjects.value = await $fetch<any[]>('/api/akademik/subjects') || [] } catch (e) { console.error(e) }
}

async function fetchRooms() {
  try {
    const dormitories = await $fetch<any[]>('/api/master-data/dormitories') || []
    const all: string[] = []
    for (const d of dormitories) {
      if (d.rooms && Array.isArray(d.rooms)) {
        for (const r of d.rooms) {
          if (typeof r === 'string') all.push(r)
          else if (r.name) all.push(r.name)
        }
      }
    }
    rooms.value = [...new Set(all)].sort()
  } catch (e) { console.error(e) }
}

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    const params: Record<string, string> = {}
    if (filterClass.value) params.kelas = filterClass.value
    if (filterTeacher.value) params.guru = filterTeacher.value
    const qs = new URLSearchParams(params).toString()
    schedules.value = await $fetch<JadwalItem[]>(`/api/jadwal${qs ? '?' + qs : ''}`) || []
  } catch (e: any) { error.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

watch([filterClass, filterTeacher], () => fetchData())

// ── Drag & Drop ─────────────────────────────────────────────

const draggedItem = ref<JadwalItem | null>(null)
const dropTarget = ref('')

function onDragStart(item: JadwalItem) {
  draggedItem.value = item
}

function onDragEnd() {
  draggedItem.value = null
  dropTarget.value = ''
}

function onDragOver(day: string, period: number) {
  if (draggedItem.value) dropTarget.value = `${day}-${period}`
}

function onDragEnter(day: string, period: number) {
  if (draggedItem.value) dropTarget.value = `${day}-${period}`
}

function onDragLeave(day: string, period: number) {
  if (dropTarget.value === `${day}-${period}`) dropTarget.value = ''
}

async function onDrop(day: string, period: number) {
  const item = draggedItem.value
  dropTarget.value = ''
  draggedItem.value = null
  if (!item || (item.hari === day && item.jamKe === period)) return
  try {
    await $fetch(`/api/jadwal/${item.id}`, {
      method: 'PUT',
      body: { ...item, hari: day, jamKe: period },
    })
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal memindahkan jadwal'
  }
}

// ── Print ───────────────────────────────────────────────────
function printSchedule() {
  const f = filteredSchedules.value
  if (!f.length) { error.value = 'Tidak ada data untuk dicetak'; return }

  const byClass = filterClass.value || 'SEMUA KELAS'
  const byTeacher = filterTeacher.value || 'SEMUA PENGAJAR'
  const periods = maxPeriods.value

  let rows = ''
  for (let p = 1; p <= periods; p++) {
    rows += `<tr><td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:9pt;font-weight:bold;background:#f5f5f5;">${p}</td>`
    for (const day of days) {
      const items = scheduleMap.value[day]?.[p] || []
      if (items.length) {
        rows += `<td style="padding:4px 6px;border:1px solid #333;font-size:9pt;vertical-align:top;">`
        rows += items.map(item => `
          <div style="margin-bottom:4px;">
            <b>${item.mapel}</b><br/>
            <span style="font-size:8pt;color:#555;">${filterTeacher ? item.kelas : item.guru}</span><br/>
            <span style="font-size:8pt;color:#888;">${item.ruang}</span>
          </div>
        `).join('<hr style="margin:2px 0;border:none;border-top:1px dashed #ccc;"/>')
        rows += `</td>`
      } else {
        rows += `<td style="padding:4px 6px;border:1px solid #333;font-size:9pt;text-align:center;color:#ccc;">-</td>`
      }
    }
    rows += '</tr>'
  }

  const dayHeaders = days.map(d => `<th style="padding:6px;border:1px solid #333;font-size:9pt;background:#e8e8e8;">${d}</th>`).join('')

  const title = filterClass.value
    ? `JADWAL KELAS: ${filterClass.value}`
    : filterTeacher.value
      ? `JADWAL PENGAJAR: ${filterTeacher.value}`
      : 'JADWAL PELAJARAN'

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`
<html><head><title>${title}</title>
<style>
  @page { size: landscape; margin: 12mm 15mm; }
  body { font-family: 'Times New Roman', Times, serif; margin:0; padding:15px; }
  .kop { text-align:center; border-bottom:2px solid #333; padding-bottom:10px; margin-bottom:16px; }
  .kop .logo { max-height:55px; vertical-align:middle; margin-right:8px; }
  .kop .kop-title { font-size:15pt; font-weight:bold; }
  .kop .kop-alamat { font-size:9pt; }
  h2 { text-align:center; font-size:13pt; margin:14px 0; text-decoration:underline; }
  .info { margin-bottom:10px; font-size:10pt; }
  table { width:100%; border-collapse:collapse; margin:10px 0; }
  th, td { padding:4px 6px; border:1px solid #333; font-size:9pt; vertical-align:top; }
  th { background:#e8e8e8; }
  .ttd { margin-top:30px; display:flex; justify-content:space-around; }
  .ttd div { text-align:center; width:180px; }
  .ttd .jabatan { font-size:10pt; margin-bottom:50px; }
  .ttd .nama { font-size:11pt; font-weight:bold; text-decoration:underline; }
</style></head><body>
<div class="kop">
  <table style="width:100%;border:none;"><tr>
    <td style="width:70px;text-align:center;border:none;">
      <img src="/image/logo.png" class="logo" style="max-height:55px;" onerror="this.style.display='none'" />
    </td>
    <td style="text-align:center;border:none;">
      <div class="kop-title">YAYASAN PONDOK PESANTREN<br>AL FATAH PANEKAN</div>
      <div class="kop-alamat">Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</div>
    </td>
  </tr></table>
</div>
<h2>${title}</h2>
<table class="info" style="border:none;">
  <tr><td style="border:none;">Kelas</td><td style="border:none;">: ${byClass}</td></tr>
  <tr><td style="border:none;">Pengajar</td><td style="border:none;">: ${byTeacher}</td></tr>
  <tr><td style="border:none;">Total Jadwal</td><td style="border:none;">: ${f.length}</td></tr>
</table>
<table>
  <thead><tr><th style="width:35px;">Jam</th>${dayHeaders}</tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>`)
  win.document.close()
  setTimeout(() => { win.print() }, 500)
}

const showModal = ref(false)
const isEditing = ref(false)
const showDeleteModal = ref(false)
const deleteTarget = ref<JadwalItem | null>(null)

const defaultForm = () => ({
  id: '',
  hari: '',
  jamKe: 1,
  mapel: '',
  guru: '',
  kelas: '',
  ruang: '',
})

const form = reactive(defaultForm())

function openAddModal() {
  isEditing.value = false
  Object.assign(form, defaultForm())
  showModal.value = true
}

function openCellAdd(day: string, period: number) {
  isEditing.value = false
  Object.assign(form, { ...defaultForm(), hari: day, jamKe: period, kelas: filterClass.value, guru: filterTeacher.value })
  showModal.value = true
}

function openEditModal(item: JadwalItem) {
  isEditing.value = true
  Object.assign(form, { ...item })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveSchedule() {
  if (!form.hari || !form.mapel || !form.guru || !form.kelas || !form.ruang) return
  try {
    if (isEditing.value) {
      await $fetch(`/api/jadwal/${form.id}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/jadwal', { method: 'POST', body: { ...form } })
    }
    closeModal(); await fetchData()
  } catch (e: any) { error.value = e.message || 'Gagal menyimpan' }
}

function confirmDelete(item: JadwalItem) {
  deleteTarget.value = item
  showDeleteModal.value = true
}

async function doDelete() {
  if (!deleteTarget.value?.id) { error.value = 'Data tidak valid'; return }
  try {
    await $fetch(`/api/jadwal/${deleteTarget.value.id}`, { method: 'DELETE' })
    await fetchData()
    showDeleteModal.value = false
    deleteTarget.value = null
  } catch (e: any) { error.value = e.message || 'Gagal menghapus' }
}

onMounted(() => { fetchData(); fetchClasses(); fetchTeachers(); fetchSubjects(); fetchRooms() })
</script>