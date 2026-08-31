import { verifyFirebaseToken } from '../../utils/firebase'
import { getDatabase } from 'firebase-admin/database'

const GEMINI_MODEL_DEFAULT = 'gemini-2.0-flash'
const GEMINI_MODEL_FALLBACKS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-flash-latest', 'gemini-2.5-flash']
const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models'
const OPENROUTER_MODEL_DEFAULT = 'qwen/qwen2.5-vl-32b-instruct:free'
const OPENROUTER_FALLBACKS = [
  'qwen/qwen2.5-vl-32b-instruct:free',
  'google/gemma-3-4b-it:free',
  'google/gemma-3-12b-it:free',
  'meta-llama/llama-3.2-11b-vision-instruct:free',
  'google/gemma-4-31b-it:free',
  'qwen/qwen2.5-vl-72b-instruct:free',
]
const OCR_SPACE_API = 'https://api.ocr.space/parse/image'

const DEFAULT_OCR_PROMPT = `Anda adalah OCR untuk tabel absensi pondok pesantren.
Ekstrak teks dari gambar tabel absensi berikut.
Tabel memiliki kolom: NO, NAMA, ALAMAT/KLS, dan kolom tanggal (1-31).
Untuk absensi per-kelas: tiap tanggal 1 kolom.
Untuk absensi Pagi-Malam: tiap tanggal ada 2 kolom (P = Pagi, M = Malam).

Di dalam kolom tanggal terdapat MARK tulisan tangan berupa satu karakter:
- ✓ atau v atau R atau • hadir Hadir (present)
- • atau · = Datang (hadir tapi telat / coming)
- B = Bolos (kabur)
- A atau X = Alpa (absent tanpa keterangan)
- S = Sakit (sick)
- I = Izin (permit umum)
- P = Pulang (izin pulang)

Keluarkan hasilnya dalam format tabel markdown seperti ini:
| NO | NAMA | KLS/ALAMAT | TANGGAL |
| 1 | Nama Santri | ... | 1P:✓ 1M:✓ 2P:B 2M:✓ ... atau 1:✓ 2:S ... |

Tulis SEMUA data yang terbaca, jangan ada yang dilewatkan. Pertahankan simbol asli B,P,S,I,A,✓,• apa adanya.`

function stripBase64Prefix(data: string): string {
  return data.replace(/^data:image\/\w+;base64,/, '')
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[]
}
interface OpenRouterChoice { message: { content: string } }
interface OpenRouterResponse { choices: OpenRouterChoice[] }
interface OcrSpaceResponse {
  IsErroredOnProcessing: boolean
  ErrorMessage?: string
  ParsedResults?: { ParsedText: string; FileParseExitCode: number; ErrorMessage?: string }[]
}

async function callGemini(base64Image: string, apiKey: string, model: string, prompt: string): Promise<string> {
  const raw = stripBase64Prefix(base64Image)
  const res = await fetch(`${GEMINI_API}/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: 'image/jpeg', data: raw } }] }],
      generationConfig: { maxOutputTokens: 8192 },
    }),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Gemini ${res.status}: ${errText || res.statusText}`)
  }
  const json: GeminiResponse = await res.json()
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini: empty response')
  return text
}

async function callGeminiWithFallback(base64Image: string, apiKey: string, primaryModel: string, prompt: string): Promise<string> {
  const candidates = [primaryModel, ...GEMINI_MODEL_FALLBACKS.filter(m => m !== primaryModel)]
  let lastErr: string = ''
  for (const m of candidates) {
    try {
      return await callGemini(base64Image, apiKey, m, prompt)
    } catch (e: any) {
      lastErr = e.message || String(e)
      // retry hanya jika 404 NOT_FOUND / model tidak support, selain itu langsung throw
      const isNotFound = /404|NOT_FOUND|not found|not supported/i.test(lastErr)
      if (!isNotFound) throw e
      console.warn(`Gemini model ${m} failed, try fallback:`, lastErr)
    }
  }
  throw new Error(lastErr || 'Gemini: all fallback models failed')
}

async function callOpenRouter(base64Image: string, apiKey: string, model: string, prompt: string): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://alfatahsppt.web.app',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: base64Image } }] }],
      max_tokens: 8192,
    }),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`OpenRouter ${res.status}: ${errText || res.statusText}`)
  }
  const json: OpenRouterResponse = await res.json()
  const text = json.choices?.[0]?.message?.content
  if (!text) throw new Error('OpenRouter: empty response')
  return text
}

async function callOpenRouterWithFallback(base64Image: string, apiKey: string, primaryModel: string, prompt: string): Promise<string> {
  const candidates = [primaryModel, ...OPENROUTER_FALLBACKS.filter(m => m !== primaryModel)]
  let lastErr: string = ''
  for (const m of candidates) {
    try {
      return await callOpenRouter(base64Image, apiKey, m, prompt)
    } catch (e: any) {
      lastErr = e.message || String(e)
      const isNotFound = /404|unavailable for free|not found/i.test(lastErr)
      if (!isNotFound) throw e
      console.warn(`OpenRouter model ${m} failed, try fallback:`, lastErr)
    }
  }
  throw new Error(lastErr || 'OpenRouter: all fallback free models failed')
}

async function callOcrSpace(base64Image: string, apiKey: string): Promise<string> {
  const formData = new FormData()
  formData.append('base64Image', base64Image)
  formData.append('OCREngine', '3')
  formData.append('language', 'auto')
  formData.append('scale', 'true')
  const res = await fetch(OCR_SPACE_API, { method: 'POST', headers: { apikey: apiKey } as any, body: formData })
  if (!res.ok) throw new Error(`OCR.space ${res.status}: ${res.statusText}`)
  const json: OcrSpaceResponse = await res.json()
  if (json.IsErroredOnProcessing) throw new Error(json.ErrorMessage || 'OCR.space processing error')
  const parsed = json.ParsedResults?.[0]
  if (!parsed || parsed.FileParseExitCode !== 1) throw new Error(parsed?.ErrorMessage || 'OCR.space parsing failed')
  return parsed.ParsedText || ''
}

async function getOcrConfigFromRTDB() {
  try {
    const db = getDatabase()
    const snap = await db.ref('config/ocr').once('value')
    return (snap.val() || {}) as Record<string, any>
  } catch { return {} as Record<string, any> }
}

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get('authorization'))

  const { image, prompt: bodyPrompt } = await readBody(event) as { image: string; prompt?: string }
  if (!image) throw createError({ statusCode: 400, statusMessage: 'Image base64 required' })

  const config = useRuntimeConfig()
  const rtdbConfig = await getOcrConfigFromRTDB()

  // Priority: RTDB > runtimeConfig > env
  const geminiKey = rtdbConfig.geminiApiKey || config.geminiApiKey || (process.env as any).NUXT_GEMINI_API_KEY || (process.env as any).GEMINI_API_KEY || ''
  const geminiModel = rtdbConfig.geminiModel || (config as any).geminiModel || GEMINI_MODEL_DEFAULT
  const openrouterKey = rtdbConfig.openrouterApiKey || config.openrouterApiKey || (process.env as any).NUXT_OPENROUTER_API_KEY || (process.env as any).OPENROUTER_API_KEY || ''
  const openrouterModel = rtdbConfig.openrouterModel || (config as any).openrouterModel || OPENROUTER_MODEL_DEFAULT
  const ocrspaceKey = rtdbConfig.ocrSpaceApiKey || config.ocrSpaceApiKey || (process.env as any).NUXT_OCR_SPACE_API_KEY || (process.env as any).OCR_SPACE_API_KEY || ''
  const ocrPrompt = (bodyPrompt || rtdbConfig.ocrPrompt || rtdbConfig.prompt || DEFAULT_OCR_PROMPT).trim() || DEFAULT_OCR_PROMPT

  let result: string | null = null
  let provider = ''

  const providerOrder: string[] = Array.isArray(rtdbConfig.providerOrder) && rtdbConfig.providerOrder.length
    ? rtdbConfig.providerOrder
    : ['gemini', 'openrouter', 'ocrspace']

  const errors: string[] = []

  for (const p of providerOrder) {
    if (p === 'gemini' && geminiKey) {
      try { result = await callGeminiWithFallback(image, geminiKey, geminiModel, ocrPrompt); provider = 'gemini'; break } catch (e: any) { errors.push(e.message); console.warn('Gemini failed:', e.message) }
    }
    if (p === 'openrouter' && openrouterKey) {
      try { result = await callOpenRouterWithFallback(image, openrouterKey, openrouterModel, ocrPrompt); provider = 'openrouter'; break } catch (e: any) { errors.push(e.message); console.warn('OpenRouter failed:', e.message) }
    }
    if (p === 'ocrspace' && ocrspaceKey) {
      try { result = await callOcrSpace(image, ocrspaceKey); provider = 'ocrspace'; break } catch (e: any) { errors.push(e.message); console.warn('OCR.space failed:', e.message) }
    }
  }

  // fallback if order didn't cover all (e.g. order missing some)
  if (!result) {
    if (!providerOrder.includes('gemini') && geminiKey) {
      try { result = await callGeminiWithFallback(image, geminiKey, geminiModel, ocrPrompt); provider = 'gemini' } catch (e: any) { errors.push(e.message) }
    }
    if (!result && !providerOrder.includes('openrouter') && openrouterKey) {
      try { result = await callOpenRouterWithFallback(image, openrouterKey, openrouterModel, ocrPrompt); provider = 'openrouter' } catch (e: any) { errors.push(e.message) }
    }
    if (!result && !providerOrder.includes('ocrspace') && ocrspaceKey) {
      try { result = await callOcrSpace(image, ocrspaceKey); provider = 'ocrspace' } catch (e: any) { errors.push(e.message) }
    }
  }

  if (!result) {
    const hasAnyKey = !!(geminiKey || openrouterKey || ocrspaceKey)
    if (!hasAnyKey) throw createError({ statusCode: 502, statusMessage: 'No OCR provider configured — silakan isi API key di Developer > OCR Settings atau set env NUXT_GEMINI_API_KEY' })
    throw createError({ statusCode: 502, statusMessage: `OCR failed: ${errors.join(' | ') || 'all providers failed'}` })
  }

  return { text: result, provider }
})
