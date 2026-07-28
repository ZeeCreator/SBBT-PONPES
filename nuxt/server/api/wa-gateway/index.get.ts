import { getWaStats, getWaSettings, seedDefaultTemplates } from '~/server/utils/wa-gateway'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth.uid) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  await seedDefaultTemplates()
  const stats = await getWaStats()
  const settings = await getWaSettings()

  return { stats, settings }
})
