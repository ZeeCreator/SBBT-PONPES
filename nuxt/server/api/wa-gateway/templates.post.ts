import { saveWaTemplate } from '~/server/utils/wa-gateway'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth.uid) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  if (!body.name || !body.label || !body.body) {
    throw createError({ statusCode: 400, statusMessage: 'name, label, dan body wajib diisi' })
  }

  return saveWaTemplate(body)
})
