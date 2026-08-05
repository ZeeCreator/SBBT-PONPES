opencode -s ses_099f39a6bffes7K1YGhCWv6zfn

# DETAIL-SYSTEM — SIM-PPT (Sistem Informasi Manajemen Pondok Pesantren Terpadu)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 3 (Vue 3 + Nitro server) |
| CSS | Tailwind CSS via `@nuxtjs/tailwindcss` |
| Client DB | Firebase (Firestore + Realtime Database) via `firebase` v11 SDK |
| Server DB | Firebase Admin SDK via `firebase-admin` v13 (Realtime Database only) |
| Client Auth | Firebase Auth (`signInWithEmailAndPassword`, `signInWithCustomToken`) |
| Server Auth | Firebase Admin `auth.verifyIdToken()` + custom JWT session cookies via `jose` |
| OCR | Tesseract.js + OCR.space API |
| Spreadsheet | xlsx (SheetJS) for import/export |
| Icons | Material Symbols Outlined (font) |
| Environment | `.env` for secrets (gitignored) |

## Project Structure

```
nuxt/
├── .env                          # Firebase config, service account (base64), API keys
├── nuxt.config.ts                # Runtime config, modules, app head
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind theme customization
├── tsconfig.json
├── vercel.json                   # Vercel deployment config
├── app.vue
│
├── assets/css/main.css           # Global styles + glass-card, bg-mesh utilities
├── types/                        # (future) TS type declarations
├── scripts/patch-vite-node.mjs   # Postinstall patch
│
├── layouts/
│   ├── default.vue
│   ├── super-admin.vue
│   ├── kesantrian.vue
│   ├── ustadz.vue
│   ├── wali-santri.vue
│   ├── santri.vue                 # Deprecated — uses wali_santri role menu
│   └── alumni.vue
│
├── components/
│   ├── Sidebar.vue                # Sidebar navigation (variant: admin|ustadz|alumni|walisantri)
│   └── TopBar.vue                 # Top bar with user info
│
├── composables/
│   ├── useFirebase.ts             # Firebase init + useAuth (login, loginWithNis, logout, role)
│   ├── useRoleMenu.ts             # Role → menu items mapping (NO santri role)
│   └── useOcrParser.ts            # OCR utility
│
├── middleware/
│   └── auth.global.ts             # Client-side route guard (checks authCookie + user)
│
├── plugins/
│   ├── api-auth.ts                # (simplified) No Bearer injection — session cookie used
│   └── auth.client.ts             # Calls useAuth().init() for onAuthStateChanged
│
├── pages/
│   ├── index.vue                  # Landing page
│   ├── auth/login.vue             # Login: Email tab (admin/ustadz) | NIS tab (wali santri, passwordless)
│   ├── developer.vue              # Dev tools (backup/restore UI, drive upload)
│   │
│   ├── super-admin/dashboard.vue
│   ├── settings/rbac.vue
│   ├── settings/teachers.vue
│   ├── kesantrian/students.vue
│   ├── kesantrian/information-vector/index.vue
│   ├── master-data/ (classes, dormitories, periods, academic-years)
│   ├── akademik/ (curriculum, grading, imtihan, menu)
│   ├── jadwal/index.vue
│   ├── tahfidz/index.vue
│   ├── attendance/index.vue
│   ├── ibadah/ (prayer-attendance, fasting, infaq, tahajjud, wirid, zakat)
│   ├── keuangan/ (spp-payment, wali-santri, salaries, scholarships, spp-config)
│   ├── kesehatan/ (medical-records, growth, nutrition, sanitation)
│   ├── extracurricular/ (index, arts, hadroh, media, public-speaking)
│   ├── psb/ (registrations, results, tests)
│   ├── alumni/ (index, events, graduations)
│   ├── izin/index.vue
│   ├── mutasi/index.vue
│   ├── inventaris/index.vue
│   ├── khidmah/index.vue
│   ├── koperasi/index.vue
│   ├── reward/index.vue
│   ├── notifikasi/index.vue
│   ├── laporan/index.vue
│   ├── tools/import-export.vue
│   ├── portal/ (guru.vue, musyrif.vue)
│   ├── student/dashboard.vue      # Redirects to /wali-santri/dashboard
│   └── wali-santri/
│       ├── dashboard.vue           # Wali Santri dashboard (hardcoded demo data)
│       ├── register.vue            # Admin: register wali_santri account (NIS only, no password)
│       └── todos.vue               # CRUD todos for wali_santri
│
├── server/
│   ├── plugins/
│   │   └── firebase-admin.ts       # Init Firebase Admin SDK from env FIREBASE_SERVICE_ACCOUNT_KEY
│   │
│   ├── middleware/
│   │   ├── security.ts             # Security headers + rate limit headers
│   │   └── auth.ts                 # Verify __session cookie (Firebase session + custom JWT) + Bearer fallback
│   │
│   ├── utils/
│   │   ├── firebase.ts             # verifyFirebaseToken, logActivity, CRUD helpers, generateId
│   │   ├── session.ts              # createSessionToken / verifySessionToken (jose HS256 JWT)
│   │   ├── id-generator.ts         # generateNIS() / generateNUPTK() — 8 random digits
│   │   ├── backup.ts               # RTDB dump/restore, local file save/list/read/delete
│   │   └── drive.ts                # Google Drive API: JWT auth, list, upload (resumable), download
│   │
│   └── api/                        # All API endpoints under /api/**
│       ├── auth/
│       │   ├── login.post.ts       # Email+password login → Firebase session cookie
│       │   ├── logout.post.ts      # Clear __session cookie
│       │   ├── nis-login.post.ts   # NIS-only login → custom JWT session cookie + Firebase customToken
│       │   ├── register.post.ts    # Create Firebase Auth user (admin use)
│       │   ├── register-nis.post.ts# Create wali_santri account (no password, uid = wali_{nis})
│       │   ├── nis-map.get.ts      # Resolve NIS → wali_santri info (single or list)
│       │   ├── nis-map/[nis].delete.ts # Delete nis_map entry + Firebase Auth user
│       │   ├── set-role.post.ts    # Set user role in RTDB
│       │   └── users.get.ts        # List Firebase Auth users with roles
│       │
│       ├── todos/                  # Wali Santri todos CRUD (RTDB)
│       │   ├── index.get.ts, index.post.ts
│       │   └── [id].put.ts, [id].delete.ts
│       │
│       ├── backup/                 # Backup & Restore system
│       │   ├── index.get.ts        # List local backups
│       │   ├── index.post.ts       # Create backup
│       │   ├── restore.post.ts     # Restore from local backup
│       │   ├── [name].delete.ts    # Delete local backup
│       │   ├── download/[name].get.ts # Download backup file
│       │   └── drive/              # Google Drive integration
│       │       ├── list.get.ts     # List Drive files
│       │       ├── upload.post.ts  # Upload to Drive
│       │       └── restore.post.ts # Restore from Drive
│       │
│       ├── students/               # Santri CRUD (RTDB, keyed by random ID)
│       │   ├── index.get.ts, index.post.ts
│       │   ├── [id].put.ts (partial update OK, no waliKelas, no NIS regen)
│       │   └── [id]/violations.get.ts, violations.post.ts
│       │
│       ├── guru/                   # Guru CRUD
│       │   ├── index.get.ts, index.post.ts
│       │   └── [id].put.ts (partial update OK)
│       │
│       ├── dashboard-stats.get.ts  # Aggregated stats (class grouping from master data)
│       ├── health.get.ts
│       └── ... (many other CRUD endpoints)
```

---

## AUTHENTICATION SYSTEM (CRITICAL)

### Two auth mechanisms

| Mechanism | Used for | Cookie/Header |
|-----------|----------|--------------|
| **Session Cookie** (`__session`) | Primary API auth via server middleware | `Set-Cookie: __session=<JWT>` |
| **Bearer Token** (Firebase ID Token) | Fallback API auth | `Authorization: Bearer <token>` |
| **Firebase Client SDK** | Client-side Firebase access (Firestore, RTDB) | `onAuthStateChanged` + localStorage |

### Login flows

#### 1. Wali Santri / Santri (NIS only, NO password)
```
Client: POST /api/auth/nis-login { nis }
Server:
  ├─ Lookup nis_map/{nis} → wali_santri (uid from nis_map, name=parentName)
  └─ Lookup students (orderByChild='nis') → santri → mapped to wali_santri role (uid=santri_{nis})
  ├─ Ensure roles/{uid} exists with role='wali_santri'
  ├─ Generate Firebase customToken: auth.createCustomToken(uid, { role: 'wali_santri' })
  ├─ Create session JWT: createSessionToken({ uid, role, nis, name, email })
  ├─ Set cookie: __session (httpOnly, sameSite=lax, path=/, maxAge=7d)
  └─ Return { uid, role, customToken, name, nis, email }
Client:
  ├─ signInWithCustomToken(customToken) → Firebase client SDK signed in
  └─ Redirect to dashboard
```

#### 2. Admin / Ustadz / etc. (Email + Password)
```
Client: POST /api/auth/login { email, password }
Server:
  ├─ Verify via Firebase REST API: accounts:signInWithPassword
  ├─ Create Firebase session cookie: auth.createSessionCookie(idToken)
  ├─ Set cookie: __session (httpOnly, sameSite=lax, path=/, maxAge=7d)
  └─ Return { uid, role, name, idToken }
Client:
  ├─ signInWithEmailAndPassword(email, password) → Firebase client SDK signed in
  └─ Redirect to dashboard
```

#### 3. Logout
```
Client: POST /api/auth/logout
Server: deleteCookie(event, '__session')
Client: signOut(auth) → user=null, role=null, authCookie=false
```

### Server middleware (`server/middleware/auth.ts`)

Runs on every `/api/` request **except** PUBLIC_ROUTES:
- `/api/health`
- `/api/uptime/`
- `/api/auth/login`
- `/api/auth/nis-login`

Priority:
1. Read `__session` cookie → try `verifySessionCookie()` (Firebase session) → if fails, try `verifySessionToken()` (custom JWT)
2. If no UID from cookie → try `Authorization: Bearer <idToken>` → `verifyIdToken()`
3. If UID found but no role → look up `roles/{uid}/role` from RTDB
4. Sets `event.context.auth = { uid, role, name, email, nis }`

### Session JWT (`server/utils/session.ts`)

- Algorithm: HS256 via `jose`
- Payload: `{ uid, role, nis, name, email }`
- Expiry: 7 days
- Secret: `process.env.NUXT_SESSION_SECRET` (fallback `'dev-session-secret-change-in-production'`)

### Client-side composable (`composables/useFirebase.ts`)

| Method | Description |
|--------|-------------|
| `init()` | Subscribe to `onAuthStateChanged`, set user/loading/authCookie |
| `login(email, password)` | Call server POST /api/auth/login + Firebase signInWithEmailAndPassword |
| `loginWithNis(nis)` | Call server POST /api/auth/nis-login + Firebase signInWithCustomToken |
| `loginWithToken(customToken)` | Direct Firebase signInWithCustomToken |
| `logout()` | Firebase signOut + POST /api/auth/logout |
| `refreshRole()` | Read roles/{uid}/role from RTDB, fallback to ID token claims |
| `getIdToken()` | Return current Firebase user's ID token |

### Important auth rules
- **No `santri` role exists.** Student login maps to `wali_santri` role.
- `__session` cookie is HTTP-only, can't be read by JS — prevents XSS token theft.
- The `api-auth.ts` plugin is simplified to a no-op. No Bearer injection needed.
- `authCookie` (boolean, `auth-logged-in`) is used by SSR route guard as a quick check. Not security-critical.

---

## DATABASE (Firebase Realtime Database)

Single project: `alfatahsppt` — RTDB at `alfatahsppt-default-rtdb.firebaseio.com`

### Key paths

| Path | Purpose |
|------|---------|
| `students/{id}` | Student records (keyed by random 20-char ID). Fields: name, nis, class, classId, city, gender, dormitoryId, dormitoryName, roomId, roomName, phone, address, parentName, parentPhone, disciplineScore, status, createdAt |
| `teacher/{id}` | Teacher/guru records |
| `roles/{uid}` | Role mapping: `{ role: string, email, displayName, nis?, updatedAt }` |
| `nis_map/{nis}` | Wali Santri NIS → Firebase Auth mapping: `{ uid, email, studentName, parentName, createdAt }` |
| `todos/{id}` | Wali Santri todos: `{ uid, title, description, done, priority, createdAt, updatedAt }` |
| `activity_logs/{id}` | Activity log entries |
| `master-data/` | classes, periods, academic-years, dormitories (sub-paths) |
| `attendance/` | Attendance records |
| `grades/` | Academic grades |
| ... | Many more CRUD paths |

### NIS generation (`server/utils/id-generator.ts`)
- `generateNIS()` → 8 random digits as string
- `generateNUPTK()` → 8 random digits as string
- No dependence on name or date. Pure random.
- **NIS/NUPTK are NEVER regenerated on PUT updates.**

---

## BACKUP & RESTORE

### Local backups (`server/utils/backup.ts`)
- `dumpRTDB()` → `ref('/').once('value')` → full data snapshot
- `saveBackup(data)` → write to `.output/backups/{timestamp}.json`
- `listBackups()` → return sorted file list
- `readBackup(name)` → read file content
- `restoreBackup(data)` → `ref('/').set(data)` (full replace)
- `deleteBackup(name)` → remove file

### Google Drive (`server/utils/drive.ts`)
- JWT auth from `FIREBASE_SERVICE_ACCOUNT_KEY` base64 env
- `getAccessToken()` → Drive API access token
- `listDriveFiles()` → search for `application/json` files
- `uploadToDrive(fileName, jsonData)` → resumable upload to Drive
- `downloadFromDrive(fileId)` → download file content

### API endpoints (`/api/backup/*`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/backup` | GET | List local backups |
| `/api/backup` | POST | Create new backup |
| `/api/backup/restore` | POST | Restore from backup body |
| `/api/backup/{name}` | DELETE | Delete local backup |
| `/api/backup/download/{name}` | GET | Download backup file |
| `/api/backup/drive/list` | GET | List Drive backup files |
| `/api/backup/drive/upload` | POST | Upload to Drive |
| `/api/backup/drive/restore` | POST | Restore from Drive file |

---

## WALI SANTRI SYSTEM

### Registration (admin only)
- UI: `/wali-santri/register` (under super_admin menu `Wali Santri`)
- API: `POST /api/auth/register-nis { nis }`
- Creates Firebase Auth user: `createUser({ uid: 'wali_{nis}', email: 'wali-{nis}@alfatah.sch.id', displayName })`
- No password set — user authenticates via custom token only
- Creates `nis_map/{nis}` + `roles/{uid}` entries

### Login
- NIS only, no password needed
- `POST /api/auth/nis-login` handles both:
  - Existing wali_santri (from nis_map)
  - Students without nis_map (auto-mapped to wali_santri role)
- Returns Firebase custom token + sets session cookie

### Todos
- UI: `/wali-santri/todos`
- API: `/api/todos/*` (CRUD)
- RTDB path: `todos/{id}` with fields: uid, title, description, done (boolean), priority (Rendah/Sedang/Tinggi), createdAt, updatedAt
- Filtered by `uid` (owner)
- Sortable by createdAt or priority

### Dashboard
- UI: `/wali-santri/dashboard`
- Currently uses hardcoded demo data (transactions, subjects, attendanceStats)
- Shows student info, SPP status, academic progress, disciplinary points, attendance overview

---

## CRITICAL FIXES & CONVENTIONS

### 1. Headers bug (FIXED)
`plugins/api-auth.ts` originally used `...(init.headers)` spread on a native `Headers` object, which yields `[key, value]` arrays instead of key-value pairs. Fixed by `headersToPlain()` helper that handles `Headers` instanceof, arrays, and plain objects. Now simplified to no-op since session cookie handles auth.

### 2. Undefined body.name (FIXED)
All POST/PUT endpoints must use `body.name?.trim() || ''` and `const body = await readBody(event) || {}` to prevent Firebase `set/update` from receiving `undefined` values.

### 3. PUT partial updates (FIXED)
PUT endpoints (`students/[id].put.ts`, `guru/[id].put.ts`) accept partial payloads. Only fields present in body are sanitized and applied. NIS/NUPTK are NEVER regenerated on PUT. No `name` field required for partial updates.

### 4. Wali Kelas removed (FIXED)
All `waliKelas` and `waliKelasId` fields removed from:
- Student POST/PUT endpoints
- Student form (pages/kesantrian/students.vue)
- Information vector display
- Mutasi print page

### 5. Dashboard class grouping (FIXED)
`dashboard-stats.get.ts` groups students by `class` field from student records, NOT from master data classes. This prevents phantom/empty classes from appearing in stats.

### 6. No `santri` role exists
All student-facing functionality is under `wali_santri` role. The `santri` role has been removed from `useRoleMenu.ts`. The `santri` layout (`layouts/santri.vue`) defaults to `wali_santri` role menu. `pages/student/dashboard.vue` redirects to `/wali-santri/dashboard`.

---

## ROLE SYSTEM

| Role | Menu Variant | Layout | Description |
|------|-------------|--------|-------------|
| `super_admin` | admin | super-admin | Full access |
| `bendahara` | admin | super-admin | Financial management |
| `kesantrian` | admin | kesantrian | Student affairs |
| `ustadz` | ustadz | ustadz | Teacher |
| `wali_santri` | walisantri | wali-santri | Parent/guardian |
| `alumni` | alumni | alumni | Alumni |

Role menu is defined in `composables/useRoleMenu.ts`. `useRoleMenu(role)` returns the config or defaults to `wali_santri`. Uses `SidebarVariant` type: `'admin' | 'ustadz' | 'alumni' | 'walisantri'` (no 'santri').

---

## ENVIRONMENT VARIABLES (.env)

```
# Firebase Client SDK
NUXT_PUBLIC_FIREBASE_API_KEY=...
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NUXT_PUBLIC_FIREBASE_PROJECT_ID=...
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NUXT_PUBLIC_FIREBASE_APP_ID=...
NUXT_PUBLIC_FIREBASE_DATABASE_URL=...

# Firebase Admin SDK (base64-encoded service account JSON)
FIREBASE_SERVICE_ACCOUNT_KEY=...

# OCR & AI
NUXT_GEMINI_API_KEY=...
NUXT_OPENROUTER_API_KEY=...
NUXT_OCR_SPACE_API_KEY=...

# Session (optional — fallback to dev secret)
NUXT_SESSION_SECRET=...
```

---

## BUILD & DEPLOY

```bash
npm run build       # Nuxt build → .output/
npm run dev         # Development server
npm run preview     # Preview production build
```

- Vercel deployment via `vercel.json`
- Preview: `node .output/server/index.mjs`

---

## COMMON PITFALLS FOR AI

1. **`event.context.auth` is set by `server/middleware/auth.ts`** — always check `event.context.auth?.uid` instead of manually verifying tokens.
2. **`logActivity()` uses `event.context.auth` first** — fallback to auth header only if context not set.
3. **No password for wali_santri** — `register-nis.post.ts` creates users without password. `createUser({ uid, email, displayName })`.
4. **UID formats**: `wali_{nis}` for registered wali_santri, `santri_{nis}` for auto-mapped students.
5. **Session cookie is custom JWT** for NIS login, **Firebase session cookie** for email login. `server/middleware/auth.ts` handles both.
6. **`api-auth.ts` is a no-op** — do NOT re-add Bearer token injection unless needed for a specific non-cookie scenario.
7. **NIS is 8 digits max** — enforced in login input (`maxlength="8"`).
8. **`useAuth().loginWithNis(nis)` is the correct method** for wali_santri login, NOT `login()`.
9. **Do NOT add `requiredRole: 'santri'` to any page** — use `wali_santri`.
10. **Do NOT assume `santri` layout exists** — santri.vue redirects to wali-santri role.
