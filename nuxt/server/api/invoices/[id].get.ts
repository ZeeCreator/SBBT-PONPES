import { rtdbGetById } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const invoice = await rtdbGetById('invoices', id)
  
  if (!invoice) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invoice not found'
    })
  }
  
  return invoice
})
