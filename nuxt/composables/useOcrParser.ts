const MARK_MAP: Record<string, string> = {
  A: 'absent', a: 'absent',
  S: 'sick', s: 'sick',
  X: 'absent', x: 'absent',
  '.': 'present', '·': 'present', '•': 'present',
  v: 'present', V: 'present', '✓': 'present', '✔': 'present',
  R: 'present', r: 'present',
  I: 'permit', i: 'permit',
  P: 'permit', p: 'permit',
}

const MARK_CHARS = new Set(Object.keys(MARK_MAP))

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
      if (!seen.has(j) && ca === b[j]) {
        match++
        seen.add(j)
        break
      }
    }
  }
  const maxLen = Math.max(a.length, b.length)
  const score = match / maxLen
  if (a.length <= 3 && score >= 0.5) return score * 0.8
  return score
}

function fuzzyWords(ocrWords: string[], nameWords: string[]): number {
  let best = 0
  for (const ow of ocrWords) {
    for (const nw of nameWords) {
      const score = charOverlap(ow, nw)
      if (score > best) best = score
    }
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

function extractDateMarks(tanggalCell: string): Record<string, string> {
  const marks: Record<string, string> = {}
  const pattern = /(\d{1,2})\s*[:=]\s*([A-Za-z.·•v✓✔])/g
  let m: RegExpExecArray | null
  while ((m = pattern.exec(tanggalCell)) !== null) {
    const date = m[1]
    const char = m[2]
    if (MARK_MAP[char]) marks[date] = MARK_MAP[char]
  }
  return marks
}

function extractAllMarksOnLine(line: string): Record<string, string> | null {
  const cells = line.split('|').map(c => c.trim())
  if (cells.length < 4) return null

  const tanggalCell = cells[cells.length - 2] || ''
  const marks = extractDateMarks(tanggalCell)

  if (Object.keys(marks).length > 0) return marks

  const allCells = [tanggalCell, cells[cells.length - 1] || '']
  for (const cell of allCells) {
    const tokens = cell.split(/\s+/)
    for (const t of tokens) {
      if (t.length === 1 && MARK_CHARS.has(t)) {
        const status = MARK_MAP[t]
        for (let d = 1; d <= 31; d++) marks[String(d)] = status
        return marks
      }
    }
  }

  return null
}

export function parseOcrAttendance(
  ocrText: string,
  students: any[]
): Record<string, Record<string, string>> | null {
  const lines = ocrText.split('\n').map(l => l.trim()).filter(Boolean)
  const out: Record<string, Record<string, string>> = {}

  const studentOrder: { student: any; score: number; idx: number }[] = []
  for (const student of students) {
    const nName = normalize(student.name)
    if (!nName) continue
    let bestScore = 0
    let bestIdx = -1
    for (let i = 0; i < lines.length; i++) {
      const score = matchScore(lines[i], student.name)
      if (score > bestScore) { bestScore = score; bestIdx = i }
    }
    if (bestIdx >= 0 && bestScore >= 25) {
      studentOrder.push({ student, score: bestScore, idx: bestIdx })
    }
  }
  studentOrder.sort((a, b) => a.idx - b.idx)
  if (!studentOrder.length) return null

  for (const so of studentOrder) {
    const s = so.student
    const line = lines[so.idx]
    const marks = extractAllMarksOnLine(line)

    if (marks) {
      out[s.id] = marks
    } else {
      const def: Record<string, string> = {}
      for (let d = 1; d <= 31; d++) def[String(d)] = 'present'
      out[s.id] = def
    }
  }

  return out
}

export function mapCharToStatus(char: string): string | null {
  return MARK_MAP[char.trim()] || null
}
