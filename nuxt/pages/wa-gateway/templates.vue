<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg flex items-center justify-between">
      <div>
        <NuxtLink to="/wa-gateway" class="inline-flex items-center gap-1 text-primary text-label-md hover:underline mb-2">
          <span class="material-symbols-outlined text-sm">arrow_back</span> Kembali
        </NuxtLink>
        <h2 class="font-display text-headline-lg text-primary">Template Pesan</h2>
        <p class="text-on-surface-variant text-body-md">Template pesan untuk kebutuhan pondok pesantren</p>
      </div>
      <button @click="openAddModal" class="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md hover:brightness-110 transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">add</span> Template Baru
      </button>
    </div>

    <div class="mb-stack-lg flex flex-wrap gap-2">
      <button v-for="cat in categories" :key="cat.value" @click="filterCategory = cat.value"
        class="px-3 py-1.5 rounded-lg text-label-sm transition-all"
        :class="filterCategory === cat.value ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'">
        <span class="material-symbols-outlined text-xs align-middle mr-1">{{ cat.icon }}</span>
        {{ cat.label }}
      </button>
      <button @click="filterCategory = ''"
        class="px-3 py-1.5 rounded-lg text-label-sm transition-all"
        :class="!filterCategory ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'">
        Semua
      </button>
    </div>

    <div v-if="loading" class="text-center py-12 text-on-surface-variant">Memuat template...</div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
        <div v-for="tpl in filteredTemplates" :key="tpl.id" class="glass-card rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-sm">{{ categoryIcon(tpl.category) }}</span>
              <span class="text-label-md font-bold">{{ tpl.label }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button @click="openEditModal(tpl)" class="p-1.5 hover:bg-primary-fixed/20 rounded-lg transition-colors">
                <span class="material-symbols-outlined text-sm text-primary">edit</span>
              </button>
              <button @click="confirmDelete(tpl)" class="p-1.5 hover:bg-error-container/20 rounded-lg transition-colors">
                <span class="material-symbols-outlined text-sm text-error">delete</span>
              </button>
            </div>
          </div>
          <pre class="text-label-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3 mb-3 whitespace-pre-wrap font-sans text-[11px] leading-relaxed max-h-32 overflow-y-auto">{{ tpl.body }}</pre>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="v in tpl.variables" :key="v" class="px-2 py-0.5 bg-primary-fixed/20 text-primary rounded text-[10px] font-mono">
              {{ '{<!-- -->{' + v + '}<!-- -->}' }}
            </span>
          </div>
          <p class="text-[10px] text-on-surface-variant mt-2">{{ tpl.category }}</p>
        </div>
      </div>
      <p v-if="filteredTemplates.length === 0" class="text-center py-12 text-on-surface-variant">Tidak ada template di kategori ini</p>
    </template>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeModal">
        <div class="bg-surface rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-display text-title-lg text-primary">{{ editingId ? 'Edit Template' : 'Template Baru' }}</h3>
            <button class="text-on-surface-variant hover:text-on-surface" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form @submit.prevent="saveTemplate" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Nama Template *</label>
                <input v-model="form.name" type="text" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="spp-tagihan" />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Label *</label>
                <input v-model="form.label" type="text" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="Tagihan SPP" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Kategori</label>
              <select v-model="form.category" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none">
                <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Isi Pesan *</label>
              <textarea v-model="form.body" required rows="6"
                class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none font-sans"
                placeholder="Yth. {{nama_wali}}&#10;&#10;Ananda {{nama_santri}}..."></textarea>
              <p class="text-label-sm text-on-surface-variant">Gunakan <code class="text-primary bg-primary-fixed/20 px-1 rounded">{<!-- -->{variable}}</code> untuk placeholder</p>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Variabel (pisahkan dengan koma)</label>
              <input v-model="variablesInput" type="text" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="nama_wali, nama_santri, bulan, jumlah" />
              <p class="text-label-sm text-on-surface-variant">Variabel yang digunakan dalam template</p>
            </div>
            <div class="flex items-center gap-3 pt-2">
              <button type="submit" :disabled="saving" class="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-body-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60">
                <span v-if="saving" class="material-symbols-outlined animate-spin text-sm">refresh</span>
                {{ saving ? 'Menyimpan...' : 'Simpan Template' }}
              </button>
              <button type="button" @click="closeModal" class="text-on-surface-variant text-label-md hover:text-on-surface">Batal</button>
            </div>
            <p v-if="err" class="text-error text-label-sm">{{ err }}</p>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })
const { getTemplates, createTemplate, updateTemplate, deleteTemplate } = useWaGateway()

const loading = ref(true)
const templates = ref<any[]>([])
const filterCategory = ref('')
const showModal = ref(false)
const editingId = ref('')
const saving = ref(false)
const err = ref('')
const variablesInput = ref('')

const categories = [
  { value: 'keuangan', label: 'Keuangan', icon: 'payments' },
  { value: 'akademik', label: 'Akademik', icon: 'school' },
  { value: 'absensi', label: 'Absensi', icon: 'calendar_month' },
  { value: 'tahfidz', label: 'Tahfidz', icon: 'menu_book' },
  { value: 'pengumuman', label: 'Pengumuman', icon: 'campaign' },
  { value: 'izin', label: 'Izin Santri', icon: 'passport' },
  { value: 'mutasi', label: 'Mutasi', icon: 'swap_horiz' },
  { value: 'kegiatan', label: 'Kegiatan', icon: 'sports_kabaddi' },
  { value: 'kesehatan', label: 'Kesehatan', icon: 'medical_services' },
  { value: 'lainnya', label: 'Lainnya', icon: 'more_horiz' },
]

const form = reactive({
  name: '',
  label: '',
  category: 'pengumuman',
  body: '',
  variables: [] as string[],
})

const filteredTemplates = computed(() => {
  if (!filterCategory.value) return templates.value
  return templates.value.filter((t: any) => t.category === filterCategory.value)
})

function categoryIcon(cat: string) {
  const found = categories.find(c => c.value === cat)
  return found?.icon || 'more_horiz'
}

function openAddModal() {
  editingId.value = ''
  form.name = ''
  form.label = ''
  form.category = 'pengumuman'
  form.body = ''
  form.variables = []
  variablesInput.value = ''
  showModal.value = true
}

function openEditModal(tpl: any) {
  editingId.value = tpl.id
  form.name = tpl.name
  form.label = tpl.label
  form.category = tpl.category
  form.body = tpl.body
  form.variables = tpl.variables || []
  variablesInput.value = (tpl.variables || []).join(', ')
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = ''
}

async function saveTemplate() {
  saving.value = true
  err.value = ''
  form.variables = variablesInput.value.split(',').map((v: string) => v.trim()).filter(Boolean)

  try {
    if (editingId.value) {
      await updateTemplate(editingId.value, { ...form })
    } else {
      await createTemplate({ ...form })
    }
    closeModal()
    await loadTemplates()
  } catch (e: any) {
    err.value = e.message
  } finally {
    saving.value = false
  }
}

async function confirmDelete(tpl: any) {
  if (!confirm(`Hapus template "${tpl.label}"?`)) return
  await deleteTemplate(tpl.id)
  await loadTemplates()
}

async function loadTemplates() {
  loading.value = true
  try {
    templates.value = await getTemplates()
  } catch (e: any) {
    err.value = e.message
  } finally {
    loading.value = false
  }
}

loadTemplates()
</script>
