<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <NuxtLink to="/wa-gateway" class="inline-flex items-center gap-1 text-primary text-label-md hover:underline mb-2">
        <span class="material-symbols-outlined text-sm">arrow_back</span> Kembali
      </NuxtLink>
      <h2 class="font-display text-headline-lg text-primary">Log Pengiriman</h2>
      <p class="text-on-surface-variant text-body-md">Riwayat pengiriman pesan WhatsApp</p>
    </div>

    <div class="glass-card rounded-xl p-5 shadow-sm mb-stack-lg">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="space-y-1">
          <label class="text-label-sm text-on-surface-variant">Status</label>
          <select v-model="filters.status" class="bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-label-sm focus:ring-primary outline-none">
            <option value="">Semua</option>
            <option value="sent">Terkirim</option>
            <option value="delivered">Delivered</option>
            <option value="read">Read</option>
            <option value="failed">Gagal</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-label-sm text-on-surface-variant">Tipe</label>
          <select v-model="filters.type" class="bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-label-sm focus:ring-primary outline-none">
            <option value="">Semua</option>
            <option value="single">Tunggal</option>
            <option value="broadcast">Broadcast</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-label-sm text-on-surface-variant">Nomor Telepon</label>
          <input v-model="filters.phone" type="text" placeholder="Cari nomor..." class="bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-label-sm focus:ring-primary outline-none" />
        </div>
        <button @click="loadLogs" class="bg-primary-container text-primary px-4 py-2 rounded-lg text-label-sm hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">search</span> Cari
        </button>
        <button @click="resetFilters" class="text-on-surface-variant text-label-sm hover:text-on-surface px-3 py-2">Reset</button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-on-surface-variant">Memuat log...</div>

    <template v-else>
      <BulkActionBar :selected-count="selectedCount" @clear="clearSelection">
        <template #actions>
          <button @click="bulkResend" class="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-label-sm hover:brightness-110 transition-all">
            <span class="material-symbols-outlined text-sm">refresh</span> Kirim Ulang
          </button>
        </template>
      </BulkActionBar>

      <div class="glass-card rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-surface-container-low">
              <tr>
                <th class="px-4 py-4 w-10"><input type="checkbox" :checked="allSelected" @change="toggleAll" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Telepon</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Pesan</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tipe</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Pengirim</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              <tr v-for="msg in messages" :key="msg.id" class="hover:bg-primary-fixed/5 transition-colors">
                <td class="px-4 py-4"><input type="checkbox" :checked="isSelected(msg.id)" @change="toggleOne(msg.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /></td>
                <td class="px-4 py-3 text-label-md font-mono">{{ msg.phone }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant max-w-xs truncate">{{ msg.message }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="statusClass(msg.status)">{{ msg.status }}</span>
                </td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ msg.type }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ msg.sentByName || '-' }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ formatDate(msg.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="messages.length === 0" class="text-center py-12 text-on-surface-variant text-label-sm">Belum ada data pengiriman</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useTableSelection } from '~/composables/useTableSelection'
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => messages)

definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })
const { getLogs, sendMessage } = useWaGateway()

const loading = ref(true)
const messages = ref<any[]>([])
const filters = reactive({ status: '', type: '', phone: '' })

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
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function resetFilters() {
  filters.status = ''
  filters.type = ''
  filters.phone = ''
  loadLogs()
}

async function loadLogs() {
  loading.value = true
  try {
    const q: Record<string, string> = {}
    if (filters.status) q.status = filters.status
    if (filters.type) q.type = filters.type
    if (filters.phone) q.phone = filters.phone
    messages.value = await getLogs(q)
  } catch (e) {
    console.error('Gagal memuat log:', e)
  } finally {
    loading.value = false
  }
}

async function bulkResend() {
  const items = messages.value.filter((m: any) => selected.value.includes(m.id))
  if (items.length === 0) return
  if (!confirm(`Kirim ulang ${items.length} pesan?`)) return

  for (const item of items) {
    try {
      await sendMessage(item.phone, item.message)
    } catch (e) {
      console.error('Gagal kirim ulang:', item.id, e)
    }
  }
  clearSelection()
  await loadLogs()
}

loadLogs()
</script>
