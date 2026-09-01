// Import koreksi Pagi-Malam Agustus 2026 dari tabel markdown yang diberikan user
// Usage: cd nuxt && node scripts/import-pagi-malam-corrected.mjs [YYYY-MM]
// Default: 2026-08
import fs from 'fs'
import path from 'path'
import admin from 'firebase-admin'

const MONTH = process.argv[2] || '2026-08'
const DATABASE_URL = process.env.FIREBASE_DATABASE_URL || 'https://alfatahsppt-default-rtdb.firebaseio.com'

const MARK_MAP = {
  '✓': 'hadir', '✔': 'hadir', 'v': 'hadir', 'V': 'hadir', 'R': 'hadir', 'r': 'hadir', 'H': 'hadir', 'h': 'hadir', 'U': 'hadir', 'u': 'hadir',
  '•': 'datang', '·': 'datang', '.': 'datang', '∙': 'datang', '●': 'datang', 'o': 'datang', 'O': 'datang', '0': 'datang', '°': 'datang', ',': 'datang',
  'B': 'bolos', 'b': 'bolos',
  'A': 'alpa', 'a': 'alpa', 'X': 'alpa', 'x': 'alpa',
  'S': 'sakit', 's': 'sakit',
  'I': 'izin', 'i': 'izin', 'l': 'izin', '|': 'izin',
  'P': 'pulang', 'p': 'pulang',
}

function canon(ch) {
  if (!ch) return ''
  return MARK_MAP[ch] || MARK_MAP[ch.trim()] || ''
}

function getServiceAccount() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (b64) return JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'))
  const candidates = [
    path.resolve(process.cwd(), '../serviceacc.json'),
    path.resolve(process.cwd(), 'serviceacc.json'),
    path.resolve(process.cwd(), '..', 'serviceacc.json'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      console.log(`Menggunakan service account: ${p}`)
      return JSON.parse(fs.readFileSync(p, 'utf-8'))
    }
  }
  console.error('ERROR: Service account tidak ditemukan.')
  process.exit(1)
}

function normalizeName(name) {
  return String(name || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
}

// Data koreksi dari user - 39 baris
const CORRECTED_ROWS = [
  { no: 1, name: 'AHMAD KHOLID', kls: '1', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P: 9M: 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:A 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 2, name: 'SYAHRUL', kls: '1', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:A 6M:A 7P:✓ 7M:✓ 8P: 8M: 9P:A 9M:A 10P:A 10M:A 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:A 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 3, name: 'AHMAD MUHAMMAD IBROHIM', kls: '2', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:A 6M:A 7P:✓ 7M:✓ 8P: 8M: 9P:A 9M:A 10P:A 10M:A 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:A 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 4, name: 'ANDIKA LEVERITA RAMADHON', kls: '2', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:P 27M:P 28P:P 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 5, name: 'FAHREZI', kls: '2', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:A 5M:A 6P:✓ 6M:✓ 7P:A 7M:A 8P: 8M: 9P:A 9M:A 10P:A 10M:A 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 6, name: 'MUHAMMAD FADIL', kls: '2', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:A 5M:A 6P:✓ 6M:✓ 7P:A 7M:A 8P: 8M: 9P:A 9M:A 10P:A 10M:A 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:A' },
  { no: 7, name: 'MUHAMMAD IHSANULHAQ', kls: '2', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:A 9M:A 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:A 31P:A 31M:A' },
  { no: 8, name: 'MUHAMMAD IKBAL', kls: '2', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 9, name: 'MUHAMMAD KHOLID JABBAZ', kls: '2', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 10, name: 'ADAM', kls: '4', tanggal: '1P:✓ 1M:S 2P:A 2M:S 3P:A 4P:A 4M:A 5P:A 5M:A 6P:R 6M:R 7P:A 7M:A 8P:A 8M:A 9P:V 9M:V 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:A 27P:A 27M:A 28P: 28M: 29P:A 29M:A 30P:A 30M:A 31P:A 31M:A' },
  { no: 11, name: 'AKBAR JULIAN PERDANA', kls: '4', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:A 9M:V 10P:V 10M:V 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 12, name: 'AR-RIFAT', kls: '4', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:A 30M:A 31P:A 31M:A' },
  { no: 13, name: 'ARDIAN RAMADHAN', kls: '4', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:i 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:P 26M:P 27P:P 27M:P 28P:P 28M:P 29P:P 29M:P 30P:P 30M:P 31P:P 31M:P' },
  { no: 14, name: 'ARKA DWI APRIO', kls: '4', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 15, name: 'EVAN', kls: '4', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:S 3M:S 4P:S 4M:B 5P:A 5M:A 6P:A 6M:A 7P:A 7M:A 8P: 8M: 9P:A 9M:V 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:V 31P:A 31M:A' },
  { no: 16, name: 'KHOIRUL HUDA', kls: '4', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:A 7M:A 8P: 8M: 9P:A 9M:A 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:A 27P:✓ 27M:✓ 28P: 28M: 29P:A 29M:• 30P:A 30M:A 31P:A 31M:A' },
  { no: 17, name: 'MUHAMMAD HAFIDZ FURKHON AL BAIHAQI', kls: '4', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:i 10P:i 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:✓ 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 18, name: 'MUHAMMAD ARQOM', kls: '4', tanggal: '1P:A 1M:V 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:V 7M:A 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:i 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 19, name: 'SAIFUL BAHRI', kls: '4', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:S 3M:S 4P:U 4M:A 5P:A 5M:A 6P:A 6M:A 7P:A 7M:A 8P: 8M: 9P:V 9M:V 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:A' },
  { no: 20, name: 'SAIFUL ROZAK', kls: '4', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:A 9M:A 10P:A 10M:A 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:A' },
  { no: 21, name: 'SHIDDIQ', kls: '4', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:A 9M:S 10P:A 10M:A 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:A 27P:✓ 27M:✓ 28P: 28M: 29P:A 29M:• 30P:✓ 30M:✓ 31P:A' },
  { no: 22, name: 'YADI', kls: '4', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:A 7M:V 8P: 8M: 9P:A 9M:S 10P:A 10M:V 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:A 27P:✓ 27M:✓ 28P: 28M: 29P:A 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:A' },
  { no: 23, name: 'YUNUS', kls: '4', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:R 7M:A 8P: 8M: 9P:A 9M:V 10P:A 10M:S 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:A 27P:✓ 27M:✓ 28P: 28M: 29P:A 29M:• 30P:A 30M:A 31P:A 31M:A' },
  { no: 24, name: 'ZAKI', kls: '4', tanggal: '1P:A 1M:V 2P:A 2M:✓ 3P:✓ 4P:✓ 4M:✓ 5P:A 5M:A 6P:A 6M:A 7P:i 7M:i 8P: 8M: 9P: 9M: 10P:A 10M:A 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:A 27P:A 27M:✓ 28P: 28M: 29P:A 29M:• 30P:✓ 30M:A 31P:A 31M:A' },
  { no: 25, name: 'AKMAL', kls: '5', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 26, name: 'AZIZ', kls: '5', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 27, name: 'BINTANG', kls: '5', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:V 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:✓ 27P:✓ 27M:✓ 28P: 28M: 29P:A 29M:• 30P:A 30M:A 31P:A 31M:A' },
  { no: 28, name: 'FAZILAH', kls: '5', tanggal: '1P:A 1M:V 2P:A 2M:S 3P:S 3M:S 4P:A 4M:A 5P:V 5M:V 6P:A 6M:A 7P:✓ 7M:✓ 8P: 8M: 9P:A 9M:V 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:P 26M:P 27P:P 27M:P 28P:P 28M:P 29P:P 29M:P 30P:P 30M:P 31P:P 31M:P' },
  { no: 29, name: 'HABIBURRAHMAN', kls: '5', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:• 26M:A 27P:A 27M:A 28P: 28M: 29P:A 29M:A 30P:A 30M:A 31P:A 31M:A' },
  { no: 30, name: 'IQBAL', kls: '5', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:• 26M:i 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 31, name: 'LUTFI', kls: '5', tanggal: '1P:✓ 1M:S 2P:V 2M:H 3P:A 3M:V 4P:A 4M:V 5P:A 5M:A 6P:A 6M:A 7P:✓ 7M:✓ 8P: 8M: 9P:A 9M:V 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:V 27P:A 27M:A 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 32, name: 'MUHAMMAD AL-FATIH', kls: '5', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:A 27P:✓ 27M:✓ 28P: 28M: 29P:A 29M:A 30P:✓ 30M:• 31P:V 31M:A' },
  { no: 33, name: 'MUHAMMAD RAKA ANANTA', kls: '5', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:A 7M:V 8P: 8M: 9P:A 9M:V 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:i 26M:i 27P:✓ 27M:✓ 28P: 28M: 29P:✓ 29M:✓ 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 34, name: 'MUHAMMAD RAMEYZA FAREL AL PALEMBANI', kls: '5', tanggal: '1P:✓ 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:✓ 7M:✓ 8P: 8M: 9P:✓ 9M:✓ 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:i 27P:i 27M:✓ 28P: 28M: 29P:i 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 35, name: 'MUHAMMAD UMAIR ABDUL HAFIZ', kls: '5', tanggal: '1P:A 1M:✓ 2P:✓ 2M:✓ 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:✓ 5M:✓ 6P:✓ 6M:✓ 7P:A 7M:V 8P: 8M: 9P:A 9M:V 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:A 27M:✓ 28P: 28M: 29P:✓ 29M:• 30P:✓ 30M:✓ 31P:✓ 31M:✓' },
  { no: 36, name: 'RAHMAT', kls: '5', tanggal: '1P:A 1M:V 2P:A 2M:V 3P:✓ 3M:✓ 4P:✓ 4M:✓ 5P:A 5M:A 6P:A 6M:A 7P:A 7M:A 8P: 8M: 9P:A 9M:A 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:A 27P:A 27M:A 28P: 28M: 29P:A 29M:A 30P:A 30M:A 31P:A 31M:A' },
  { no: 37, name: 'REHAN', kls: '5', tanggal: '1P:A 1M:V 2P:A 2M:✓ 3P:i 3M:i 4P:V 4M:✓ 5P:V 5M:A 6P:A 6M:A 7P:A 7M:A 8P: 8M: 9P:A 9M:A 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:A 26M:A 27P:A 27M:A 28P: 28M: 29P:A 29M:A 30P:A 30M:A 31P:A 31M:A' },
  { no: 38, name: 'RUSDI', kls: '5', tanggal: '1P:A 1M:V 2P:A 2M:✓ 3P:i 3M:i 4P:✓ 4M:✓ 5P:A 5M:A 6P:A 6M:A 7P:A 7M:A 8P: 8M: 9P:A 9M:A 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:A 27M:A 28P: 28M: 29P:A 29M:A 30P:A 30M:A 31P:A 31M:A' },
  { no: 39, name: 'YUSUF', kls: '5', tanggal: '1P:A 1M:V 2P:A 2M:✓ 3P:i 3M:i 4P:✓ 4M:✓ 5P:A 5M:A 6P:A 6M:A 7P:A 7M:A 8P: 8M: 9P:A 9M:A 10P:✓ 10M:✓ 11P:✓ 11M:✓ 12P:✓ 12M:✓ 13P:✓ 13M:✓ 14P: 14M: 15P: 15M: 16P: 16M: 17P: 17M: 18P: 18M: 19P: 19M: 20P: 20M: 21P: 21M: 22P: 22M: 23P: 23M: 24P: 24M: 25P: 25M: 26P:✓ 26M:✓ 27P:A 27M:A 28P: 28M: 29P:i 29M:• 30P:A 30M:A 31P:A 31M:A' },
]

function parseMarks(tanggalStr, daysInMonth) {
  const marks = {}
  for (let d = 1; d <= daysInMonth; d++) {
    marks[`${d}P`] = ''
    marks[`${d}M`] = ''
  }
  const tokens = tanggalStr.split(/\s+/).filter(Boolean)
  for (const tok of tokens) {
    const colonIdx = tok.indexOf(':')
    if (colonIdx === -1) continue
    const key = tok.slice(0, colonIdx)
    const raw = tok.slice(colonIdx + 1)
    if (!/^\d{1,2}[PM]$/.test(key)) continue
    if (!raw) {
      marks[key] = ''
      continue
    }
    const ch = raw[0]
    const mapped = canon(ch)
    if (mapped) marks[key] = mapped
    else {
      // unknown like H/U - treat as hadir if not empty
      if (raw.trim()) marks[key] = 'hadir'
    }
  }
  return marks
}

async function main() {
  const serviceAccount = getServiceAccount()
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL: DATABASE_URL })
  const db = admin.database()
  const [year, month] = MONTH.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  const monthId = MONTH
  console.log(`Import koreksi Pagi-Malam ${monthId} - ${CORRECTED_ROWS.length} baris`)

  const snap = await db.ref('students').once('value')
  const studentsRaw = snap.val() || {}
  const students = Object.entries(studentsRaw).map(([id, val]) => ({ id, ...val }))
  console.log(`Total santri di DB: ${students.length}`)
  const byNorm = new Map()
  for (const s of students) byNorm.set(normalizeName(s.name), s)
  // also build by partial for fallback
  const records = []
  let matched = 0, unmatched = []
  for (const row of CORRECTED_ROWS) {
    const norm = normalizeName(row.name)
    let found = byNorm.get(norm)
    if (!found) {
      // fallback: cari yang mengandung / dikandung
      for (const [key, s] of byNorm) {
        if (key.includes(norm) || norm.includes(key)) { found = s; break }
      }
    }
    // extra: coba per kata
    if (!found) {
      for (const s of students) {
        const sNorm = normalizeName(s.name)
        if (sNorm.includes(norm.slice(0, 6)) && norm.includes(sNorm.slice(0, 6))) { found = s; break }
      }
    }
    if (!found) {
      unmatched.push(row.name)
      console.log(`  ✗ ${row.name} TIDAK DITEMUKAN`)
      continue
    }
    matched++
    const marks = parseMarks(row.tanggal, daysInMonth)
    records.push({
      studentId: found.id,
      name: found.name,
      nis: found.nis || '',
      class: found.class || `KELAS ${row.kls}`,
      marks,
    })
    console.log(`  ✓ ${row.name} -> ${found.name} [${found.id}]`)
  }
  console.log(`\nMatched: ${matched}, Unmatched: ${unmatched.length}`)
  if (unmatched.length) console.log('Unmatched:', unmatched.join(', '))

  if (records.length === 0) {
    console.log('Tidak ada records, abort')
    await admin.app().delete()
    process.exit(0)
  }

  // Cari existing attendance_program_pm untuk monthId ini
  const listSnap = await db.ref('attendance_program_pm').orderByChild('monthId').equalTo(monthId).once('value')
  const existing = listSnap.val()
  const now = new Date().toISOString()
  let op = ''
  let targetId = ''
  if (existing && Object.keys(existing).length > 0) {
    // ambil yang pertama, update
    targetId = Object.keys(existing)[0]
    await db.ref(`attendance_program_pm/${targetId}`).update({
      records,
      year, month, monthId, class: 'Semua', updatedAt: now,
    })
    op = `UPDATE ${targetId}`
  } else {
    const ref = await db.ref('attendance_program_pm').push({
      monthId, year, month, class: 'Semua', records, createdAt: now, updatedAt: now,
    })
    targetId = ref.key
    op = `CREATE ${targetId}`
  }
  console.log(`\n✅ ${op} — ${records.length} santri untuk ${monthId}`)
  // Verify satu sample AKMAL
  const akmal = records.find(r => normalizeName(r.name) === normalizeName('AKMAL'))
  if (akmal) {
    console.log('\nSample AKMAL marks:')
    console.log(JSON.stringify(akmal.marks, null, 2))
    const counts = {}
    for (const v of Object.values(akmal.marks)) if (v) counts[v] = (counts[v]||0)+1
    console.log('Counts:', counts, 'totalSesi', Object.values(akmal.marks).filter(Boolean).length)
  }

  await admin.app().delete()
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
