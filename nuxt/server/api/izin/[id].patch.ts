import { rtdbGetById, rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  await rtdbUpdate('izin', id!, { ...body, updatedAt: new Date().toISOString() })
  const updated = await rtdbGetById('izin', id!)
  if (body.status === 'Disetujui') {
    await logActivity(event, 'Setujui Izin', `${updated?.santri || ''} - ${updated?.jenis || ''}`, 'check_circle', '#2e7d32')
  } else if (body.status === 'Ditolak') {
    await logActivity(event, 'Tolak Izin', `${updated?.santri || ''} - ${updated?.jenis || ''}`, 'cancel', '#ba1a1a')
  }
  return updated
})
