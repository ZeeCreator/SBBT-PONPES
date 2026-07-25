import { defineEventHandler, setHeader } from 'h3'

const BASE_URL = 'https://sbbt-ponpes-t6x9.vercel.app'

const endpoints = [
  { method: 'GET', path: '/api', desc: 'API Roadmap & Documentation' },
  { method: 'GET', path: '/api/docs', desc: 'API Documentation (Markdown)' },
  { method: 'GET', path: '/api/health', desc: 'Health Check' },
  { method: 'GET', path: '/api/search', desc: 'Search across all data' },
  { method: 'GET', path: '/api/activity-logs', desc: 'Get activity logs' },
  { method: 'POST', path: '/api/activity-logs', desc: 'Create activity log' },
  { method: 'GET', path: '/api/dashboard-stats', desc: 'Dashboard statistics' },
  { method: 'GET', path: '/api/students', desc: 'List all students' },
  { method: 'POST', path: '/api/students', desc: 'Create student' },
  { method: 'GET', path: '/api/students/[id]', desc: 'Get student by ID' },
  { method: 'PUT', path: '/api/students/[id]', desc: 'Update student' },
  { method: 'DELETE', path: '/api/students/[id]', desc: 'Delete student' },
  { method: 'GET', path: '/api/students/[id]/violations', desc: 'Get student violations' },
  { method: 'POST', path: '/api/students/[id]/violations', desc: 'Add student violation' },
  { method: 'GET', path: '/api/invoices', desc: 'List invoices' },
  { method: 'POST', path: '/api/invoices', desc: 'Create invoice' },
  { method: 'GET', path: '/api/invoices/[id]', desc: 'Get invoice by ID' },
  { method: 'PUT', path: '/api/invoices/[id]', desc: 'Update invoice' },
  { method: 'DELETE', path: '/api/invoices/[id]', desc: 'Delete invoice' },
  { method: 'GET', path: '/api/payments', desc: 'List payments' },
  { method: 'POST', path: '/api/payments', desc: 'Create payment' },
  { method: 'GET', path: '/api/auth/login', desc: 'Login with email/password' },
  { method: 'POST', path: '/api/auth/login', desc: 'Login endpoint' },
  { method: 'POST', path: '/api/auth/logout', desc: 'Logout' },
  { method: 'POST', path: '/api/auth/nis-login', desc: 'Login with NIS' },
  { method: 'GET', path: '/api/auth/nis-map', desc: 'Get NIS mapping' },
  { method: 'POST', path: '/api/auth/register', desc: 'Register new user' },
  { method: 'POST', path: '/api/auth/register-nis', desc: 'Register NIS' },
  { method: 'POST', path: '/api/auth/set-role', desc: 'Set user role' },
  { method: 'GET', path: '/api/auth/users', desc: 'List users' },
  { method: 'GET', path: '/api/attendance', desc: 'Get attendance records' },
  { method: 'POST', path: '/api/attendance', desc: 'Create attendance record' },
  { method: 'POST', path: '/api/attendance/ocr', desc: 'OCR attendance scan' },
  { method: 'GET', path: '/api/akademik', desc: 'Academic overview' },
  { method: 'GET', path: '/api/akademik/grades', desc: 'List grades' },
  { method: 'POST', path: '/api/akademik/grades', desc: 'Create grade' },
  { method: 'GET', path: '/api/akademik/subjects', desc: 'List subjects' },
  { method: 'POST', path: '/api/akademik/subjects', desc: 'Create subject' },
  { method: 'GET', path: '/api/akademik/iktibar', desc: 'List iktibar exams' },
  { method: 'GET', path: '/api/akademik/imtihan', desc: 'List imtihan exams' },
  { method: 'GET', path: '/api/master-data/classes', desc: 'List classes' },
  { method: 'POST', path: '/api/master-data/classes', desc: 'Create class' },
  { method: 'GET', path: '/api/master-data/dormitories', desc: 'List dormitories' },
  { method: 'POST', path: '/api/master-data/dormitories', desc: 'Create dormitory' },
  { method: 'GET', path: '/api/master-data/academic-years', desc: 'List academic years' },
  { method: 'GET', path: '/api/master-data/periods', desc: 'List periods' },
  { method: 'GET', path: '/api/guru', desc: 'List teachers' },
  { method: 'POST', path: '/api/guru', desc: 'Create teacher' },
  { method: 'GET', path: '/api/alumni', desc: 'List alumni' },
  { method: 'POST', path: '/api/alumni', desc: 'Create alumni record' },
  { method: 'GET', path: '/api/alumni/events', desc: 'List alumni events' },
  { method: 'GET', path: '/api/alumni/graduations', desc: 'List graduations' },
  { method: 'GET', path: '/api/ibadah/fasting', desc: 'List fasting records' },
  { method: 'GET', path: '/api/ibadah/infaq', desc: 'List infaq records' },
  { method: 'GET', path: '/api/ibadah/prayer-attendance', desc: 'Prayer attendance' },
  { method: 'GET', path: '/api/ibadah/tahajjud', desc: 'Tahajjud records' },
  { method: 'GET', path: '/api/ibadah/wirid', desc: 'Wirid records' },
  { method: 'GET', path: '/api/ibadah/zakat', desc: 'Zakat records' },
  { method: 'GET', path: '/api/extracurricular', desc: 'List extracurriculars' },
  { method: 'GET', path: '/api/extracurricular/arts', desc: 'Arts activities' },
  { method: 'GET', path: '/api/extracurricular/hadroh', desc: 'Hadroh activities' },
  { method: 'GET', path: '/api/extracurricular/media', desc: 'Media activities' },
  { method: 'GET', path: '/api/extracurricular/public-speaking', desc: 'Public speaking' },
  { method: 'GET', path: '/api/keuangan/salaries', desc: 'List salaries' },
  { method: 'GET', path: '/api/keuangan/scholarships', desc: 'List scholarships' },
  { method: 'GET', path: '/api/keuangan/spp-config', desc: 'SPP configuration' },
  { method: 'GET', path: '/api/inventaris', desc: 'List inventory items' },
  { method: 'GET', path: '/api/inventaris/loans', desc: 'List inventory loans' },
  { method: 'GET', path: '/api/izin', desc: 'List permits' },
  { method: 'POST', path: '/api/izin', desc: 'Create permit' },
  { method: 'GET', path: '/api/jadwal', desc: 'List schedules' },
  { method: 'GET', path: '/api/kesehatan/growth', desc: 'Growth records' },
  { method: 'GET', path: '/api/kesehatan/medical-records', desc: 'Medical records' },
  { method: 'GET', path: '/api/kesehatan/nutrition', desc: 'Nutrition records' },
  { method: 'GET', path: '/api/kesehatan/sanitation', desc: 'Sanitation records' },
  { method: 'GET', path: '/api/khidmah', desc: 'Khidmah records' },
  { method: 'GET', path: '/api/koperasi/items', desc: 'Cooperative items' },
  { method: 'GET', path: '/api/koperasi/transactions', desc: 'Cooperative transactions' },
  { method: 'GET', path: '/api/laporan', desc: 'Reports overview' },
  { method: 'GET', path: '/api/laporan/financial', desc: 'Financial report' },
  { method: 'POST', path: '/api/laporan/generate', desc: 'Generate report' },
  { method: 'GET', path: '/api/laporan/raport/[studentId]', desc: 'Student report card' },
  { method: 'GET', path: '/api/laporan/receipt/[invoiceId]', desc: 'Payment receipt' },
  { method: 'GET', path: '/api/mutasi', desc: 'Mutation records' },
  { method: 'GET', path: '/api/notifikasi', desc: 'Notifications' },
  { method: 'POST', path: '/api/ocr/analyze', desc: 'OCR analyze image' },
  { method: 'GET', path: '/api/psb/registrations', desc: 'PSB registrations' },
  { method: 'GET', path: '/api/psb/results', desc: 'PSB results' },
  { method: 'GET', path: '/api/psb/tests', desc: 'PSB tests' },
  { method: 'GET', path: '/api/reward', desc: 'Reward records' },
  { method: 'GET', path: '/api/tahfidz/murojaah', desc: 'Murojaah records' },
  { method: 'GET', path: '/api/tahfidz/ziyadah', desc: 'Ziyadah records' },
  { method: 'GET', path: '/api/todos', desc: 'Todo list' },
  { method: 'POST', path: '/api/todos', desc: 'Create todo' },
  { method: 'POST', path: '/api/tools/import', desc: 'Import data from Excel' },
  { method: 'GET', path: '/api/tools/template', desc: 'Download import template' },
  { method: 'GET', path: '/api/uptime/check', desc: 'Uptime monitor check' },
  { method: 'GET', path: '/api/uptime/logs', desc: 'Uptime logs' },
  { method: 'GET', path: '/api/backup', desc: 'List backups' },
  { method: 'POST', path: '/api/backup', desc: 'Create backup' },
  { method: 'GET', path: '/api/backup/drive/list', desc: 'Google Drive backups' },
  { method: 'POST', path: '/api/backup/drive/upload', desc: 'Upload backup to Drive' },
  { method: 'POST', path: '/api/backup/drive/restore', desc: 'Restore from Drive' },
  { method: 'POST', path: '/api/backup/restore', desc: 'Restore from local backup' },
]

export default defineEventHandler(async (event) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIM-PPT API — Roadmap</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; padding: 2rem; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem; background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { color: #94a3b8; margin-bottom: 2rem; font-size: 0.9rem; }
    .summary { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .stat { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1rem 1.5rem; flex: 1; min-width: 120px; }
    .stat-label { color: #94a3b8; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-value { font-size: 1.5rem; font-weight: 700; margin-top: 0.25rem; }
    table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
    th { background: #334155; text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600; }
    td { padding: 0.65rem 1rem; border-top: 1px solid #1e293b; font-size: 0.85rem; }
    tr:hover td { background: #1e293b; }
    .method { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; font-family: monospace; }
    .method-GET { background: #1e3a5f; color: #60a5fa; }
    .method-POST { background: #1a3a2a; color: #4ade80; }
    .method-PUT { background: #3a2a1a; color: #fbbf24; }
    .method-PATCH { background: #2a1a3a; color: #c084fc; }
    .method-DELETE { background: #3a1a1a; color: #f87171; }
    .path { font-family: monospace; color: #e2e8f0; }
    .desc { color: #94a3b8; }
    a { color: #60a5fa; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .footer { margin-top: 2rem; text-align: center; color: #475569; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>SIM-PPT API</h1>
    <p class="subtitle">Sistem Informasi Manajemen Pondok Pesantren Terpadu — REST API Roadmap</p>

    <div class="summary">
      <div class="stat">
        <div class="stat-label">Total Endpoints</div>
        <div class="stat-value">${endpoints.length}</div>
      </div>
      <div class="stat">
        <div class="stat-label">GET</div>
        <div class="stat-value" style="color:#60a5fa">${endpoints.filter(e => e.method === 'GET').length}</div>
      </div>
      <div class="stat">
        <div class="stat-label">POST</div>
        <div class="stat-value" style="color:#4ade80">${endpoints.filter(e => e.method === 'POST').length}</div>
      </div>
      <div class="stat">
        <div class="stat-label">PUT/PATCH/DELETE</div>
        <div class="stat-value" style="color:#fbbf24">${endpoints.filter(e => ['PUT', 'PATCH', 'DELETE'].includes(e.method)).length}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Method</th>
          <th>Endpoint</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        ${endpoints.map(e => `<tr>
          <td><span class="method method-${e.method}">${e.method}</span></td>
          <td class="path"><a href="${BASE_URL}${e.path}" target="_blank">${e.path}</a></td>
          <td class="desc">${e.desc}</td>
        </tr>`).join('')}
      </tbody>
    </table>

    <div class="footer">
      SIM-PPT &copy; ${new Date().getFullYear()} &mdash; <a href="${BASE_URL}/api/docs">Markdown Docs</a>
    </div>
  </div>
</body>
</html>`

  setHeader(event, 'content-type', 'text/html; charset=utf-8')
  return html
})
