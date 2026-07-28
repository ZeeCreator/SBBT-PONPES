<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg flex items-center justify-between">
      <div>
        <h2 class="font-display text-headline-lg text-primary">WhatsApp Gateway</h2>
        <p class="text-on-surface-variant text-body-md">Manajemen pengiriman pesan WhatsApp terpadu</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/wa-gateway/broadcast" class="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md hover:brightness-110 transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">campaign</span> Broadcast
        </NuxtLink>
        <NuxtLink to="/wa-gateway/settings" class="bg-primary-container text-on-primary px-4 py-2 rounded-lg text-label-md hover:bg-primary transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">settings</span> Pengaturan
        </NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-on-surface-variant">Memuat data...</div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
        <div class="glass-card rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="material-symbols-outlined text-primary text-2xl">check_circle</span>
            <span class="text-label-sm text-on-surface-variant">Total</span>
          </div>
          <p class="font-display text-headline-md text-primary">{{ stats.totalSent }}</p>
          <p class="text-label-sm text-on-surface-variant">Pesan Terkirim</p>
        </div>
        <div class="glass-card rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="material-symbols-outlined text-green-600 text-2xl">done_all</span>
            <span class="text-label-sm text-on-surface-variant">Terkirim</span>
          </div>
          <p class="font-display text-headline-md text-green-700">{{ stats.totalDelivered }}</p>
          <p class="text-label-sm text-on-surface-variant">Pesan Terbaca/Delivered</p>
        </div>
        <div class="glass-card rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="material-symbols-outlined text-error text-2xl">error</span>
            <span class="text-label-sm text-on-surface-variant">Gagal</span>
          </div>
          <p class="font-display text-headline-md text-error">{{ stats.totalFailed }}</p>
          <p class="text-label-sm text-on-surface-variant">Pesan Gagal</p>
        </div>
        <div class="glass-card rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="material-symbols-outlined text-secondary text-2xl">today</span>
            <span class="text-label-sm text-on-surface-variant">Hari Ini</span>
          </div>
          <p class="font-display text-headline-md text-secondary">{{ stats.todaySent }}</p>
          <p class="text-label-sm text-on-surface-variant">Pesan Hari Ini</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div class="lg:col-span-2 glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-4">Pesan Terakhir</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Telepon</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Pesan</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="msg in recentMessages" :key="msg.id" class="hover:bg-primary-fixed/5 transition-colors">
                  <td class="px-4 py-3 text-label-md font-mono text-sm">{{ msg.phone }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant max-w-xs truncate">{{ msg.message }}</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="statusClass(msg.status)">{{ msg.status }}</span>
                  </td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ formatDate(msg.createdAt) }}</td>
                </tr>
                <tr v-if="recentMessages.length === 0">
                  <td colspan="4" class="px-4 py-8 text-center text-on-surface-variant text-label-sm">Belum ada pesan terkirim</td>
                </tr>
              </tbody>
            </table>
          </div>
          <NuxtLink to="/wa-gateway/logs" class="mt-4 inline-flex items-center gap-1 text-primary text-label-md hover:underline">
            Lihat semua log <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </NuxtLink>
        </div>

        <div class="glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-4">Template Cepat</h3>
          <div class="space-y-2">
            <NuxtLink v-for="cat in categories" :key="cat.value" to="/wa-gateway/templates"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-fixed/10 transition-colors group">
              <span class="material-symbols-outlined text-primary text-sm">{{ cat.icon }}</span>
              <span class="text-label-md group-hover:text-primary transition-colors">{{ cat.label }}</span>
              <span class="ml-auto text-label-sm text-on-surface-variant">{{ templateCountByCategory[cat.value] || 0 }}</span>
            </NuxtLink>
          </div>

          <div class="mt-6 pt-4 border-t border-outline-variant/10">
            <h4 class="text-label-md text-on-surface-variant mb-3">Status Gateway</h4>
            <div class="flex items-center gap-3 mb-2">
              <span class="w-3 h-3 rounded-full" :class="settings.isActive ? 'bg-green-500' : 'bg-red-400'"></span>
              <span class="text-label-md" :class="settings.isActive ? 'text-green-700' : 'text-on-surface-variant'">
                {{ settings.isActive ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-xs">api</span>
              <span>{{ providerLabel }}</span>
            </div>
            <p class="text-label-sm text-on-surface-variant mt-1">{{ settings.senderName }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })
const { getDashboard, getLogs, getProviders } = useWaGateway()

const loading = ref(true)
const stats = reactive({ totalSent: 0, totalDelivered: 0, totalFailed: 0, todaySent: 0, activeTemplates: 0, provider: 'fonnte', isActive: false })
const settings = reactive({ isActive: false, senderName: '', provider: 'fonnte', apiKey: '', endpointUrl: '', webhookSecret: '', dailyLimit: 500 })
const recentMessages = ref<any[]>([])
const providers = ref<{ id: string; label: string }[]>([])
const providerLabel = computed(() => {
  const p = providers.value.find(p => p.id === settings.provider)
  return p?.label || settings.provider
})
const categories = [
  { value: 'keuangan', label: 'Keuangan', icon: 'payments' },
  { value: 'akademik', label: 'Akademik', icon: 'school' },
  { value: 'absensi', label: 'Absensi', icon: 'calendar_month' },
  { value: 'tahfidz', label: 'Tahfidz', icon: 'menu_book' },
  { value: 'pengumuman', label: 'Pengumuman', icon: 'campaign' },
  { value: 'izin', label: 'Izin Santri', icon: 'passport' },
]
const templateCountByCategory = reactive<Record<string, number>>({})

function statusClass(status: string) {
  const map: Record<string, string> = {
    sent: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    read: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

function formatDate(date: string) {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

async function loadData() {
  loading.value = true
  try {
    const [dash, logs, provs] = await Promise.all([
      getDashboard(),
      getLogs({ limit: '10' }),
      getProviders(),
    ])
    Object.assign(stats, dash.stats)
    Object.assign(settings, dash.settings)
    providers.value = provs
    recentMessages.value = (logs || []).slice(0, 10)

  } catch (e: any) {
    console.error('Gagal memuat data:', e)
  } finally {
    loading.value = false
  }
}

loadData()
</script>
