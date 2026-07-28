import { deleteWaTemplate } from '~/server/utils/wa-gateway'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth.uid) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID diperlukan' })
  }

  await deleteWaTemplate(id)
  return { success: true }
})
