import { handleBotMessage, getBotSettings } from '~/server/utils/wa-bot'
import { sendWaMessage } from '~/server/utils/wa-gateway'

function extractPhone(body: any): string | null {
  const p = body.payload?.from || body.payload?.chat_id
  return p || body.target || body.from || body.phone || body.sender_phone || body.sender || null
}

function extractMessage(body: any): string | null {
  const m = body.payload?.body || body.payload?.text || body.payload?.message
  return m || body.message || body.text || body.msg || body.body || null
}

function normalizeRawPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '').replace(/^0/, '62')
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

  const cleanPhone = normalizeRawPhone(phone)
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
