import { verifyFirebaseToken } from '../../utils/firebase'

const GEMINI_MODEL = 'gemini-1.5-flash'
const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models'
const OPENROUTER_MODEL = 'google/gemma-4-26b-a4b-it:free'
const OCR_SPACE_API = 'https://api.ocr.space/parse/image'

const OCR_PROMPT = `Anda adalah OCR untuk tabel absensi pondok pesantren.
Ekstrak teks dari gambar tabel absensi berikut.
Tabel memiliki kolom: NO, NAMA, ALAMAT, dan kolom tanggal (1-31).
Di dalam kolom tanggal terdapat MARK tulisan tangan berupa satu karakter:
- A atau X = Alpa (absent)
- S = Sakit (sick)  
- I atau P = Izin/Pulang (permit)
- R atau v atau ✓ atau • = Hadir (present)

Keluarkan hasilnya dalam format tabel markdown seperti ini:
| NO | NAMA | ALAMAT | TANGGAL |
| 1 | Nama Santri | Alamat | daftar mark per tanggal... |

Tulis SEMUA data yang terbaca, jangan ada yang dilewatkan.`

function stripBase64Prefix(data: string): string {
  return data.replace(/^data:image\/\w+;base64,/, '')
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[]
    }
  }[]
}

interface OpenRouterChoice {
  message: { content: string }
}

interface OpenRouterResponse {
  choices: OpenRouterChoice[]
}

interface OcrSpaceResponse {
  IsErroredOnProcessing: boolean
  ErrorMessage?: string
  ParsedResults?: {
    ParsedText: string
    FileParseExitCode: number
    ErrorMessage?: string
  }[]
}

async function callGemini(base64Image: string, apiKey: string): Promise<string> {
  const raw = stripBase64Prefix(base64Image)
  const res = await fetch(`${GEMINI_API}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: OCR_PROMPT },
          { inline_data: { mime_type: 'image/jpeg', data: raw } },
        ],
      }],
      generationConfig: { maxOutputTokens: 4096 },
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

async function callOpenRouter(base64Image: string, apiKey: string): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://alfatahsppt.web.app',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: OCR_PROMPT },
            { type: 'image_url', image_url: { url: base64Image } },
          ],
        },
      ],
      max_tokens: 4096,
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

async function callOcrSpace(base64Image: string, apiKey: string): Promise<string> {
  const formData = new FormData()
  formData.append('base64Image', base64Image)
  formData.append('OCREngine', '3')
  formData.append('language', 'auto')
  formData.append('scale', 'true')

  const res = await fetch(OCR_SPACE_API, {
    method: 'POST',
    headers: { apikey: apiKey },
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`OCR.space ${res.status}: ${res.statusText}`)
  }

  const json: OcrSpaceResponse = await res.json()
  if (json.IsErroredOnProcessing) {
    throw new Error(json.ErrorMessage || 'OCR.space processing error')
  }

  const parsed = json.ParsedResults?.[0]
  if (!parsed || parsed.FileParseExitCode !== 1) {
    throw new Error(parsed?.ErrorMessage || 'OCR.space parsing failed')
  }

  return parsed.ParsedText || ''
}

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get('authorization'))

  const { image } = await readBody(event) as { image: string }
  if (!image) throw createError({ statusCode: 400, statusMessage: 'Image base64 required' })

  const config = useRuntimeConfig()
  const geminiKey = config.geminiApiKey || process.env.NUXT_GEMINI_API_KEY
  const openrouterKey = config.openrouterApiKey || process.env.NUXT_OPENROUTER_API_KEY
  const ocrspaceKey = config.ocrSpaceApiKey || process.env.NUXT_OCR_SPACE_API_KEY

  let result: string | null = null
  let provider = ''

  if (geminiKey) {
    try {
      result = await callGemini(image, geminiKey)
      provider = 'gemini'
    } catch (e: any) {
      console.warn('Gemini failed:', e.message)
    }
  }

  if (!result && openrouterKey) {
    try {
      result = await callOpenRouter(image, openrouterKey)
      provider = 'openrouter'
    } catch (e: any) {
      console.warn('OpenRouter failed:', e.message)
    }
  }

  if (!result && ocrspaceKey) {
    try {
      result = await callOcrSpace(image, ocrspaceKey)
      provider = 'ocrspace'
    } catch (e: any) {
      console.error('All OCR providers failed:', e.message)
      throw createError({ statusCode: 502, statusMessage: `OCR failed: ${e.message}` })
    }
  }

  if (!result) {
    throw createError({ statusCode: 502, statusMessage: 'No OCR provider configured' })
  }

  return { text: result, provider }
})
