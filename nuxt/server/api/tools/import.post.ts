import XLSX from 'xlsx'
import { rtdbAdd } from '~/server/utils/firebase'
import { generateNIS } from '~/server/utils/id-generator'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const type = (body.type as string) || 'santri'
  const base64 = body.file as string

  if (!base64) throw createError({ statusCode: 400, statusMessage: 'File tidak ditemukan' })

  const buf = Buffer.from(base64.split(',')[1] || base64, 'base64')
  const wb = XLSX.read(buf, { type: 'buffer' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows: any[] = XLSX.utils.sheet_to_json(ws)
  const results: { success: number; failed: number; errors: string[] } = { success: 0, failed: 0, errors: [] }

  for (const row of rows) {
    try {
      if (type === 'santri') {
        const name = (row['Nama'] || '').trim()
        if (!name) {
          results.failed++
          results.errors.push('Baris tanpa nama')
          continue
        }
        await rtdbAdd('students', {
          nis: String(row['NIS'] || generateNIS()),
          name,
          kelas: row['Kelas'] || '',
          kamar: row['Kamar'] || '',
          alamat: row['Alamat'] || '',
          nohp: String(row['NoHP'] || ''),
        })
      } else if (type === 'nilai') {
        await rtdbAdd('grades', {
          nis: String(row['NIS'] || ''),
          name: row['Nama'] || '',
          subject: row['Mata Pelajaran'] || '',
          tugas: Number(row['Nilai Tugas']) || 0,
          uts: Number(row['Nilai UTS']) || 0,
          uas: Number(row['Nilai UAS']) || 0,
        })
      }
      results.success++
    } catch (e: any) {
      results.failed++
      results.errors.push(`${row['Nama'] || 'unknown'}: ${e.message}`)
    }
  }

  return results
})
