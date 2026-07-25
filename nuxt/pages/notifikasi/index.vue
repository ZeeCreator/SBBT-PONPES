<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Notifikasi & Pengumuman</h2>
      <p class="text-on-surface-variant text-body-md">Kelola notifikasi push, buku penghubung, dan pengumuman siaran.</p>
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
      <div class="flex gap-2 mb-stack-md border-b border-outline-variant/20">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" class="px-5 py-3 text-label-md font-medium transition-colors relative" :class="activeTab === tab.key ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'">
          {{ tab.label }}
          <span v-if="activeTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
        </button>
      </div>
      <div v-if="activeTab === 'push'">
        <div class="glass-card rounded-xl shadow-sm overflow-hidden">
          <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-on-surface-variant">search</span>
              <input v-model="filterPush" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari notifikasi..." />
            </div>
            <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="openAddModal('push')">
              <span class="material-symbols-outlined text-sm">add</span> Kirim Notifikasi
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Judul</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Jenis</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Target</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="item in filteredPush" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                  <td class="px-4 py-3 text-label-md font-medium">{{ item.title }}</td>
                  <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', jenisClass(item.jenis)]">{{ item.jenis }}</span></td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.target }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.date }}</td>
                  <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', statusClass(item.status)]">{{ item.status }}</span></td>
                  <td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors" @click="deleteNotif(item.id)"><span class="material-symbols-outlined">delete</span></button></td>
                </tr>
                <tr v-if="filteredPush.length === 0"><td colspan="99"  class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'buku'">
        <div class="glass-card rounded-xl shadow-sm overflow-hidden">
          <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-on-surface-variant">search</span>
                <input v-model="filterBuku" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari santri..." />
              </div>
              <select v-model="filterBukuStatus" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
                <option value="">Semua Status</option>
                <option value="dibaca">Dibaca</option>
                <option value="belum">Belum</option>
              </select>
            </div>
            <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="openAddModal('buku')">
              <span class="material-symbols-outlined text-sm">add</span> Kirim Pesan
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Pengirim</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Pesan</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="item in filteredBuku" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                  <td class="px-4 py-3 text-label-md font-medium">{{ item.santri }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.pengirim }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant max-w-[200px] truncate">{{ item.pesan }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.date }}</td>
                  <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', item.status === 'dibaca' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700']">{{ item.status }}</span></td>
                  <td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors" @click="deleteNotif(item.id)"><span class="material-symbols-outlined">delete</span></button></td>
                </tr>
                <tr v-if="filteredBuku.length === 0"><td colspan="99"  class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'pengumuman'">
        <div class="glass-card rounded-xl shadow-sm overflow-hidden">
          <div class="p-stack-md border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-stack-md">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-on-surface-variant">search</span>
              <input v-model="filterPengumuman" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari pengumuman..." />
            </div>
            <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="openAddModal('pengumuman')">
              <span class="material-symbols-outlined text-sm">add</span> Buat Pengumuman
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Judul</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Isi</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Target</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="item in filteredPengumuman" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(item.id)" @change="toggleOne(item.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                  <td class="px-4 py-3 text-label-md font-medium">{{ item.title }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant max-w-[250px] truncate">{{ item.isi }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.date }}</td>
                  <td class="px-4 py-3"><span class="px-2.5 py-0.5 text-[11px] bg-surface-container-low rounded-full">{{ item.target }}</span></td>
                  <td class="px-4 py-3"><span :class="['px-2.5 py-0.5 text-[11px] font-bold rounded-full', item.status === 'terkirim' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700']">{{ item.status }}</span></td>
                  <td class="px-4 py-3 text-center"><button class="text-error hover:text-red-700 transition-colors" @click="deleteNotif(item.id)"><span class="material-symbols-outlined">delete</span></button></td>
                </tr>
                <tr v-if="filteredPengumuman.length === 0"><td colspan="99"  class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter">
          <div class="bg-primary px-gutter py-stack-md flex justify-between items-center">
            <div class="text-on-primary">
              <h2 class="font-display text-headline-md">{{ modalTitle }}</h2>
              <p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Notifikasi Module</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="submitForm">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Judul</label>
              <input v-model="form.title" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
            </div>
            <div class="space-y-1" v-if="modalType === 'pengumuman'">
              <label class="text-label-md text-on-surface-variant">Isi</label>
              <textarea v-model="form.isi" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" rows="3" required></textarea>
            </div>
            <div class="space-y-1" v-if="modalType === 'buku'">
              <label class="text-label-md text-on-surface-variant">Santri</label>
              <input v-model="form.santri" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
            </div>
            <div class="space-y-1" v-if="modalType === 'buku'">
              <label class="text-label-md text-on-surface-variant">Pesan</label>
              <textarea v-model="form.pesan" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" rows="2" required></textarea>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Target</label>
                <select v-model="form.target" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option value="Semua Wali">Semua Wali</option>
                  <option value="Kelas 10">Kelas 10</option>
                  <option value="Kelas 11">Kelas 11</option>
                  <option value="Kelas 12">Kelas 12</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Tanggal</label>
                <input type="date" v-model="form.date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
              </div>
            </div>
            <div class="space-y-1" v-if="modalType === 'push'">
              <label class="text-label-md text-on-surface-variant">Jenis</label>
              <select v-model="form.jenis" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="Pengingat SPP">Pengingat SPP</option>
                <option value="Info Pelanggaran">Info Pelanggaran</option>
                <option value="Pengumuman Libur">Pengumuman Libur</option>
              </select>
            </div>
            <div class="flex justify-end gap-stack-sm pt-stack-sm">
              <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="showModal = false">Batal</button>
              <button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Kirim</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => filteredPush)
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

interface NotifItem {
  id: number
  title: string
  jenis?: string
  isi?: string
  santri?: string
  pesan?: string
  pengirim?: string
  target: string
  date: string
  status: string
  type: 'push' | 'buku' | 'pengumuman'
}

const activeTab = ref('push')
const filterPush = ref('')
const filterBuku = ref('')
const filterBukuStatus = ref('')
const filterPengumuman = ref('')
const showModal = ref(false)
const modalType = ref<'push' | 'buku' | 'pengumuman'>('push')
const modalTitle = ref('')
const loading = ref(true)
const errorS = ref('')
const notifs = ref<NotifItem[]>([])

const form = reactive({
  title: '',
  isi: '',
  santri: '',
  pesan: '',
  target: 'Semua Wali',
  date: new Date().toISOString().split('T')[0],
  jenis: 'Pengingat SPP',
})

const tabs = [
  { key: 'push', label: 'Notifikasi Push' },
  { key: 'buku', label: 'Buku Penghubung' },
  { key: 'pengumuman', label: 'Pengumuman & Siaran' },
]

const pushNotif = computed(() => notifs.value.filter(n => n.type === 'push'))
const bukuPenghubung = computed(() => notifs.value.filter(n => n.type === 'buku'))
const pengumuman = computed(() => notifs.value.filter(n => n.type === 'pengumuman'))

const stats = computed(() => {
  const push = pushNotif.value
  return [
    { label: 'Total Notifikasi Bulan Ini', icon: 'notifications', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: notifs.value.length.toString() },
    { label: 'Terkirim', icon: 'check_circle', bg: 'bg-green-100', iconColor: 'text-green-600', valueColor: 'text-green-700', value: push.filter(i => i.status === 'terkirim').length.toString() },
    { label: 'Gagal', icon: 'error', bg: 'bg-red-100', iconColor: 'text-red-600', valueColor: 'text-red-700', value: push.filter(i => i.status === 'gagal').length.toString() },
    { label: 'Pending', icon: 'hourglass', bg: 'bg-amber-100', iconColor: 'text-amber-600', valueColor: 'text-amber-700', value: push.filter(i => i.status === 'pending').length.toString() },
  ]
})

const filteredPush = computed(() => pushNotif.value.filter(i => !filterPush.value || i.title.toLowerCase().includes(filterPush.value.toLowerCase())))
const filteredBuku = computed(() => bukuPenghubung.value.filter(i => (!filterBuku.value || (i.santri || '').toLowerCase().includes(filterBuku.value.toLowerCase())) && (!filterBukuStatus.value || i.status === filterBukuStatus.value)))
const filteredPengumuman = computed(() => pengumuman.value.filter(i => !filterPengumuman.value || i.title.toLowerCase().includes(filterPengumuman.value.toLowerCase())))

function jenisClass(jenis: string) {
  const map: Record<string, string> = { 'Pengingat SPP': 'bg-blue-100 text-blue-700', 'Info Pelanggaran': 'bg-red-100 text-red-700', 'Pengumuman Libur': 'bg-green-100 text-green-700' }
  return map[jenis] || 'bg-surface-container text-on-surface-variant'
}

function statusClass(status: string) {
  const map: Record<string, string> = { 'terkirim': 'bg-green-100 text-green-700', 'gagal': 'bg-red-100 text-red-700', 'pending': 'bg-amber-100 text-amber-700' }
  return map[status] || 'bg-surface-container text-on-surface-variant'
}

async function fetchData() {
  loading.value = true; errorS.value = ''
  try { notifs.value = await $fetch<NotifItem[]>('/api/notifikasi') || [] }
  catch (e: any) { errorS.value = e.message || 'Gagal memuat data' }
  finally { loading.value = false }
}

function openAddModal(type: 'push' | 'buku' | 'pengumuman') {
  modalType.value = type
  modalTitle.value = type === 'push' ? 'Kirim Notifikasi Push' : type === 'buku' ? 'Kirim Pesan Buku Penghubung' : 'Buat Pengumuman'
  form.title = ''
  form.isi = ''
  form.santri = ''
  form.pesan = ''
  form.target = 'Semua Wali'
  form.date = new Date().toISOString().split('T')[0]
  form.jenis = 'Pengingat SPP'
  showModal.value = true
}

async function submitForm() {
  try {
    const payload: any = {
      title: form.title,
      target: form.target,
      date: form.date,
      type: modalType.value,
      status: 'pending',
    }
    if (modalType.value === 'push') {
      payload.jenis = form.jenis
    } else if (modalType.value === 'buku') {
      payload.santri = form.santri
      payload.pesan = form.pesan
      payload.pengirim = 'Ustadz'
    } else {
      payload.isi = form.isi
    }
    await $fetch('/api/notifikasi', { method: 'POST', body: payload })
    showModal.value = false; await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal mengirim' }
}

async function deleteNotif(id: number) {
  if (!confirm('Yakin ingin menghapus notifikasi ini?')) return
  try {
    await $fetch(`/api/notifikasi/${id}`, { method: 'DELETE' })
    await fetchData()
  } catch (e: any) { errorS.value = e.message || 'Gagal menghapus' }
}

onMounted(() => fetchData())
</script>
