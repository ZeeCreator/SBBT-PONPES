import { saveWaSettings } from '~/server/utils/wa-gateway'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth.uid) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const allowed = ['provider', 'apiKey', 'endpointUrl', 'webhookSecret', 'isActive', 'senderName', 'dailyLimit']
  const filtered: Record<string, any> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) filtered[key] = body[key]
  }

  await saveWaSettings(filtered)
  return { success: true }
})
