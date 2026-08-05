import { rtdbGetById, rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  await rtdbUpdate('mutasi', id!, { ...body, updatedAt: new Date().toISOString() })
  const updated = await rtdbGetById('mutasi', id!)
  if (body.status === 'disetujui') {
    await logActivity(event, 'Setujui Mutasi', `${updated?.santri || ''} - ${updated?.tipe || ''}`, 'check_circle', '#2e7d32')
  } else if (body.status === 'ditolak') {
    await logActivity(event, 'Tolak Mutasi', `${updated?.santri || ''} - ${updated?.tipe || ''}`, 'cancel', '#ba1a1a')
  }
  return updated
})
