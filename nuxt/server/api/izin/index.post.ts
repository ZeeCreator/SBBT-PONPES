import { rtdbAdd } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = { ...body, status: 'pending', createdAt: new Date().toISOString() }
  const result = await rtdbAdd('izin', data)
  await logActivity(event, 'Ajukan Izin', `${body.santri || ''} - ${body.jenis || ''}`, 'logout', '#1a6bff')
  return result
})
