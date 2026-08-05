import { processWaWebhook, getWaSettings } from '~/server/utils/wa-gateway'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const settings = await getWaSettings()

  if (settings.webhookSecret) {
    const headerSecret = getHeader(event, 'x-webhook-secret') || getHeader(event, 'x-hub-signature-256') || ''
    if (!headerSecret.includes(settings.webhookSecret)) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid webhook signature' })
    }
  }

  await processWaWebhook(body)
  return { status: true }
})
