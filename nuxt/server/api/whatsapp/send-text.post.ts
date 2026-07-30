import { sendWaMessage, logWaMessage } from '~/server/utils/wa-gateway'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth.uid) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  if (!body.chatId || !body.text) {
    throw createError({ statusCode: 400, statusMessage: 'chatId dan text wajib diisi' })
  }

  const phone = body.chatId.replace(/@c\.us$/, '').replace(/@s\.whatsapp\.net$/, '')

  console.log('[WHATSAPP-API] send-text request:', { chatId: body.chatId, phone, textPreview: body.text.substring(0, 50) })

  let result
  try {
    result = await sendWaMessage(phone, body.text)
  } catch (e: any) {
    console.log('[WHATSAPP-API] sendWaMessage threw:', { message: e.message, data: e.data, status: e.statusCode || e.status })
    throw createError({
      statusCode: 502,
      statusMessage: e.message || 'Gagal menghubungi OpenWA',
    })
  }

  console.log('[WHATSAPP-API] send-text result:', JSON.stringify(result))

  await logWaMessage({
    phone,
    message: body.text,
    status: result.success ? 'sent' : 'failed',
    type: 'single',
    sentBy: auth.uid,
    sentByName: auth.name,
    messageId: result.messageId,
    error: result.error,
  })

  if (!result.success) {
    throw createError({
      statusCode: 502,
      statusMessage: result.error || 'Gagal mengirim pesan',
    })
  }

  return {
    messageId: result.messageId,
    timestamp: Math.floor(Date.now() / 1000),
  }
})
