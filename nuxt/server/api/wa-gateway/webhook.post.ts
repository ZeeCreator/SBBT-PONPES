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

  const settings = await getBotSettings()
  if (!settings.enabled) {
    return { status: 'ok', bot: 'disabled' }
  }

  const phone = extractPhone(body)
  const message = extractMessage(body)

  if (!phone || !message) {
    return { status: 'ok', ignored: 'no phone or message' }
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '')

  event.waitUntil((async () => {
    try {
      const reply = await handleBotMessage(cleanPhone, message)
      if (reply) {
        await sendWaMessage(cleanPhone, reply)
      }
    } catch (e) {
      console.error('Bot error:', e)
    }
  })())

  return { status: 'ok' }
})
