<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg">
      <h2 class="font-display text-headline-lg text-primary">System Settings & RBAC Control</h2>
      <p class="text-on-surface-variant text-body-md">Manage system configuration, user roles, and permissions.</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-gutter">
      <div class="lg:col-span-1 space-y-gutter">
        <div class="glass-card rounded-xl p-4 shadow-sm">
          <nav class="space-y-1">
            <a v-for="tab in tabs" :key="tab.id" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer"
              :class="activeTab === tab.id ? 'bg-primary-fixed/30 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'"
              @click="activeTab = tab.id">
              <span class="material-symbols-outlined text-sm">{{ tab.icon }}</span>
              <span class="text-label-md">{{ tab.label }}</span>
            </a>
          </nav>
        </div>
      </div>
      <div class="lg:col-span-3 space-y-gutter">
        <div v-if="activeTab === 'roles'" class="glass-card rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="font-display text-title-lg text-primary">Role Management</h3>
              <p class="text-label-md text-on-surface-variant">Configure user roles and access permissions (Firebase Custom Claims)</p>
            </div>
            <button class="bg-primary-container text-on-primary px-4 py-2 rounded-lg text-label-md hover:bg-primary transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">add</span> Add Role
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="role in roles" :key="role.name" class="p-5 rounded-xl bg-surface-container-low border border-white">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div :class="['w-10 h-10 rounded-full flex items-center justify-center', role.bg]">
                    <span class="material-symbols-outlined" :class="role.iconColor">{{ role.icon }}</span>
                  </div>
                  <div>
                    <p class="text-label-md font-bold">{{ role.name }}</p>
                    <p class="text-[11px] text-on-surface-variant">{{ role.description }}</p>
                  </div>
                </div>
                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="role.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-surface-container text-on-surface-variant'">
                  {{ role.status }}
                </span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="permission in role.permissions" :key="permission"
                  class="px-2 py-1 bg-white rounded text-[10px] text-on-surface-variant border border-outline-variant/30">
                  {{ permission }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'users'" class="glass-card rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-display text-title-lg text-primary">User Management</h3>
            <button class="bg-primary-container text-on-primary px-4 py-2 rounded-lg text-label-md hover:bg-primary transition-all flex items-center gap-2" @click="showAddUser = true">
              <span class="material-symbols-outlined text-sm">person_add</span> Add User
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">User</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Email</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Role</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">UID</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10">
                <tr v-for="user in fbUsers" :key="user.uid" class="hover:bg-primary-fixed/5 transition-colors">
                  <td class="px-4 py-3 text-label-md font-medium">{{ user.displayName || '-' }}</td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ user.email }}</td>
                  <td class="px-4 py-3">
                    <select v-model="user.role" class="bg-surface-container-low border border-outline-variant/30 rounded px-2 py-1 text-[10px] font-bold focus:ring-primary" @change="updateUserRole(user)">
                      <option value="super_admin">Super Admin</option>
                      <option value="bendahara">Bendahara</option>
                      <option value="kesantrian">Kesantrian</option>
                      <option value="wali_santri">Wali Santri</option>
                    </select>
                  </td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant/50 font-mono text-[10px]">{{ user.uid.substring(0, 12) }}...</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <button class="text-primary text-label-sm hover:underline" @click="openRoleModal(user)">Set Role</button>
                      <button v-if="user.uid === 'YjTj0ZiMo5en1EfhgpOW4L8csJv1'" class="text-secondary text-label-sm font-bold flex items-center gap-1">
                        <span class="material-symbols-outlined text-xs">verified</span> Owner
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="loadingUsers" class="text-center py-8 text-on-surface-variant text-label-sm">Loading users...</p>
            <p v-if="!loadingUsers && fbUsers.length === 0" class="text-center py-8 text-on-surface-variant text-label-sm">No users found</p>
          </div>
        </div>
        <div v-if="activeTab === 'guru'" class="glass-card rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="font-display text-title-lg text-primary">Manage Teachers</h3>
              <p class="text-label-md text-on-surface-variant">CRUD data ustadz/guru pengajar</p>
            </div>
            <NuxtLink to="/settings/teachers" class="bg-primary-container text-on-primary px-4 py-2 rounded-lg text-label-md hover:bg-primary transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">add</span> Manage Teachers
            </NuxtLink>
          </div>
          <p class="text-on-surface-variant text-label-sm">Guru management page tersedia di halaman terpisah.</p>
        </div>
        <div v-if="activeTab === 'firebase'" class="glass-card rounded-xl p-6 shadow-sm">
          <h3 class="font-display text-title-lg text-primary mb-4">Firebase Security Rules</h3>
          <div class="p-4 rounded-xl bg-primary-container/5 border border-primary-container/20 mb-4">
            <pre class="text-label-sm text-on-surface leading-relaxed overflow-x-auto"><code>// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Students collection
    match /students/{studentId} {
      allow read: if request.auth != null
        && (request.auth.token.role == 'super_admin'
        || request.auth.token.role == 'kesantrian'
        || request.auth.token.role == 'bendahara'
        || (request.auth.token.role == 'wali_santri'
            && request.auth.token.studentId == studentId));

      allow write: if request.auth != null
        && (request.auth.token.role == 'super_admin'
        || request.auth.token.role == 'kesantrian');

      // Sub-collections
      match /grades/{gradeId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null
          && request.auth.token.role == 'super_admin';
      }

      match /violations/{violationId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null
          && (request.auth.token.role == 'super_admin'
          || request.auth.token.role == 'kesantrian');
      }
    }

    // Payments & Invoices
    match /invoices/{invoiceId} {
      allow read: if request.auth != null
        && (request.auth.token.role == 'super_admin'
        || request.auth.token.role == 'bendahara');
      allow write: if request.auth != null
        && (request.auth.token.role == 'super_admin'
        || request.auth.token.role == 'bendahara');
    }

    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && (request.auth.token.role == 'super_admin'
        || request.auth.token.role == 'bendahara');
    }
  }
}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add User Modal -->
  <Teleport to="body">
    <div v-if="showAddUser" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showAddUser = false">
      <div class="bg-surface rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-display text-title-lg text-primary">Tambah User Baru</h3>
          <button class="text-on-surface-variant hover:text-on-surface" @click="showAddUser = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form @submit.prevent="handleAddUser" class="space-y-4">
          <div class="space-y-1">
            <label class="text-label-md text-on-surface-variant">Nama Lengkap</label>
            <input v-model="addForm.name" type="text" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-label-md text-on-surface-variant">Email</label>
            <input v-model="addForm.email" type="email" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-label-md text-on-surface-variant">Password</label>
            <input v-model="addForm.password" type="password" required minlength="6" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-label-md text-on-surface-variant">Role</label>
            <select v-model="addForm.role" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none">
              <option value="super_admin">Super Admin</option>
              <option value="bendahara">Bendahara</option>
              <option value="kesantrian">Kesantrian</option>
              <option value="wali_santri">Wali Santri</option>
            </select>
          </div>
          <button type="submit" :disabled="addingUser" class="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-body-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            <span v-if="addingUser" class="material-symbols-outlined animate-spin text-sm">refresh</span>
            {{ addingUser ? 'Mendaftarkan...' : 'Daftarkan User' }}
          </button>
          <p v-if="addError" class="text-error text-label-sm text-center">{{ addError }}</p>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const activeTab = ref('roles')
const showAddUser = ref(false)
const fbUsers = ref<any[]>([])
const loadingUsers = ref(true)
const addingUser = ref(false)
const addError = ref('')
const addForm = reactive({
  name: '',
  email: '',
  password: '',
  role: 'wali_santri',
})

const tabs = [
  { id: 'roles', label: 'Roles & Permissions', icon: 'admin_panel_settings' },
  { id: 'users', label: 'User Management', icon: 'people' },
  { id: 'guru', label: 'Manage Teachers', icon: 'school' },
  { id: 'firebase', label: 'Security Rules', icon: 'security' },
]

const roles = [
  { name: 'Super Admin', description: 'Full system access', icon: 'admin_panel_settings', bg: 'bg-primary-fixed', iconColor: 'text-primary', status: 'Active',
    permissions: ['Read all collections', 'Write all collections', 'Manage users', 'Firebase console', 'System config'] },
  { name: 'Bendahara', description: 'Financial management', icon: 'payments', bg: 'bg-secondary-fixed', iconColor: 'text-secondary', status: 'Active',
    permissions: ['Read payments', 'Write payments', 'Read invoices', 'Write invoices', 'Midtrans integration'] },
  { name: 'Kesantrian', description: 'Student & discipline', icon: 'gavel', bg: 'bg-error-container', iconColor: 'text-error', status: 'Active',
    permissions: ['Read students', 'Write students', 'Read violations', 'Write violations', 'Attendance'] },
  { name: 'Wali Santri', description: 'Parent/guardian read-only', icon: 'family_history', bg: 'bg-surface-container-high', iconColor: 'text-primary', status: 'Active',
    permissions: ['Read own child data', 'Read payments', 'Read grades', 'Read attendance', 'No write access'] },
]

// --- User Management ---

async function fetchUsers() {
  loadingUsers.value = true
  try {
    const { getIdToken } = useAuth()
    const token = await getIdToken()
    const res = await fetch('/api/auth/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      fbUsers.value = await res.json()
    }
  } catch (e) {
    console.error('Failed to fetch users:', e)
  } finally {
    loadingUsers.value = false
  }
}

async function updateUserRole(user: any) {
  const { getIdToken } = useAuth()
  const token = await getIdToken()
  await fetch('/api/auth/set-role', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ uid: user.uid, role: user.role }),
  })
}

function openRoleModal(user: any) {
  // Inline role editing via the select dropdown
}

async function handleAddUser() {
  addError.value = ''
  addingUser.value = true
  try {
    const { getIdToken } = useAuth()
    const token = await getIdToken()
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        email: addForm.email,
        password: addForm.password,
        displayName: addForm.name,
        role: addForm.role,
      }),
    })
    if (res.ok) {
      showAddUser.value = false
      addForm.name = ''
      addForm.email = ''
      addForm.password = ''
      addForm.role = 'wali_santri'
      await fetchUsers()
    } else {
      const err = await res.json()
      addError.value = err.message || 'Gagal mendaftarkan user'
    }
  } catch (e: any) {
    addError.value = e.message || 'Network error'
  } finally {
    addingUser.value = false
  }
}

watch(activeTab, (tab) => {
  if (tab === 'users') fetchUsers()
})
</script>
