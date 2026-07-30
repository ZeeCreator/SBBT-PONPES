import { getBotSettings } from '~/server/utils/wa-bot'

export default defineEventHandler(async () => {
  return getBotSettings()
})
