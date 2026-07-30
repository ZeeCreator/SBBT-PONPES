import { saveBotSettings, syncStudentsToQdrant } from '~/server/utils/wa-bot'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth.uid) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  await saveBotSettings(body)

  if (body.syncStudents) {
    const count = await syncStudentsToQdrant()
    return { success: true, synced: count }
  }

  return { success: true }
})
