import { getConversations } from '~/server/utils/wa-bot'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth.uid) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  return getConversations()
})
