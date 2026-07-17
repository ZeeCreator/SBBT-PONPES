import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { FirebaseAdminService } from '../common/firebase-admin.service'

@Injectable()
export class LaporanService {
  private readonly logger = new Logger(LaporanService.name)

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async generateRapor(studentId: string, semester: number) {
    const student = await this.firebaseAdmin.getById('students', studentId)
    if (!student) throw new NotFoundException('Student not found')

    const grades = await this.firebaseAdmin.getSubList('students', studentId, 'grades')
    const semesterGrades = grades.filter((g: any) => g.semester === semester)

    const violations = await this.firebaseAdmin.getSubList('students', studentId, 'violations')
    const totalPoints = violations.reduce((sum: number, v: any) => sum + (v.pointsDeducted || 0), 0)

    this.logger.log(`Report generated for student ${studentId}`)
    await this.firebaseAdmin.logActivity('Generate Rapor', 'System', `Rapor semester ${semester} — ${student.name || studentId}`)

    return {
      student,
      semester,
      grades: semesterGrades,
      violations,
      totalViolationPoints: totalPoints,
      generatedAt: new Date().toISOString(),
    }
  }

  async generateReceipt(invoiceId: string) {
    const invoice = await this.firebaseAdmin.getById('invoices', invoiceId)
    if (!invoice) throw new NotFoundException('Invoice not found')

    await this.firebaseAdmin.logActivity('Generate Kwitansi', 'System', `Kwitansi invoice ${invoiceId}`)
    return invoice
  }

  async getFinancialReport(startDate: string, endDate: string) {
    const payments = await this.firebaseAdmin.getList('payments')
    const filtered = payments.filter((p: any) =>
      p.paidAt && p.paidAt >= startDate && p.paidAt <= endDate,
    )

    const totalAmount = filtered.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)

    await this.firebaseAdmin.logActivity('Generate Laporan Keuangan', 'System', `Periode ${startDate} — ${endDate}`)

    return {
      period: { startDate, endDate },
      totalTransactions: filtered.length,
      totalAmount,
      payments: filtered,
      generatedAt: new Date().toISOString(),
    }
  }
}
