# SIM-PPT API Documentation

**Base URL:** `https://sbbt-ponpes-t6x9.vercel.app`

---

## Authentication

### `POST /api/auth/login`
Login with email and password.

**Request:**
```json
{ "email": "user@example.com", "password": "..." }
```

**Response:**
```json
{ "uid": "...", "role": "super_admin", "name": "...", "idToken": "..." }
```

### `POST /api/auth/nis-login`
Login using NIS (student ID number).

**Request:**
```json
{ "nis": "12345" }
```

**Response:**
```json
{ "uid": "...", "role": "wali_santri", "customToken": "...", "name": "...", "nis": "12345", "email": "..." }
```

### `POST /api/auth/logout`
Clear session and logout.

### `POST /api/auth/register`
Register a new account.

### `GET /api/auth/users`
List all registered users. (Requires auth)

### `GET /api/auth/nis-map`
Get NIS-to-UID mapping. (Requires auth)

### `DELETE /api/auth/nis-map/[nis]`
Remove NIS mapping.

### `POST /api/auth/register-nis`
Register/associate NIS with a user.

### `POST /api/auth/set-role`
Set user role (super_admin / admin / guru / wali_santri).

---

## Students

### `GET /api/students`
List all students.

**Query params:** `?class=`, `?status=`, `?search=`

### `POST /api/students`
Create new student record.

### `GET /api/students/[id]`
Get student details by ID.

### `PUT /api/students/[id]`
Update student data.

### `DELETE /api/students/[id]`
Delete student record.

### `GET /api/students/[id]/violations`
List violations for a student.

### `POST /api/students/[id]/violations`
Add a violation record.

---

## Attendance

### `GET /api/attendance`
Get attendance records. **Query:** `?date=`, `?class=`

### `POST /api/attendance`
Create attendance record.

### `POST /api/attendance/ocr`
Process attendance via OCR (image upload).

---

## Academic

### `GET /api/akademik`
Academic overview / dashboard data.

### `GET /api/akademik/grades`
List all grades.

### `POST /api/akademik/grades`
Add grade.

### `PUT /api/akademik/grades/[id]`
Update grade.

### `DELETE /api/akademik/grades/[id]`
Delete grade.

### `GET /api/akademik/subjects`
List subjects.

### `POST /api/akademik/subjects`
Create subject.

### `GET /api/akademik/iktibar`
List iktibar (mid-semester) exams.

### `GET /api/akademik/imtihan`
List imtihan (final) exams.

---

## Master Data

### `GET /api/master-data/classes`
List classes.

### `POST /api/master-data/classes`
Create class.

### `PUT /api/master-data/classes/[id]`
Update class.

### `DELETE /api/master-data/classes/[id]`
Delete class.

### `GET /api/master-data/dormitories`
List dormitories.

### `POST /api/master-data/dormitories`
Create dormitory.

### `PUT /api/master-data/dormitories/[id]`
Update dormitory.

### `DELETE /api/master-data/dormitories/[id]`
Delete dormitory.

### `POST /api/master-data/dormitories/[id]/rooms`
Add room to dormitory.

### `DELETE /api/master-data/dormitories/[id]/rooms/[roomId]`
Remove room from dormitory.

### `GET /api/master-data/academic-years`
List academic years.

### `GET /api/master-data/periods`
List periods.

---

## Teachers

### `GET /api/guru`
List teachers.

### `POST /api/guru`
Create teacher.

### `PUT /api/guru/[id]`
Update teacher.

### `DELETE /api/guru/[id]`
Delete teacher.

---

## Alumni

### `GET /api/alumni`
List alumni.

### `POST /api/alumni`
Create alumni record.

### `PUT /api/alumni/[id]`
Update alumni.

### `DELETE /api/alumni/[id]`
Delete alumni.

### `GET /api/alumni/events`
List alumni events.

### `POST /api/alumni/events`
Create event.

### `GET /api/alumni/graduations`
List graduation records.

---

## Ibadah (Worship)

### `GET /api/ibadah/fasting`
Fasting records.

### `GET /api/ibadah/infaq`
Infaq/donation records.

### `GET /api/ibadah/prayer-attendance`
Prayer attendance records.

### `GET /api/ibadah/tahajjud`
Tahajjud prayer records.

### `GET /api/ibadah/wirid`
Wirid/dzikr records.

### `GET /api/ibadah/zakat`
Zakat records.

---

## Extracurricular

### `GET /api/extracurricular`
List all extracurricular activities.

### `GET /api/extracurricular/arts`
Arts activities.

### `GET /api/extracurricular/hadroh`
Hadroh/music activities.

### `GET /api/extracurricular/media`
Media activities.

### `GET /api/extracurricular/public-speaking`
Public speaking activities.

---

## Finance

### `GET /api/keuangan/salaries`
Teacher salaries.

### `GET /api/keuangan/scholarships`
Student scholarships.

### `GET /api/keuangan/spp-config`
SPP/tuition fee configuration.

### `GET /api/invoices`
List invoices.

### `POST /api/invoices`
Create invoice.

### `GET /api/payments`
List payments.

### `POST /api/payments`
Record payment.

---

## Inventory

### `GET /api/inventaris`
List inventory items.

### `POST /api/inventaris`
Create inventory item.

### `GET /api/inventaris/loans`
List equipment loans.

### `POST /api/inventaris/loans`
Create loan record.

---

## Permits & Schedules

### `GET /api/izin`
List permits/excuses.

### `POST /api/izin`
Submit permit.

### `GET /api/jadwal`
Class schedules.

### `POST /api/jadwal`
Create schedule.

---

## Health

### `GET /api/kesehatan/medical-records`
Medical records.

### `GET /api/kesehatan/growth`
Growth monitoring (height/weight).

### `GET /api/kesehatan/nutrition`
Nutrition records.

### `GET /api/kesehatan/sanitation`
Sanitation/hygiene records.

---

## Reports

### `GET /api/laporan`
Reports overview.

### `GET /api/laporan/financial`
Financial report.

### `GET /api/laporan/raport/[studentId]`
Student report card (PDF/HTML).

### `GET /api/laporan/receipt/[invoiceId]`
Payment receipt (PDF/HTML).

---

## PSB (New Student Registration)

### `GET /api/psb/registrations`
List PSB registrations.

### `POST /api/psb/registrations`
Create registration.

### `GET /api/psb/results`
PSB test results.

### `GET /api/psb/tests`
PSB test schedule.

---

## Tahfidz (Quran Memorization)

### `GET /api/tahfidz/murojaah`
Murojaah (review) records.

### `GET /api/tahfidz/ziyadah`
Ziyadah (new memorization) records.

---

## Utilities

### `GET /api/search`
Search across all data.

### `GET /api/todos`
Todo list.

### `POST /api/todos`
Create todo.

### `POST /api/tools/import`
Import data from Excel file.

### `GET /api/tools/template`
Download Excel import template.

### `GET /api/uptime/check`
Uptime monitor health check.

### `GET /api/uptime/logs`
Uptime monitor logs.

---

## Backup

### `GET /api/backup`
List local backups.

### `POST /api/backup`
Create local backup.

### `GET /api/backup/drive/list`
List Drive backups.

### `POST /api/backup/drive/upload`
Upload backup to Google Drive.

### `POST /api/backup/drive/restore`
Restore from Drive.

### `POST /api/backup/restore`
Restore from local file.

---

## Misc

### `GET /api/health`
Simple health check. Returns `{ "status": "ok", "timestamp": ... }`.

### `GET /api/docs`
This documentation page in Markdown format.

### `GET /api/`
API roadmap homepage (HTML).

---

*Generated for SIM-PPT v1.0*
