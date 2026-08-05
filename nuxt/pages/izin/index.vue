<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Izin Santri</h2>
      <p class="text-on-surface-variant text-body-md">Kelola izin pulang, izin dokter, dan izin khusus santri.</p>
    </div>
    <div v-if="errorS" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ errorS }}</div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
    </div>
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
        <div v-for="stat in stats" :key="stat.label" class="glass-card p-6 rounded-xl shadow-sm text-center">
          <div class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" :class="stat.bg">
            <span class="material-symbols-outlined" :class="stat.iconColor">{{ stat.icon }}</span>
          </div>
          <p class="font-display text-headline-md" :class="stat.valueColor">{{ stat.value }}</p>
          <p class="text-label-sm text-on-surface-variant">{{ stat.label }}</p>
        </div>
      </div>
      <div class="glass-card rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <select v-model="filterStatus" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
              <option value="">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
          <button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm" @click="openAddModal">
            <span class="material-symbols-outlined text-sm">add</span> Tambah Izin
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
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Santri</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Jenis Izin</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal Mulai</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Tanggal Selesai</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Keterangan</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
                <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              <tr v-for="item in filteredPermits" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                <td class="px-6 py-4 text-label-md font-medium">{{ item.santri }}</td>
                <td class="px-6 py-4">
                  <span :class="['px-3 py-1 text-[11px] font-bold rounded-full', item.jenis === 'Izin Pulang' ? 'bg-blue-100 text-blue-700' : item.jenis === 'Izin Dokter' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700']">
                    {{ item.jenis }}
                  </span>
                </td>
                <td class="px-6 py-4 text-label-sm text-on-surface-variant">{{ item.tglMulai }}</td>
                <td class="px-6 py-4 text-label-sm text-on-surface-variant">{{ item.tglSelesai }}</td>
                <td class="px-6 py-4 text-label-sm text-on-surface-variant max-w-[200px] truncate">{{ item.keterangan }}</td>
                <td class="px-6 py-4">
                  <span :class="['px-3 py-1 text-[11px] font-bold rounded-full', item.status === 'Pending' ? 'bg-amber-100 text-amber-700' : item.status === 'Disetujui' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
      <div class="flex items-center gap-2">
        <button v-if="item.status === 'Pending'" class="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors" title="Setujui" @click="approvePermit(item.id)">
          <span class="material-symbols-outlined text-sm">check_circle</span>
        </button>
        <button v-if="item.status === 'Pending'" class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Tolak" @click="rejectPermit(item.id)">
          <span class="material-symbols-outlined text-sm">cancel</span>
        </button>
        <button v-if="item.status === 'Disetujui'" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Cetak Surat" @click="printSuratIzin(item)">
          <span class="material-symbols-outlined text-sm">print</span>
        </button>
        <button class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit" @click="openEditModal(item)">
          <span class="material-symbols-outlined text-sm">edit</span>
        </button>
      </div>
                </td>
              </tr>
              <tr v-if="filteredPermits.length === 0">
                <td colspan="99"  class="px-6 py-12 text-center text-on-surface-variant text-label-md">Belum ada data izin.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-enter">
          <div class="px-gutter py-stack-md border-b border-outline-variant/20 flex justify-between items-center">
            <h3 class="font-display text-title-lg text-primary">{{ editingId ? 'Edit Izin' : 'Tambah Izin' }}</h3>
            <button class="p-1.5 rounded-lg hover:bg-surface-container transition-colors" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-gutter space-y-stack-md">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Santri</label>
              <select v-model="form.santri" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="">Pilih Santri</option>
                <option v-for="s in students" :key="s.id" :value="s.name">{{ s.name }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Jenis Izin</label>
              <select v-model="form.jenis" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="">Pilih Jenis</option>
                <option value="Izin Pulang">Izin Pulang</option>
                <option value="Izin Dokter">Izin Dokter</option>
                <option value="Izin Khusus">Izin Khusus</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Tanggal Mulai</label>
              <input v-model="form.tglMulai" type="date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Tanggal Selesai</label>
              <input v-model="form.tglSelesai" type="date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Keterangan</label>
              <textarea v-model="form.keterangan" rows="3" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none min-h-[80px]" placeholder="Alasan izin"></textarea>
            </div>
          </div>
          <div class="px-gutter py-stack-md border-t border-outline-variant/20 flex justify-end gap-stack-sm">
            <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="closeModal">Batal</button>
            <button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" @click="savePermit">Simpan</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredPermits)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

interface PermitItem {
  id: number
  santri: string
  jenis: string
  tglMulai: string
  tglSelesai: string
  keterangan: string
  status: string
}

const students = ref<any[]>([])
const { getIdToken } = useAuth()

const loading = ref(true)
const errorS = ref('')
const permits = ref<PermitItem[]>([])
const filterStatus = ref('')
const showModal = ref(false)
const editingId = ref<string | null>(null)

const filteredPermits = computed(() =>
  !filterStatus.value
    ? permits.value
    : permits.value.filter(p => p.status === filterStatus.value)
)

const stats = computed(() => {
  const pending = permits.value.filter(p => p.status === 'Pending').length
  const approved = permits.value.filter(p => p.status === 'Disetujui').length
  return [
    { label: 'Pending Approval', icon: 'hourglass_top', bg: 'bg-amber-100', iconColor: 'text-amber-600', valueColor: 'text-amber-700', value: pending.toString() },
    { label: 'Disetujui', icon: 'check_circle', bg: 'bg-green-100', iconColor: 'text-green-600', valueColor: 'text-green-700', value: approved.toString() },
    { label: 'Ditolak', icon: 'cancel', bg: 'bg-red-100', iconColor: 'text-red-600', valueColor: 'text-red-700', value: permits.value.filter(p => p.status === 'Ditolak').length.toString() },
    { label: 'Total Izin', icon: 'description', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: permits.value.length.toString() },
  ]
})

async function fetchData() {
  loading.value = true; errorS.value = ''
  try {
    const params: Record<string, string> = {}
    if (filterStatus.value) params.status = filterStatus.value
    const qs = new URLSearchParams(params).toString()
    permits.value = await $fetch<PermitItem[]>(`/api/izin${qs ? '?' + qs : ''}`) || []
  } catch (e: any) { errorS.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

async function fetchStudents() {
  try {
    const token = await getIdToken()
    const res = await fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) students.value = await res.json()
  } catch (e) { console.error(e) }
}

watch(filterStatus, () => fetchData())

const defaultForm = () => ({
  id: 0,
  santri: '',
  jenis: '',
  tglMulai: '',
  tglSelesai: '',
  keterangan: '',
  status: 'Pending',
})

const form = reactive(defaultForm())

function openAddModal() {
  editingId.value = null
  Object.assign(form, defaultForm())
  showModal.value = true
}

function openEditModal(item: PermitItem) {
  editingId.value = item.id.toString()
  form.id = item.id
  form.santri = item.santri
  form.jenis = item.jenis
  form.tglMulai = item.tglMulai
  form.tglSelesai = item.tglSelesai
  form.keterangan = item.keterangan
  showModal.value = true
}

function closeModal() { showModal.value = false }

async function savePermit() {
  if (!form.santri || !form.jenis || !form.tglMulai || !form.tglSelesai) return
  try {
    if (editingId.value) {
      await $fetch(`/api/izin/${editingId.value}`, { method: 'PATCH', body: { ...form } })
    } else {
      await $fetch('/api/izin', { method: 'POST', body: { ...form } })
    }
    closeModal(); await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menyimpan' }
}

async function approvePermit(id: number) {
  try {
    await $fetch(`/api/izin/${id}`, { method: 'PATCH', body: { status: 'Disetujui' } })
    await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menyetujui' }
}

async function rejectPermit(id: number) {
  try {
    await $fetch(`/api/izin/${id}`, { method: 'PATCH', body: { status: 'Ditolak' } })
    await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menolak' }
}

function printSuratIzin(item: PermitItem) {
  const stud = students.value.find(s => s.name === item.santri)
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`
<html><head><title>Surat Izin - ${item.santri}</title>
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

<h2>SURAT IZIN</h2>
<div class="no-surat">No: ${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}/SPI/AL-FATAH/${new Date().getMonth() + 1}/${new Date().getFullYear()}</div>

<div class="content">
  <p>Yang bertanda tangan di bawah ini, Kepala Pondok Pesantren Al Fatah Panekan, menerangkan bahwa:</p>
</div>

<table class="data">
  <tr><td class="label">Nama Santri</td><td>: ${item.santri}</td></tr>
  ${stud?.nis ? `<tr><td>NIS</td><td>: ${stud.nis}</td></tr>` : ''}
  ${stud?.class ? `<tr><td>Kelas</td><td>: ${stud.class}</td></tr>` : ''}
  <tr><td>Jenis Izin</td><td>: ${item.jenis}</td></tr>
  <tr><td>Tanggal Mulai</td><td>: ${item.tglMulai}</td></tr>
  <tr><td>Tanggal Selesai</td><td>: ${item.tglSelesai}</td></tr>
  <tr><td>Keterangan</td><td>: ${item.keterangan || '-'}</td></tr>
</table>

<div class="content">
  <p>Benar bahwa santri tersebut di atas diberikan izin untuk meninggalkan pondok selama waktu yang telah ditentukan. Demikian surat ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
</div>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>
`)
  win.document.close()
  setTimeout(() => win.print(), 500)
}

async function bulkDelete() {
  if (!confirm(`Yakin ingin menghapus ${selectedCount} data?`)) return
  try {
    await Promise.all(selected.value.map(id => $fetch(`/api/izin/${id}`, { method: 'DELETE' })))
    clearSelection()
    await fetchData()
  } catch (e: any) {
    errorS.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => { fetchData(); fetchStudents() })
</script>
