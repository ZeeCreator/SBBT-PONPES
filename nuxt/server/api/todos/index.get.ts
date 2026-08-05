import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const uid = String(q.uid || '')
  const db = getDatabase()

  let ref = db.ref('todos')
  if (uid) ref = ref.orderByChild('uid').equalTo(uid)

  const snap = await ref.once('value')
  const data = snap.val() || {}
  let list = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))

  if (uid) {
    list = list.filter((t: any) => t.uid === uid)
  }

  list.sort((a: any, b: any) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    return (b.createdAt || '').localeCompare(a.createdAt || '')
  })

  return list
})
