<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Import / Export Data</h2>
      <p class="text-on-surface-variant text-body-md">Download template Excel dan import data santri, nilai, absensi.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-stack-lg">
      <div class="glass-card rounded-xl p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <span class="material-symbols-outlined text-blue-600">file_download</span>
          </div>
          <div>
            <h3 class="font-display text-title-md text-primary">Download Template</h3>
            <p class="text-label-sm text-on-surface-variant">Pilih tipe data untuk mengunduh template Excel.</p>
          </div>
        </div>
        <div class="space-y-3">
          <button v-for="tpl in templates" :key="tpl.type"
            class="w-full flex items-center justify-between px-4 py-3 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-all"
            @click="downloadTemplate(tpl.type)">
            <span class="text-label-md">{{ tpl.label }}</span>
            <span class="material-symbols-outlined text-on-surface-variant text-sm">download</span>
          </button>
        </div>
      </div>

      <div class="glass-card rounded-xl p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <span class="material-symbols-outlined text-green-600">file_upload</span>
          </div>
          <div>
            <h3 class="font-display text-title-md text-primary">Import Data</h3>
            <p class="text-label-sm text-on-surface-variant">Upload file Excel yang sudah diisi.</p>
          </div>
        </div>
        <div class="space-y-3">
          <select v-model="importType" class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary">
            <option value="santri">Data Santri</option>
            <option value="nilai">Nilai</option>
          </select>
          <div class="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 text-center hover:border-primary/50 transition-all cursor-pointer" @click="$refs.fileInput?.click()" @dragover.prevent @drop.prevent="handleDrop">
            <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="handleFile" />
            <span class="material-symbols-outlined text-3xl text-on-surface-variant mb-2">cloud_upload</span>
            <p class="text-label-sm text-on-surface-variant">Klik atau drop file Excel di sini</p>
            <p v-if="selectedFile" class="text-label-sm text-primary mt-1">{{ selectedFile.name }}</p>
          </div>
          <button v-if="selectedFile" class="w-full px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 active:scale-95 transition-all" @click="importData" :disabled="importing">
            {{ importing ? 'Mengimpor...' : 'Import Data' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="importResult" class="glass-card rounded-xl p-6 shadow-sm">
      <h3 class="font-display text-title-md text-primary mb-3">Hasil Import</h3>
      <div class="grid grid-cols-3 gap-4 mb-3">
        <div class="text-center p-3 bg-green-50 rounded-lg">
          <p class="font-display text-headline-md text-green-600">{{ importResult.success }}</p>
          <p class="text-label-sm text-green-700">Sukses</p>
        </div>
        <div class="text-center p-3 bg-red-50 rounded-lg">
          <p class="font-display text-headline-md text-red-600">{{ importResult.failed }}</p>
          <p class="text-label-sm text-red-700">Gagal</p>
        </div>
        <div class="text-center p-3 bg-surface-container-low rounded-lg">
          <p class="font-display text-headline-md text-on-surface-variant">{{ importResult.success + importResult.failed }}</p>
          <p class="text-label-sm text-on-surface-variant">Total</p>
        </div>
      </div>
      <div v-if="importResult.errors?.length" class="space-y-1">
        <p class="text-label-sm text-red-600 font-medium">Error:</p>
        <p v-for="(err, i) in importResult.errors.slice(0, 5)" :key="i" class="text-label-sm text-red-500">- {{ err }}</p>
        <p v-if="importResult.errors.length > 5" class="text-label-sm text-on-surface-variant">...dan {{ importResult.errors.length - 5 }} error lainnya</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const templates = [
  { label: 'Template Data Santri', type: 'santri' },
  { label: 'Template Nilai', type: 'nilai' },
  { label: 'Template Absensi Bulanan', type: 'absensi' },
]

const importType = ref('santri')
const selectedFile = ref<File | null>(null)
const importing = ref(false)
const importResult = ref<any>(null)
const fileInput = ref<HTMLInputElement>()

async function downloadTemplate(type: string) {
  try {
    const res = await fetch(`/api/tools/template?type=${type}`)
    if (!res.ok) throw new Error('Gagal download')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `template-${type}.xlsx`; a.click()
    URL.revokeObjectURL(url)
  } catch (e: any) {
    alert('Gagal download template: ' + e.message)
  }
}

function handleFile(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) selectedFile.value = target.files[0]
}

function handleDrop(e: DragEvent) {
  if (e.dataTransfer?.files?.[0]) {
    selectedFile.value = e.dataTransfer.files[0]
  }
}

async function importData() {
  if (!selectedFile.value) return
  importing.value = true
  importResult.value = null
  try {
    const reader = new FileReader()
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(selectedFile.value!)
    })
    importResult.value = await $fetch('/api/tools/import', {
      method: 'POST',
      body: { type: importType.value, file: base64 }
    })
    selectedFile.value = null
  } catch (e: any) {
    importResult.value = { success: 0, failed: 1, errors: [e.message || 'Gagal import'] }
  } finally {
    importing.value = false
  }
}
</script>
