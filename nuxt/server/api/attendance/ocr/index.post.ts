import { verifyFirebaseToken } from '../../../utils/firebase'
import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  await verifyFirebaseToken(event.headers.get('authorization'))

  const body = await readBody(event)
  if (!body || !body.image) throw createError({ statusCode: 400, statusMessage: 'Base64 image required' })

  const { image, ocrText, date, class: className } = body

  const db = getDatabase()
  const id = 'ocr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)

  await db.ref(`attendance_ocr/${id}`).set({
    date: date || '',
    class: className || '',
    image,
    ocrText: ocrText || '',
    imageSize: image.length,
    createdAt: new Date().toISOString(),
  })

  return { id, message: 'OCR result stored' }
})
