<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">Imtihan & Iktibar</h2>
      <p class="text-on-surface-variant text-body-md">Pilih kelas untuk mengelola imtihan (ujian) atau iktibar (catatan harian).</p>
    </div>
    <div v-if="error" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ error }}</div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
      <div v-for="cls in classes" :key="cls.id"
        class="glass-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-outline-variant/10">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center">
            <span class="material-symbols-outlined text-primary">school</span>
          </div>
          <div>
            <h3 class="font-display text-title-md text-primary">{{ cls.name || cls.nama }}</h3>
            <p class="text-label-sm text-on-surface-variant">Tingkat {{ cls.level || cls.tingkat }} - {{ cls.group || '-' }}</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button class="flex-1 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all text-center" @click="navigateTo(`/akademik/imtihan/${cls.id}/imtihan`)">
            <span class="material-symbols-outlined text-sm align-middle mr-1">quiz</span> Imtihan
          </button>
          <button class="flex-1 px-4 py-2 bg-secondary text-on-secondary rounded-lg text-label-md hover:brightness-110 transition-all text-center" @click="navigateTo(`/akademik/imtihan/${cls.id}/iktibar`)">
            <span class="material-symbols-outlined text-sm align-middle mr-1">edit_note</span> Iktibar
          </button>
        </div>
      </div>
      <div v-if="classes.length === 0" class="col-span-full text-center py-12 text-on-surface-variant text-label-md">Belum ada kelas</div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const classes = ref<any[]>([])
const loading = ref(true)
const error = ref('')

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    const data = await $fetch('/api/master-data/classes')
    classes.value = data || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data kelas'
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchData())
</script>
