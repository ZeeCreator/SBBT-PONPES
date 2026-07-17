<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="flex items-center justify-between mb-stack-lg">
      <div>
        <h2 class="font-display text-headline-lg text-primary">Catatan & Todos</h2>
        <p class="text-body-md text-on-surface-variant">Kelola catatan dan tugas untuk dipantau.</p>
      </div>
      <button class="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="openAdd">
        <span class="material-symbols-outlined text-sm">add</span> Tambah Catatan
      </button>
    </div>

    <div v-if="message" class="mb-stack-md p-4 rounded-xl text-label-sm font-medium" :class="message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">{{ message }}</div>

    <div v-if="loading" class="text-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
      <p class="text-label-sm text-on-surface-variant mt-2">Memuat data...</p>
    </div>

    <div v-else-if="todos.length === 0" class="glass-card rounded-2xl p-12 text-center">
      <span class="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">checklist</span>
      <p class="text-title-md text-on-surface-variant">Belum ada catatan</p>
      <p class="text-label-sm text-on-surface-variant/60 mt-1">Klik "Tambah Catatan" untuk membuat catatan baru.</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="todo in todos" :key="todo.id" class="glass-card rounded-2xl p-gutter transition-all hover:shadow-md" :class="todo.done ? 'opacity-60' : ''">
        <div class="flex items-start gap-4">
          <button class="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0" :class="todo.done ? 'bg-primary border-primary text-on-primary' : 'border-outline-variant hover:border-primary'" @click="toggleDone(todo)">
            <span v-if="todo.done" class="material-symbols-outlined text-xs">check</span>
          </button>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <p class="text-body-md font-semibold" :class="todo.done ? 'line-through text-on-surface-variant' : 'text-on-surface'">{{ todo.title }}</p>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" :class="priorityClass(todo.priority)">{{ todo.priority }}</span>
            </div>
            <p v-if="todo.description" class="text-label-sm text-on-surface-variant mb-2">{{ todo.description }}</p>
            <div class="flex items-center gap-3 text-[11px] text-on-surface-variant/60">
              <span>{{ todo.createdAt ? new Date(todo.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-' }}</span>
              <span v-if="todo.done && todo.updatedAt">Selesai: {{ new Date(todo.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) }}</span>
            </div>
          </div>
          <button class="p-1.5 text-on-surface-variant hover:text-error transition-colors shrink-0" @click="deleteTodo(todo.id)">
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter">
          <div class="bg-primary px-gutter py-stack-md flex justify-between items-center">
            <h3 class="font-display text-headline-md text-on-primary">{{ editingId ? 'Edit Catatan' : 'Tambah Catatan' }}</h3>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form @submit.prevent="saveTodo" class="p-gutter space-y-4">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Judul <span class="text-error">*</span></label>
              <input v-model="form.title" type="text" required class="w-full bg-surface-container-low border-none rounded-lg text-body-md p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Judul catatan" />
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Deskripsi</label>
              <textarea v-model="form.description" class="w-full bg-surface-container-low border-none rounded-lg text-body-md p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Deskripsi (opsional)" rows="3"></textarea>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Prioritas</label>
              <select v-model="form.priority" class="w-full bg-surface-container-low border-none rounded-lg text-body-md p-3 outline-none focus:ring-2 focus:ring-primary">
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" @click="showModal = false">Batal</button>
              <button type="submit" class="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 active:scale-95 transition-all">{{ saving ? 'Menyimpan...' : editingId ? 'Update' : 'Simpan' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'wali-santri', requiredRole: 'wali_santri' })

const { user } = useAuth()
const todos = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const showModal = ref(false)
const editingId = ref('')

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
})

function priorityClass(p: string) {
  const map: Record<string, string> = { low: 'bg-blue-100 text-blue-700', medium: 'bg-amber-100 text-amber-700', high: 'bg-red-100 text-red-700' }
  return map[p] || map.medium
}

async function fetchTodos() {
  loading.value = true
  try {
    const uid = user.value?.uid
    if (!uid) { todos.value = []; return }
    todos.value = await $fetch(`/api/todos?uid=${uid}`)
  } catch { todos.value = [] } finally { loading.value = false }
}

function openAdd() {
  editingId.value = ''
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  showModal.value = true
}

async function saveTodo() {
  saving.value = true
  try {
    const uid = user.value?.uid
    if (!uid) return
    if (editingId.value) {
      await $fetch(`/api/todos/${editingId.value}`, { method: 'PUT', body: { title: form.title, description: form.description, priority: form.priority } })
      message.value = '✅ Catatan diperbarui'
    } else {
      await $fetch('/api/todos', { method: 'POST', body: { uid, title: form.title, description: form.description, priority: form.priority } })
      message.value = '✅ Catatan ditambahkan'
    }
    showModal.value = false
    await fetchTodos()
  } catch (e: any) {
    message.value = `❌ Gagal: ${e.data?.statusMessage || e.message}`
  } finally { saving.value = false }
  setTimeout(() => { message.value = '' }, 4000)
}

async function toggleDone(todo: any) {
  try {
    await $fetch(`/api/todos/${todo.id}`, { method: 'PUT', body: { done: !todo.done } })
    todo.done = !todo.done
  } catch (e: any) {
    message.value = `❌ Gagal: ${e.message}`
  }
}

async function deleteTodo(id: string) {
  if (!confirm('Hapus catatan ini?')) return
  try {
    await $fetch(`/api/todos/${id}`, { method: 'DELETE' })
    message.value = '✅ Catatan dihapus'
    await fetchTodos()
  } catch (e: any) {
    message.value = `❌ Gagal: ${e.message}`
  }
  setTimeout(() => { message.value = '' }, 4000)
}

onMounted(fetchTodos)
</script>
