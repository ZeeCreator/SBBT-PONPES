import { d as defineEventHandler, r as readBody, c as createError, j as useRuntimeConfig } from '../../../_/nitro.mjs';
import { v as verifyFirebaseToken } from '../../../_/firebase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'firebase-admin/app';
import 'firebase-admin/auth';
import 'firebase-admin/database';
import 'jose';

const GEMINI_MODEL = "gemini-1.5-flash";
const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models";
const OPENROUTER_MODEL = "google/gemma-4-26b-a4b-it:free";
const OCR_SPACE_API = "https://api.ocr.space/parse/image";
const OCR_PROMPT = `Anda adalah OCR untuk tabel absensi pondok pesantren.
Ekstrak teks dari gambar tabel absensi berikut.
Tabel memiliki kolom: NO, NAMA, ALAMAT, dan kolom tanggal (1-31).
Di dalam kolom tanggal terdapat MARK tulisan tangan berupa satu karakter:
- A atau X = Alpa (absent)
- S = Sakit (sick)  
- I atau P = Izin/Pulang (permit)
- R atau v atau \u2713 atau \u2022 = Hadir (present)

Keluarkan hasilnya dalam format tabel markdown seperti ini:
| NO | NAMA | ALAMAT | TANGGAL |
| 1 | Nama Santri | Alamat | daftar mark per tanggal... |

Tulis SEMUA data yang terbaca, jangan ada yang dilewatkan.`;
function stripBase64Prefix(data) {
  return data.replace(/^data:image\/\w+;base64,/, "");
}
async function callGemini(base64Image, apiKey) {
  var _a, _b, _c, _d, _e;
  const raw = stripBase64Prefix(base64Image);
  const res = await fetch(`${GEMINI_API}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: OCR_PROMPT },
          { inline_data: { mime_type: "image/jpeg", data: raw } }
        ]
      }],
      generationConfig: { maxOutputTokens: 4096 }
    })
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini ${res.status}: ${errText || res.statusText}`);
  }
  const json = await res.json();
  const text = (_e = (_d = (_c = (_b = (_a = json.candidates) == null ? void 0 : _a[0]) == null ? void 0 : _b.content) == null ? void 0 : _c.parts) == null ? void 0 : _d[0]) == null ? void 0 : _e.text;
  if (!text) throw new Error("Gemini: empty response");
  return text;
}
async function callOpenRouter(base64Image, apiKey) {
  var _a, _b, _c;
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://alfatahsppt.web.app"
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: OCR_PROMPT },
            { type: "image_url", image_url: { url: base64Image } }
          ]
        }
      ],
      max_tokens: 4096
    })
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${errText || res.statusText}`);
  }
  const json = await res.json();
  const text = (_c = (_b = (_a = json.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content;
  if (!text) throw new Error("OpenRouter: empty response");
  return text;
}
async function callOcrSpace(base64Image, apiKey) {
  var _a;
  const formData = new FormData();
  formData.append("base64Image", base64Image);
  formData.append("OCREngine", "3");
  formData.append("language", "auto");
  formData.append("scale", "true");
  const res = await fetch(OCR_SPACE_API, {
    method: "POST",
    headers: { apikey: apiKey },
    body: formData
  });
  if (!res.ok) {
    throw new Error(`OCR.space ${res.status}: ${res.statusText}`);
  }
  const json = await res.json();
  if (json.IsErroredOnProcessing) {
    throw new Error(json.ErrorMessage || "OCR.space processing error");
  }
  const parsed = (_a = json.ParsedResults) == null ? void 0 : _a[0];
  if (!parsed || parsed.FileParseExitCode !== 1) {
    throw new Error((parsed == null ? void 0 : parsed.ErrorMessage) || "OCR.space parsing failed");
  }
  return parsed.ParsedText || "";
}
const analyze_post = defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get("authorization"));
  const { image } = await readBody(event);
  if (!image) throw createError({ statusCode: 400, statusMessage: "Image base64 required" });
  const config = useRuntimeConfig();
  const geminiKey = config.geminiApiKey || process.env.NUXT_GEMINI_API_KEY;
  const openrouterKey = config.openrouterApiKey || process.env.NUXT_OPENROUTER_API_KEY;
  const ocrspaceKey = config.ocrSpaceApiKey || process.env.NUXT_OCR_SPACE_API_KEY;
  let result = null;
  let provider = "";
  if (geminiKey) {
    try {
      result = await callGemini(image, geminiKey);
      provider = "gemini";
    } catch (e) {
      console.warn("Gemini failed:", e.message);
    }
  }
  if (!result && openrouterKey) {
    try {
      result = await callOpenRouter(image, openrouterKey);
      provider = "openrouter";
    } catch (e) {
      console.warn("OpenRouter failed:", e.message);
    }
  }
  if (!result && ocrspaceKey) {
    try {
      result = await callOcrSpace(image, ocrspaceKey);
      provider = "ocrspace";
    } catch (e) {
      console.error("All OCR providers failed:", e.message);
      throw createError({ statusCode: 502, statusMessage: `OCR failed: ${e.message}` });
    }
  }
  if (!result) {
    throw createError({ statusCode: 502, statusMessage: "No OCR provider configured" });
  }
  return { text: result, provider };
});

export { analyze_post as default };
//# sourceMappingURL=analyze.post.mjs.map
