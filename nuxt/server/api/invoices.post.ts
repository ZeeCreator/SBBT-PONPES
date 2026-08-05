import { rtdbAdd, generateId } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = {
    ...body,
    status: 'pending',
    invoiceCode: 'INV/' + new Date().getFullYear() + '/' + String(new Date().getMonth() + 1).padStart(2, '0') + '/' + generateId().substring(0, 6).toUpperCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const result = await rtdbAdd('invoices', data)
  await logActivity(event, 'Buat Tagihan Baru', `${body.studentName || 'Santri'} - ${body.type || 'SPP'}`, 'receipt', '#1a6bff')
  return result
})
