import { rtdbAdd } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = {
    ...body,
    status: 'paid',
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const result = await rtdbAdd('payments', data)
  await logActivity(event, 'Proses Pembayaran SPP', `${body.invoiceCode || ''} - ${(body.amount ? 'Rp' + Number(body.amount).toLocaleString('id-ID') : '')}`, 'credit_card', '#1a6bff')
  return result
})
