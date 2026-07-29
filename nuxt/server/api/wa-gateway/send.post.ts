import { sendWaMessage, logWaMessage } from '~/server/utils/wa-gateway'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth.uid) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  if (!body.phone || !body.message) {
    throw createError({ statusCode: 400, statusMessage: 'Phone dan message wajib diisi' })
  }

  const result = await sendWaMessage(body.phone, body.message, { delay: body.delay, mediaUrl: body.mediaUrl, mediaType: body.mediaType })

  await logWaMessage({
    phone: body.phone,
    message: body.message,
    status: result.success ? 'sent' : 'failed',
    type: 'single',
    sentBy: auth.uid,
    sentByName: auth.name,
    messageId: result.messageId,
    error: result.error,
    templateId: body.templateId,
    templateName: body.templateName,
    mediaUrl: body.mediaUrl,
    mediaType: body.mediaType,
  })

  return result
})
