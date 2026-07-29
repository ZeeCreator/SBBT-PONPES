export interface MenuItem {
  label: string
  icon: string
  to: string
}

export interface RoleConfig {
  label: string
  variant: 'admin' | 'ustadz' | 'alumni' | 'walisantri'
  menu: MenuItem[]
}

const menus: Record<string, RoleConfig> = {
  super_admin: {
    label: 'Super Admin',
    variant: 'admin',
    menu: [
      { label: 'Dashboard', icon: 'dashboard', to: '/super-admin/dashboard' },
      { label: 'Santri', icon: 'group', to: '/kesantrian/students' },
      { label: 'Master Data', icon: 'database', to: '/master-data' },
      { label: 'Akademik', icon: 'school', to: '/akademik/menu' },
      { label: 'Penilaian', icon: 'assignment', to: '/akademik/grading' },
      { label: 'Jadwal', icon: 'schedule', to: '/jadwal' },
      { label: 'Tahfidz', icon: 'menu_book', to: '/tahfidz' },
      { label: 'Absensi', icon: 'calendar_month', to: '/attendance' },
      { label: 'Ibadah', icon: 'mosque', to: '/ibadah/prayer-attendance' },
      { label: 'Guru', icon: 'badge', to: '/settings/teachers' },
      { label: 'Kesehatan', icon: 'medical_services', to: '/kesehatan/medical-records' },
      { label: 'Ekstrakurikuler', icon: 'sports_kabaddi', to: '/extracurricular' },
      { label: 'PSB/PPDB', icon: 'app_registration', to: '/psb/registrations' },
      { label: 'Alumni', icon: 'diversity_3', to: '/alumni' },
      { label: 'Izin Santri', icon: 'passport', to: '/izin' },
      { label: 'Izin Guru', icon: 'badge', to: '/izin/guru' },
      { label: 'Mutasi', icon: 'swap_horiz', to: '/mutasi' },
      { label: 'Inventaris', icon: 'inventory_2', to: '/inventaris' },
      { label: 'Import/Export', icon: 'file_present', to: '/tools/import-export' },
      { label: 'WA Gateway', icon: 'chat', to: '/wa-gateway' },
      { label: 'Notifikasi', icon: 'notifications', to: '/notifikasi' },
      { label: 'Laporan', icon: 'description', to: '/laporan' },
      { label: 'Wali Santri', icon: 'family_history', to: '/wali-santri/register' },
      { label: 'Pengaturan', icon: 'settings', to: '/settings/rbac' },
      { label: 'Developer', icon: 'code', to: '/developer' },
    ],
  },
  bendahara: {
    label: 'Bendahara',
    variant: 'admin',
    menu: [
      { label: 'Dashboard', icon: 'dashboard', to: '/super-admin/dashboard' },
      { label: 'Santri', icon: 'group', to: '/kesantrian/students' },
      { label: 'WA Gateway', icon: 'chat', to: '/wa-gateway' },
      { label: 'Laporan', icon: 'description', to: '/laporan' },
    ],
  },
  kesantrian: {
    label: 'Kesantrian',
    variant: 'admin',
    menu: [
      { label: 'Dashboard', icon: 'dashboard', to: '/super-admin/dashboard' },
      { label: 'Data Santri', icon: 'group', to: '/kesantrian/students' },
      { label: 'Pelanggaran', icon: 'gavel', to: '/kesantrian/students' },
      { label: 'Absensi', icon: 'calendar_month', to: '/attendance' },
      { label: 'Ibadah', icon: 'mosque', to: '/ibadah/prayer-attendance' },
      { label: 'Tahfidz', icon: 'menu_book', to: '/tahfidz' },
      { label: 'Izin Santri', icon: 'passport', to: '/izin' },
      { label: 'Reward', icon: 'stars', to: '/reward' },
      { label: 'Mutasi', icon: 'swap_horiz', to: '/mutasi' },
      { label: 'Khidmah', icon: 'volunteer_activism', to: '/khidmah' },
      { label: 'Kesehatan', icon: 'medical_services', to: '/kesehatan/medical-records' },
      { label: 'Ekstrakurikuler', icon: 'sports_kabaddi', to: '/extracurricular' },
      { label: 'Inventaris', icon: 'inventory_2', to: '/inventaris' },
      { label: 'Import/Export', icon: 'file_present', to: '/tools/import-export' },
      { label: 'Laporan', icon: 'description', to: '/laporan' },
    ],
  },
  ustadz: {
    label: 'Ustadz / Ustadzah',
    variant: 'ustadz',
    menu: [
      { label: 'Dashboard', icon: 'dashboard', to: '/portal/guru' },
      { label: 'Jadwal Mengajar', icon: 'schedule', to: '/jadwal' },
      { label: 'Penilaian', icon: 'assignment', to: '/akademik/grading' },
      { label: 'Absensi Santri', icon: 'calendar_month', to: '/attendance' },
      { label: 'Tahfidz', icon: 'menu_book', to: '/tahfidz' },
      { label: 'Data Santri', icon: 'group', to: '/kesantrian/students' },
    ],
  },
  wali_santri: {
    label: 'Wali Santri',
    variant: 'walisantri',
    menu: [
      { label: 'Dashboard', icon: 'dashboard', to: '/wali-santri/dashboard' },
      { label: 'Data Anak', icon: 'badge', to: '/student/dashboard' },
      { label: 'Akademik', icon: 'auto_stories', to: '/akademik/menu' },
      { label: 'Nilai', icon: 'assignment', to: '/akademik/grading' },
      { label: 'Absensi', icon: 'calendar_month', to: '/attendance' },
      { label: 'Tahfidz', icon: 'menu_book', to: '/tahfidz' },
      { label: 'Catatan', icon: 'checklist', to: '/wali-santri/todos' },
    ],
  },
  alumni: {
    label: 'Alumni',
    variant: 'alumni',
    menu: [
      { label: 'Dashboard', icon: 'dashboard', to: '/alumni' },
      { label: 'Data Alumni', icon: 'group', to: '/alumni' },
      { label: 'Acara', icon: 'event', to: '/alumni/events' },
      { label: 'Wisuda', icon: 'auto_stories', to: '/alumni/graduations' },
    ],
  },
}

export function useRoleMenu(role: string | null): RoleConfig {
  return menus[role || ''] || menus.wali_santri
}
