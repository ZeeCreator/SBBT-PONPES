import { getWaLogsFromGateway } from '~/server/utils/wa-gateway'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth.uid) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  return getWaLogsFromGateway({
    status: query.status as string,
    type: query.type as string,
    phone: query.phone as string,
    dateFrom: query.dateFrom as string,
    dateTo: query.dateTo as string,
  })
})
