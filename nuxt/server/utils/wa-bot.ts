import { getDatabase } from 'firebase-admin/database'
import { sendWaMessage } from './wa-gateway'
import { rtdbGetList } from './firebase'

const QDRANT_URL = 'https://7253ae62-9eb9-464a-85b8-3d9c9bd03bfe.eu-central-1-0.aws.cloud.qdrant.io'
const QDRANT_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwic3ViamVjdCI6ImFwaS1rZXk6MjY3MDY3NjYtNDkwOC00ZDBkLTk4NTMtMjQ2OGNlZWMzZjM4In0.pJ-8AnVJ0zcQ80EodA8VZ6rU5wQMipZIPLsb81vmSP8'
const COLLECTION = '7253ae62-9eb9-464a-85b8-3d9c9bd03bfe'
const AI_URL = 'https://apifreellm.com/api/v1/chat'
const AI_KEY = 'apf_h6266kocollosiu76f469ryj'

// ── Qdrant ──

export async function initQdrantCollection(): Promise<void> {
  const exists = await $fetch(`${QDRANT_URL}/collections/${COLLECTION}`, {
    method: 'GET',
    headers: { 'api-key': QDRANT_API_KEY },
  }).then(() => true).catch(() => false)

  if (exists) return

  await $fetch(`${QDRANT_URL}/collections/${COLLECTION}`, {
    method: 'PUT',
    headers: { 'api-key': QDRANT_API_KEY, 'Content-Type': 'application/json' },
    body: { vectors: { size: 384, distance: 'Cosine' } },
  })
}

export async function syncStudentsToQdrant(): Promise<number> {
  await initQdrantCollection()
  const students = await rtdbGetList('students')
  let count = 0

  for (const s of students) {
    const payload = {
      firebaseId: s.id,
      name: s.name || '',
      nis: s.nis || '',
      className: s.class || '',
      classId: s.classId || '',
      gender: s.gender || '',
      status: s.status || '',
      parentName: s.parentName || '',
      parentPhone: s.parentPhone || '',
    }

    await $fetch(`${QDRANT_URL}/collections/${COLLECTION}/points`, {
      method: 'PUT',
      headers: { 'api-key': QDRANT_API_KEY, 'Content-Type': 'application/json' },
      body: { points: [{ id: count + 1, vector: new Array(384).fill(0), payload }] },
    })
    count++
  }

  return count
}

// ── Firebase Student Search ──

async function searchStudentsFromFirebase(query: string): Promise<any[]> {
  const all = await rtdbGetList('students')
  const q = query.toLowerCase().trim()
  return all.filter((s: any) =>
    (s.name && s.name.toLowerCase().includes(q)) ||
    (s.nis && s.nis.toLowerCase().includes(q)) ||
    (s.parentName && s.parentName.toLowerCase().includes(q))
  ).slice(0, 5)
}

// ── Attendance from attendance_monthly ──

async function getAttendanceSummary(studentId: string, studentName: string): Promise<string> {
  const db = getDatabase()
  const snap = await db.ref('attendance_monthly').once('value')
  if (!snap.exists()) return 'Belum ada data absensi.'

  let totalHadir = 0, totalIzin = 0, totalSakit = 0, totalAlpha = 0
  let totalDays = 0

  for (const entry of Object.values(snap.val()) as any[]) {
    const records = entry.records || []
    const found = records.find((r: any) => r.studentId === studentId || r.name === studentName)
    if (!found || !found.marks) continue
    for (const day of Object.values(found.marks) as string[]) {
      totalDays++
      if (day === 'present') totalHadir++
      else if (day === 'permit') totalIzin++
      else if (day === 'sick') totalSakit++
      else if (day === 'absent') totalAlpha++
    }
  }

  if (totalDays === 0) return 'Belum ada data absensi.'
  return `Hadir ${totalHadir}, Izin ${totalIzin}, Sakit ${totalSakit}, Alpha ${totalAlpha} (dari ${totalDays} hari)`
}

// ── Grades from grades/ ──

async function getGradesSummary(studentId: string): Promise<string> {
  const db = getDatabase()
  const snap = await db.ref('grades').orderByChild('studentId').equalTo(studentId).once('value')
  if (!snap.exists()) return 'Belum ada data nilai.'

  const records = Object.values(snap.val()) as any[]
  const grouped: Record<string, { scores: number[]; semester: string; year: string }> = {}

  for (const r of records) {
    const key = `${r.subject || '?'}`
    if (!grouped[key]) grouped[key] = { scores: [], semester: r.semester || '', year: r.academicYear || '' }
    if (typeof r.score === 'number') grouped[key].scores.push(r.score)
  }

  const lines = Object.entries(grouped).map(([subject, data]) => {
    const avg = data.scores.length ? (data.scores.reduce((a, b) => a + b, 0) / data.scores.length).toFixed(0) : '-'
    return `${subject}: ${avg} (${data.semester} ${data.year})`
  })

  return lines.join('\n')
}

// ── AI ──

export async function callAI(message: string, context: string): Promise<string> {
  const prompt = context
    ? `Kamu adalah asisten pondok pesantren. Gunakan data berikut untuk menjawab:\n\n${context}\n\nPertanyaan: ${message}\n\nJawab dengan ramah dan informatif dalam Bahasa Indonesia. Jika data tidak ditemukan, beritahu user.`
    : `Kamu adalah asisten pondok pesantren. Jawab pertanyaan user dengan ramah dalam Bahasa Indonesia.\n\nPertanyaan: ${message}`

  const res = await $fetch<{ success: boolean; response?: string; error?: string }>(AI_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${AI_KEY}`, 'Content-Type': 'application/json' },
    body: { message: prompt },
  })

  if (res.success && res.response) return res.response
  throw new Error(res.error || 'AI gagal merespon')
}

// ── Bot Handler ──

export async function handleBotMessage(phone: string, message: string): Promise<string> {
  const botSettings = await getBotSettings()
  if (!botSettings.enabled) return ''

  const students = await searchStudentsFromFirebase(message)

  if (students.length === 0) {
    return callAI(message, '')
  }

  let context = ''
  for (const s of students) {
    context += `Santri: ${s.name}\nNIS: ${s.nis}\nKelas: ${s.class || '-'}\nStatus: ${s.status || 'Active'}\n`

    const absensi = await getAttendanceSummary(s.id, s.name)
    context += `Absensi: ${absensi}\n`

    const nilai = await getGradesSummary(s.id)
    context += `Nilai:\n${nilai}\n\n`
  }

  context += 'Gunakan data di atas untuk menjawab pertanyaan user dengan ramah dalam Bahasa Indonesia.'

  const reply = await callAI(message, context)
  await saveConversation(phone, message, reply)
  return reply
}

// ── Conversation Memory ──

async function saveConversation(phone: string, userMsg: string, botReply: string): Promise<void> {
  const db = getDatabase()
  const ref = db.ref(`wa_gateway/conversations/${phone.replace(/[^0-9]/g, '')}`)
  const snap = await ref.once('value')
  const existing = snap.val() || { messages: [] }
  existing.messages.push(
    { role: 'user', text: userMsg, time: new Date().toISOString() },
    { role: 'bot', text: botReply, time: new Date().toISOString() }
  )
  if (existing.messages.length > 50) existing.messages = existing.messages.slice(-50)
  await ref.set(existing)
}

export async function getConversations(): Promise<any[]> {
  const db = getDatabase()
  const snap = await db.ref('wa_gateway/conversations').once('value')
  if (!snap.exists()) return []
  return Object.entries(snap.val()).map(([phone, data]: [string, any]) => ({
    phone,
    messages: data.messages || [],
    lastMessage: data.messages?.[data.messages.length - 1]?.time || '',
  }))
}

export async function getBotSettings(): Promise<{ enabled: boolean; autoReply: boolean; welcomeMessage: string }> {
  const db = getDatabase()
  const snap = await db.ref('wa_gateway/bot_settings').once('value')
  if (snap.exists()) return snap.val()
  return { enabled: false, autoReply: true, welcomeMessage: 'Assalamualaikum, ketik nama santri untuk cek absensi dan program.' }
}

export async function saveBotSettings(data: { enabled?: boolean; autoReply?: boolean; welcomeMessage?: string; syncStudents?: boolean }): Promise<void> {
  const db = getDatabase()
  await db.ref('wa_gateway/bot_settings').update(data)
}
