<template>
  <div class="px-gutter max-w-container-max mx-auto" style="padding-top: 6rem; padding-bottom: 3rem;">
    <div class="mb-stack-lg flex flex-wrap items-center justify-between gap-stack-md">
      <div>
        <button class="text-label-sm text-primary hover:underline mb-1 flex items-center gap-1" @click="navigateTo('/akademik/imtihan')">
          <span class="material-symbols-outlined text-sm">arrow_back</span> Kembali
        </button>
        <h2 class="font-display text-headline-lg text-primary capitalize">{{ type }} - {{ className }}</h2>
        <p class="text-on-surface-variant text-body-md">{{ type === 'imtihan' ? 'Kelola jadwal dan nilai ujian per sesi' : 'Catatan iktibar harian santri' }}</p>
      </div>
      <div v-if="type === 'imtihan'" class="flex flex-wrap items-center gap-3">
        <div class="flex flex-wrap items-center gap-2 bg-surface-container-low rounded-xl px-2 py-2 border border-outline-variant/10">
          <select v-model="selectedStudentId" class="bg-white border border-outline-variant/20 rounded-lg text-label-sm py-1.5 px-2 focus:ring-primary max-w-[170px]">
            <option value="">-- Pilih Santri --</option>
            <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <select v-model="selectedPrintSesi" class="bg-white border border-outline-variant/20 rounded-lg text-label-sm py-1.5 px-2 focus:ring-primary">
            <option value="">Semua Sesi</option>
            <option v-for="sk in sesiKeys" :key="sk" :value="sk">Sesi {{ sk }}</option>
          </select>
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-tertiary text-on-tertiary rounded-lg text-label-sm shadow hover:brightness-110 disabled:opacity-40" :disabled="!selectedStudentId" @click="selectedPrintSesi ? printSantriPerSesi() : printNilaiSantri()" :title="selectedPrintSesi ? `Cetak per santri sesi ${selectedPrintSesi}` : 'Cetak semua sesi per santri'">
            <span class="material-symbols-outlined text-[16px]">badge</span> {{ selectedPrintSesi ? `Cetak Sesi ${selectedPrintSesi}` : 'Cetak Per Santri' }}
          </button>
          <button v-if="selectedStudentId && selectedPrintSesi" class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-label-sm shadow hover:brightness-110" @click="printSantriPerSesi()" title="Cetak per santri per sesi (detail)">
            <span class="material-symbols-outlined text-[16px]">description</span> Per Santri + Per Sesi
          </button>
        </div>
        <button class="flex items-center gap-2 px-5 py-2.5 bg-secondary text-on-secondary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="printRanking">
          <span class="material-symbols-outlined text-sm">leaderboard</span> Ranking Semua Sesi
        </button>
        <button class="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all" @click="openAddModal()">
          <span class="material-symbols-outlined text-sm">add</span> Tambah Ujian
        </button>
      </div>
    </div>
    <div v-if="error" class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">{{ error }}</div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
    </div>

    <template v-else-if="type === 'imtihan'">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
        <div v-for="s in examStats" :key="s.label" class="glass-card p-stack-md rounded-xl shadow-sm text-center">
          <p class="font-display text-headline-md" :class="s.color">{{ s.value }}</p>
          <p class="text-label-sm text-on-surface-variant">{{ s.label }}</p>
        </div>
      </div>

      <!-- Card per SESI IMTIHAN -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <div v-for="sesi in sesiKeys" :key="sesi" class="glass-card rounded-2xl shadow-sm overflow-hidden border border-outline-variant/20 flex flex-col">
          <!-- Card Header (all selector) -->
          <div class="px-5 py-4 flex items-center justify-between gap-3" :class="sesiHeaderClass(sesi)">
            <div class="flex items-center gap-3">
              <label v-if="(groupedExams[sesi] || []).length" class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" :checked="allSelected(sesi)" class="w-4 h-4 accent-primary rounded" @change="toggleAllSesi(sesi)" />
              </label>
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-label-md" :class="sesiBadgeClass(sesi)">
                {{ sesi }}
              </div>
              <div>
                <h3 class="font-display text-title-md text-primary leading-none">SESI IMTIHAN {{ sesi }}</h3>
                <p class="text-label-sm text-on-surface-variant">{{ (groupedExams[sesi] || []).length }} mata pelajaran <span v-if="selectedCount(sesi)">• <span class="font-bold text-primary">{{ selectedCount(sesi) }} terpilih</span></span></p>
              </div>
            </div>
            <div class="flex items-center gap-1.5">
              <span v-if="(groupedExams[sesi] || []).length" class="hidden sm:inline text-[11px] text-on-surface-variant mr-1">{{ allSelected(sesi) ? 'Batal pilih' : 'Pilih semua' }}</span>
              <button class="p-2 rounded-lg bg-white/80 hover:bg-white text-primary shadow-sm transition-colors" title="Print sesi ini" @click="printSesi(sesi)" :disabled="(groupedExams[sesi] || []).length === 0">
                <span class="material-symbols-outlined text-[18px]">print</span>
              </button>
              <button class="p-2 rounded-lg bg-primary text-on-primary hover:brightness-110 shadow-sm transition-all" title="Tambah mapel ke sesi ini" @click="openAddModal(sesi)">
                <span class="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>

          <!-- Bulk bar per sesi (muncul jika ada yang terpilih) -->
          <div v-if="selectedCount(sesi) > 0" class="px-4 py-2.5 bg-primary-fixed/10 border-y border-primary/10 flex flex-wrap items-center gap-2">
            <span class="text-label-sm font-semibold text-primary">{{ selectedCount(sesi) }} mapel terpilih</span>
            <div class="flex flex-wrap items-center gap-1.5 ml-1">
              <button class="px-3 py-1.5 bg-error text-on-error rounded-full text-[11px] font-bold hover:brightness-110 flex items-center gap-1" @click="bulkDeleteSesi(sesi)">
                <span class="material-symbols-outlined text-[14px]">delete</span> Hapus
              </button>
              <div class="flex items-center gap-1 bg-white rounded-full border border-outline-variant/20 px-1 py-0.5">
                <select v-model="bulkTargetSesi[sesi]" class="bg-transparent text-[11px] py-1 px-2 outline-none">
                  <option value="">Pindah ke...</option>
                  <option v-for="sk in sesiKeys" :key="sk" :value="sk" :disabled="String(sk)===String(sesi)">Sesi {{ sk }}</option>
                </select>
                <button class="px-2.5 py-1 bg-secondary text-on-secondary rounded-full text-[11px] font-bold hover:brightness-110" @click="bulkMoveSesi(sesi)">Pindah</button>
              </div>
              <button class="px-2.5 py-1.5 bg-surface-container-high rounded-full text-[11px] font-semibold hover:bg-surface-container" @click="clearSelection(sesi)">Bersihkan</button>
            </div>
          </div>

          <!-- Card Body -->
          <div class="flex-1">
            <div v-if="(groupedExams[sesi] || []).length === 0" class="py-10 px-6 text-center">
              <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-3">
                <span class="material-symbols-outlined text-on-surface-variant">menu_book</span>
              </div>
              <p class="text-label-md text-on-surface-variant mb-3">Belum ada mata pelajaran di sesi ini</p>
              <button class="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-sm hover:brightness-110 transition-all" @click="openAddModal(sesi)">
                + Tambah Mata Pelajaran
              </button>
            </div>
            <div v-else class="divide-y divide-outline-variant/10">
              <div v-for="(exam, idx) in groupedExams[sesi]" :key="exam.id" class="flex items-center gap-3 px-4 py-3 hover:bg-primary-fixed/5 transition-colors group" :class="isSelected(sesi, exam.id) ? 'bg-primary-fixed/10' : ''">
                <input type="checkbox" :checked="isSelected(sesi, exam.id)" class="w-4 h-4 accent-primary rounded shrink-0" @change="toggleOne(sesi, exam.id)" />
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" :class="isSelected(sesi, exam.id) ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'">{{ idx + 1 }}</span>
                <div class="flex-1 min-w-0 cursor-pointer" @click="toggleOne(sesi, exam.id)">
                  <p class="text-label-md font-medium truncate" :class="isSelected(sesi, exam.id) ? 'text-primary' : ''">{{ exam.subject }}</p>
                  <p class="text-[11px] text-on-surface-variant">{{ exam.date || '-' }} • {{ exam.duration || '-' }} menit <span v-if="exam.averageScore || exam.avgComputed">• Avg {{ exam.averageScore || exam.avgComputed }}</span></p>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <button class="w-8 h-8 rounded-lg bg-primary-fixed/30 hover:bg-primary-fixed/60 text-primary flex items-center justify-center transition-colors" title="Input / Lihat Nilai" @click="navigateTo(`/akademik/imtihan/${kelas}/nilai/${exam.id}`)">
                    <span class="material-symbols-outlined text-[16px]">edit_square</span>
                  </button>
                  <button class="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors" title="Hapus" @click="deleteExam(exam.id)">
                    <span class="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div v-if="(groupedExams[sesi] || []).length > 0" class="px-4 py-2.5 bg-surface-container-low/50 border-t border-outline-variant/10 flex items-center justify-between gap-2">
            <span class="text-[11px] text-on-surface-variant">{{ (groupedExams[sesi] || []).length }} mapel • {{ sesiStats(sesi).avgText }} <span v-if="selectedCount(sesi)" class="text-primary font-bold">• {{ selectedCount(sesi) }} dipilih</span></span>
            <div class="flex items-center gap-1.5">
              <button v-if="selectedStudentId" class="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-emerald-200" @click="printSantriPerSesi(sesi)">
                <span class="material-symbols-outlined text-[14px]">person</span> Per Santri
              </button>
              <button class="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1" @click="printSesi(sesi)">
                <span class="material-symbols-outlined text-[14px]">print</span> Sesi {{ sesi }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Jika belum ada sesi sama sekali -->
      <div v-if="sesiKeys.length === 0 && exams.length > 0" class="mt-gutter glass-card rounded-xl p-6 text-center text-on-surface-variant text-label-md">
        Tidak ada sesi — data ujian belum memiliki field sesi.
      </div>
    </template>

    <template v-else>
      <div class="mb-stack-lg flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-on-surface-variant">calendar_today</span>
          <input type="date" v-model="iktibarDate" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary" />
        </div>
        <input v-model="iktibarSearch" class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary flex-1 max-w-xs" placeholder="Cari santri..." />
      </div>
      <div class="glass-card rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-surface-container-low">
              <tr>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Santri</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Catatan Iktibar</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant">Tanggal</th>
                <th class="px-4 py-3 text-label-sm text-on-surface-variant text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              <tr v-for="item in filteredIktibar" :key="item.id" class="hover:bg-primary-fixed/5 transition-colors">
                <td class="px-4 py-3 text-label-md font-medium">{{ item.santri }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant max-w-xs truncate">{{ item.catatan }}</td>
                <td class="px-4 py-3 text-label-sm text-on-surface-variant">{{ item.date }}</td>
                <td class="px-4 py-3 text-center">
                  <button class="text-primary hover:text-primary-fixed mr-2 transition-colors" @click="editIktibar(item)"><span class="material-symbols-outlined">edit</span></button>
                  <button class="text-error hover:text-red-700 transition-colors" @click="deleteIktibar(item.id)"><span class="material-symbols-outlined">delete</span></button>
                </td>
              </tr>
              <tr v-if="filteredIktibar.length === 0"><td colspan="4" class="px-4 py-8 text-center text-on-surface-variant text-label-md">Belum ada catatan iktibar</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-stack-lg glass-card rounded-xl p-6 shadow-sm">
        <h3 class="font-display text-title-md text-primary mb-4">Tambah Catatan Iktibar</h3>
        <form @submit.prevent="submitIktibar" class="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
          <select v-model="iktibarForm.santri" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required>
            <option value="">-- Pilih Santri --</option>
            <option v-for="s in students" :key="s.id" :value="s.name">{{ s.name }}</option>
          </select>
          <input type="date" v-model="iktibarForm.date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
          <button class="px-6 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button>
          <div class="md:col-span-3">
            <textarea v-model="iktibarForm.catatan" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none min-h-[80px]" placeholder="Catatan iktibar..." required></textarea>
          </div>
        </form>
      </div>
    </template>

    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="showAddModal = false">
        <div class="bg-surface rounded-2xl shadow-2xl max-w-[560px] w-full max-h-[90vh] overflow-hidden animate-modal-enter flex flex-col">
          <div class="bg-primary px-6 py-4 flex justify-between items-center shrink-0">
            <div>
              <h2 class="font-display text-title-lg text-on-primary leading-none">Tambah Mata Pelajaran</h2>
              <p class="text-on-primary/70 text-label-sm mt-1">Pilih sesi dan mata pelajaran</p>
            </div>
            <button class="text-on-primary/60 hover:text-on-primary p-2" @click="showAddModal = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="p-6 space-y-5 overflow-y-auto" @submit.prevent="submitExam">
            <!-- Pilih Sesi dengan Radio -->
            <div class="space-y-2">
              <label class="text-label-md font-semibold text-on-surface">Sesi Imtihan <span class="text-error">*</span></label>
              <div class="grid grid-cols-4 gap-2">
                <label v-for="n in 4" :key="n" class="relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all" :class="String(examForm.sesi) === String(n) ? 'border-primary bg-primary-fixed/20 text-primary' : 'border-outline-variant/30 bg-surface-container-low hover:border-primary/30'">
                  <input type="radio" :value="String(n)" v-model="examForm.sesi" class="sr-only" required />
                  <span class="w-8 h-8 rounded-full flex items-center justify-center text-label-md font-bold" :class="String(examForm.sesi) === String(n) ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'">{{ n }}</span>
                  <span class="text-label-sm font-medium">Sesi {{ n }}</span>
                  <span v-if="String(examForm.sesi) === String(n)" class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-white text-[14px]">check</span></span>
                </label>
              </div>
            </div>

            <!-- Pilih Mapel dengan Multiple Checkbox (radio style) -->
            <div class="space-y-2">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <label class="text-label-md font-semibold text-on-surface">Mata Pelajaran <span class="text-error">*</span> <span v-if="examForm.subjects.length" class="ml-1 px-2 py-0.5 rounded-full bg-primary text-on-primary text-[11px]">{{ examForm.subjects.length }} dipilih</span></label>
                <div class="flex items-center gap-1">
                  <input v-model="mapelSearch" type="text" placeholder="Cari mapel..." class="bg-surface-container-low border border-outline-variant/20 rounded-lg text-label-sm py-1.5 px-3 focus:ring-primary outline-none w-32" />
                  <button type="button" class="px-2.5 py-1.5 bg-surface-container-high rounded-lg text-label-sm hover:bg-surface-container" @click="selectAllFiltered">Pilih semua</button>
                  <button type="button" class="px-2.5 py-1.5 bg-surface-container-high rounded-lg text-label-sm hover:bg-surface-container" @click="clearSubjects">Bersihkan</button>
                </div>
              </div>
              <div v-if="filteredSubjects.length === 0" class="py-6 text-center text-label-sm text-on-surface-variant border border-dashed border-outline-variant/30 rounded-xl">
                Tidak ada mata pelajaran. Tambahkan dulu di menu kurikulum.
              </div>
              <div v-else class="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                <label v-for="s in filteredSubjects" :key="s.id" class="flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all select-none" :class="isSubjectSelected(s.name) ? 'border-primary bg-primary-fixed/15 ring-1 ring-primary' : existingInSesi(s.name) ? 'border-amber-200 bg-amber-50 opacity-60 cursor-not-allowed' : 'border-outline-variant/20 bg-surface-container-low hover:bg-surface-container-high'">
                  <input type="checkbox" :value="s.name" :checked="isSubjectSelected(s.name)" :disabled="existingInSesi(s.name)" class="accent-primary w-4 h-4 shrink-0" @change="toggleSubject(s.name)" />
                  <span class="text-label-sm font-medium leading-tight truncate flex-1">{{ s.name }}</span>
                  <span v-if="existingInSesi(s.name)" class="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Sudah ada</span>
                  <span v-else-if="isSubjectSelected(s.name)" class="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-white text-[14px]">check</span></span>
                </label>
              </div>
              <!-- Input manual -->
              <div class="flex items-center gap-2 pt-1">
                <span class="text-label-sm text-on-surface-variant shrink-0">Tambah manual:</span>
                <input v-model="examForm.manualSubject" placeholder="Nama mapel..." class="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-lg text-label-sm py-1.5 px-3 focus:ring-primary outline-none" @keydown.enter.prevent="addManualSubject" />
                <button type="button" class="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-label-sm hover:bg-primary/20" @click="addManualSubject">+ Tambah</button>
              </div>
              <div v-if="examForm.subjects.length" class="flex flex-wrap gap-1.5 pt-1">
                <span v-for="nm in examForm.subjects" :key="nm" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed/30 text-primary text-label-sm border border-primary/20">
                  {{ nm }} <button type="button" class="w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center" @click="toggleSubject(nm)"><span class="material-symbols-outlined text-[12px]">close</span></button>
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Tanggal</label>
                <input type="date" v-model="examForm.date" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
              </div>
              <div class="space-y-1">
                <label class="text-label-md text-on-surface-variant">Durasi (menit)</label>
                <input type="number" v-model="examForm.duration" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required />
              </div>
            </div>
            <div class="flex justify-between items-center gap-3 pt-2 border-t border-outline-variant/10 mt-2">
              <span class="text-label-sm text-on-surface-variant">{{ examForm.subjects.length ? `${examForm.subjects.length} mapel akan ditambahkan ke Sesi ${examForm.sesi || '-'}` : 'Pilih minimal 1 mata pelajaran' }}</span>
              <div class="flex gap-2">
                <button class="px-5 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button" @click="showAddModal = false">Batal</button>
                <button class="px-7 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-40" type="submit" :disabled="isSaving || examForm.subjects.length === 0 || !examForm.sesi">
                  <span v-if="isSaving" class="material-symbols-outlined text-sm animate-spin">refresh</span>
                  <span v-else class="material-symbols-outlined text-sm">save</span> Simpan {{ examForm.subjects.length ? `(${examForm.subjects.length})` : '' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin', requiredRole: 'super_admin' })

const route = useRoute()
const kelas = route.params.kelas as string
const type = route.params.type as string

const loading = ref(true)
const error = ref('')
const className = ref('')
const exams = ref<any[]>([])
const iktibarList = ref<any[]>([])
const students = ref<any[]>([])
const subjects = ref<any[]>([])

const selectedStudentId = ref('')
const selectedPrintSesi = ref('')
const showAddModal = ref(false)
const mapelSearch = ref('')
const examForm = reactive({ sesi: '', subject: '', subjects: [] as string[], manualSubject: '', date: '', duration: 90 })
const isSaving = ref(false)
const selectedPerSesi = ref<Record<string, string[]>>({})
const bulkTargetSesi = ref<Record<string, string>>({})
const iktibarDate = ref(new Date().toISOString().split('T')[0])
const iktibarSearch = ref('')
const iktibarForm = reactive({ santri: '', catatan: '', date: new Date().toISOString().split('T')[0] })

const filteredSubjects = computed(() => {
  if (!mapelSearch.value.trim()) return subjects.value
  const q = mapelSearch.value.toLowerCase()
  return subjects.value.filter((s: any) => (s.name || '').toLowerCase().includes(q))
})

const sesiKeys = computed(() => {
  const set = new Set<string>()
  for (let i = 1; i <= 4; i++) set.add(String(i))
  exams.value.forEach((e: any) => {
    if (e.sesi !== undefined && e.sesi !== null && String(e.sesi).trim() !== '') set.add(String(e.sesi))
  })
  return Array.from(set).sort((a, b) => {
    const an = Number(a), bn = Number(b)
    if (!isNaN(an) && !isNaN(bn)) return an - bn
    return a.localeCompare(b)
  })
})

const groupedExams = computed<Record<string, any[]>>(() => {
  const g: Record<string, any[]> = {}
  sesiKeys.value.forEach(k => g[k] = [])
  exams.value.forEach((e: any) => {
    const key = e.sesi !== undefined && e.sesi !== null && String(e.sesi).trim() !== '' ? String(e.sesi) : '1'
    if (!g[key]) g[key] = []
    // compute avg if missing
    if (!e.averageScore && e.scores) {
      const vals = Object.values(e.scores as Record<string, any>).map((v: any) => Number(v.score) || 0).filter(v => v > 0)
      e.avgComputed = vals.length ? (vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1) : ''
    }
    g[key].push(e)
  })
  // sort each group by subject name
  Object.keys(g).forEach(k => g[k].sort((a, b) => (a.subject || '').localeCompare(b.subject || '')))
  return g
})

function sesiHeaderClass(sesi: string) {
  const n = Number(sesi)
  if (n === 1) return 'bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100'
  if (n === 2) return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100'
  if (n === 3) return 'bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100'
  if (n === 4) return 'bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100'
  return 'bg-surface-container-low border-b border-outline-variant/10'
}
function sesiBadgeClass(sesi: string) {
  const n = Number(sesi)
  if (n === 1) return 'bg-emerald-600'
  if (n === 2) return 'bg-blue-600'
  if (n === 3) return 'bg-amber-600'
  if (n === 4) return 'bg-violet-600'
  return 'bg-primary'
}
function sesiStats(sesi: string) {
  const list = groupedExams.value[sesi] || []
  const avgVals = list.map(e => Number(e.averageScore || e.avgComputed) || 0).filter(v => v > 0)
  const avg = avgVals.length ? (avgVals.reduce((a, b) => a + b, 0) / avgVals.length).toFixed(1) : '-'
  return { avgText: `Rata-rata ${avg}` }
}

const examStats = computed(() => [
  { label: 'Total Ujian', value: exams.value.length.toString(), color: 'text-primary' },
  { label: 'Rata-rata Nilai', value: exams.value.length ? (exams.value.reduce((s, e) => s + (Number(e.averageScore || e.avgComputed) || 0), 0) / exams.value.length).toFixed(1) : '-', color: 'text-secondary' },
  { label: 'Mata Pelajaran', value: [...new Set(exams.value.map(e => e.subject))].length.toString(), color: 'text-tertiary' },
  { label: 'Nilai Tertinggi', value: exams.value.length ? Math.max(...exams.value.map(e => Number(e.averageScore || e.avgComputed) || 0)).toString() : '-', color: 'text-green-600' },
])

const filteredIktibar = computed(() => iktibarList.value.filter(i =>
  (!iktibarSearch.value || i.santri.toLowerCase().includes(iktibarSearch.value.toLowerCase())) &&
  (!iktibarDate.value || i.date === iktibarDate.value)
))

function openAddModal(sesi?: string) {
  if (sesi) examForm.sesi = String(sesi)
  else if (!examForm.sesi) examForm.sesi = '1'
  mapelSearch.value = ''
  examForm.subjects = []
  examForm.manualSubject = ''
  examForm.subject = ''
  if (!examForm.date) examForm.date = new Date().toISOString().split('T')[0]
  showAddModal.value = true
}

function isSubjectSelected(name: string) { return examForm.subjects.includes(name) }
function existingInSesi(name: string) {
  if (!examForm.sesi) return false
  const list = groupedExams.value[String(examForm.sesi)] || []
  return list.some((e: any) => (e.subject || '').toLowerCase() === name.toLowerCase())
}
function toggleSubject(name: string) {
  if (existingInSesi(name)) return
  const idx = examForm.subjects.indexOf(name)
  if (idx >= 0) examForm.subjects.splice(idx, 1)
  else examForm.subjects.push(name)
}
function selectAllFiltered() {
  filteredSubjects.value.forEach((s: any) => {
    if (!isSubjectSelected(s.name) && !existingInSesi(s.name)) examForm.subjects.push(s.name)
  })
}
function clearSubjects() { examForm.subjects = []; examForm.manualSubject = '' }
function addManualSubject() {
  const nm = (examForm.manualSubject || '').trim()
  if (!nm) return
  if (existingInSesi(nm)) { error.value = `Mapel "${nm}" sudah ada di Sesi ${examForm.sesi}`; return }
  if (!isSubjectSelected(nm)) examForm.subjects.push(nm)
  examForm.manualSubject = ''
}

// --- All selector & bulk kelola mapel per sesi ---
function getSelected(sesi: string): string[] { return selectedPerSesi.value[String(sesi)] || [] }
function isSelected(sesi: string, id: string) { return getSelected(sesi).includes(id) }
function allSelected(sesi: string) {
  const list = groupedExams.value[String(sesi)] || []
  if (!list.length) return false
  const sel = getSelected(sesi)
  return sel.length === list.length && list.every((e: any) => sel.includes(e.id))
}
function selectedCount(sesi: string) { return getSelected(sesi).length }
function toggleOne(sesi: string, id: string) {
  const key = String(sesi)
  const arr = [...getSelected(key)]
  const idx = arr.indexOf(id)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(id)
  selectedPerSesi.value[key] = arr
}
function toggleAllSesi(sesi: string) {
  const key = String(sesi)
  const list = groupedExams.value[key] || []
  if (allSelected(key)) selectedPerSesi.value[key] = []
  else selectedPerSesi.value[key] = list.map((e: any) => e.id)
}
function clearSelection(sesi: string) { selectedPerSesi.value[String(sesi)] = [] }
async function bulkDeleteSesi(sesi: string) {
  const ids = getSelected(sesi)
  if (!ids.length) return
  if (!confirm(`Hapus ${ids.length} mata pelajaran di Sesi ${sesi}?`)) return
  try {
    await Promise.all(ids.map((id: string) => $fetch(`/api/akademik/imtihan/${id}`, { method: 'DELETE' }).catch(() => null)))
    clearSelection(sesi)
    await fetchData()
  } catch (e: any) { error.value = e.message || 'Gagal hapus massal' }
}
async function bulkMoveSesi(sesi: string) {
  const target = bulkTargetSesi.value[String(sesi)]
  if (!target) { error.value = 'Pilih sesi tujuan'; return }
  if (String(target) === String(sesi)) { error.value = 'Sesi tujuan sama dengan asal'; return }
  const ids = getSelected(sesi)
  if (!ids.length) return
  if (!confirm(`Pindahkan ${ids.length} mapel dari Sesi ${sesi} ke Sesi ${target}?`)) return
  try {
    await Promise.all(ids.map((id: string) => $fetch(`/api/akademik/imtihan/${id}`, { method: 'PUT', body: { sesi: String(target) } }).catch(() => null)))
    clearSelection(sesi)
    await fetchData()
  } catch (e: any) { error.value = e.message || 'Gagal pindah sesi' }
}

async function fetchData() {
  loading.value = true; error.value = ''
  try {
    const classes = await $fetch<any[]>('/api/master-data/classes')
    const cls = classes.find((c: any) => c.id === kelas)
    className.value = cls?.name || cls?.nama || kelas

    if (type === 'imtihan') {
      exams.value = await $fetch(`/api/akademik/imtihan?kelas=${kelas}`) || []
    } else {
      iktibarList.value = await $fetch(`/api/akademik/iktibar?kelas=${kelas}`) || []
    }
    students.value = await $fetch(`/api/students?class=${encodeURIComponent(cls?.name || kelas)}`) || []
    subjects.value = await $fetch(`/api/akademik/subjects`) || []
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

async function submitExam() {
  // kumpulkan subjects dari checkbox + manual + legacy single
  if (examForm.subject && !examForm.subjects.includes(examForm.subject)) examForm.subjects.push(examForm.subject.trim())
  if (examForm.manualSubject && examForm.manualSubject.trim() && !examForm.subjects.includes(examForm.manualSubject.trim())) {
    const nm = examForm.manualSubject.trim()
    if (!existingInSesi(nm)) examForm.subjects.push(nm)
  }
  if (!examForm.sesi) { error.value = 'Pilih sesi terlebih dahulu'; return }
  if (!examForm.subjects.length) { error.value = 'Pilih minimal 1 mata pelajaran'; return }
  isSaving.value = true; error.value = ''
  try {
    // cek duplikat di sesi yang sama
    const existingNames = new Set((groupedExams.value[String(examForm.sesi)] || []).map((e: any) => (e.subject || '').toLowerCase()))
    const toCreate = examForm.subjects.filter(nm => !existingNames.has(nm.toLowerCase()))
    const skipped = examForm.subjects.length - toCreate.length
    if (!toCreate.length) { error.value = 'Semua mapel terpilih sudah ada di sesi ini'; isSaving.value = false; return }
    // buat semua mapel secara parallel (multiple)
    await Promise.all(toCreate.map(nm => $fetch('/api/akademik/imtihan', { method: 'POST', body: { sesi: examForm.sesi, subject: nm, date: examForm.date, duration: examForm.duration, kelas } })))
    showAddModal.value = false; examForm.subjects = []; examForm.subject = ''; examForm.manualSubject = ''; examForm.date = ''; examForm.duration = 90
    if (skipped) error.value = `${toCreate.length} mapel ditambahkan, ${skipped} sudah ada dan dilewati`
    else error.value = ''
    await fetchData()
  } catch (e: any) { error.value = e.message || 'Gagal menyimpan' }
  finally { isSaving.value = false }
}

async function printSesi(sesi: string) {
  const list = groupedExams.value[sesi] || []
  if (!list.length) { error.value = `Belum ada data di Sesi ${sesi}`; return }
  error.value = ''
  try {
    const examDetails = await Promise.all(
      list.map((e: any) => $fetch<any>(`/api/akademik/imtihan/${e.id}`).catch(() => e))
    )
    const valid = examDetails.filter(Boolean)
    const classes = await $fetch<any[]>('/api/master-data/classes')
    const cls = classes.find((c: any) => c.id === kelas)
    const allStudents = await $fetch<any[]>(`/api/students?class=${encodeURIComponent(cls?.name || kelas)}`) || []
    const nameMap: Record<string, string> = {}
    allStudents.forEach(s => { nameMap[s.id] = s.name })
    // build ranking for this sesi
    const studentMap: Record<string, Record<string, number>> = {}
    valid.forEach((exam: any) => {
      if (!exam.scores) return
      Object.entries(exam.scores).forEach(([sid, data]: [string, any]) => {
        if (!studentMap[sid]) studentMap[sid] = {}
        studentMap[sid][exam.subject] = Number(data.score) || 0
      })
    })
    // include students with no score yet as 0 row
    allStudents.forEach(s => { if (!studentMap[s.id]) studentMap[s.id] = {} })

    interface RankEntry { id: string; name: string; subjects: Record<string, number>; total: number; avg: number }
    const ranked: RankEntry[] = Object.entries(studentMap).map(([id, subs]) => {
      // sum only subjects in this sesi
      const vals = valid.map((e: any) => subs[e.subject] || 0)
      const total = vals.reduce((a, b) => a + b, 0)
      return { id, name: nameMap[id] || id, subjects: subs, total, avg: vals.length ? total / vals.length : 0 }
    })
    ranked.sort((a, b) => b.total - a.total || b.avg - a.avg)

    const subjectNames = valid.map(e => e.subject)
    const headerCells = subjectNames.map(s => `<th style="padding:6px 8px;border:1px solid #333;font-size:10pt;text-align:center;white-space:nowrap;">${s}</th>`).join('')
    const rows = ranked.map((r, i) => {
      const scoreCells = subjectNames.map(s =>
        `<td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${r.subjects[s] ? r.subjects[s] : '-'}</td>`
      ).join('')
      return `<tr>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${i + 1}</td>
        <td style="padding:4px 6px;border:1px solid #333;font-size:10pt;">${r.name}</td>
        ${scoreCells}
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;font-weight:bold;">${r.total}</td>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${r.avg.toFixed(1)}</td>
      </tr>`
    }).join('')

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
<html><head><title>Rekap Sesi ${sesi} - ${className.value}</title>
<style>
  @page { size: landscape; margin: 12mm 15mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 15px; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 16px; }
  .kop .logo { max-height: 55px; vertical-align: middle; margin-right: 8px; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 13pt; margin: 14px 0 4px; text-decoration: underline; }
  .sub { text-align:center; font-size:10pt; margin-bottom:10px; }
  .info { margin-bottom: 10px; }
  .info td { padding: 2px 6px; font-size: 10pt; }
  table.data { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table.data th { background: #f0f0f0; padding: 6px; border: 1px solid #333; font-size: 10pt; }
  table.data td { padding: 4px 6px; border: 1px solid #333; font-size: 10pt; }
  .ttd { margin-top: 30px; display: flex; justify-content: space-around; }
  .ttd div { text-align: center; width: 180px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 50px; }
  .ttd .nama { font-size: 11pt; font-weight: bold; text-decoration: underline; }
</style></head><body>
<div class="kop">
  <table style="width:100%;"><tr>
    <td style="width:70px;text-align:center;">
      <img src="/image/logo.png" class="logo" style="max-height:55px;" onerror="this.style.display='none'" />
    </td>
    <td style="text-align:center;">
      <div class="kop-title">YAYASAN PONDOK PESANTREN<br>AL FATAH PANEKAN</div>
      <div class="kop-alamat">Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</div>
    </td>
  </tr></table>
</div>

<h2>REKAP NILAI IMTIHAN — SESI ${sesi}</h2>
<p class="sub">Kelas: ${className.value} &nbsp;|&nbsp; Jumlah Mapel: ${valid.length} &nbsp;|&nbsp; Jumlah Santri: ${ranked.length}</p>

<table class="data">
  <thead>
    <tr>
      <th style="width:32px;">No</th>
      <th>Nama Santri</th>
      ${headerCells}
      <th style="width:55px;">Jumlah</th>
      <th style="width:60px;">Rata-rata</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>

<div class="ttd">
  <div><div class="jabatan">Wali Kelas,</div><div class="nama">_____________________</div></div>
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>
`)
    win.document.close()
    setTimeout(() => { win.print() }, 500)
  } catch (e: any) {
    error.value = e.message || 'Gagal mencetak sesi'
  }
}

async function printNilaiSantri() {
  if (!selectedStudentId.value) return
  error.value = ''
  try {
    const allExams = await $fetch<any[]>(`/api/akademik/imtihan?kelas=${kelas}`) || []
    if (!allExams.length) { error.value = 'Belum ada data ujian'; return }

    const examDetails = await Promise.all(
      allExams.map((e: any) => $fetch<any>(`/api/akademik/imtihan/${e.id}`).catch(() => null))
    )
    const valid = examDetails.filter(Boolean)
    if (!valid.length) { error.value = 'Gagal memuat detail nilai'; return }

    const student = students.value.find(s => s.id === selectedStudentId.value)
    if (!student) { error.value = 'Santri tidak ditemukan'; return }

    const studentScores: { subject: string; date: string; score: string; notes: string; sesi: string }[] = []
    valid.forEach((exam: any) => {
      if (!exam.scores) return
      const data = exam.scores[selectedStudentId.value]
      if (data) {
        studentScores.push({ subject: exam.subject, date: exam.date, score: data.score || '-', notes: data.notes || '', sesi: exam.sesi || '-' })
      }
    })

    const total = studentScores.reduce((s, r) => s + (Number(r.score) || 0), 0)
    const avg = studentScores.length ? (total / studentScores.length) : 0

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
<html><head><title>Nilai IMTIHAN - ${student.name}</title>
<style>
  @page { size: A4; margin: 15mm 20mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 0; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 16px; }
  .kop .logo { max-height: 55px; vertical-align: middle; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 13pt; margin: 14px 0; text-decoration: underline; }
  table.info { margin-bottom: 12px; width: 100%; }
  table.info td { padding: 2px 6px; font-size: 10pt; vertical-align: top; }
  table.info .label { width: 120px; }
  table.data { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table.data th { background: #f0f0f0; padding: 6px; border: 1px solid #333; font-size: 10pt; }
  table.data td { padding: 4px 6px; border: 1px solid #333; font-size: 10pt; text-align: center; }
  table.data td.left { text-align: left; }
  .summary { margin-top: 8px; font-size: 10pt; }
  .summary td { padding: 2px 8px; }
  .ttd { margin-top: 30px; display: flex; justify-content: space-around; }
  .ttd div { text-align: center; width: 180px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 50px; }
  .ttd .nama { font-size: 11pt; font-weight: bold; text-decoration: underline; }
</style></head><body>
<div class="kop">
  <table style="width:100%;"><tr>
    <td style="width:70px;text-align:center;">
      <img src="/image/logo.png" class="logo" style="max-height:55px;" onerror="this.style.display='none'" />
    </td>
    <td style="text-align:center;">
      <div class="kop-title">YAYASAN PONDOK PESANTREN<br>AL FATAH PANEKAN</div>
      <div class="kop-alamat">Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</div>
    </td>
  </tr></table>
</div>

<h2>DAFTAR NILAI IMTIHAN</h2>

<table class="info">
  <tr><td class="label">Nama Santri</td><td>: ${student.name}</td></tr>
  ${student.nis ? `<tr><td>NIS</td><td>: ${student.nis}</td></tr>` : ''}
  <tr><td>Kelas</td><td>: ${className.value}</td></tr>
</table>

<table class="data">
  <thead>
    <tr>
      <th style="width:32px;">No</th>
      <th style="width:70px;">Sesi</th>
      <th>Mata Pelajaran</th>
      <th style="width:100px;">Tanggal</th>
      <th style="width:70px;">Nilai</th>
      <th>Keterangan</th>
    </tr>
  </thead>
  <tbody>
    ${studentScores.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${r.sesi !== '-' ? `Sesi ${r.sesi}` : '-'}</td>
      <td class="left">${r.subject}</td>
      <td>${r.date}</td>
      <td style="font-weight:bold;">${r.score}</td>
      <td class="left">${r.notes || '-'}</td>
    </tr>`).join('')}
  </tbody>
</table>

<table class="summary">
  <tr><td>Jumlah Mata Pelajaran</td><td>: ${studentScores.length}</td></tr>
  <tr><td>Total Nilai</td><td>: ${total}</td></tr>
  <tr><td>Rata-rata Nilai</td><td>: ${avg.toFixed(1)}</td></tr>
</table>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>
`)
    win.document.close()
    setTimeout(() => win.print(), 500)
  } catch (e: any) {
    error.value = e.message || 'Gagal mencetak'
  }
}

async function printSantriPerSesi(overrideSesi?: string) {
  const sesi = overrideSesi || selectedPrintSesi.value
  if (!selectedStudentId.value) { error.value = 'Pilih santri terlebih dahulu'; return }
  if (!sesi) { error.value = 'Pilih sesi terlebih dahulu'; return }
  error.value = ''
  try {
    const list = groupedExams.value[sesi] || []
    if (!list.length) { error.value = `Belum ada data di Sesi ${sesi}`; return }
    const examDetails = await Promise.all(
      list.map((e: any) => $fetch<any>(`/api/akademik/imtihan/${e.id}`).catch(() => e))
    )
    const valid = examDetails.filter(Boolean)
    const student = students.value.find(s => s.id === selectedStudentId.value)
    if (!student) { error.value = 'Santri tidak ditemukan'; return }

    const studentScores: { subject: string; date: string; score: string; notes: string }[] = []
    valid.forEach((exam: any) => {
      const match = exam.scores?.[selectedStudentId.value]
      studentScores.push({ subject: exam.subject, date: exam.date || '-', score: match ? (match.score ?? '-') : '-', notes: match?.notes || '-' })
    })
    const total = studentScores.reduce((a, b) => a + (Number(b.score) || 0), 0)
    const avg = studentScores.length ? (total / studentScores.length).toFixed(1) : '-'

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
<html><head><title>Nilai Sesi ${sesi} - ${student.name}</title>
<style>
  @page { size: A4; margin: 14mm 16mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color:#000; margin:0; padding:14px; }
  .kop { text-align:center; border-bottom:2px solid #333; padding-bottom:10px; margin-bottom:14px; }
  .kop .logo{max-height:55px; vertical-align:middle;}
  .kop .kop-title{font-size:14pt;font-weight:bold;}
  .kop .kop-alamat{font-size:9pt;}
  h2{ text-align:center; font-size:13pt; margin:12px 0 2px; text-decoration:underline;}
  .sub{ text-align:center; font-size:10pt; margin-bottom:12px;}
  table.info{ width:100%; margin-bottom:10px;}
  table.info td{ padding:3px 6px; font-size:10pt; vertical-align:top;}
  table.info .label{ width:130px; font-weight:bold;}
  table.data{ width:100%; border-collapse:collapse; margin:10px 0;}
  table.data th{ background:#f0f0f0; padding:6px 8px; border:1px solid #333; font-size:10pt; text-align:center;}
  table.data td{ padding:5px 8px; border:1px solid #333; font-size:10pt; text-align:center;}
  table.data td.left{ text-align:left;}
  .summary{ margin-top:10px; font-size:10pt;}
  .summary td{ padding:2px 8px;}
  .badge{ display:inline-block; padding:3px 10px; border-radius:20px; font-size:10pt; font-weight:bold; background:${Number(sesi)===1?'#ecfdf5':Number(sesi)===2?'#eff6ff':Number(sesi)===3?'#fffbeb':'#f5f3ff'}; border:1px solid #333;}
  .ttd{ margin-top:32px; display:flex; justify-content:space-around; text-align:center; font-size:10pt;}
  .ttd .jabatan{ margin-bottom:48px;}
  .ttd .nama{ font-weight:bold; text-decoration:underline;}
</style></head><body>
<div class="kop">
  <table style="width:100%"><tr>
    <td style="width:70px;text-align:center"><img src="/image/logo.png" class="logo" style="max-height:55px" onerror="this.style.display='none'"/></td>
    <td style="text-align:center"><div class="kop-title">YAYASAN PONDOK PESANTREN<br/>AL FATAH PANEKAN</div><div class="kop-alamat">Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</div></td>
  </tr></table>
</div>
<h2>DAFTAR NILAI IMTIHAN <span class="badge">SESI ${sesi}</span></h2>
<p class="sub">Kelas: ${className.value} &nbsp;|&nbsp; Santri: ${student.name} ${student.nis ? `(${student.nis})` : ''}</p>
<table class="info">
  <tr><td class="label">Nama Santri</td><td>: ${student.name}</td><td class="label">NIS</td><td>: ${student.nis || '-'}</td></tr>
  <tr><td class="label">Kelas</td><td>: ${className.value}</td><td class="label">Sesi</td><td>: Imtihan ${sesi}</td></tr>
  <tr><td class="label">Jumlah Mapel Sesi</td><td>: ${valid.length}</td><td class="label">Tanggal Cetak</td><td>: ${new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric'})}</td></tr>
</table>
<table class="data">
  <thead><tr><th style="width:32px">No</th><th>Mata Pelajaran</th><th style="width:95px">Tanggal</th><th style="width:70px">Nilai</th><th>Keterangan</th></tr></thead>
  <tbody>
    ${studentScores.map((r,i)=>`
    <tr>
      <td>${i+1}</td>
      <td class="left">${r.subject}</td>
      <td>${r.date}</td>
      <td style="font-weight:bold">${r.score}</td>
      <td class="left">${r.notes || '-'}</td>
    </tr>`).join('')}
  </tbody>
</table>
<table class="summary">
  <tr><td>Jumlah Mata Pelajaran (Sesi ${sesi})</td><td>: ${studentScores.length}</td></tr>
  <tr><td>Total Nilai Sesi ${sesi}</td><td>: ${total}</td></tr>
  <tr><td>Rata-rata Sesi ${sesi}</td><td>: ${avg}</td></tr>
</table>
<div class="ttd">
  <div><div class="jabatan">Wali Kelas ${className.value},</div><div class="nama">_____________________</div></div>
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>`)
    win.document.close()
    setTimeout(()=>win.print(),500)
  } catch(e:any){ error.value = e.message || 'Gagal mencetak per santri per sesi' }
}

async function printRanking() {
  error.value = ''
  try {
    const allExams = await $fetch<any[]>(`/api/akademik/imtihan?kelas=${kelas}`) || []
    if (!allExams.length) { error.value = 'Belum ada data ujian'; return }

    const examDetails = await Promise.all(
      allExams.map((e: any) => $fetch<any>(`/api/akademik/imtihan/${e.id}`).catch(() => null))
    )
    const valid = examDetails.filter(Boolean)
    if (!valid.length) { error.value = 'Gagal memuat detail nilai'; return }

    const classes = await $fetch<any[]>('/api/master-data/classes')
    const cls = classes.find((c: any) => c.id === kelas)
    const students = await $fetch<any[]>(`/api/students?class=${encodeURIComponent(cls?.name || kelas)}`) || []
    const nameMap: Record<string, string> = {}
    students.forEach(s => { nameMap[s.id] = s.name })

    const studentMap: Record<string, Record<string, number>> = {}

    valid.forEach((exam: any) => {
      if (!exam.scores) return
      Object.entries(exam.scores).forEach(([sid, data]: [string, any]) => {
        if (!studentMap[sid]) studentMap[sid] = {}
        studentMap[sid][exam.subject] = Number(data.score) || 0
      })
    })

    interface RankEntry { id: string; name: string; subjects: Record<string, number>; total: number; avg: number }
    const ranked: RankEntry[] = Object.entries(studentMap).map(([id, subs]) => {
      const vals = Object.values(subs)
      const total = vals.reduce((a, b) => a + b, 0)
      return { id, name: nameMap[id] || id, subjects: subs, total, avg: vals.length ? total / vals.length : 0 }
    })
    ranked.sort((a, b) => b.total - a.total || b.avg - a.avg)

    const subjectNames = valid.map(e => e.subject)
    const headerCells = subjectNames.map(s => `<th style="padding:6px 8px;border:1px solid #333;font-size:10pt;text-align:center;">${s}</th>`).join('')
    const rows = ranked.map((r, i) => {
      const scoreCells = subjectNames.map(s =>
        `<td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${r.subjects[s] || '-'}</td>`
      ).join('')
      return `<tr>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${i + 1}</td>
        <td style="padding:4px 6px;border:1px solid #333;font-size:10pt;">${r.name}</td>
        ${scoreCells}
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;font-weight:bold;">${r.total}</td>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;">${r.avg.toFixed(1)}</td>
        <td style="text-align:center;padding:4px 6px;border:1px solid #333;font-size:10pt;font-weight:bold;">${i + 1}</td>
      </tr>`
    }).join('')

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
<html><head><title>Rekap Nilai & Ranking - ${className.value}</title>
<style>
  @page { size: landscape; margin: 12mm 15mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 0; padding: 15px; }
  .kop { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 16px; }
  .kop .logo { max-height: 55px; vertical-align: middle; margin-right: 8px; }
  .kop .kop-title { font-size: 15pt; font-weight: bold; }
  .kop .kop-alamat { font-size: 9pt; }
  h2 { text-align: center; font-size: 13pt; margin: 14px 0; text-decoration: underline; }
  .info { margin-bottom: 10px; }
  .info td { padding: 2px 6px; font-size: 10pt; }
  table.data { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table.data th { background: #f0f0f0; padding: 6px; border: 1px solid #333; font-size: 10pt; }
  table.data td { padding: 4px 6px; border: 1px solid #333; font-size: 10pt; }
  .ttd { margin-top: 30px; display: flex; justify-content: space-around; }
  .ttd div { text-align: center; width: 180px; }
  .ttd .jabatan { font-size: 10pt; margin-bottom: 50px; }
  .ttd .nama { font-size: 11pt; font-weight: bold; text-decoration: underline; }
</style></head><body>
<div class="kop">
  <table style="width:100%;"><tr>
    <td style="width:70px;text-align:center;">
      <img src="/image/logo.png" class="logo" style="max-height:55px;" onerror="this.style.display='none'" />
    </td>
    <td style="text-align:center;">
      <div class="kop-title">YAYASAN PONDOK PESANTREN<br>AL FATAH PANEKAN</div>
      <div class="kop-alamat">Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352</div>
    </td>
  </tr></table>
</div>

<h2>REKAP NILAI & RANKING IMTIHAN — SEMUA SESI</h2>

<table class="info">
  <tr><td>Kelas</td><td>: ${className.value}</td></tr>
  <tr><td>Jumlah Ujian</td><td>: ${valid.length}</td></tr>
  <tr><td>Jumlah Santri</td><td>: ${ranked.length}</td></tr>
</table>

<table class="data">
  <thead>
    <tr>
      <th style="width:32px;">No</th>
      <th>Nama Santri</th>
      ${headerCells}
      <th style="width:55px;">Jumlah</th>
      <th style="width:60px;">Rata-rata</th>
      <th style="width:50px;">Rank</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>

<div class="ttd">
  <div><div class="jabatan">Kepala Pondok,</div><div class="nama">_____________________</div></div>
</div>
</body></html>
`)
    win.document.close()
    setTimeout(() => { win.print() }, 500)
  } catch (e: any) {
    error.value = e.message || 'Gagal mencetak'
  }
}

async function deleteExam(id: string) {
  if (!confirm('Yakin ingin menghapus ujian ini?')) return
  try { await $fetch(`/api/akademik/imtihan/${id}`, { method: 'DELETE' }); await fetchData() }
  catch (e: any) { error.value = e.message || 'Gagal menghapus' }
}

async function submitIktibar() {
  try {
    await $fetch('/api/akademik/iktibar', { method: 'POST', body: { ...iktibarForm, kelas } })
    iktibarForm.santri = ''; iktibarForm.catatan = ''; iktibarForm.date = new Date().toISOString().split('T')[0]
    await fetchData()
  } catch (e: any) { error.value = e.message || 'Gagal menyimpan' }
}

async function editIktibar(item: any) {
  const note = prompt('Edit catatan iktibar:', item.catatan)
  if (!note) return
  try { await $fetch(`/api/akademik/iktibar/${item.id}`, { method: 'PUT', body: { catatan: note } }); await fetchData() }
  catch (e: any) { error.value = e.message || 'Gagal mengupdate' }
}

async function deleteIktibar(id: string) {
  if (!confirm('Yakin ingin menghapus catatan ini?')) return
  try { await $fetch(`/api/akademik/iktibar/${id}`, { method: 'DELETE' }); await fetchData() }
  catch (e: any) { error.value = e.message || 'Gagal menghapus' }
}

onMounted(() => fetchData())
</script>
