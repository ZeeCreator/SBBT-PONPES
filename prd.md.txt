# Product Requirements Document (PRD)

## Sistem Informasi Manajemen Pondok Pesantren Terpadu (SIM-PPT)

| Atribut | Detail |
|---|---|
| **Nama Proyek** | Sistem Informasi Manajemen Pondok Pesantren Terpadu (SIM-PPT) |
| **Fase** | Tahap 1 — Pengembangan Inti (API & Web Base) |
| **Arsitektur** | Serverless Backend & NoSQL Cloud Database |
| **Status Dokumen** | Draft v1.0 |

---

## 1. Ringkasan Eksekutif

SIM-PPT adalah platform manajemen digital terpadu untuk lingkungan pondok pesantren. Sistem ini dibangun di atas infrastruktur **Vercel** untuk eksekusi antarmuka dan backend API yang cepat, dengan **Firebase** sebagai pusat data (NoSQL), manajemen autentikasi, dan sinkronisasi real-time.

Kombinasi ini menghasilkan aplikasi yang:
- Sangat skalabel
- Aman dari serangan level infrastruktur
- Efisien secara biaya operasional

---

## 2. Tujuan Proyek

| # | Tujuan | Deskripsi |
|---|---|---|
| 1 | **Aksesibilitas Real-time** | Memberikan pembaruan instan kepada wali santri terkait data kehadiran, pelanggaran, dan status pembayaran |
| 2 | **Keandalan Infrastruktur** | Menghilangkan beban pemeliharaan server tradisional dengan pendekatan serverless-native |
| 3 | **Keamanan Maksimal** | Mengamankan data sensitif pesantren melalui Firebase Security Rules dan validasi backend berlapis |

---

## 3. Tumpukan Teknologi (Tech Stack)

### 3.1 Frontend & Backend API
- **Nuxt.js** — ideal untuk server-side rendering dan API route handlers di Vercel
- **NestJS** — digunakan sebagai backend API terpisah untuk logika bisnis yang lebih kompleks dan terstruktur (modular, testable, mengikuti pola arsitektur enterprise: Controller-Service-Module)
  - Di-deploy sebagai **Vercel Serverless Function**, menggunakan adapter seperti `@nestjs/platform-express` yang dibungkus melalui handler serverless (misalnya `serverless-http` atau `@vendia/serverless-express`) agar kompatibel dengan runtime Vercel
  - Entry point NestJS diekspos melalui satu file handler di `/api/index.ts` (atau struktur folder `api/` sesuai konvensi Vercel), sehingga seluruh route NestJS (controller & module) tetap berjalan dalam satu function tanpa cold-start berlebihan
  - Cocok digunakan untuk domain-domain dengan business logic berat, seperti modul Keuangan (integrasi Midtrans), generate PDF (Puppeteer), dan validasi terpusat, sementara Nuxt.js tetap menangani sisi UI dan API ringan lainnya

### 3.1.1 Pertimbangan Arsitektur Nuxt.js vs NestJS pada Vercel
| Aspek | Nuxt.js (Nitro API Routes) | NestJS (Serverless Function) |
|---|---|---|
| **Peran** | UI + API ringan/general | Backend service khusus untuk logika bisnis kompleks |
| **Struktur** | File-based routing (`/server/api/...`) | Modular (Controller, Service, Module, DTO, Guard) |
| **Cocok untuk** | CRUD ringan, proxy request, SSR page data | Validasi berlapis, integrasi pihak ketiga (Midtrans, Puppeteer), business rule kompleks |
| **Deployment di Vercel** | Native, tanpa konfigurasi tambahan | Butuh adapter serverless + konfigurasi `vercel.json` (rewrites ke satu entry function) |
| **Skalabilitas Tim** | Baik untuk tim kecil/menengah | Lebih baik untuk tim besar yang butuh standar arsitektur backend yang ketat |

> **Catatan:** Kedua stack tetap 100% kompatibel dengan model serverless Vercel dan sama-sama menggunakan Firebase Admin SDK untuk akses data privileged. Pemilihan mana yang menangani suatu endpoint disesuaikan dengan kompleksitas domain masing-masing modul.

### 3.2 Database & Storage
| Komponen | Fungsi |
|---|---|
| **Firebase Cloud Firestore** | Penyimpanan data terstruktur (data santri, nilai, tagihan) |
| **Firebase Storage** | Menyimpan pasfoto santri, bukti transfer manual, dan dokumen |

### 3.3 Autentikasi
- **Firebase Authentication** dengan implementasi **Custom Claims** untuk manajemen peran pengguna (RBAC)

### 3.4 UI/UX & Styling
- **Tailwind CSS**
- Pendekatan desain: clean, minimalis, elegan
- Sentuhan **Glassmorphism ringan** pada komponen dashboard utama
- Pengawasan ketat terhadap elemen visual berlebihan agar performa peramban tetap ringan

### 3.5 Integrasi & Otomatisasi
| Layanan | Fungsi |
|---|---|
| **Midtrans API** | Gerbang pembayaran (Virtual Account, QRIS) untuk SPP |
| **Puppeteer** | Generate laporan rapor & kuitansi SPP otomatis (PDF resolusi tinggi) pada serverless function |

---

## 4. Hak Akses & Peran Pengguna (RBAC via Firebase Custom Claims)

Berbeda dengan database SQL, peran pengguna disematkan langsung ke dalam token Firebase menggunakan **Custom Claims** melalui **Firebase Admin SDK** di Vercel.

| Peran | Hak Akses |
|---|---|
| **Super Admin** | Akses penuh ke dashboard utama dan Firebase Console |
| **Bendahara** | Akses ke collection `payments` dan `invoices` |
| **Kesantrian** | Akses write ke collection `disciplinary_records` |
| **Wali Santri** | Akses read-only, dikunci via Firestore Rules (hanya bisa membaca dokumen jika `studentId` cocok dengan data anak mereka) |

---

## 5. Kebutuhan Fungsional (Fitur Inti)

### A. Modul Autentikasi
1. Pengguna login menggunakan email/nomor HP via Firebase Auth di sisi client
2. Klien mengirimkan ID Token Firebase ke Vercel API
3. Vercel API memverifikasi token menggunakan Firebase Admin SDK sebelum memproses permintaan sensitif

### B. Modul Akademik & Kesantrian
- **Struktur Data NoSQL:** Collection `students` memiliki sub-collection `grades` (nilai) dan `violations` (pelanggaran)
- **Notifikasi Instan:** Memanfaatkan listener bawaan Firestore agar aplikasi web pengasuh asrama langsung diperbarui secara real-time ketika ada santri yang tercatat melakukan pelanggaran

### C. Modul Keuangan & Integrasi Midtrans
Alur proses:
1. Bendahara men-generate tagihan di sistem → membuat dokumen berstatus `pending` di Firestore
2. Wali santri melakukan checkout → sistem memanggil Midtrans Snap API
3. **Webhook Midtrans:** saat pembayaran berhasil, Midtrans memanggil endpoint Vercel API `/api/midtrans-webhook`
4. Vercel API memverifikasi signature key Midtrans, lalu memperbarui status dokumen di Firestore menjadi `paid` menggunakan Firebase Admin SDK (melewati batasan client-side)
5. Orang tua dapat mengunduh kuitansi PDF yang di-render secara headless oleh Puppeteer di Vercel

---

## 6. Kebutuhan Non-Fungsional (Keamanan Siber Khusus Firebase)

### 6.1 Firestore Security Rules (Krusial)
Ini adalah benteng pertahanan utama. Data tidak boleh hanya bisa diakses melalui Vercel API — database itu sendiri harus dikunci.

Contoh aturan:
```
allow write: if request.auth.token.role == 'bendahara';
```
> Mencegah pihak tak berwenang memanipulasi data SPP langsung dari client-side.

### 6.2 Validasi Input API
Semua request ke endpoint API Vercel wajib divalidasi skemanya untuk mencegah masuknya data kotor (misalnya script XSS yang disamarkan dalam nama santri) ke dalam Firestore.

### 6.3 Manajemen Kredensial
- Service Account Key Firebase Admin (format JSON) dan Server Key Midtrans **wajib** disimpan sebagai Environment Variables terenkripsi di dashboard pengaturan Vercel
- **Dilarang keras** berada di repositori kode

---

## 7. Arsitektur Komunikasi Sistem

| Jenis Aktivitas | Alur Komunikasi | Keterangan |
|---|---|---|
| **Publik/Admin (Client-side)** | UI Web (Nuxt) ↔ Firebase Firestore (via Client SDK) | Untuk operasi read ringan yang sudah diamankan oleh Firestore Rules; menghemat panggilan ke Vercel API |
| **Sensitif Ringan (Server-side, Nuxt)** | UI Web (Nuxt) → Vercel API (`/server/api/...`) → Firebase Admin SDK | Untuk endpoint ringan: pembuatan dokumen sederhana, proxy data, operasi CRUD dasar |
| **Sensitif & Bisnis Kompleks (Server-side, NestJS)** | UI Web (Nuxt) → Vercel Serverless Function (NestJS) → Firebase Admin SDK / Midtrans API / Puppeteer | Wajib untuk: pembuatan tagihan SPP, generate PDF rapor (Puppeteer), integrasi Midtrans, dan penerimaan webhook pembayaran — memanfaatkan struktur modular NestJS (Guard, Interceptor, DTO Validation) untuk keamanan dan validasi berlapis |

---

## 8. Ringkasan Diagram Alur Data (Deskriptif)

```
[Wali Santri / Admin] 
        │
        ├── Read ringan ────────────► Firebase Firestore (Client SDK, diamankan Firestore Rules)
        │
        ├── Aksi sensitif ringan ───► Vercel API - Nuxt (/server/api/...)
        │                                     │
        │                                     └─► Firebase Admin SDK (write privileged)
        │
        └── Aksi bisnis kompleks ───► Vercel Serverless Function - NestJS (/api/...)
                                              │
                                              ├─► Firebase Admin SDK (write privileged)
                                              ├─► Midtrans Snap API (pembayaran)
                                              └─► Puppeteer (generate PDF rapor/kuitansi)
```

---

*Dokumen ini disusun berdasarkan spesifikasi awal proyek SIM-PPT Tahap 1 dan dapat diperbarui seiring perkembangan kebutuhan fungsional maupun teknis.*