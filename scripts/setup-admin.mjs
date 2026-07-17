// Script ini telah dipindahkan ke nuxt/scripts/setup-admin.mjs
// Jalankan dari direktori nuxt/:
//   cd nuxt
//   $env:FIREBASE_SERVICE_ACCOUNT_KEY="<base64>" ; node scripts/setup-admin.mjs <UID>

import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const scriptPath = resolve(__dirname, '..', 'nuxt', 'scripts', 'setup-admin.mjs')

console.log('Script telah dipindahkan ke nuxt/scripts/setup-admin.mjs')
console.log('Menjalankan dari lokasi baru...\n')

execSync(`node "${scriptPath}" ${process.argv.slice(2).join(' ')}`, {
  stdio: 'inherit',
  env: { ...process.env },
})
