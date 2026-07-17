import { rtdbGetList } from '~/server/utils/firebase'

export default defineEventHandler(async () => {
  return rtdbGetList('wirid')
})
