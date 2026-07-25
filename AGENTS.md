# SIM-PPT — Project Profile

## Overview
Sistem Informasi Manajemen Pondok Pesantren Terpadu. Manajemen digital terpadu untuk pondok pesantren: santri, akademik, keuangan, inventaris, alumni, dll.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Nuxt 3.21+ (Vue 3.5+, Nitro 2.13+) |
| Styling | Tailwind CSS (custom theme), Material Symbols |
| Database | Firebase Realtime Database (RTDB) |
| Auth | Firebase Auth (email/password + custom token untuk NIS) |
| Server-side Firebase | firebase-admin SDK (server/utils/firebase.ts) |
| Client-side Firebase | firebase (composables/useFirebase.ts) |
| Deploy | Vercel (nitro preset: vercel) |
| OCR | tesseract.js |
| Spreadsheet | xlsx |
| AI | Gemini API, OpenRouter |

## Project Structure (nuxt/)

```
nuxt/
├── assets/css/main.css          # Global styles, glass-card, bg-mesh, animations
├── components/                   # Vue components (BulkActionBar, dll)
├── composables/
│   ├── useFirebase.ts           # Client Firebase init + auth helpers
│   ├── useRoleMenu.ts           # Role-based sidebar menu config
│   ├── useTableSelection.ts     # Select-all / bulk selection logic
│   └── useOcrParser.ts          # OCR PDF/image parser
├── layouts/                      # super-admin.vue, kesantrian.vue, dll
├── pages/                        # All routes (lihat di bawah)
├── server/
│   ├── api/                      # API endpoints (Nuxt file-based routing)
│   ├── middleware/
│   │   ├── auth.ts              # API auth: session cookie → Bearer token → RTDB role lookup
│   │   └── security.ts          # Security headers, rate limit
│   └── utils/
│       ├── firebase.ts          # RTDB CRUD helpers (rtdbGetList, rtdbAdd, rtdbUpdate, dll)
│       ├── session.ts           # JWT session token (custom, non-Firebase)
│       ├── id-generator.ts      # NIS generator
│       ├── backup.ts            # Backup ke Google Drive
│       └── drive.ts             # Google Drive API
└── tailwind.config.ts           # Custom colors, spacing, typography scale
```

## Key Routes (pages/)

### Auth
- `/auth/login` — Login page (email/password + NIS login)
- `/auth/register` — Register

### Master Data
- `/master-data/classes` — CRUD kelas
- `/master-data/periods` — CRUD periode SPP
- `/master-data/academic-years` — CRUD tahun ajaran
- `/master-data/dormitories` — CRUD gedung + kamar
- `/master-data` — Index master data

### Santri / Kesantrian
- `/kesantrian/students` — Database santri (CRUD + filter kelas/kamar/gender/status)
- `/kesantrian/information-vector` — Vector informasi

### Akademik
- `/akademik/menu` — Menu akademik
- `/akademik/grading` — Penilaian
- `/akademik/imtihan` — Ujian
- `/jadwal` — Jadwal
- `/attendance` — Absensi
- `/tahfidz` — Tahfidz

### Lainnya
- `/kesehatan/medical-records`
- `/extracurricular`
- `/psb/registrations` — PPDB/PSB
- `/alumni`, `/izin`, `/mutasi`, `/inventaris`, `/khidmah`, `/reward`
- `/koperasi` — Koperasi
- `/notifikasi`, `/laporan`
- `/settings/teachers`, `/settings/rbac`
- `/tools/import-export`
- `/developer`
- `/wali-santri/dashboard`, `/wali-santri/todos`, `/wali-santri/register`
- `/student/dashboard`

## Authentication System

1. **Server middleware** (`server/middleware/auth.ts`):
   - Public routes: `/api/health`, `/api/uptime/`, `/api/auth/login`, `/api/auth/nis-login`
   - Auth priority: session cookie → Bearer token → RTDB role lookup
   - Has `event.context.auth = { uid, role, name, email, nis }`

2. **Client** (`composables/useFirebase.ts`):
   - `useAuth()` returns: `user`, `role`, `loading`, `init()`, `login()`, `loginWithNis()`, `logout()`, `getIdToken()`, `refreshRole()`
   - Login creates session cookie + Firebase Auth sign-in
   - NIS login via `/api/auth/nis-login` (returns custom token)

3. **Roles**: `super_admin`, `bendahara`, `kesantrian`, `ustadz`, `wali_santri`, `alumni`
   - Role stored at `roles/{uid}/role` di RTDB
   - Menu config in `composables/useRoleMenu.ts`

## Firebase RTDB Patterns

### ID Generation (`server/utils/firebase.ts`)
- 20-char string: `[a-z0-9]`, starts with letter
- `generateId()` — random ID
- Keys used: `students/{id}`, `classes/{id}`, `dormitories/{id}`, `rooms/{id}`, `roles/{uid}`, `activity_logs/{id}`, dll

### CRUD Helpers
| Function | Description |
|----------|-------------|
| `rtdbGetList(path)` | Get all items → `[{ id: firebaseKey, ...val }]` |
| `rtdbGetById(path, id)` | Get single item |
| `rtdbAdd(path, data)` | Create with generated ID |
| `rtdbAddWithId(path, id, data)` | Create with specific ID |
| `rtdbUpdate(path, id, data)` | Update fields |
| `rtdbRemove(path, id)` | Delete |
| `rtdbQueryEqual(path, field, value)` | Query by field equality |

**IMPORTANT**: `rtdbGetList` strips `id` field from stored val to prevent stored-id overriding Firebase key. `rtdbAdd` and `rtdbUpdate` also strip `id` from data before saving.

### API Routing Convention
- `master-data/classes.get.ts` — GET /api/master-data/classes
- `master-data/classes.post.ts` — POST /api/master-data/classes
- `master-data/classes/[id].put.ts` — PUT /api/master-data/classes/:id
- `master-data/classes/[id].delete.ts` — DELETE /api/master-data/classes/:id
- Same pattern for: `dormitories`, `periods`, `academic-years`

## Design System

### Colors (from tailwind.config.ts)
- `primary`: #003527 (dark green)
- `primary-container`: #064e3b
- `secondary`: #9b4500 (orange)
- `secondary-container`: #fd8a42
- `background`: #f8f9ff
- `surface`: #f8f9ff
- `error`: #ba1a1a

### Typography
- Font: Inter (body), Plus Jakarta Sans (display)
- Scale: `display-lg` (48px), `headline-lg` (32px), `headline-md` (24px), `title-lg` (20px), `body-md` (16px), `label-md` (14px), `label-sm` (12px)

### Spacing
- `gutter`: 24px, `stack-sm`: 8px, `stack-md`: 16px, `stack-lg`: 32px

### CSS Classes
- `glass-card` — frosted glass effect (blur + semi-transparent white)
- `glass-card-solid` — more opaque glass
- `bg-mesh` — radial gradient mesh background
- `animate-modal-enter` — modal entrance animation

## Common Patterns

### Table with Selection & Bulk Action
```vue
<script setup>
const { selected, allSelected, toggleAll, toggleOne, isSelected, clearSelection, selectedCount } = useTableSelection(() => items)
</script>
```
Templates: `:checked="allSelected" @change="toggleAll"`, `:checked="isSelected(item.id)" @change="toggleOne(item.id)"`, `BulkActionBar` component with slot `#actions`.

### CRUD Modal Pattern
1. `defaultForm()` — returns clean form state (NO `id` field — generated by Firebase)
2. `form = reactive(defaultForm())`
3. `openAddModal()` — reset form, show modal
4. `openEditModal(item)` — `Object.assign(form, { ...item })`, show modal
5. `saveItem()` — destructure `id` out, POST or PUT with clean payload
6. `closeModal()` — hide modal

### Working with RTDB Objects (Rooms, etc.)
- RTDB stores objects as key-value: `{ "-Nxxx": { name: "Kamar 1" }, ... }`
- Convert to array: `Object.entries(data).map(([id, val]) => ({ id, ...val }))`

## Session History

### 2025-07-25 Fix: Landasan Page
- Redesigned landing page (`pages/index.vue`) with hero branding + glass card + login button
- Removed Wali Santri & Santri portal links (only Admin & Staff remains)

### 2025-07-25 Fix: Class Filter & Student Validation
- `pages/kesantrian/students.vue`: Filter class case-insensitive (lowercase comparison)
- Added `novalidate` to form, removed `required` from select/input (browser validation was blocking Vue validation)
- Strengthened class validation: `String(form.classId).trim()` instead of `!form.classId`

### 2025-07-25 Fix: Stored ID Overriding Firebase Key (Systemic Bug)
- **Root cause**: `defaultForm()` in CRUD pages had `id: 0` which got saved to Firebase as a data field. `rtdbGetList` returned this overriding the Firebase key.
- **Fix (systemic)**: `rtdbGetList` strips `id` from stored val. `rtdbAdd` strips `id` before saving. `rtdbUpdate` strips `id` before updating.
- **Fix (pages)**: Removed `id` from `defaultForm()` in `classes.vue`, `periods.vue`, `academic-years.vue`, `dormitories.vue`. Added destructuring in `saveItem()` to strip `id` from API body.
- **Existing data**: Classes stored with `id: 0` are now read correctly; to clean up, delete and re-add via Firebase console.

### 2025-07-25 Fix: Dormitories Page
- Room display: `{{ room.name || room }}` (was `[object Object]`)
- Room delete uses `room.id` (Firebase key) for API URL
- `saveItem` excludes `rooms` from PUT/POST body
- Server `[id].put.ts` strips `rooms` from request body

### 2025-07-25 Fix: Select All & Bulk Action Bar
- Created `composables/useTableSelection.ts` — select all with closure pattern (auto-unwraps Ref/ComputedRef)
- Created `components/BulkActionBar.vue` — reusable bulk action bar with slot
- Applied to 42 pages with "Hapus" button + `bulkDelete()` function
- Removed "Keuangan" from sidebar (`useRoleMenu.ts`) and TopBar

## Build & Deploy

```bash
cd nuxt
npx nuxi build          # Local build (verify before deploy)
npx vercel deploy --prebuilt   # Deploy to Vercel
```

Build output: `.vercel/output/` (static + serverless functions). Build command: `nuxt build` (`nuxt.config.ts` nitro preset: `vercel`).

## Common Pitfalls

1. **Forgot to strip `id` in POST/PUT body**: Firebase RTDB stores `id` as data field, overriding the Firebase key on read.
   - **Fix**: Destructure `const { id, ...payload } = form` before sending to API.
   - **Server-side safety**: `rtdbAdd` and `rtdbUpdate` now strip `id` automatically.
2. **Browser validation blocking JS validation**: Add `novalidate` to `<form>` when using custom validation.
3. **select required interfering with v-model**: Don't use `required` on `<select>` with Vue v-model; let Vue handle validation.
4. **Missing API route**: When creating new CRUD, create all 4 files: `.get.ts`, `.post.ts`, `[id].put.ts`, `[id].delete.ts`.
5. **Server utils import**: Use `import { rtdbGetList } from '~/server/utils/firebase'` (not relative paths) for server-side imports.
