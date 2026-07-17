import { rtdbAdd } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = { ...body, status: 'pending', createdAt: new Date().toISOString() }
  const result = await rtdbAdd('mutasi', data)
  await logActivity(event, 'Ajukan Mutasi', `${body.santri || ''} - ${body.tipe || ''}`, 'swap_horiz', '#1a6bff')
  return result
})
