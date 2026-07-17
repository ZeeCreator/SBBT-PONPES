<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Setoran Zakat</h2>
      <p class="text-on-surface-variant text-body-md">Pencatatan zakat fitrah & zakat mal.</p>
    </div>
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
            <span class="material-symbols-outlined text-on-surface-variant">filter_alt</span>
            <select v-model="filterJenis" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
              <option value="">Semua Jenis</option>
              <option value="Zakat Fitrah">Zakat Fitrah</option>
              <option value="Zakat Mal">Zakat Mal</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-on-surface-variant">search</span>
            <input v-model="filterSearch" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" placeholder="Cari..." />
          </div>
        </div>
        <button class="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="showAddModal = true">
          <span class="material-symbols-outlined text-sm">add</span> Catat Zakat
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama Muzakki</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Jenis Zakat</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Jumlah</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant">Mustahiq</th>
              <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-for="record in filteredRecords" :key="record.id" class="hover:bg-primary-fixed/5 transition-colors">
              <td class="px-4 py-3 text-label-md font-medium">{{ record.name }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-0.5 rounded text-[11px] font-bold', record.jenis === 'Zakat Fitrah' ? 'bg-teal-100 text-teal-700' : 'bg-purple-100 text-purple-700']">{{ record.jenis }}</span>
              </td>
              <td class="px-4 py-3 text-label-md font-bold text-primary">
                <template v-if="record.jenis === 'Zakat Fitrah'">{{ record.amount }} Kg</template>
                <template v-else>Rp {{ record.amount.toLocaleString() }}</template>
              </td>
              <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ record.date }}</td>
              <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ record.mustahiq || '-' }}</td>
              <td class="px-4 py-3 text-center">
                <button class="text-error hover:text-red-700 transition-colors" @click="deleteRecord(record.id)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
            <tr v-if="filteredRecords.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showAddModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter">
          <div class="bg-primary px-gutter py-stack-md flex justify-between items-center">
            <div class="text-on-primary">
              <h2 class="font-display text-headline-md">Catat Zakat</h2>
              <p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Ibadah Module</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showAddModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="submitRecord">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Nama Muzakki</label>
              <input v-model="form.name" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Nama" required />
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Jenis Zakat</label>
                <select v-model="form.jenis" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option value="Zakat Fitrah">Zakat Fitrah</option>
                  <option value="Zakat Mal">Zakat Mal</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">{{ form.jenis === 'Zakat Fitrah' ? 'Jumlah (Kg)' : 'Jumlah (Rp)' }}</label>
                <input type="number" v-model="form.amount" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="0" min="0" required />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Tanggal</label>
                <input type="date" v-model="form.date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Mustahiq</label>
                <select v-model="form.mustahiq" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option value="">Pilih Mustahiq</option>
                  <option v-for="m in mustahiqList" :key="m" :value="m">{{ m }}</option>
                </select>
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

const loading = ref(true)
const error = ref('')
const filterJenis = ref('')
const filterSearch = ref('')
const showAddModal = ref(false)

const mustahiqList = ['Fakir', 'Miskin', 'Amil', 'Muallaf', 'Riqab', 'Gharimin', 'Fisabilillah', 'Ibnu Sabil']

const form = reactive({
  name: '',
  jenis: 'Zakat Fitrah',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  mustahiq: '',
})

const items = ref<any[]>([])

const totalFitrah = computed(() => {
  return items.value.filter(r => r.jenis === 'Zakat Fitrah').reduce((sum, r) => sum + Number(r.amount), 0)
})

const totalMal = computed(() => {
  return items.value.filter(r => r.jenis === 'Zakat Mal').reduce((sum, r) => sum + Number(r.amount), 0)
})

const uniqueMuzakki = computed(() => {
  return new Set(items.value.map(r => r.name)).size
})

const stats = computed(() => [
  { label: 'Total Zakat Fitrah', icon: 'rice_bowl', bg: 'bg-teal-100', iconColor: 'text-teal-600', valueColor: 'text-teal-700', value: `${totalFitrah.value} Kg` },
  { label: 'Total Zakat Mal', icon: 'account_balance_wallet', bg: 'bg-purple-100', iconColor: 'text-purple-600', valueColor: 'text-purple-700', value: `Rp ${totalMal.value.toLocaleString()}` },
  { label: 'Total Muzakki', icon: 'groups', bg: 'bg-primary-fixed', iconColor: 'text-primary', valueColor: 'text-primary', value: uniqueMuzakki.value.toString() },
  { label: 'Total Transaksi', icon: 'receipt_long', bg: 'bg-amber-100', iconColor: 'text-amber-600', valueColor: 'text-amber-700', value: items.value.length.toString() },
])

const filteredRecords = computed(() => {
  return items.value.filter(r => {
    const matchJenis = !filterJenis.value || r.jenis === filterJenis.value
    const matchSearch = !filterSearch.value || r.name.toLowerCase().includes(filterSearch.value.toLowerCase())
    return matchJenis && matchSearch
  })
})

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/ibadah/zakat')
    items.value = data || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

async function submitRecord() {
  try {
    await $fetch('/api/ibadah/zakat', {
      method: 'POST',
      body: { ...form, amount: Number(form.amount) },
    })
    showAddModal.value = false
    form.name = ''
    form.jenis = 'Zakat Fitrah'
    form.amount = 0
    form.date = new Date().toISOString().split('T')[0]
    form.mustahiq = ''
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

async function deleteRecord(id: string) {
  if (!confirm('Yakin ingin menghapus?')) return
  try {
    await $fetch(`/api/ibadah/zakat/${id}`, { method: 'DELETE' })
    await fetchData()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  }
}

onMounted(() => fetchData())
</script>
