import { getDatabase } from 'firebase-admin/database'
import { verifyFirebaseToken, logActivity } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const decoded = await verifyFirebaseToken(authHeader)
  const db = getDatabase()
  // check super_admin via RTDB roles/{uid}
  try {
    const snap = await db.ref(`roles/${decoded.uid}/role`).once('value')
    const role = snap.val()
    if (role !== 'super_admin') throw createError({ statusCode: 403, statusMessage: 'Hanya super_admin yang dapat mengubah OCR config' })
  } catch (e: any) {
    if (e.statusCode === 403) throw e
  }

  const body = await readBody(event) as Record<string, any>
  const patch: Record<string, any> = {}
  if (body.geminiApiKey !== undefined) patch.geminiApiKey = String(body.geminiApiKey || '').trim()
  if (body.geminiModel !== undefined) patch.geminiModel = String(body.geminiModel || '').trim() || 'gemini-1.5-flash'
  if (body.openrouterApiKey !== undefined) patch.openrouterApiKey = String(body.openrouterApiKey || '').trim()
  if (body.openrouterModel !== undefined) patch.openrouterModel = String(body.openrouterModel || '').trim() || 'google/gemma-3-27b-it:free'
  if (body.ocrSpaceApiKey !== undefined) patch.ocrSpaceApiKey = String(body.ocrSpaceApiKey || '').trim()
  if (body.ocrPrompt !== undefined) patch.ocrPrompt = String(body.ocrPrompt || '').trim()
  if (body.prompt !== undefined) patch.ocrPrompt = String(body.prompt || '').trim()
  if (body.providerOrder !== undefined && Array.isArray(body.providerOrder)) {
    const allowed = new Set(['gemini', 'openrouter', 'ocrspace'])
    patch.providerOrder = body.providerOrder.filter((x: string) => allowed.has(x))
  }

  await db.ref('config/ocr').update(patch)
  await logActivity(event, 'Update OCR Config', `${decoded.email || decoded.uid} update OCR config`, 'document_scanner', '#0d9488')

  const snap2 = await db.ref('config/ocr').once('value')
  return snap2.val() || patch
})
