<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Mutasi Kamar, Kelas, Boyong, Halaqoh & Pindah Pondok</h2>
      <p class="text-on-surface-variant text-body-md">Kelola permintaan mutasi/pindah kamar, kelas, boyong (pulang), pindah halaqoh, dan pindah pondok santri.</p>
    </div>
    <div v-if="errorS" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ errorS }}</div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
    </div>
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
        <div v-for="stat in stats" :key="stat.label" class="glass-card p-stack-md rounded-xl shadow-sm text-center">
          <div class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" :class="stat.bg">
            <span class="material-symbols-outlined" :class="stat.iconColor">{{ stat.icon }}</span>
          </div>
          <p class="font-display text-headline-md" :class="stat.valueColor">{{ stat.value }}</p>
          <p class="text-label-sm text-on-surface-variant">{{ stat.label }}</p>
        </div>
      </div>
      <div class="glass-card rounded-xl shadow-sm overflow-hidden">
        <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-on-surface-variant">search</span>
              <input v-model="filterSearch" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari santri..." />
            </div>
<select v-model="filterTipe" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
                <option value="">Semua Tipe</option>
                <option value="Kamar">Kamar</option>
                <option value="Kelas">Kelas</option>
                <option value="Boyong">Boyong</option>
                <option value="Halaqoh">Halaqoh</option>
                <option value="Pindah Pondok Al-Fatah Pusat">Pindah Pondok Al-Fatah Pusat</option>
              </select>
            <select v-model="filterStatus" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
          <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="openAddModal">
            <span class="material-symbols-outlined text-sm">add</span> Ajukan Mutasi
          </button>
        </div>
        <BulkActionBar :selected-count="selectedCount" @clear="clearSelection">
          <template #actions>
            <button class="flex items-center gap-1 px-3 py-1.5 bg-error text-on-error rounded-lg text-label-sm hover:brightness-110 transition-all" @click="bulkDelete">
              <span class="material-symbols-outlined text-sm">delete</span> Hapus
            </button>
          </template>
        </BulkActionBar>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-surface-container-low">
              <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tipe Mutasi</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Dari</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Ke</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Keterangan</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              <tr v-for="item in filteredMutasi" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                <td class="px-4 py-3 text-label-md font-medium">{{ item.santri }}</td>
                <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', tipeBadge(item.tipe)]">{{ item.tipe }}</span></td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.dari || '-' }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.ke || '-' }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.keterangan || '-' }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.date }}</td>
                <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', statusClass(item.status)]">{{ statusLabel(item.status) }}</span></td>
                <td class="px-4 py-3 text-center">
                  <button v-if="item.status === 'pending'" class="text-green-600 hover:text-green-800 mr-2 transition-colors" @click="approve(item.id)"><span class="material-symbols-outlined">check_circle</span></button>
                  <button v-if="item.status === 'pending'" class="text-red-600 hover:text-red-800 mr-2 transition-colors" @click="reject(item.id)"><span class="material-symbols-outlined">cancel</span></button>
                  <button v-if="item.status === 'disetujui' && item.tipe === 'Boyong'" class="text-blue-600 hover:text-blue-800 mr-2 transition-colors" @click="printSuratBoyong(item)" title="Cetak Surat Boyong"><span class="material-symbols-outlined">print</span></button>
                    <button v-if="item.status === 'disetujui' && item.tipe === 'Pindah Pondok Al-Fatah Pusat'" class="text-blue-600 hover:text-blue-800 mr-2 transition-colors" @click="printSuratPindah(item)" title="Cetak Surat Pindah"><span class="material-symbols-outlined">print</span></button>
              <button class="text-error hover:text-red-700 transition-colors" @click="deleteMutasi(item.id)"><span class="material-symbols-outlined">delete</span></button>
                </td>
              </tr>
              <tr v-if="filteredMutasi.length === 0"><td colspan="99"  class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter">
          <div class="bg-primary px-gutter py-stack-md flex justify-between items-center">
            <div class="text-on-primary">
              <h2 class="font-display text-headline-md">Ajukan Mutasi</h2>
              <p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Mutasi Module</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="submitForm">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Santri</label>
              <select v-model="form.santri" @change="form.studentId = students.find(s => s.name === form.santri)?.id || ''" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required>
                <option value="">-- Pilih Santri --</option>
                <option v-for="s in students" :key="s.id" :value="s.name">{{ s.name }} ({{ s.nis || '-' }})</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Tipe Mutasi</label>
              <select v-model="form.tipe" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="Kamar">Kamar</option>
                <option value="Kelas">Kelas</option>
                <option value="Boyong">Boyong (Pulang)</option>
                <option value="Halaqoh">Halaqoh</option>
                <option value="Pindah Pondok Al-Fatah Pusat">Pindah Pondok Al-Fatah Pusat</option>
              </select>
            </div>

            <template v-if="form.tipe === 'Kamar' || form.tipe === 'Kelas'">
              <div class="grid grid-cols-2 gap-stack-md">
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Dari</label>
                  <input v-model="form.dari" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" :placeholder="form.tipe === 'Kamar' ? 'Kamar 1-A' : 'Kelas 10-A'" required />
                </div>
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Ke</label>
                  <input v-model="form.ke" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" :placeholder="form.tipe === 'Kamar' ? 'Kamar 2-B' : 'Kelas 11-A'" required />
                </div>
              </div>
            </template>

            <template v-if="form.tipe === 'Boyong'">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Keterangan / Alasan Boyong</label>
                <textarea v-model="form.keterangan" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none min-h-[80px]" placeholder="Alasan boyong/pulang..." required></textarea>
              </div>
              <div class="grid grid-cols-2 gap-stack-md">
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Dari Kamar</label>
                  <input v-model="form.dari" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Kamar sebelumnya" />
                </div>
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Dari Kelas</label>
                  <input v-model="form.ke" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Kelas sebelumnya" />
                </div>
              </div>
            </template>

            <template v-if="form.tipe === 'Halaqoh'">
              <div class="grid grid-cols-2 gap-stack-md">
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Dari Halaqoh</label>
                  <input v-model="form.dari" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Halaqoh A" required />
                </div>
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Ke Halaqoh</label>
                  <input v-model="form.ke" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Halaqoh B" required />
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Keterangan</label>
                <textarea v-model="form.keterangan" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none min-h-[60px]" placeholder="Alasan pindah halaqoh..."></textarea>
              </div>
            </template>

<template v-if="form.tipe === 'Pindah Pondok Al-Fatah Pusat'">
              <div class="grid grid-cols-2 gap-stack-md">
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Dari</label>
                  <input v-model="form.dari" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Pondok Al-Fatah Panekan" />
                </div>
                <div class="space-y-1">
                  <label class="text-label-md text-on-surface-variant">Ke</label>
                  <input v-model="form.ke" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Pondok Al-Fatah Pusat" />
                </div>
              </div>
            </template>

            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Tanggal</label>
              <input type="date" v-model="form.date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
            </div>
            <div class="flex justify-end gap-stack-sm pt-stack-sm">
              <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="showModal = false">Batal</button>
              <button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Ajukan</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredMutasi)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

interface MutasiItem {
  id: number
  santri: string
  studentId?: string
  tipe: string
  dari: string
  ke: string
  keterangan?: string
  date: string
  status: string
}

const filterSearch = ref('')
const filterTipe = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const loading = ref(true)
const errorS = ref('')
const mutasi = ref<MutasiItem[]>([])

const students = ref<any[]>([])
const { getIdToken } = useAuth()

const form = reactive({
  santri: '',
  studentId: '',
  tipe: 'Kamar',
  dari: '',
  ke: '',
  keterangan: '',
  date: new Date().toISOString().split('T')[0],
})

const stats = computed(() => [
  { label: 'Total Mutasi Bulan Ini', icon: 'swap_horiz', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: mutasi.value.length.toString() },
  { label: 'Pending Approvals', icon: 'hourglass', bg: 'bg-amber-100', iconColor: 'text-amber-600', valueColor: 'text-amber-700', value: mutasi.value.filter(m => m.status === 'pending').length.toString() },
  { label: 'Disetujui', icon: 'check_circle', bg: 'bg-green-100', iconColor: 'text-green-600', valueColor: 'text-green-700', value: mutasi.value.filter(m => m.status === 'disetujui').length.toString() },
  { label: 'Ditolak', icon: 'cancel', bg: 'bg-red-100', iconColor: 'text-red-600', valueColor: 'text-red-700', value: mutasi.value.filter(m => m.status === 'ditolak').length.toString() },
])

const filteredMutasi = computed(() => mutasi.value.filter(m =>
  (!filterSearch.value || m.santri.toLowerCase().includes(filterSearch.value.toLowerCase())) &&
  (!filterTipe.value || m.tipe === filterTipe.value) &&
  (!filterStatus.value || m.status === filterStatus.value)
))

function tipeBadge(tipe: string) {
  const map: Record<string, string> = {
    'Kamar': 'bg-blue-100 text-blue-700',
    'Kelas': 'bg-purple-100 text-purple-700',
    'Boyong': 'bg-orange-100 text-orange-700',
    'Halaqoh': 'bg-teal-100 text-teal-700',
    'Pindah Pondok Al-Fatah Pusat': 'bg-rose-100 text-rose-700'
  }
  return map[tipe] || 'bg-surface-container text-on-surface-variant'
}

function statusClass(status: string) {
  const map: Record<string, string> = { 'pending': 'bg-amber-100 text-amber-700', 'disetujui': 'bg-green-100 text-green-700', 'ditolak': 'bg-red-100 text-red-700' }
  return map[status] || 'bg-surface-container text-on-surface-variant'
}

function statusLabel(status: string) {
  const map: Record<string, string> = { 'pending': 'Pending', 'disetujui': 'Disetujui', 'ditolak': 'Ditolak' }
  return map[status] || status
}

async function fetchData() {
  loading.value = true; errorS.value = ''
  try {
    const params: Record<string, string> = {}
    if (filterSearch.value) params.search = filterSearch.value
    if (filterTipe.value) params.tipe = filterTipe.value
    if (filterStatus.value) params.status = filterStatus.value
    const qs = new URLSearchParams(params).toString()
    mutasi.value = await $fetch<MutasiItem[]>(`/api/mutasi${qs ? '?' + qs : ''}`) || []
  } catch (e: any) { errorS.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

watch([filterSearch, filterTipe, filterStatus], () => fetchData())

function openAddModal() {
  form.santri = ''
  form.studentId = ''
  form.tipe = 'Kamar'
  form.dari = ''
  form.ke = ''
  form.keterangan = ''
  form.date = new Date().toISOString().split('T')[0]
  showModal.value = true
}

watch(() => form.tipe, (val) => {
  if (val === 'Pindah Pondok Al-Fatah Pusat') {
    if (!form.dari) form.dari = 'Pondok Al-Fatah Panekan'
    if (!form.ke) form.ke = 'Pondok Al-Fatah Pusat'
  }
})

async function fetchStudents() {
  try {
    const token = await getIdToken()
    const res = await fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) students.value = await res.json()
  } catch (e) { console.error(e) }
}

async function submitForm() {
  try {
    await $fetch('/api/mutasi', {
      method: 'POST',
      body: {
        santri: form.santri,
        studentId: form.studentId,
        tipe: form.tipe,
        dari: form.dari,
        ke: form.ke,
        keterangan: form.keterangan,
        date: form.date,
        status: 'pending'
      }
    })
    showModal.value = false; await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal mengajukan' }
}

async function approve(id: number) {
  try {
    await $fetch(`/api/mutasi/${id}`, { method: 'PATCH', body: { status: 'disetujui' } })
    await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menyetujui' }
}

async function reject(id: number) {
  try {
    await $fetch(`/api/mutasi/${id}`, { method: 'PATCH', body: { status: 'ditolak' } })
    await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menolak' }
}

async function deleteMutasi(id: number) {
  if (!confirm('Yakin ingin menghapus data mutasi ini?')) return
  try {
    await $fetch(`/api/mutasi/${id}`, { method: 'DELETE' })
    await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menghapus' }
}

function printSuratBoyong(item: MutasiItem) {
  const stud = students.value.find(s => s.id === (item as any).studentId || s.name === item.santri)
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`
<html><head><title>Surat Boyong - ${item.santri}</title>
<style>
  @page { size: A4; margin: 15mm 20mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 0; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
  .kop .logo { max-height: 60px; vertical-align: middle; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 14pt; margin: 16px 0; text-decoration: underline; }
  .no-surat { text-align: center; font-size: 10pt; margin-bottom: 16px; }
  .content { line-height: 1.8; text-align: justify; }
  table.data { width: 100%; border-collapse: collapse; margin: 12px 0; }
  table.data td { padding: 4px 8px; font-size: 11pt; vertical-align: top; }
  table.data .label { width: 120px; }
  .ttd { margin-top: 40px; display: flex; justify-content: space-around; }
  .ttd div { text-align: center; width: 180px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 60px; }
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

<h2>SURAT IZIN BOYONG (PULANG)</h2>
<div class="no-surat">No: ${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}/SPPB/AL-FATAH/${new Date().getMonth() + 1}/${new Date().getFullYear()}</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini, Kepala Pondok Pesantren Al Fatah Panekan, menerangkan bahwa:</p>
</div>

<table class="data">
  <tr><td class="label">Nama Santri</td><td>: ${item.santri}</td></tr>
  ${stud?.nis ? `<tr><td>NIS</td><td>: ${stud.nis}</td></tr>` : ''}
  ${stud?.class ? `<tr><td>Kelas</td><td>: ${stud.class}</td></tr>` : ''}
  ${item.dari ? `<tr><td>Dari Kamar</td><td>: ${item.dari}</td></tr>` : ''}
  ${item.ke ? `<tr><td>Dari Kelas</td><td>: ${item.ke}</td></tr>` : ''}
  <tr><td>Alasan Boyong</td><td>: ${item.keterangan || '-'}</td></tr>
  <tr><td>Tanggal Boyong</td><td>: ${item.date}</td></tr>
</table>

<div class="content">
  <p>Benar bahwa santri tersebut di atas telah diizinkan untuk boyong (pulang) dari Pondok Pesantren Al Fatah Panekan. Demikian surat ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
  <div><div class="jabatan">Santri,</div><div class="nama">_____________________</div></div>
</div>
</body></html>
`)
  win.document.close()
  setTimeout(() => win.print(), 500)
}

function printSuratPindah(item: MutasiItem) {
  const stud = students.value.find(s => s.id === (item as any).studentId || s.name === item.santri)
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`
<html><head><title>Surat Pindah - ${item.santri}</title>
<style>
  @page { size: A4; margin: 15mm 20mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 0; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
  .kop .logo { max-height: 60px; vertical-align: middle; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 14pt; margin: 16px 0; text-decoration: underline; }
  .no-surat { text-align: center; font-size: 10pt; margin-bottom: 16px; }
  .content { line-height: 1.8; text-align: justify; }
  table.data { width: 100%; border-collapse: collapse; margin: 12px 0; }
  table.data td { padding: 4px 8px; font-size: 11pt; vertical-align: top; }
  table.data .label { width: 120px; }
  .ttd { margin-top: 40px; display: flex; justify-content: space-around; }
  .ttd div { text-align: center; width: 180px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 60px; }
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

<h2>SURAT PINDAH PONDOK</h2>
<div class="no-surat">No: ${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}/SPPB/AL-FATAH/${new Date().getMonth() + 1}/${new Date().getFullYear()}</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini, Kepala Pondok Pesantren Al Fatah Panekan, menerangkan bahwa:</p>
</div>

<table class="data">
  <tr><td class="label">Nama Santri</td><td>: ${item.santri}</td></tr>
  ${stud?.nis ? `<tr><td>NIS</td><td>: ${stud.nis}</td></tr>` : ''}
  ${stud?.class ? `<tr><td>Kelas</td><td>: ${stud.class}</td></tr>` : ''}
  ${stud?.tempat_lahir ? `<tr><td>Tempat, Tgl Lahir</td><td>: ${stud.tempat_lahir}${stud?.tanggal_lahir ? ', ' + stud.tanggal_lahir : ''}</td></tr>` : ''}
  ${stud?.alamat ? `<tr><td>Alamat</td><td>: ${stud.alamat}</td></tr>` : ''}
  ${stud?.nama_wali ? `<tr><td>Nama Wali</td><td>: ${stud.nama_wali}</td></tr>` : ''}
  ${stud?.no_hp_wali ? `<tr><td>No. HP Wali</td><td>: ${stud.no_hp_wali}</td></tr>` : ''}
  ${item.dari ? `<tr><td>Dari Pondok</td><td>: ${item.dari}</td></tr>` : ''}
  ${item.ke ? `<tr><td>Ke Pondok</td><td>: ${item.ke}</td></tr>` : ''}
  <tr><td>Tanggal Pindah</td><td>: ${item.date}</td></tr>
</table>

<div class="content">
  <p>Benar bahwa santri tersebut di atas adalah santri kami yang bermaksud untuk mengikuti Program Pondok Pesantren Al Fatah Pusat. Sehubungan dengan hal tersebut, maka yang bersangkutan dipindahkan dari Pondok Pesantren Al Fatah Panekan ke Pondok Pesantren Al Fatah Pusat. Demikian surat ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd">
  <div><div class="jabatan">Pengurus Pondok,</div><div class="nama">_____________________</div></div>
  <div><div class="jabatan">Santri,</div><div class="nama">_____________________</div></div>
</div>
</body></html>
`)
  win.document.close()
  setTimeout(() => win.print(), 500)
}

async function bulkDelete() {
  if (!confirm(`Yakin ingin menghapus ${selectedCount} data?`)) return
  try {
    await Promise.all(selected.value.map(id => $fetch(`/api/mutasi/${id}`, { method: 'DELETE' })))
    clearSelection()
    await fetchData()
  } catch (e: any) {
    errorS.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => { fetchData(); fetchStudents() })
</script>
