// Mapping lengkap: B=Bolos, P=Pulang, I=Izin, S=Sakit, A/X=Alpa, ✓=Hadir, •=Datang
const MARK_MAP: Record<string, string> = {
  // Hadir
  '✓': 'hadir', '✔': 'hadir', 'v': 'hadir', 'V': 'hadir', 'R': 'hadir', 'r': 'hadir',
  // Datang (hadir telat)
  '•': 'datang', '·': 'datang',
  // Bolos
  'B': 'bolos', 'b': 'bolos',
  // Alpa
  'A': 'alpa', 'a': 'alpa', 'X': 'alpa', 'x': 'alpa',
  // Sakit
  'S': 'sakit', 's': 'sakit',
  // Izin
  'I': 'izin', 'i': 'izin',
  // Pulang
  'P': 'pulang', 'p': 'pulang',
  // dot tetap dianggap hadir (noise -> hadir) biar tidak hilang
  '.': 'hadir',
}

// alias untuk backward compat per-kelas lama (present/absent etc -> canonical)
export const LEGACY_ALIAS: Record<string, string> = {
  present: 'hadir', absent: 'alpa', sick: 'sakit', permit: 'izin', alpha: 'alpa',
  hadir: 'hadir', datang: 'datang', bolos: 'bolos', alpa: 'alpa', sakit: 'sakit', izin: 'izin', pulang: 'pulang',
}

// marker chars set for token extraction (single char)
const MARK_CHARS = new Set(Object.keys(MARK_MAP).filter(c => c.length === 1))

function normalize(n: string) {
  return n.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim()
}

function wordOverlap(ocrWords: string[], nameWords: string[]): number {
  const common = ocrWords.filter(w => nameWords.includes(w)).length
  if (common > 0) return 45 + common * 10
  return 0
}

function charOverlap(a: string, b: string): number {
  if (a.length < 2 || b.length < 2) return 0
  let match = 0
  const seen = new Set<number>()
  for (const ca of a) {
    for (let j = 0; j < b.length; j++) {
      if (!seen.has(j) && ca === b[j]) { match++; seen.add(j); break }
    }
  }
  const maxLen = Math.max(a.length, b.length)
  const score = match / maxLen
  if (a.length <= 3 && score >= 0.5) return score * 0.8
  return score
}

function fuzzyWords(ocrWords: string[], nameWords: string[]): number {
  let best = 0
  for (const ow of ocrWords) for (const nw of nameWords) {
    const s = charOverlap(ow, nw); if (s > best) best = s
  }
  if (best > 0.35) return Math.round(best * 38)
  return 0
}

function matchScore(ocrLine: string, studentName: string): number {
  const nOcr = normalize(ocrLine)
  const nName = normalize(studentName)
  if (!nOcr || !nName) return 0
  if (nOcr === nName) return 100
  if (nOcr.includes(nName)) return 85
  if (nName.includes(nOcr) && nOcr.length > 2) return 65
  const nOcrWords = nOcr.split(' ')
  const nNameWords = nName.split(' ')
  const common = wordOverlap(nOcrWords, nNameWords)
  if (common > 0) return common
  return fuzzyWords(nOcrWords, nNameWords)
}

function tokenToStatus(token: string): string | null {
  const t = token.trim()
  if (!t) return null
  if (t.length === 1) return MARK_MAP[t] || null
  // handle strings like "B", "P", "A " etc
  const ch = t[0]
  // multi-char like "✓" is single but may have extra spaces
  if (MARK_MAP[ch]) return MARK_MAP[ch]
  return null
}

function extractDateMarksExplicit(line: string): Record<string, string> | null {
  // pattern like "1: ✓" or "1P: B" or "1M:S" or "12: A"
  const marks: Record<string, string> = {}
  const re = /(\d{1,2})\s*(P|M)?\s*[:=]\s*([A-Za-z✓✔•·.])/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(line)) !== null) {
    const day = m[1]
    const sess = (m[2] || '').toUpperCase() // P/M
    const ch = m[3]
    const status = MARK_MAP[ch]
    if (!status) continue
    const key = sess ? `${parseInt(day)}${sess}` : String(parseInt(day))
    marks[key] = status
  }
  return Object.keys(marks).length ? marks : null
}

function extractAllMarksSequence(line: string): string[] {
  // ambil bagian tabel setelah kolom ke-3 (setelah NO|NAMA|ALAMAT/KLS)
  // fallback: seluruh line jika tidak ada '|'
  let segment = line
  if (line.includes('|')) {
    const cells = line.split('|').map(c => c.trim()).filter(Boolean)
    // cells[0]=NO, cells[1]=NAMA, cells[2]=ALAMAT/KLS, sisanya tanggal
    if (cells.length >= 4) segment = cells.slice(3).join(' | ')
    else if (cells.length === 3) segment = cells[2]
  }
  // extract tokens: single mark chars separated by space, |, ,, ;
  // gunakan regex untuk capture setiap mark char standalone
  const seq: string[] = []
  // match each mark char as separate token (including ✓ etc)
  // we need to avoid letters inside names -> segment already excludes name part
  const re2 = /[A-Za-z✓✔•·.]/g
  let mm: RegExpExecArray | null
  while ((mm = re2.exec(segment)) !== null) {
    const ch = mm[0]
    const st = MARK_MAP[ch]
    if (st) seq.push(st)
  }
  return seq
}

function marksFromExplicitOrSequence(line: string, mode: 'single' | 'pm'): Record<string, string> | null {
  const explicit = extractDateMarksExplicit(line)
  if (explicit) {
    // if explicit found and mode matches, return
    // For pm mode, keys like "1P", "1M" already correct. For single, keys like "12"
    // If explicit has pm keys but mode single -> convert by taking P only
    if (mode === 'pm') return explicit
    // single mode: if explicit keys contain P/M, strip suffix and merge (prefer non-hadir)
    if (Object.keys(explicit).some(k => /P|M/.test(k))) {
      const out: Record<string, string> = {}
      for (const [k, v] of Object.entries(explicit)) {
        const day = k.replace(/[PM]/, '')
        // keep first or non-hadir
        if (!out[day] || out[day] === 'hadir') out[day] = v
      }
      return Object.keys(out).length ? out : null
    }
    return explicit
  }

  const seq = extractAllMarksSequence(line)
  if (!seq.length) return null

  if (mode === 'single') {
    // sequence maps 1..31
    const out: Record<string, string> = {}
    for (let i = 0; i < Math.min(seq.length, 31); i++) out[String(i + 1)] = seq[i]
    return Object.keys(out).length ? out : null
  } else {
    // pm: expect up to 62 (31*2). Alternating P,M
    const out: Record<string, string> = {}
    if (seq.length >= 60) {
      for (let i = 0; i < Math.min(seq.length, 62); i++) {
        const day = Math.floor(i / 2) + 1
        const sess = i % 2 === 0 ? 'P' : 'M'
        out[`${day}${sess}`] = seq[i]
      }
      return out
    }
    if (seq.length >= 31 && seq.length < 60) {
      // ambiguous: could be 31 marks -> treat as duplicate for P&M? common kasus foto rapat where ocr only capture one mark per day
      // We'll duplicate each mark to both P and M
      // if user expects strictly 62, this still gives data; better than losing
      // heuristic: if seq length == 31 -> duplicate
      if (seq.length === 31) {
        for (let i = 0; i < 31; i++) {
          out[`${i + 1}P`] = seq[i]
          out[`${i + 1}M`] = seq[i]
        }
        return out
      }
      // otherwise 32-59 -> map sequentially P,M, ignore extra?
      for (let i = 0; i < Math.min(seq.length, 62); i++) {
        const day = Math.floor(i / 2) + 1
        const sess = i % 2 === 0 ? 'P' : 'M'
        out[`${day}${sess}`] = seq[i]
      }
      return out
    }
    // seq <31 -> pad with hadir? just map available
    for (let i = 0; i < seq.length; i++) {
      const day = Math.floor(i / 2) + 1
      const sess = i % 2 === 0 ? 'P' : 'M'
      if (day <= 31) out[`${day}${sess}`] = seq[i]
    }
    return Object.keys(out).length ? out : null
  }
}

export function parseOcrAttendance(
  ocrText: string,
  students: any[]
): Record<string, Record<string, string>> | null {
  return parseOcrAttendanceWithMode(ocrText, students, 'single')
}

export function parseOcrAttendancePM(
  ocrText: string,
  students: any[]
): Record<string, Record<string, string>> | null {
  return parseOcrAttendanceWithMode(ocrText, students, 'pm')
}

function parseOcrAttendanceWithMode(
  ocrText: string,
  students: any[],
  mode: 'single' | 'pm'
): Record<string, Record<string, string>> | null {
  const lines = ocrText.split('\n').map(l => l.trim()).filter(Boolean)
  const out: Record<string, Record<string, string>> = {}

  const studentOrder: { student: any; score: number; idx: number }[] = []
  for (const s of students) {
    const nName = normalize(String(s.name || ''))
    if (!nName) continue
    let bestScore = 0, bestIdx = -1
    for (let i = 0; i < lines.length; i++) {
      const sc = matchScore(lines[i], String(s.name))
      if (sc > bestScore) { bestScore = sc; bestIdx = i }
    }
    if (bestIdx >= 0 && bestScore >= 25) studentOrder.push({ student: s, score: bestScore, idx: bestIdx })
  }
  studentOrder.sort((a, b) => a.idx - b.idx)
  if (!studentOrder.length) return null

  for (const so of studentOrder) {
    const s = so.student
    const line = lines[so.idx]
    const marks = marksFromExplicitOrSequence(line, mode)
    if (marks) out[s.id] = marks
    else {
      // default all hadir
      const def: Record<string, string> = {}
      if (mode === 'single') for (let d = 1; d <= 31; d++) def[String(d)] = 'hadir'
      else for (let d = 1; d <= 31; d++) { def[`${d}P`] = ''; def[`${d}M`] = '' }
      out[s.id] = def
    }
  }
  return out
}

export function mapCharToStatus(char: string): string | null {
  return MARK_MAP[char.trim()] || null
}

export { MARK_MAP }
