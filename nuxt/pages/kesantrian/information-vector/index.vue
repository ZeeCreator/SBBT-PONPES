<template>
  <div>
    <div v-if="error" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ error }}</div>
    <div v-if="success" class="mb-stack-lg p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-label-md">{{ success }}</div>

    <!-- Mode List -->
    <template v-if="!selectedStudent">
      <div class="mb-stack-lg">
        <h2 class="font-display text-headline-lg text-primary">Pusat Informasi & Data</h2>
        <p class="text-on-surface-variant text-body-md">Cari dan kelola data santri, ustadz, dan guru dari satu tempat.</p>
      </div>

      <div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50 mb-stack-lg">
        <div class="p-stack-md border-b border-surface-variant/30 flex flex-wrap items-center gap-stack-md">
          <div class="flex items-center gap-2 flex-1 min-w-[200px]">
            <span class="material-symbols-outlined text-on-surface-variant">search</span>
            <input v-model="searchQuery" type="text" placeholder="Cari nama, NIS, NUPTK..." class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary outline-none flex-1" @input="onSearchInput" />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-label-sm text-on-surface-variant">Tipe:</label>
            <select v-model="filterType" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary">
              <option value="">Semua</option>
              <option value="students">Santri</option>
              <option value="teachers">Ustadz/Guru</option>
            </select>
          </div>
          <button class="p-2 hover:bg-surface-container-high rounded-lg transition-colors" @click="fetchAll" title="Refresh">
            <span class="material-symbols-outlined text-on-surface-variant" :class="{ 'animate-spin': loading }">refresh</span>
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-16">
        <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
        <p class="text-label-sm text-on-surface-variant mt-2">Memuat data...</p>
      </div>

      <template v-else>
        <div v-if="filteredStudents.length > 0 && (filterType === '' || filterType === 'students')" class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50 mb-stack-lg">
          <div class="p-stack-md border-b border-surface-variant/30 flex items-center justify-between">
            <h3 class="font-display text-title-lg text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">groups</span> Santri
              <span class="text-label-sm text-on-surface-variant font-normal">({{ filteredStudents.length }})</span>
            </h3>
            <NuxtLink to="/kesantrian/students" class="text-label-sm text-primary hover:underline">Kelola Santri</NuxtLink>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant w-10">#</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">NIS</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Kelas</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Gender</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-variant/30">
                <tr v-for="(s, i) in filteredStudents" :key="s.id" class="hover:bg-primary-fixed/5 transition-colors">
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ i + 1 }}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div v-if="s.photo" class="w-8 h-8 rounded-full overflow-hidden shrink-0">
                        <img :src="s.photo" alt="" class="w-full h-full object-cover" />
                      </div>
                      <div v-else class="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-[11px]">{{ getInitials(s.name) }}</div>
                      <p class="text-label-md font-medium cursor-pointer hover:text-primary" @click="selectStudent(s)">{{ s.name }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ s.nis || '-' }}</td>
                  <td class="px-4 py-3"><span class="bg-surface-container-low px-2 py-0.5 rounded text-label-sm">{{ s.class || '-' }}</span></td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ s.gender || '-' }}</td>
                  <td class="px-4 py-3">
                    <span :class="['px-2 py-0.5 text-[10px] font-bold rounded-full', s.status === 'Active' ? 'bg-primary-fixed text-on-primary-fixed' : s.status === 'On Leave' ? 'bg-amber-100 text-amber-700' : 'bg-surface-container text-on-surface-variant']">{{ s.status }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-1">
                      <button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Detail" @click="selectStudent(s)"><span class="material-symbols-outlined text-sm">visibility</span></button>
                      <button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit" @click="editStudent(s)"><span class="material-symbols-outlined text-sm">edit</span></button>
                      <button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus" @click="confirmDeleteStudent(s)"><span class="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="filteredTeachers.length > 0 && (filterType === '' || filterType === 'teachers')" class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50 mb-stack-lg">
          <div class="p-stack-md border-b border-surface-variant/30 flex items-center justify-between">
            <h3 class="font-display text-title-lg text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">badge</span> Ustadz / Guru
              <span class="text-label-sm text-on-surface-variant font-normal">({{ filteredTeachers.length }})</span>
            </h3>
            <NuxtLink to="/settings/teachers" class="text-label-sm text-primary hover:underline">Kelola Guru</NuxtLink>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low">
                <tr>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant w-10">#</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Nama</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">NUPTK</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Spesialisasi</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                  <th class="px-4 py-3 text-label-sm text-on-surface-variant">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-variant/30">
                <tr v-for="(t, i) in filteredTeachers" :key="t.id" class="hover:bg-secondary-fixed/5 transition-colors">
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ i + 1 }}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold text-[11px]">{{ getInitials(t.name) }}</div>
                      <div>
                        <p class="text-label-md font-medium">{{ t.name }}</p>
                        <p v-if="t.email" class="text-[10px] text-on-surface-variant">{{ t.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ t.nuptk || '-' }}</td>
                  <td class="px-4 py-3"><span class="bg-surface-container-low px-2 py-0.5 rounded text-label-sm">{{ t.specialization || '-' }}</span></td>
                  <td class="px-4 py-3">
                    <span class="flex items-center gap-1 text-label-sm" :class="t.status === 'active' ? 'text-green-600' : t.status === 'resigned' ? 'text-error' : 'text-on-surface-variant'">
                      <span class="w-1.5 h-1.5 rounded-full" :class="t.status === 'active' ? 'bg-green-500' : t.status === 'resigned' ? 'bg-error' : 'bg-outline'"></span>
                      {{ t.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-1">
                      <button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit" @click="editTeacher(t)"><span class="material-symbols-outlined text-sm">edit</span></button>
                      <button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus" @click="confirmDeleteTeacher(t)"><span class="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="!loading && filteredStudents.length === 0 && filteredTeachers.length === 0" class="text-center py-16 text-on-surface-variant">
          <span class="material-symbols-outlined text-4xl mb-3">search_off</span>
          <p class="text-label-md">Tidak ada data ditemukan</p>
        </div>
      </template>
    </template>

    <!-- Mode Detail Santri -->
    <template v-if="selectedStudent">
      <button class="flex items-center gap-1 text-label-sm text-primary hover:underline mb-stack-md" @click="backToList">
        <span class="material-symbols-outlined text-sm">arrow_back</span> Kembali
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
        <div class="lg:col-span-2 glass-card rounded-2xl p-6">
          <div class="flex flex-col md:flex-row gap-6">
            <div v-if="selectedStudent.photo" class="w-full md:w-48 aspect-[4/5] rounded-xl overflow-hidden shadow-md">
              <img :src="selectedStudent.photo" alt="" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-full md:w-48 aspect-[4/5] rounded-xl bg-primary-fixed/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-6xl text-primary">person</span>
            </div>
            <div class="flex-1 space-y-4">
              <div>
                <h2 class="font-display text-headline-md text-primary">{{ selectedStudent.name }}</h2>
                <p class="text-on-surface-variant text-label-md">NIS: {{ selectedStudent.nis || '-' }} &bull; {{ selectedStudent.class || '-' }}</p>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Gender</p><p class="text-title-sm font-bold">{{ selectedStudent.gender || '-' }}</p></div>
                <div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Kota</p><p class="text-title-sm font-bold">{{ selectedStudent.city || '-' }}</p></div>
                <div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Kamar</p><p class="text-title-sm font-bold">{{ selectedStudent.roomName || selectedStudent.dormitoryName || '-' }}</p></div>
                <div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Status</p><p class="text-title-sm font-bold">{{ selectedStudent.status || '-' }}</p></div>
                <div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Skor Disiplin</p><p class="text-title-sm font-bold" :class="(selectedStudent.disciplineScore ?? 100) >= 80 ? 'text-green-600' : (selectedStudent.disciplineScore ?? 100) >= 60 ? 'text-amber-600' : 'text-red-600'">{{ selectedStudent.disciplineScore ?? 100 }}</p></div>
              </div>
              <div class="p-3 bg-surface-container-low rounded-xl">
                <p class="text-[10px] uppercase text-on-surface-variant font-semibold mb-1">Alamat</p>
                <p class="text-label-md">{{ selectedStudent.address || '-' }}</p>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Orang Tua</p><p class="text-label-md font-bold">{{ selectedStudent.parentName || '-' }}</p></div>
                <div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">No. HP Orang Tua</p><p class="text-label-md font-bold">{{ selectedStudent.parentPhone || '-' }}</p></div>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card rounded-2xl p-6 space-y-3">
          <h3 class="font-display text-title-lg text-on-background">Aksi</h3>
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-primary text-on-primary rounded-xl text-label-md hover:brightness-110 transition-all" @click="printBiodata">
            <span class="material-symbols-outlined text-sm">print</span> Cetak Biodata
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-xl text-label-md hover:brightness-110 transition-all" @click="printGrades">
            <span class="material-symbols-outlined text-sm">grade</span> Cetak Nilai
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-surface-container-high text-on-surface rounded-xl text-label-md hover:brightness-110 transition-all" @click="printAllHistory">
            <span class="material-symbols-outlined text-sm">history</span> Cetak All Riwayat
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl text-label-md hover:brightness-110 transition-all border border-amber-200" @click="navigateToMutasi">
            <span class="material-symbols-outlined text-sm">swap_horiz</span> Cetak Surat Pindah
          </button>
          <hr class="border-outline-variant/20 my-2" />
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-primary-fixed/30 text-primary rounded-xl text-label-md hover:bg-primary-fixed/50 transition-all" @click="editStudent(selectedStudent)">
            <span class="material-symbols-outlined text-sm">edit</span> Edit Santri
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-error-container/30 text-error rounded-xl text-label-md hover:bg-error-container/50 transition-all" @click="confirmDeleteStudent(selectedStudent)">
            <span class="material-symbols-outlined text-sm">delete</span> Hapus Santri
          </button>
        </div>
      </div>

      <!-- Riwayat Absensi Bulanan -->
      <div class="glass-card rounded-2xl overflow-hidden mb-stack-lg">
        <div class="p-stack-md border-b border-outline-variant/20 flex items-center justify-between">
          <h3 class="font-display text-title-lg text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">calendar_month</span> Riwayat Absensi Bulanan
          </h3>
          <span class="text-label-sm text-on-surface-variant">{{ attendance.length }} bulan</span>
        </div>
        <div v-if="loadingAttendance" class="p-6 text-center text-on-surface-variant text-label-sm">Memuat...</div>
        <div v-else-if="attendance.length === 0" class="p-6 text-center text-on-surface-variant text-label-sm">Belum ada data absensi</div>
        <div v-else class="space-y-4 p-4">
          <div v-for="month in attendance" :key="month.monthId" class="border border-outline-variant/20 rounded-xl overflow-hidden">
            <div class="bg-surface-container-low px-4 py-2 flex items-center justify-between">
              <span class="text-label-sm font-bold">{{ month.monthLabel }}</span>
              <span class="text-label-xs text-on-surface-variant">Kelas: {{ month.className }}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="bg-surface-container-lowest">
                    <th class="px-2 py-1 text-[10px] text-on-surface-variant w-24">Nama</th>
                    <th v-for="d in 31" :key="d" class="px-0.5 py-1 text-[9px] text-on-surface-variant text-center" style="min-width:22px">{{ d }}</th>
                    <th class="px-2 py-1 text-[10px] text-on-surface-variant text-center w-16">Hadir</th>
                    <th class="px-2 py-1 text-[10px] text-on-surface-variant text-center w-12">S/I/A</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="divide-x divide-outline-variant/10">
                    <td class="px-2 py-1 text-label-xs font-medium">{{ month.student.name }}</td>
                    <td v-for="d in 31" :key="d" class="px-0.5 py-1 text-center">
                      <span :class="['inline-block w-5 h-5 rounded text-[9px] font-bold leading-5', dayClass(month.student.marks?.[String(d)])]">
                        {{ dayLabel(month.student.marks?.[String(d)]) }}
                      </span>
                    </td>
                    <td class="px-2 py-1 text-center text-label-xs font-bold text-green-600">{{ month.stats.hadir }}</td>
                    <td class="px-2 py-1 text-center text-label-xs">
                      <span class="text-amber-600">{{ month.stats.sakit }}</span>/
                      <span class="text-blue-600">{{ month.stats.izin }}</span>/
                      <span class="text-red-600">{{ month.stats.alpa }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Pelanggaran -->
      <div class="glass-card rounded-2xl overflow-hidden mb-stack-lg">
        <div class="p-stack-md border-b border-outline-variant/20 flex items-center justify-between">
          <h3 class="font-display text-title-lg text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-error">gavel</span> Pelanggaran
          </h3>
          <span class="text-label-sm text-on-surface-variant">{{ violations.length }} record</span>
        </div>
        <div v-if="loadingViolations" class="p-6 text-center text-on-surface-variant text-label-sm">Memuat...</div>
        <div v-else-if="violations.length === 0" class="p-6 text-center text-on-surface-variant text-label-sm">Tidak ada pelanggaran</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-surface-container-low">
              <tr>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Kategori</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Deskripsi</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Poin</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-variant/30">
              <tr v-for="v in violations" :key="v.id" class="hover:bg-red-50/30">
                <td class="px-4 py-3 text-label-md">{{ formatDate(v.timestamp) }}</td>
                <td class="px-4 py-3"><span class="bg-surface-container-low px-2 py-0.5 rounded text-label-sm">{{ v.category || v.type || '-' }}</span></td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ v.description || '-' }}</td>
                <td class="px-4 py-3"><span class="text-label-md font-bold text-error">-{{ v.pointsDeducted || 0 }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Nilai -->
      <div class="glass-card rounded-2xl overflow-hidden mb-stack-lg">
        <div class="p-stack-md border-b border-outline-variant/20 flex items-center justify-between">
          <h3 class="font-display text-title-lg text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">school</span> Nilai Akademik
          </h3>
          <span class="text-label-sm text-on-surface-variant">{{ grades.length }} record</span>
        </div>
        <div v-if="loadingGrades" class="p-6 text-center text-on-surface-variant text-label-sm">Memuat...</div>
        <div v-else-if="grades.length === 0" class="p-6 text-center text-on-surface-variant text-label-sm">Belum ada nilai</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-surface-container-low">
              <tr>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Sesi</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Mata Pelajaran</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Nilai</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Keterangan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-variant/30">
              <tr v-for="g in grades" :key="g.id" class="hover:bg-primary-fixed/5">
                <td class="px-4 py-3 text-label-sm text-on-surface-variant text-center font-semibold">{{ g.sesi ? `Imtihan ${g.sesi}` : '-' }}</td>
                <td class="px-4 py-3 text-label-md">{{ g.subject || '-' }}</td>
                <td class="px-4 py-3"><span class="text-label-md font-bold">{{ g.score ?? '-' }}</span></td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ g.date || '-' }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ g.notes || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="showDeleteModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-modal-enter p-6 text-center">
          <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-red-500 text-3xl">warning</span>
          </div>
          <h3 class="font-display text-title-lg mb-2">Konfirmasi Hapus</h3>
          <p class="text-label-md text-on-surface-variant mb-1">Yakin ingin menghapus?</p>
          <p class="font-bold text-body-md">{{ deleteTarget?.name }}</p>
          <div class="flex gap-3 mt-6">
            <button class="flex-1 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md" @click="showDeleteModal = false">Batal</button>
            <button class="flex-1 py-2 bg-error text-on-error rounded-lg text-label-md" @click="doDelete">Hapus</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'kesantrian', requiredRole: 'kesantrian' })

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const error = ref('')
const success = ref('')
const searchQuery = ref('')
const filterType = ref('')
const students = ref<any[]>([])
const teachers = ref<any[]>([])
const selectedStudent = ref<any>(null)
const showDeleteModal = ref(false)
const deleteTarget = ref<any>(null)
const deleteType = ref<'student' | 'teacher'>('student')

const attendance = ref<any[]>([])
const violations = ref<any[]>([])
const grades = ref<any[]>([])
const loadingAttendance = ref(false)
const loadingViolations = ref(false)
const loadingGrades = ref(false)

const filteredStudents = computed(() => {
  let result = students.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(s => (s.name || '').toLowerCase().includes(q) || (s.nis || '').toLowerCase().includes(q))
  }
  return result
})

const filteredTeachers = computed(() => {
  let result = teachers.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t => (t.name || '').toLowerCase().includes(q) || (t.nuptk || '').toLowerCase().includes(q))
  }
  return result
})

function getInitials(name: string) {
  return (name || 'A').split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase()
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    present: 'bg-green-100 text-green-700',
    sick: 'bg-amber-100 text-amber-700',
    permit: 'bg-blue-100 text-blue-700',
    absent: 'bg-red-100 text-red-700',
  }
  return map[status] || 'bg-surface-container text-on-surface-variant'
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    present: 'Hadir',
    sick: 'Sakit',
    permit: 'Izin',
    absent: 'Alpa',
  }
  return map[status] || status || '-'
}

function formatDate(ts: string) {
  if (!ts) return '-'
  return ts.split('T')[0]
}

function onSearchInput() {
  if (selectedStudent.value) {
    selectedStudent.value = null
  }
}

async function fetchAll() {
  loading.value = true
  error.value = ''
  try {
    const [sData, tData] = await Promise.all([
      $fetch('/api/students'),
      $fetch('/api/guru').catch(() => []),
    ])
    students.value = (sData || []).map((s: any) => ({
      ...s,
      initials: getInitials(s.name),
      photo: s.photo || '',
    }))
    teachers.value = tData || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

async function selectStudent(s: any) {
  selectedStudent.value = s
  await Promise.all([
    loadAttendance(s.id),
    loadViolations(s.id),
    loadGrades(s.id),
  ])
}

function backToList() {
  selectedStudent.value = null
  searchQuery.value = ''
  filterType.value = ''
}

async function loadAttendance(studentId: string) {
  loadingAttendance.value = true
  try {
    const { getIdToken } = useAuth()
    const token = await getIdToken()
    const res = await fetch('/api/attendance/monthly', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const allMonths: any[] = res.ok ? await res.json() : []
    const filtered = allMonths
      .filter((m: any) => (m.records || []).some((r: any) => r.studentId === studentId))
      .sort((a: any, b: any) => (b.monthId || '').localeCompare(a.monthId || ''))

    attendance.value = filtered.map((m: any) => {
      const student = (m.records || []).find((r: any) => r.studentId === studentId)
      const marks = student?.marks || {}
      let hadir = 0, sakit = 0, izin = 0, alpa = 0
      for (let d = 1; d <= 31; d++) {
        const v = marks[String(d)]
        if (v === 'present') hadir++
        else if (v === 'sick') sakit++
        else if (v === 'permit') izin++
        else if (v === 'absent') alpa++
      }
      const [y, mo] = (m.monthId || '').split('-')
      const monthLabel = mo ? new Date(parseInt(y), parseInt(mo) - 1).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : m.monthId
      return {
        monthId: m.monthId,
        monthLabel,
        className: m.class || '-',
        student: { ...(student || {}), marks, name: student?.name || 'Unknown' },
        stats: { hadir, sakit, izin, alpa },
      }
    })
  } catch { attendance.value = [] }
  finally { loadingAttendance.value = false }
}

function dayClass(status: string) {
  const map: Record<string, string> = {
    present: 'bg-green-100 text-green-700',
    sick: 'bg-amber-100 text-amber-700',
    permit: 'bg-blue-100 text-blue-700',
    absent: 'bg-red-100 text-red-700',
  }
  return map[status] || 'bg-surface-container-low text-on-surface-variant'
}

function dayLabel(status: string) {
  const map: Record<string, string> = {
    present: '✓',
    sick: 'S',
    permit: 'I',
    absent: 'A',
  }
  return map[status] || ''
}

async function loadViolations(studentId: string) {
  loadingViolations.value = true
  try {
    const data = await $fetch(`/api/students/${studentId}/violations`)
    violations.value = (data || []).sort((a: any, b: any) => ((b.timestamp || '') as string).localeCompare(a.timestamp || ''))
  } catch { violations.value = [] }
  finally { loadingViolations.value = false }
}

async function loadGrades(studentId: string) {
  loadingGrades.value = true
  try {
    const data = await $fetch(`/api/akademik/grades?studentId=${studentId}`)
    const allGrades: any[] = data || []

    const imtihanList = await $fetch('/api/akademik/imtihan').catch(() => [])
    if (imtihanList.length > 0) {
      const examDetails = await Promise.all(
        imtihanList.map((e: any) => $fetch(`/api/akademik/imtihan/${e.id}`).catch(() => null))
      )
      examDetails.filter(Boolean).forEach((exam: any) => {
        if (!exam.scores || !exam.scores[studentId]) return
        const existing = allGrades.find(g => g.subject === exam.subject)
        if (!existing) {
          allGrades.push({
            id: `imtihan_${exam.id}_${studentId}`,
            subject: exam.subject,
            score: Number(exam.scores[studentId].score) || 0,
            grade: '',
            semester: '-',
            academicYear: '-',
            date: exam.date || '',
            notes: exam.scores[studentId].notes || '',
            sesi: exam.sesi || '',
          })
        }
      })
    }

    grades.value = allGrades
  } catch { grades.value = [] }
  finally { loadingGrades.value = false }
}

function editStudent(s: any) {
  router.push('/kesantrian/students')
}

function editTeacher(t: any) {
  router.push('/settings/teachers')
}

function confirmDeleteStudent(s: any) {
  deleteTarget.value = s
  deleteType.value = 'student'
  showDeleteModal.value = true
}

function confirmDeleteTeacher(t: any) {
  deleteTarget.value = t
  deleteType.value = 'teacher'
  showDeleteModal.value = true
}

async function doDelete() {
  if (!deleteTarget.value) return
  try {
    if (deleteType.value === 'student') {
      await $fetch(`/api/students/${deleteTarget.value.id}`, { method: 'DELETE' })
      students.value = students.value.filter(s => s.id !== deleteTarget.value.id)
      if (selectedStudent.value?.id === deleteTarget.value.id) selectedStudent.value = null
      success.value = 'Santri berhasil dihapus'
      $fetch('/api/activity-logs', { method: 'POST', body: { action: 'Hapus Santri', description: `Santri ${deleteTarget.value.name} dihapus dari Pusat Informasi`, icon: 'person_remove', color: '#dc2626' } }).catch(() => {})
    } else {
      await $fetch(`/api/guru/${deleteTarget.value.id}`, { method: 'DELETE' })
      teachers.value = teachers.value.filter(t => t.id !== deleteTarget.value.id)
      success.value = 'Guru berhasil dihapus'
      $fetch('/api/activity-logs', { method: 'POST', body: { action: 'Hapus Guru', description: `Guru ${deleteTarget.value.name} dihapus dari Pusat Informasi`, icon: 'badge', color: '#dc2626' } }).catch(() => {})
    }
    showDeleteModal.value = false
    deleteTarget.value = null
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Gagal menghapus'
  }
  setTimeout(() => { success.value = '' }, 3000)
}

function navigateToMutasi() {
  router.push('/mutasi')
}

function printBiodata() {
  if (!selectedStudent.value) return
  const s = selectedStudent.value
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(`<!DOCTYPE html>
<html><head><title>Biodata - ${s.name}</title>
<style>
  @page { size: portrait; margin: 15mm; }
  body { font-family: 'Times New Roman', Times, serif; color: #000; font-size: 12pt; }
  .header { text-align: center; margin-bottom: 20px; }
  .header h1 { font-size: 18pt; margin: 0; }
  .header h2 { font-size: 14pt; margin: 5px 0; font-weight: normal; }
  .header p { font-size: 10pt; margin: 2px 0; }
  hr { border: none; border-top: 2px solid #000; margin: 10px 0; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 6px 8px; border: 1px solid #000; font-size: 11pt; }
  td.label { font-weight: bold; width: 35%; }
  .section-title { font-size: 13pt; font-weight: bold; margin: 15px 0 8px; }
  .footer { margin-top: 40px; display: flex; justify-content: space-around; text-align: center; font-size: 10pt; }
  .footer .line { margin-top: 50px; width: 150px; border-top: 1px solid #000; display: inline-block; }
</style></head><body>
<div class="header">
  <h1>BIODATA SANTRI</h1>
  <h2>YAYASAN PONDOK PESANTREN AL FATAH PANEKAN</h2>
  <p>Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</p>
</div>
<hr />
<div class="section-title">Data Pribadi</div>
<table>
  <tr><td class="label">Nama Lengkap</td><td>${s.name || '-'}</td></tr>
  <tr><td class="label">NIS</td><td>${s.nis || '-'}</td></tr>
  <tr><td class="label">Jenis Kelamin</td><td>${s.gender || '-'}</td></tr>
  <tr><td class="label">Tempat / Tgl Lahir</td><td>${s.birthPlace || '-'} / ${s.birthDate || '-'}</td></tr>
  <tr><td class="label">Kota Asal</td><td>${s.city || '-'}</td></tr>
  <tr><td class="label">Alamat</td><td>${s.address || '-'}</td></tr>
  <tr><td class="label">No. Telepon</td><td>${s.phone || '-'}</td></tr>
</table>
<div class="section-title">Data Pendidikan</div>
<table>
  <tr><td class="label">Kelas</td><td>${s.class || '-'}</td></tr>
  <tr><td class="label">Status</td><td>${s.status || '-'}</td></tr>
</table>
<div class="section-title">Data Orang Tua / Wali</div>
<table>
  <tr><td class="label">Nama Orang Tua</td><td>${s.parentName || '-'}</td></tr>
  <tr><td class="label">No. HP Orang Tua</td><td>${s.parentPhone || '-'}</td></tr>
</table>
<div class="footer">
  <div><p>Mengetahui,</p><p>Kepala Pondok</p><span class="line"></span></div>
</div>
<script>window.onload=function(){window.print()}<\/script>
</body></html>`)
  w.document.close()
}

function printGrades() {
  if (!selectedStudent.value || grades.value.length === 0) return
  const s = selectedStudent.value
  const w = window.open('', '_blank')
  if (!w) return
  const rows = grades.value.map(g => `<tr><td style="padding:4px 8px;border:1px solid #000">${g.subject || '-'}</td><td style="padding:4px 8px;border:1px solid #000;text-align:center">${g.score ?? '-'}</td><td style="padding:4px 8px;border:1px solid #000;text-align:center">${g.grade || '-'}</td><td style="padding:4px 8px;border:1px solid #000;text-align:center">${g.semester || '-'}</td><td style="padding:4px 8px;border:1px solid #000;text-align:center">${g.academicYear || '-'}</td></tr>`).join('')
  w.document.write(`<!DOCTYPE html>
<html><head><title>Nilai - ${s.name}</title>
<style>
  @page { size: portrait; margin: 15mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; }
  .header { text-align: center; margin-bottom: 15px; }
  .header h1 { font-size: 16pt; margin: 0; }
  .header p { font-size: 10pt; margin: 2px 0; }
  hr { border: none; border-top: 2px solid #000; margin: 10px 0; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #eee; padding: 6px 8px; border: 1px solid #000; font-size: 11pt; }
  td { padding: 4px 8px; border: 1px solid #000; font-size: 11pt; }
  .info { margin-bottom: 10px; font-size: 11pt; }
  .footer { margin-top: 40px; display: flex; justify-content: space-around; text-align: center; font-size: 10pt; }
  .footer .line { margin-top: 50px; width: 150px; border-top: 1px solid #000; display: inline-block; }
</style></head><body>
<div class="header"><h1>LAPORAN NILAI SANTRI</h1><p>YAYASAN PONDOK PESANTREN AL FATAH PANEKAN</p></div>
<hr />
<div class="info">Nama: <strong>${s.name}</strong> | NIS: ${s.nis || '-'} | Kelas: ${s.class || '-'}</div>
<table><thead><tr><th>Mata Pelajaran</th><th>Nilai</th><th>Grade</th><th>Semester</th><th>Tahun Ajaran</th></tr></thead><tbody>${rows}</tbody></table>
<div class="footer">
  <div><p>Mengetahui,</p><p>Kepala Pondok</p><span class="line"></span></div>
</div>
<script>window.onload=function(){window.print()}<\/script>
</body></html>`)
  w.document.close()
}

function printAllHistory() {
  if (!selectedStudent.value) return
  const s = selectedStudent.value
  const w = window.open('', '_blank')
  if (!w) return
  const dayLbl: Record<string, string> = { present: '✓', sick: 'S', permit: 'I', absent: 'A' }
  const attRows = attendance.value.length > 0
    ? attendance.value.map(m => {
        const cells = Array.from({ length: 31 }, (_, i) => {
          const s = m.student.marks?.[String(i + 1)]
          return `<td style="padding:1px 3px;border:1px solid #000;text-align:center;font-size:7pt">${dayLbl[s] || ''}</td>`
        }).join('')
        return `<tr><td style="padding:3px 6px;border:1px solid #000;font-size:8pt;font-weight:bold" colspan="34">${m.monthLabel}</td></tr>
<tr>${cells}</tr>`
      }).join('')
    : '<tr><td colspan="34" style="padding:8px;text-align:center;font-size:9pt">Tidak ada data</td></tr>'
  const vioRows = violations.value.length > 0 ? violations.value.map(v => `<tr><td style="padding:3px 6px;border:1px solid #000;font-size:9pt">${formatDate(v.timestamp)}</td><td style="padding:3px 6px;border:1px solid #000;font-size:9pt">${v.category || v.type || '-'}</td><td style="padding:3px 6px;border:1px solid #000;font-size:9pt;text-align:center">-${v.pointsDeducted || 0}</td></tr>`).join('') : '<tr><td colspan="3" style="padding:8px;text-align:center;font-size:9pt">Tidak ada pelanggaran</td></tr>'
  const gradeRows = grades.value.length > 0 ? grades.value.map(g => `<tr><td style="padding:3px 6px;border:1px solid #000;font-size:9pt">${g.subject || '-'}</td><td style="padding:3px 6px;border:1px solid #000;font-size:9pt;text-align:center">${g.score ?? '-'}</td><td style="padding:3px 6px;border:1px solid #000;font-size:9pt;text-align:center">${g.grade || '-'}</td><td style="padding:3px 6px;border:1px solid #000;font-size:9pt;text-align:center">${g.semester || '-'}</td><td style="padding:3px 6px;border:1px solid #000;font-size:9pt;text-align:center">${g.academicYear || '-'}</td></tr>`).join('') : '<tr><td colspan="5" style="padding:8px;text-align:center;font-size:9pt">Tidak ada nilai</td></tr>'
  w.document.write(`<!DOCTYPE html>
<html><head><title>Riwayat Lengkap - ${s.name}</title>
<style>
  @page { size: portrait; margin: 12mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; }
  .header { text-align: center; }
  .header h1 { font-size: 15pt; margin: 0; }
  .header p { font-size: 9pt; margin: 2px 0; }
  hr { border: none; border-top: 2px solid #000; margin: 6px 0; }
  h3 { font-size: 12pt; margin: 12px 0 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
  th { background: #eee; padding: 4px 6px; border: 1px solid #000; font-size: 9pt; }
  td { padding: 3px 6px; border: 1px solid #000; font-size: 9pt; }
  .biodata { margin-bottom: 10px; }
  .biodata td { padding: 2px 8px; font-size: 10pt; border: none; }
  .biodata td:first-child { font-weight: bold; width: 30%; }
  .footer { margin-top: 30px; display: flex; justify-content: space-around; text-align: center; font-size: 9pt; }
  .footer .line { margin-top: 40px; width: 140px; border-top: 1px solid #000; display: inline-block; }
</style></head><body>
<div class="header">
  <h1>RIWAYAT LENGKAP SANTRI</h1>
  <p>YAYASAN PONDOK PESANTREN AL FATAH PANEKAN</p>
</div>
<hr />
<table class="biodata">
  <tr><td>Nama</td><td>: ${s.name}</td><td>NIS</td><td>: ${s.nis || '-'}</td></tr>
  <tr><td>Kelas</td><td>: ${s.class || '-'}</td><td>Status</td><td>: ${s.status || '-'}</td></tr>
  <tr><td>Kota</td><td>: ${s.city || '-'}</td><td>Skor Disiplin</td><td>: ${s.disciplineScore ?? 100}</td></tr>
</table>
<h3>A. Riwayat Absensi Bulanan</h3>
<table style="font-size:7pt"><thead><tr><th style="padding:2px 4px;border:1px solid #000;text-align:center" colspan="34">Bulan / Tanggal (1-31)</th></tr></thead><tbody>${attRows}</tbody></table>
<h3>B. Riwayat Pelanggaran</h3>
<table><thead><tr><th>Tanggal</th><th>Kategori</th><th>Poin</th></tr></thead><tbody>${vioRows}</tbody></table>
<h3>C. Riwayat Nilai</h3>
<table><thead><tr><th>Mata Pelajaran</th><th>Nilai</th><th>Grade</th><th>Semester</th><th>Tahun Ajaran</th></tr></thead><tbody>${gradeRows}</tbody></table>
<div class="footer">
  <div><p>Mengetahui,</p><p>Kepala Pondok</p><span class="line"></span></div>
</div>
<script>window.onload=function(){window.print()}<\/script>
</body></html>`)
  w.document.close()
}

onMounted(async () => {
  await fetchAll()
  const q = route.query.q as string
  if (q && q.trim()) {
    searchQuery.value = q.trim()
    const match = students.value.find(s => s.name?.toLowerCase() === q.trim().toLowerCase())
    if (match) {
      await selectStudent(match)
    }
  }
})
</script>
