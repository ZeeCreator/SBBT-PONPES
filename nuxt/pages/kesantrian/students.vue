<template>
  <div>
    <div v-if="error" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ error }}</div>
    <div v-if="success" class="mb-stack-lg p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-label-md">{{ success }}</div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
      <div v-for="stat in stats" :key="stat.label" :class="['glass-card p-stack-md rounded-xl shadow-sm', stat.border]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-on-surface-variant text-label-md">{{ stat.label }}</span>
          <span class="material-symbols-outlined" :class="stat.iconColor">{{ stat.icon }}</span>
        </div>
        <p class="font-display text-headline-md" :class="stat.valueColor">{{ stat.value }}</p>
        <div class="flex items-center gap-1 mt-1">
          <span v-if="stat.badge" :class="['text-[10px] px-1.5 py-0.5 rounded-full', stat.badgeClass]">{{ stat.badge }}</span>
          <span class="text-on-surface-variant text-[10px]">{{ stat.subtext }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-stack-md mb-stack-md">
      <div>
        <h2 class="font-display text-headline-md text-primary">Database Santri</h2>
        <p class="text-on-surface-variant text-body-md">Kelola data santri terintegrasi dengan master data kelas, kamar, dan guru.</p>
      </div>
      <div class="flex items-center gap-stack-sm">
        <button class="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-label-md transition-all shadow-md hover:brightness-110 active:scale-95" @click="openAddModal">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Santri
        </button>
        <button class="flex items-center gap-2 px-4 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg text-label-md transition-all shadow-md hover:brightness-110 active:scale-95" @click="showViolationModal = true">
          <span class="material-symbols-outlined text-sm">add_alert</span> Tambah Pelanggaran
        </button>
      </div>
    </div>

    <div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50">
      <div class="p-stack-md border-b border-surface-variant/30 flex flex-wrap items-center gap-stack-md">
        <div class="flex items-center gap-2">
          <label class="text-label-sm text-on-surface-variant">Kelas:</label>
          <select v-model="filterClass" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3">
            <option value="">Semua Kelas</option>
            <option v-for="cls in classList" :key="cls.id || cls" :value="cls.name || cls">{{ cls.name || cls }}</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-label-sm text-on-surface-variant">Kamar:</label>
          <select v-model="filterDormitory" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3">
            <option value="">Semua Kamar</option>
            <option v-for="d in dormitories" :key="d.id" :value="d.name">{{ d.name }}</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-label-sm text-on-surface-variant">Status:</label>
          <select v-model="filterStatus" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3">
            <option value="">Semua Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Alumni">Alumni</option>
          </select>
        </div>
        <div class="flex items-center gap-2 ml-auto">
          <input v-model="searchQuery" type="text" placeholder="Cari santri..." class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary-container w-48" />
          <button class="p-2 hover:bg-surface-container-high rounded-lg transition-colors" @click="fetchStudents" title="Refresh">
            <span class="material-symbols-outlined text-on-surface-variant" :class="{ 'animate-spin': loading }">refresh</span>
          </button>
        </div>
      </div>

      <div v-if="selectedStudents.length > 0" class="px-stack-md py-3 bg-primary-fixed/20 border-b border-surface-variant/30 flex items-center gap-4">
        <span class="text-label-sm font-semibold text-primary">{{ selectedStudents.length }} santri terpilih</span>
        <button class="text-label-sm bg-error text-on-error px-3 py-1.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-1" @click="confirmBulkDelete">
          <span class="material-symbols-outlined text-sm">delete</span> Hapus
        </button>
        <button class="text-label-sm bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-1" @click="bulkSetActive">
          <span class="material-symbols-outlined text-sm">check_circle</span> Set Active
        </button>
        <button class="text-label-sm bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-1" @click="bulkSetOnLeave">
          <span class="material-symbols-outlined text-sm">pause_circle</span> Set On Leave
        </button>
        <button class="ml-auto text-label-sm text-on-surface-variant hover:text-primary flex items-center gap-1" @click="selectedStudents = []">
          <span class="material-symbols-outlined text-sm">close</span> Batal
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-4 py-4 text-label-md text-on-surface-variant w-10">
                <input type="checkbox" :checked="selectedStudents.length === filteredStudents.length && filteredStudents.length > 0" @change="toggleAllStudents" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
              </th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Santri</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">NIS</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Kelas</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Kamar</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Gender</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Skor Disiplin</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th>
              <th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-variant/30">
            <tr v-if="loading">
              <td colspan="9" class="px-6 py-12 text-center text-on-surface-variant text-label-md">
                <span class="material-symbols-outlined animate-spin align-middle mr-2">refresh</span> Memuat data...
              </td>
            </tr>
            <tr v-else-if="filteredStudents.length === 0">
              <td colspan="9" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Tidak ada data santri</td>
            </tr>
            <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-primary-container/5 transition-colors group" :class="{ 'bg-primary-fixed/10': selectedStudent?.id === student.id }">
              <td class="px-4 py-4">
                <input type="checkbox" :checked="selectedStudents.includes(student.id)" @change="toggleStudent(student.id)" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div v-if="student.photo" class="w-9 h-9 rounded-full overflow-hidden shrink-0">
                    <img :src="student.photo" alt="" class="w-full h-full object-cover" />
                  </div>
                  <div v-else :class="['w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0', student.avatarBg]">
                    {{ student.initials }}
                  </div>
                  <div>
                    <p class="text-label-md text-on-surface font-medium cursor-pointer hover:text-primary" @click="selectStudent(student)">{{ student.name }}</p>
                    <p class="text-[11px] text-on-surface-variant">{{ student.city || '-' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ student.nis || '-' }}</td>
              <td class="px-6 py-4">
                <span class="bg-surface-container-low px-2 py-0.5 rounded text-label-sm text-on-surface-variant">{{ student.class || '-' }}</span>
              </td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ student.roomName || student.dormitoryName || '-' }}</td>
              <td class="px-6 py-4 text-label-md text-on-surface-variant">{{ student.gender || '-' }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-1.5 w-20 bg-surface-container-highest rounded-full overflow-hidden">
                    <div :class="['h-full rounded-full', student.scoreBar]" :style="{ width: student.score + '%' }"></div>
                  </div>
                  <span :class="['text-label-sm font-bold', student.scoreColor]">{{ student.score }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider', student.statusClass]">{{ student.status }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1">
                  <button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit" @click="openEditModal(student)">
                    <span class="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus" @click="confirmDelete(student)">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-surface-variant/30 flex items-center justify-between">
        <span class="text-on-surface-variant text-label-md">{{ filteredStudents.length }} dari {{ students.length }} santri</span>
      </div>
    </div>

    <div v-if="selectedStudent" class="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-stack-lg">
      <div class="lg:col-span-2 glass-card rounded-2xl p-gutter flex flex-col md:flex-row gap-gutter">
        <div class="md:w-1/3">
          <div v-if="selectedStudent.photo" class="w-full aspect-[4/5] rounded-xl shadow-lg overflow-hidden">
            <img :src="selectedStudent.photo" alt="" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-full aspect-[4/5] rounded-xl shadow-lg bg-primary-fixed/30 flex items-center justify-center">
            <span class="material-symbols-outlined text-6xl text-primary">person</span>
          </div>
        </div>
        <div class="md:w-2/3 space-y-stack-md">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-display text-headline-md text-primary">{{ selectedStudent.name }}</h3>
              <p class="text-on-surface-variant text-label-md">NIS: {{ selectedStudent.nis || '-' }} &bull; {{ selectedStudent.class || '-' }}</p>
            </div>
            <span :class="['px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider', selectedStudent.score < 60 ? 'bg-error-container text-on-error-container' : 'bg-primary-fixed text-on-primary-fixed']">
              Skor: {{ selectedStudent.score }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-stack-md">
            <div class="p-3 bg-surface-container-low rounded-xl">
              <p class="text-[10px] uppercase text-on-surface-variant font-semibold">Kota</p>
              <p class="text-title-sm font-bold text-primary">{{ selectedStudent.city || '-' }}</p>
            </div>
            <div class="p-3 bg-surface-container-low rounded-xl">
              <p class="text-[10px] uppercase text-on-surface-variant font-semibold">Gender</p>
              <p class="text-title-sm font-bold text-on-background">{{ selectedStudent.gender || '-' }}</p>
            </div>
            <div class="p-3 bg-surface-container-low rounded-xl">
              <p class="text-[10px] uppercase text-on-surface-variant font-semibold">Kamar</p>
              <p class="text-title-sm font-bold text-primary">{{ selectedStudent.roomName || selectedStudent.dormitoryName || '-' }}</p>
            </div>
          </div>
          <div class="space-y-2">
            <p class="text-label-sm text-on-surface-variant uppercase">Info</p>
            <p class="text-label-md text-on-surface">Status: <span class="font-bold">{{ selectedStudent.status }}</span></p>
            <p class="text-label-md text-on-surface">Skor Disiplin: <span class="font-bold" :class="selectedStudent.score >= 80 ? 'text-green-600' : selectedStudent.score >= 60 ? 'text-amber-600' : 'text-red-600'">{{ selectedStudent.score }}</span></p>
            <p class="text-label-md text-on-surface">Orang Tua: <span class="font-medium">{{ selectedStudent.parentName || '-' }} ({{ selectedStudent.parentPhone || '-' }})</span></p>
          </div>
          <div class="pt-2 flex gap-3">
            <button class="flex-1 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all" @click="openEditModal(selectedStudent)">Edit Santri</button>
            <button class="flex-1 py-2 border border-red-500 text-red-600 rounded-lg text-label-md hover:bg-red-50 transition-all" @click="confirmDelete(selectedStudent)">Hapus</button>
          </div>
        </div>
      </div>
      <div class="glass-card rounded-2xl p-gutter space-y-stack-md">
        <h3 class="font-display text-title-lg text-on-background flex items-center justify-between">
          Statistik Disiplin
          <span class="material-symbols-outlined text-on-surface-variant text-sm">info</span>
        </h3>
        <div v-for="stat in disciplineStats" :key="stat.label" class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-label-md text-on-surface-variant">{{ stat.label }}</p>
            <span :class="['font-bold', stat.color]">{{ stat.rating }}</span>
          </div>
          <div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div :class="['h-full rounded-full', stat.barColor]" :style="{ width: stat.value + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit Santri -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm overflow-y-auto py-10" @click.self="closeModal">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-modal-enter my-auto">
          <div class="bg-primary px-gutter py-stack-md flex justify-between items-center">
            <div class="text-on-primary">
              <h2 class="font-display text-headline-md">{{ isEditing ? 'Edit Santri' : 'Tambah Santri' }}</h2>
              <p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Terintegrasi Master Data</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="p-gutter space-y-stack-md max-h-[70vh] overflow-y-auto" @submit.prevent="saveStudent">
            <div class="flex items-center gap-4 mb-2">
              <div class="relative group cursor-pointer" @click="triggerPhotoUpload">
                <div v-if="form.photo" class="w-[100px] h-[100px] rounded-full overflow-hidden shadow-md border-2 border-primary-fixed">
                  <img :src="form.photo" alt="foto" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-[100px] h-[100px] rounded-full bg-primary-fixed/30 flex items-center justify-center shadow-md border-2 border-dashed border-primary-fixed group-hover:border-primary transition-colors">
                  <span class="material-symbols-outlined text-3xl text-primary-fixed">add_a_photo</span>
                </div>
                <div class="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                  <span class="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">camera_alt</span>
                </div>
              </div>
              <div class="flex-1">
                <p class="text-label-sm text-on-surface-variant">Foto Santri <span class="text-on-surface-variant/60">(opsional)</span></p>
                <p class="text-[10px] text-on-surface-variant/60">Klik untuk upload. Foto akan di-crop 100x100.</p>
                <input ref="photoInput" type="file" accept="image/*" class="hidden" @change="handlePhotoUpload" />
                <button v-if="form.photo" type="button" class="mt-2 text-label-xs text-error hover:underline" @click="removePhoto">Hapus Foto</button>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Nama Santri <span class="text-error">*</span></label>
                <input v-model="form.name" type="text" required class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Nama lengkap" />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">NIS <span class="text-xs text-on-surface-variant">(otomatis)</span></label>
                <input v-model="form.nis" type="text" disabled class="w-full bg-surface-container-low border-none rounded-lg text-body-md p-3 outline-none opacity-60 cursor-not-allowed" :placeholder="isEditing ? 'Nomor induk' : 'Akan digenerate otomatis'" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Kelas <span class="text-error">*</span></label>
              <select v-if="classes.length > 0" v-model="form.classId" required class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="">-- Pilih Kelas --</option>
                <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }} ({{ cls.level || '' }}{{ cls.group || '' }})</option>
              </select>
              <input v-else v-model="form.className" type="text" required class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Ketik nama kelas, contoh: Kelas 10 - Al-Azhar" />
            </div>

            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Gender</label>
                <select v-model="form.gender" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Gedung/Kamar</label>
                <select v-if="dormitories.length > 0" v-model="form.dormitoryId" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" @change="onDormitoryChange">
                  <option value="">-- Pilih Gedung --</option>
                  <option v-for="d in dormitories" :key="d.id" :value="d.id">{{ d.name }} ({{ d.gender || '-' }})</option>
                </select>
                <input v-else v-model="form.dormitoryName" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Ketik nama gedung/kamar" />
              </div>
            </div>

            <div v-if="form.dormitoryId && rooms.length > 0" class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Kamar</label>
              <select v-model="form.roomId" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="">-- Pilih Kamar --</option>
                <option v-for="r in rooms" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Kota Asal</label>
                <input v-model="form.city" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Kota" />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">No. Telepon</label>
                <input v-model="form.phone" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="No. HP" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Alamat</label>
              <textarea v-model="form.address" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Alamat lengkap" rows="2"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Nama Orang Tua / Wali</label>
                <input v-model="form.parentName" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Nama orang tua" />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">No. HP Orang Tua</label>
                <input v-model="form.parentPhone" type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="No. HP orang tua" />
              </div>
            </div>

            <div v-if="isEditing" class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Status</label>
              <select v-model="form.status" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>

            <div class="flex justify-end gap-stack-sm pt-stack-sm border-t border-outline-variant/20">
              <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="closeModal">Batal</button>
              <button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2" type="submit" :disabled="saving">
                <span v-if="saving" class="material-symbols-outlined animate-spin text-sm">refresh</span>
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Pelanggaran -->
      <div v-if="showViolationModal" class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showViolationModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter">
          <div class="bg-secondary-container px-gutter py-stack-md flex justify-between items-center">
            <div class="text-on-secondary-container">
              <h2 class="font-display text-headline-md">Tambah Pelanggaran</h2>
              <p class="text-[11px] text-on-secondary-container opacity-80 uppercase tracking-widest">Kesantrian Module</p>
            </div>
            <button class="text-on-secondary-container/60 hover:text-on-secondary-container p-2" @click="showViolationModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="p-gutter space-y-stack-md" @submit.prevent="submitViolation">
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Pilih Santri <span class="text-error">*</span></label>
              <select v-model="violationForm.studentId" required class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                <option value="">-- Pilih Santri --</option>
                <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }} ({{ s.class || '-' }})</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-stack-md">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Tipe Pelanggaran</label>
                <select v-model="violationForm.type" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option value="Ringan">Ringan</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Berat">Berat</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Kategori</label>
                <select v-model="violationForm.category" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none">
                  <option value="Kedisiplinan">Kedisiplinan</option>
                  <option value="Ibadah">Ibadah</option>
                  <option value="Kebersihan">Kebersihan</option>
                  <option value="Akhlak">Akhlak</option>
                </select>
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-label-md text-on-surface-variant">Deskripsi Pelanggaran</label>
              <textarea v-model="violationForm.description" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Deskripsi kejadian..." rows="3"></textarea>
            </div>
            <div class="flex items-center gap-2 p-3 bg-secondary-fixed/30 border border-secondary-container/20 rounded-xl">
              <span class="material-symbols-outlined text-secondary">info</span>
              <p class="text-label-sm text-on-secondary-fixed-variant leading-tight">Pelanggaran akan mengurangi skor disiplin santri secara otomatis.</p>
            </div>
            <div class="flex justify-end gap-stack-sm pt-stack-sm">
              <button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="showViolationModal = false">Batal</button>
              <button class="px-8 py-2.5 bg-secondary-container text-on-secondary-container text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2" type="submit" :disabled="violationSaving">
                <span v-if="violationSaving" class="material-symbols-outlined animate-spin text-sm">refresh</span>
                {{ violationSaving ? 'Menyimpan...' : 'Submit' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Hapus Massal -->
      <div v-if="showBulkDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showBulkDeleteModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter">
          <div class="p-6 text-center">
            <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
            </div>
            <h3 class="font-display text-title-lg text-on-surface mb-2">Hapus {{ selectedStudents.length }} Santri</h3>
            <p class="text-on-surface-variant text-label-md">Yakin ingin menghapus {{ selectedStudents.length }} santri terpilih? Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="showBulkDeleteModal = false">Batal</button>
            <button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm flex items-center gap-2" @click="doBulkDelete" :disabled="deleting">
              <span v-if="deleting" class="material-symbols-outlined animate-spin text-sm">refresh</span>
              {{ deleting ? 'Menghapus...' : 'Hapus Semua' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Hapus -->
      <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm" @click.self="showDeleteModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter">
          <div class="p-6 text-center">
            <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
            </div>
            <h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Santri</h3>
            <p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus santri berikut?</p>
            <p class="font-bold text-on-surface text-body-md">{{ deleteTarget?.name }}</p>
            <p v-if="deleteTarget?.class || deleteTarget?.roomName" class="text-label-sm text-on-surface-variant mt-1">{{ deleteTarget?.class }} &bull; {{ deleteTarget?.roomName || deleteTarget?.dormitoryName || '-' }}</p>
          </div>
          <div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all" @click="showDeleteModal = false">Batal</button>
            <button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm flex items-center gap-2" @click="doDelete" :disabled="deleting">
              <span v-if="deleting" class="material-symbols-outlined animate-spin text-sm">refresh</span>
              {{ deleting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'kesantrian', requiredRole: 'kesantrian' })

const students = ref<any[]>([])
const classes = ref<any[]>([])
const dormitories = ref<any[]>([])
const teachers = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const success = ref('')
const showModal = ref(false)
const showViolationModal = ref(false)
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const violationSaving = ref(false)
const deleting = ref(false)
const deleteTarget = ref<any>(null)
const selectedStudent = ref<any>(null)
const selectedStudents = ref<string[]>([])
const photoInput = ref<HTMLInputElement | null>(null)

const filterClass = ref('')
const filterDormitory = ref('')
const filterStatus = ref('')
const searchQuery = ref('')

const violationForm = reactive({
  studentId: '',
  type: 'Ringan',
  category: 'Kedisiplinan',
  description: '',
})

const form = reactive({
  id: '',
  name: '',
  nis: '',
  classId: '',
  className: '',
  gender: 'Laki-laki',
  dormitoryId: '',
  dormitoryName: '',
  roomId: '',
  roomName: '',
  city: '',
  phone: '',
  address: '',
  parentName: '',
  parentPhone: '',
  status: 'Active',
  photo: '',
})

const rooms = computed(() => {
  if (!form.dormitoryId) return []
  const dorm = dormitories.value.find(d => d.id === form.dormitoryId)
  if (!dorm) return []
  if (dorm.rooms && typeof dorm.rooms === 'object' && !Array.isArray(dorm.rooms)) {
    return Object.entries(dorm.rooms).map(([id, val]: any) => ({ id, ...(typeof val === 'string' ? { name: val } : val) }))
  }
  if (Array.isArray(dorm.rooms)) {
    return dorm.rooms.map((r: any) => typeof r === 'string' ? { id: r, name: r } : r)
  }
  return []
})

const classList = computed(() => classes.value)

const filteredStudents = computed(() => {
  let result = students.value
  if (filterClass.value) result = result.filter(s => s.class === filterClass.value)
  if (filterDormitory.value) result = result.filter(s => s.dormitoryName === filterDormitory.value)
  if (filterStatus.value) result = result.filter(s => s.status === filterStatus.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(s => (s.name || '').toLowerCase().includes(q) || (s.nis || '').toLowerCase().includes(q))
  }
  return result
})

const stats = computed(() => {
  const total = students.value.length
  const active = students.value.filter(s => s.status === 'Active').length
  const kelas = new Set(students.value.map(s => s.class).filter(Boolean)).size
  return [
    { label: 'Total Santri', icon: 'groups', value: String(total), badge: `${active} aktif`, badgeClass: 'bg-primary-fixed text-on-primary-fixed', subtext: 'terdaftar', iconColor: 'text-primary', valueColor: 'text-primary', border: '' },
    { label: 'Rata-rata Skor', icon: 'gavel', value: total ? Math.round(students.value.reduce((sum, s) => sum + (s.score || 0), 0) / total) + '%' : '-', badge: '', badgeClass: '', subtext: '', iconColor: 'text-secondary', valueColor: 'text-secondary', border: '' },
    { label: 'Keaktifan', icon: 'how_to_reg', value: total ? `${Math.round(active / total * 100)}%` : '-', badge: '', badgeClass: '', subtext: '', iconColor: 'text-tertiary-container', valueColor: 'text-on-background', border: '' },
    { label: 'Total Kelas', icon: 'school', value: String(kelas), badge: '', badgeClass: '', subtext: 'kelas aktif', iconColor: 'text-error', valueColor: 'text-on-background', border: 'border-l-4 border-secondary-container' },
  ]
})

const disciplineStats = computed(() => {
  const total = students.value.length
  if (!total) return []
  const avg = students.value.reduce((sum, s) => sum + (s.score || 100), 0) / total
  return [
    { label: 'Kedisiplinan', rating: avg >= 80 ? 'Baik' : avg >= 60 ? 'Cukup' : 'Kurang', value: Math.round(avg), color: avg >= 80 ? 'text-primary' : avg >= 60 ? 'text-secondary' : 'text-error', barColor: avg >= 80 ? 'bg-primary-container' : avg >= 60 ? 'bg-secondary-container' : 'bg-error' },
    { label: 'Kepatuhan', rating: avg >= 75 ? 'Baik' : 'Perlu Perbaikan', value: Math.round(Math.min(100, avg + 5)), color: 'text-secondary', barColor: 'bg-secondary-container' },
    { label: 'Partisipasi', rating: 'Aktif', value: Math.round(Math.min(100, avg + 10)), color: 'text-primary', barColor: 'bg-primary-container' },
  ]
})

async function loadMasterData() {
  try {
    const [clsData, dormData, guruData] = await Promise.all([
      $fetch('/api/master-data/classes'),
      $fetch('/api/master-data/dormitories'),
      $fetch('/api/guru').catch(() => []),
    ])
    classes.value = clsData || []
    dormitories.value = (dormData || []).map((d: any) => ({
      ...d,
      rooms: d.rooms && typeof d.rooms === 'object' && !Array.isArray(d.rooms)
        ? Object.entries(d.rooms).map(([id, val]: any) => ({ id, ...(typeof val === 'string' ? { name: val } : val) }))
        : (Array.isArray(d.rooms) ? d.rooms : []),
    }))
    teachers.value = guruData || []
  } catch (e: any) {
    error.value = 'Gagal memuat data master: ' + (e.message || 'Unknown error')
    console.error('Gagal load master data:', e)
  }
}

async function fetchStudents() {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/students')
    students.value = (data || []).map((s: any) => ({
      ...s,
      initials: (s.name || '').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
      avatarBg: s.gender === 'Perempuan' ? 'bg-secondary-fixed text-secondary' : 'bg-primary-fixed-dim text-primary',
      score: s.disciplineScore ?? 100,
      scoreBar: (s.disciplineScore ?? 100) >= 80 ? 'bg-primary-container' : (s.disciplineScore ?? 100) >= 60 ? 'bg-secondary-container' : 'bg-error',
      scoreColor: (s.disciplineScore ?? 100) >= 80 ? 'text-primary-container' : (s.disciplineScore ?? 100) >= 60 ? 'text-secondary' : 'text-error',
      statusClass: s.status === 'Active' ? 'bg-primary-fixed text-on-primary-fixed' : s.status === 'On Leave' ? 'bg-amber-100 text-amber-700' : 'bg-surface-container text-on-surface-variant',
      photo: s.photo || '',
    }))
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data santri'
  } finally {
    loading.value = false
  }
}

function selectStudent(student: any) {
  selectedStudent.value = student
}

function toggleStudent(id: string) {
  if (selectedStudents.value.includes(id)) {
    selectedStudents.value = selectedStudents.value.filter(s => s !== id)
  } else {
    selectedStudents.value.push(id)
  }
}

function toggleAllStudents() {
  const ids = filteredStudents.value.map(s => s.id)
  if (selectedStudents.value.length === ids.length && ids.length > 0) {
    selectedStudents.value = []
  } else {
    selectedStudents.value = [...ids]
  }
}

function confirmBulkDelete() {
  if (selectedStudents.value.length === 0) return
  showBulkDeleteModal.value = true
}

async function doBulkDelete() {
  if (selectedStudents.value.length === 0) return
  deleting.value = true
  error.value = ''
  try {
    await Promise.all(selectedStudents.value.map(id =>
      $fetch(`/api/students/${id}`, { method: 'DELETE' })
    ))
    success.value = `${selectedStudents.value.length} santri berhasil dihapus`
    selectedStudents.value = []
    showBulkDeleteModal.value = false
    if (selectedStudent.value && selectedStudents.value.includes(selectedStudent.value.id)) {
      selectedStudent.value = null
    }
    await fetchStudents()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus'
  } finally {
    deleting.value = false
  }
  setTimeout(() => { success.value = '' }, 3000)
}

async function bulkSetActive() {
  if (selectedStudents.value.length === 0) return
  error.value = ''
  try {
    await Promise.all(selectedStudents.value.map(id =>
      $fetch(`/api/students/${id}`, { method: 'PUT', body: { status: 'Active' } })
    ))
    success.value = `${selectedStudents.value.length} santri diubah ke Active`
    selectedStudents.value = []
    await fetchStudents()
  } catch (e: any) {
    error.value = e.message || 'Gagal mengubah status'
  }
  setTimeout(() => { success.value = '' }, 3000)
}

async function bulkSetOnLeave() {
  if (selectedStudents.value.length === 0) return
  error.value = ''
  try {
    await Promise.all(selectedStudents.value.map(id =>
      $fetch(`/api/students/${id}`, { method: 'PUT', body: { status: 'On Leave' } })
    ))
    success.value = `${selectedStudents.value.length} santri diubah ke On Leave`
    selectedStudents.value = []
    await fetchStudents()
  } catch (e: any) {
    error.value = e.message || 'Gagal mengubah status'
  }
  setTimeout(() => { success.value = '' }, 3000)
}

function triggerPhotoUpload() {
  photoInput.value?.click()
}

function removePhoto() {
  form.photo = ''
}

function handlePhotoUpload(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  const file = input.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const size = Math.min(img.width, img.height)
      const offsetX = (img.width - size) / 2
      const offsetY = (img.height - size) / 2
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 100, 100)
      form.photo = canvas.toDataURL('image/jpeg', 0.9)
    }
    img.src = reader.result as string
  }
  reader.readAsDataURL(file)
  input.value = ''
}

function onDormitoryChange() {
  form.roomId = ''
  form.roomName = ''
  const dorm = dormitories.value.find(d => d.id === form.dormitoryId)
  form.dormitoryName = dorm?.name || ''
}

function openAddModal() {
  isEditing.value = false
  Object.assign(form, {
    id: '', name: '', nis: '', classId: '', className: '', gender: 'Laki-laki',
    dormitoryId: '', dormitoryName: '', roomId: '', roomName: '',
    city: '', phone: '', address: '',
    parentName: '', parentPhone: '', status: 'Active', photo: '',
  })
  showModal.value = true
}

function openEditModal(student: any) {
  isEditing.value = true
  const cls = classes.value.find(c => c.id === student.classId || c.name === student.class)
  const dorm = dormitories.value.find(d => d.id === student.dormitoryId || d.name === student.dormitoryName)
  const roomId = student.roomId || student.roomName || ''
  Object.assign(form, {
    id: student.id,
    name: student.name || '',
    nis: student.nis || '',
    classId: cls?.id || student.classId || '',
    className: student.class || '',
    gender: student.gender || 'Laki-laki',
    dormitoryId: dorm?.id || student.dormitoryId || '',
    dormitoryName: dorm?.name || student.dormitoryName || '',
    roomId,
    roomName: student.roomName || student.roomId || '',
    city: student.city || '',
    phone: student.phone || '',
    address: student.address || '',
    parentName: student.parentName || '',
    parentPhone: student.parentPhone || '',
    status: student.status || 'Active',
    photo: student.photo || '',
  })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  success.value = ''
}

async function saveStudent() {
  error.value = ''
  success.value = ''

  if (!form.name) {
    error.value = 'Nama santri harus diisi'
    return
  }
  if (!form.classId && !form.className) {
    error.value = 'Kelas harus diisi'
    return
  }

  saving.value = true

  const cls = classes.value.find(c => c.id === form.classId)
  const dorm = dormitories.value.find(d => d.id === form.dormitoryId)
  const room = rooms.value.find((r: any) => r.id === form.roomId)
  const roomName = room ? (room.name || room) : form.roomName

  const body = {
    name: form.name,
    nis: form.nis,
    class: cls?.name || form.className,
    classId: form.classId,
    gender: form.gender,
    dormitoryId: form.dormitoryId,
    dormitoryName: dorm?.name || form.dormitoryName,
    roomId: form.roomId,
    roomName,
    city: form.city,
    phone: form.phone,
    address: form.address,
    parentName: form.parentName,
    parentPhone: form.parentPhone,
    status: form.status || 'Active',
    photo: form.photo || '',
  }

  try {
    if (isEditing.value) {
      await $fetch(`/api/students/${form.id}`, { method: 'PUT', body })
      success.value = 'Data santri berhasil diperbarui'
    } else {
      await $fetch('/api/students', { method: 'POST', body })
      success.value = 'Santri baru berhasil ditambahkan'
    }
    showModal.value = false
    await fetchStudents()
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Gagal menyimpan data santri'
    console.error('Save student error:', e)
  } finally {
    saving.value = false
  }
  setTimeout(() => { success.value = '' }, 3000)
}

function confirmDelete(student: any) {
  deleteTarget.value = student
  showDeleteModal.value = true
}

async function doDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  error.value = ''
  success.value = ''
  try {
    await $fetch(`/api/students/${deleteTarget.value.id}`, { method: 'DELETE' })
    success.value = 'Santri berhasil dihapus'
    showDeleteModal.value = false
    const deletedId = deleteTarget.value.id
    deleteTarget.value = null
    if (selectedStudent.value?.id === deletedId) {
      selectedStudent.value = null
    }
    await fetchStudents()
  } catch (e: any) {
    error.value = e.message || 'Gagal menghapus santri'
  } finally {
    deleting.value = false
  }
  setTimeout(() => { success.value = '' }, 3000)
}

async function submitViolation() {
  if (!violationForm.studentId) return
  violationSaving.value = true
  error.value = ''
  success.value = ''
  try {
    const student = students.value.find(s => s.id === violationForm.studentId)
    await $fetch(`/api/students/${violationForm.studentId}/violations`, {
      method: 'POST',
      body: {
        ...violationForm,
        studentName: student?.name || '',
        reportedBy: 'System',
      },
    })
    success.value = 'Pelanggaran berhasil dicatat'
    showViolationModal.value = false
    violationForm.studentId = ''
    violationForm.description = ''
    await fetchStudents()
  } catch (e: any) {
    error.value = e.message || 'Gagal mencatat pelanggaran'
  } finally {
    violationSaving.value = false
  }
  setTimeout(() => { success.value = '' }, 3000)
}

onMounted(() => {
  loadMasterData()
  fetchStudents()
})
</script>
