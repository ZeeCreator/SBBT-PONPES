import { rtdbGetById } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const notification = await rtdbGetById('notifikasi', id)
  
  if (!notification) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Notification not found'
    })
  }
  
  return notification
})

