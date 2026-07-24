import { defineEventHandler, readBody, createError } from 'h3'
import { rtdbAdd, rtdbGetById, logActivity } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Handle special case for Pindah Pondok Al-Fatah Pusat
  if (body.tipe === 'Pindah Pondok Al-Fatah Pusat') {
    // Validate required fields
    if (!body.studentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Student ID is required for Pindah Pondok Al-Fatah Pusat'
      })
    }
    
    // Create the mutasi record
    const mutasiData = { ...body, status: 'pending', createdAt: new Date().toISOString() }
    const mutasiResult = await rtdbAdd('mutasi', mutasiData)
    
    // Fetch complete student biodata
    const studentSnapshot = await rtdbGetById('students', body.studentId)
    if (!studentSnapshot) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Student not found'
      })
    }
    
    const studentData = { id: body.studentId, ...studentSnapshot }
    
    // Log activity with student NIS if available
    const studentName = studentData.nama || studentData.name || 'Unknown'
    const studentNis = studentData.nis || 'No NIS'
    const logMessage = studentName + ' (NIS: ' + studentNis + ') - ' + (body.tipe || '')
    await logActivity(event, 'Ajukan Mutasi Pindah Pondok', logMessage, 'swap_horiz', '#1a6bff')
    
    // Return both mutasi result and student data
    return {
      mutasi: mutasiResult,
      student: studentData
    }
  }
  
  // Handle regular mutasi requests
  const data = { ...body, status: 'pending', createdAt: new Date().toISOString() }
  const result = await rtdbAdd('mutasi', data)
  const logMessage = (body.santri || '') + ' - ' + (body.tipe || '')
  await logActivity(event, 'Ajukan Mutasi', logMessage, 'swap_horiz', '#1a6bff')
  return result
})

