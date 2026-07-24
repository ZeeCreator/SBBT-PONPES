import { getDatabase } from 'firebase-admin/database'

export default defineEventHandler(async (event) => {
  const db = getDatabase()
  
  const subjectsSnap = await db.ref('curriculum').once('value')
  const gradesSnap = await db.ref('grades').once('value')
  
  const subjectsCount = subjectsSnap.exists() ? Object.keys(subjectsSnap.val() || {}).length : 0
  const gradesCount = gradesSnap.exists() ? Object.keys(gradesSnap.val() || {}).length : 0
  
  return {
    subjects: subjectsCount,
    grades: gradesCount,
    lastUpdated: new Date().toISOString()
  }
})

