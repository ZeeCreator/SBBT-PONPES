import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { FirebaseAdminService } from '../common/firebase-admin.service'

@Injectable()
export class AkademikService {
  private readonly logger = new Logger(AkademikService.name)

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async getStudents() {
    return this.firebaseAdmin.getList('students', 'name')
  }

  async getStudentById(id: string) {
    const student = await this.firebaseAdmin.getById('students', id)
    if (!student) throw new NotFoundException('Student not found')
    return student
  }

  async getStudentGrades(studentId: string) {
    return this.firebaseAdmin.getSubList('students', studentId, 'grades', 'semester')
  }

  async addGrade(data: {
    studentId: string
    subject: string
    score: number
    semester: number
    academicYear: string
  }) {
    const student = await this.firebaseAdmin.getById('students', data.studentId)
    if (!student) throw new NotFoundException('Student not found')

    const gradeData = {
      subject: data.subject,
      score: data.score,
      grade: this.calculateGrade(data.score),
      semester: data.semester,
      academicYear: data.academicYear,
      createdAt: new Date().toISOString(),
    }

    const result = await this.firebaseAdmin.addSub('students', data.studentId, 'grades', gradeData)
    this.logger.log(`Grade added for student ${data.studentId}: ${result.id}`)

    await this.firebaseAdmin.logActivity(
      'Tambah Nilai',
      'System',
      `Nilai ${data.subject}: ${data.score} untuk siswa ${data.studentId}`,
    )

    return result
  }

  async deleteGrade(studentId: string, gradeId: string) {
    const student = await this.firebaseAdmin.getById('students', studentId)
    if (!student) throw new NotFoundException('Student not found')
    await this.firebaseAdmin.removeSub('students', studentId, 'grades', gradeId)

    await this.firebaseAdmin.logActivity('Hapus Nilai', 'System', `Nilai ${gradeId} untuk siswa ${studentId}`)
    return { message: 'Grade deleted' }
  }

  private calculateGrade(score: number): string {
    if (score >= 90) return 'A'
    if (score >= 85) return 'A-'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'B-'
    if (score >= 65) return 'C+'
    if (score >= 60) return 'C'
    return 'D'
  }

  async getCurriculum() {
    return this.firebaseAdmin.getList('curriculum', 'code')
  }

  async getCurriculumById(id: string) {
    const item = await this.firebaseAdmin.getById('curriculum', id)
    if (!item) throw new NotFoundException('Curriculum not found')
    return item
  }

  async addSubject(data: { code: string; name: string; department: string; hours: number; teacher: string }) {
    const result = await this.firebaseAdmin.add('curriculum', {
      ...data,
      active: true,
      createdAt: new Date().toISOString(),
    })

    await this.firebaseAdmin.logActivity('Tambah Mapel', 'System', `Mapel ${data.name} (${data.code})`)
    return result
  }

  async updateSubject(id: string, data: { code?: string; name?: string; department?: string; hours?: number; teacher?: string }) {
    const item = await this.firebaseAdmin.getById('curriculum', id)
    if (!item) throw new NotFoundException('Curriculum not found')

    await this.firebaseAdmin.update('curriculum', id, {
      ...data,
      updatedAt: new Date().toISOString(),
    })

    await this.firebaseAdmin.logActivity('Ubah Mapel', 'System', `Mapel ${id} diperbarui`)
    return this.firebaseAdmin.getById('curriculum', id)
  }

  async deleteSubject(id: string) {
    const item = await this.firebaseAdmin.getById('curriculum', id)
    if (!item) throw new NotFoundException('Curriculum not found')

    await this.firebaseAdmin.remove('curriculum', id)
    await this.firebaseAdmin.logActivity('Hapus Mapel', 'System', `Mapel ${item.name || id} dihapus`)
    return { message: 'Subject deleted' }
  }
}
