import { getDatabase } from 'firebase-admin/database'
import { verifyFirebaseToken } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(getHeader(event, 'authorization'))
  const db = getDatabase()
  const snap = await db.ref('config/ocr').once('value')
  const val = snap.val() || {}
  // mask keys when returning
  const mask = (k: string) => k ? `${k.slice(0, 8)}…${k.slice(-4)}` : ''
  return {
    geminiApiKey: val.geminiApiKey || '',
    geminiApiKeyMasked: mask(val.geminiApiKey || ''),
    geminiModel: val.geminiModel || 'gemini-2.0-flash',
    openrouterApiKey: val.openrouterApiKey || '',
    openrouterApiKeyMasked: mask(val.openrouterApiKey || ''),
    openrouterModel: val.openrouterModel || 'qwen/qwen2.5-vl-32b-instruct:free',
    ocrSpaceApiKey: val.ocrSpaceApiKey || '',
    ocrSpaceApiKeyMasked: mask(val.ocrSpaceApiKey || ''),
    ocrPrompt: val.ocrPrompt || val.prompt || '',
    providerOrder: val.providerOrder || ['gemini', 'openrouter', 'ocrspace'],
    hasGemini: !!val.geminiApiKey,
    hasOpenrouter: !!val.openrouterApiKey,
    hasOcrSpace: !!val.ocrSpaceApiKey,
  }
})
