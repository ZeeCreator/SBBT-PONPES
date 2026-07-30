import { handleBotMessage, getBotSettings } from '~/server/utils/wa-bot'
import { sendWaMessage } from '~/server/utils/wa-gateway'

function extractPhone(body: any): string | null {
  return body.target || body.from || body.phone || body.sender_phone || body.sender || null
}

function extractMessage(body: any): string | null {
  return body.message || body.text || body.msg || body.body || null
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('[WEBHOOK] received body:', JSON.stringify(body).substring(0, 500))

  const settings = await getBotSettings()
  if (!settings.enabled) {
    console.log('[WEBHOOK] bot disabled')
    return { status: 'ok', bot: 'disabled' }
  }

  const phone = extractPhone(body)
  const message = extractMessage(body)

  if (!phone || !message) {
    console.log('[WEBHOOK] no phone or message', { phone, message })
    return { status: 'ok', ignored: 'no phone or message' }
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '')
  console.log('[WEBHOOK] processing:', { phone: cleanPhone, message })

  try {
    const reply = await handleBotMessage(cleanPhone, message)
    console.log('[WEBHOOK] bot reply:', reply?.substring(0, 100))
    if (reply) {
      const result = await sendWaMessage(cleanPhone, reply)
      console.log('[WEBHOOK] send result:', JSON.stringify(result))
    } else {
      console.log('[WEBHOOK] no reply from bot')
    }
  } catch (e: any) {
    console.error('[WEBHOOK] error:', e.message, e.stack)
  }

  return { status: 'ok' }
})
