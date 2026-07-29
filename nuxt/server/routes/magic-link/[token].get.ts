import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  if (!token) throw createError({ statusCode: 400, statusMessage: 'Token diperlukan' })

  const db = getDatabase()
  const snap = await db.ref(`magic_links/${token}`).once('value')
  if (!snap.exists()) {
    throw createError({ statusCode: 404, statusMessage: 'Token tidak valid' })
  }

  const data = snap.val()
  if (data.used) {
    throw createError({ statusCode: 400, statusMessage: 'Token sudah digunakan' })
  }
  if (new Date(data.expiresAt) < new Date()) {
    throw createError({ statusCode: 400, statusMessage: 'Token sudah kedaluwarsa' })
  }

  const configSnap = await db.ref('config/magic_link_download_url').once('value')
  const downloadUrl = configSnap.val() || ''
  const deepLink = `simppt://login?token=${token}`

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Membuka Aplikasi...</title>
  <meta http-equiv="refresh" content="5;url=${downloadUrl || 'about:blank'}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8f9ff; min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
    }
    .card {
      background: #fff; border-radius: 24px; padding: 48px 32px;
      max-width: 400px; width: 90%; text-align: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .spinner {
      width: 48px; height: 48px; border: 4px solid #e0e0e0;
      border-top-color: #003527; border-radius: 50%;
      animation: spin 0.8s linear infinite; margin: 0 auto 24px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { color: #003527; font-size: 20px; margin-bottom: 8px; }
    p { color: #666; font-size: 14px; line-height: 1.6; }
    .btn {
      display: inline-block; margin-top: 24px; padding: 12px 24px;
      background: #003527; color: #fff; border-radius: 12px;
      text-decoration: none; font-size: 14px; font-weight: 600;
    }
    .btn:hover { opacity: 0.9; }
    .fallback { display: none; margin-top: 24px; }
    .fallback.visible { display: block; }
    .error { color: #ba1a1a; margin-top: 12px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner" id="spinner"></div>
    <h2>Membuka Aplikasi...</h2>
    <p id="status">Jika aplikasi tidak terbuka dalam beberapa detik, klik tombol di bawah.</p>
    <div class="fallback" id="fallback">
      ${downloadUrl ? `<a href="${downloadUrl}" class="btn">Download Aplikasi</a>` : ''}
      <p class="error">Pastikan aplikasi SIM PPT sudah terinstal.</p>
    </div>
  </div>
  <script>
    (function() {
      var tryOpen = '${deepLink}';
      var fallbackUrl = ${JSON.stringify(downloadUrl)};
      var timer = setTimeout(function() {
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('status').textContent = fallbackUrl
          ? 'Aplikasi belum terinstal? Silakan download terlebih dahulu.'
          : 'Tidak dapat membuka aplikasi. Hubungi administrator.';
        document.getElementById('fallback').classList.add('visible');
      }, 3000);

      // If app opens, page loses visibility
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) clearTimeout(timer);
      });

      // Try deep link via iframe and location
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      iframe.src = tryOpen;
      setTimeout(function() {
        window.location.href = tryOpen;
      }, 100);
    })();
  </script>
</body>
</html>`

  setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-store')
  return html
})
