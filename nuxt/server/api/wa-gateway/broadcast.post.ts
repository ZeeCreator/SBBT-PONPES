import { sendWaBulk } from '~/server/utils/wa-gateway'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth.uid) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  if (!body.recipients || !Array.isArray(body.recipients) || body.recipients.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Recipients wajib diisi minimal 1' })
  }

  const result = await sendWaBulk(body.recipients, { uid: auth.uid, name: auth.name }, { delayMs: body.delayMs || 2000 })
  return result
})
