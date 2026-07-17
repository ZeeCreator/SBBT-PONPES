import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const target = resolve(__dirname, '..', 'node_modules', 'vite-node', 'dist', 'client-C7yCjfvf.mjs')

let code = readFileSync(target, 'utf8')

const OLD_PATTERN = `importExternalModule(path$1) {
\t\tif (path$1.startsWith('file:')) return import(
\t\t\t/* @vite-ignore */
\t\t\tpath$1
\t\t);
\t\treturn import(
\t\t\t/* @vite-ignore */
\t\t\tpathToFileURL(path$1).href
\t\t);
\t}`

const OLD_NO_PATCH = `importExternalModule(path$1) {
\t\treturn import(
\t\t\t/* @vite-ignore */
\t\t\tpath$1
\t\t);
\t}`

const REPLACEMENT = `importExternalModule(path$1) {
\t\t// --- normalize-specifier logic (inlined) ---
\t\tconst _s = path$1.replace(/^file:[\\\\/]*/i, '');
\t\tif (/^[A-Za-z]:[\\\\/]/.test(_s))
\t\t\treturn import('file:///' + _s.replace(/\\\\/g, '/'));
\t\tif (/^[A-Za-z]:[\\\\/]/.test(path$1))
\t\t\treturn import('file:///' + path$1.replace(/\\\\/g, '/'));
\t\treturn import(path$1);
\t}`

if (code.includes(OLD_PATTERN)) {
  code = code.replace(OLD_PATTERN, REPLACEMENT)
  writeFileSync(target, code, 'utf8')
  console.log('✓ Patched vite-node importExternalModule (normalize-specifier inlined)')
} else if (code.includes(OLD_NO_PATCH)) {
  code = code.replace(OLD_NO_PATCH, REPLACEMENT)
  writeFileSync(target, code, 'utf8')
  console.log('✓ Patched vite-node importExternalModule (normalize-specifier inlined, was unpatched)')
} else {
  console.log('× Could not match importExternalModule — structure changed')
  const lines = code.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('importExternalModule')) {
      for (let j = i; j < Math.min(i + 12, lines.length); j++) {
        console.log(`  ${j + 1}: ${lines[j]}`)
      }
      break
    }
  }
}
