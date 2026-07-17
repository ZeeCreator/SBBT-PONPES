import { rtdbGetList } from '~/server/utils/firebase'

function normalizeRooms(rooms: any): any[] {
  if (!rooms) return []
  if (Array.isArray(rooms)) return rooms
  return Object.entries(rooms).map(([id, val]: any) => ({ id, ...(typeof val === 'string' ? { name: val } : val) }))
}

export default defineEventHandler(async () => {
  const items = await rtdbGetList('dormitories')
  return items.map((item: any) => ({ ...item, rooms: normalizeRooms(item.rooms) }))
})
