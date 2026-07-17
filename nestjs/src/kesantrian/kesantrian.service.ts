import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { FirebaseAdminService } from '../common/firebase-admin.service'

@Injectable()
export class KesantrianService {
  private readonly logger = new Logger(KesantrianService.name)

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async getStudents(filters?: { class?: string; status?: string }) {
    let students = await this.firebaseAdmin.getList('students', 'name')
    if (filters?.class) students = students.filter(s => s.class === filters.class)
    if (filters?.status) students = students.filter(s => s.status === filters.status)
    return students
  }

  async getStudentById(id: string) {
    const student = await this.firebaseAdmin.getById('students', id)
    if (!student) throw new NotFoundException('Student not found')
    return student
  }

  async addStudent(data: {
    name: string
    nis: string
    class: string
    city: string
    gender: string
  }) {
    const student = {
      name: data.name,
      nis: data.nis,
      class: data.class,
      city: data.city,
      gender: data.gender,
      disciplineScore: 100,
      status: 'Active',
      createdAt: new Date().toISOString(),
    }

    const result = await this.firebaseAdmin.add('students', student)
    this.logger.log(`Student added: ${result.id} - ${data.name}`)

    await this.firebaseAdmin.logActivity('Tambah Santri', 'System', `Santri ${data.name} (NIS: ${data.nis})`)
    return result
  }

  async updateStudent(id: string, data: { name?: string; nis?: string; class?: string; city?: string; gender?: string; status?: string }) {
    const student = await this.firebaseAdmin.getById('students', id)
    if (!student) throw new NotFoundException('Student not found')

    await this.firebaseAdmin.update('students', id, {
      ...data,
      updatedAt: new Date().toISOString(),
    })

    await this.firebaseAdmin.logActivity('Ubah Santri', 'System', `Data santri ${student.name || id} diperbarui`)
    return this.firebaseAdmin.getById('students', id)
  }

  async deleteStudent(id: string) {
    const student = await this.firebaseAdmin.getById('students', id)
    if (!student) throw new NotFoundException('Student not found')

    await this.firebaseAdmin.remove('students', id)
    await this.firebaseAdmin.logActivity('Hapus Santri', 'System', `Santri ${student.name || id} dihapus`)
    return { message: 'Student deleted' }
  }

  async getViolations(studentId?: string) {
    if (studentId) {
      return this.firebaseAdmin.getSubList('students', studentId, 'violations', 'timestamp')
    }
    return this.firebaseAdmin.getList('violations', 'timestamp')
  }

  async getViolationById(id: string) {
    const violation = await this.firebaseAdmin.getById('violations', id)
    if (!violation) throw new NotFoundException('Violation not found')
    return violation
  }

  async addViolation(data: {
    studentId: string
    type: string
    category: string
    description: string
    reportedBy: string
  }) {
    const student = await this.firebaseAdmin.getById('students', data.studentId)
    if (!student) throw new NotFoundException('Student not found')

    const pointsMap: Record<string, number> = { Minor: 5, Moderate: 10, Severe: 20 }
    const points = pointsMap[data.type] || 10

    const violation = {
      studentId: data.studentId,
      type: data.type,
      category: data.category,
      description: data.description,
      pointsDeducted: points,
      reportedBy: data.reportedBy,
      timestamp: new Date().toISOString(),
    }

    const rtdb = this.firebaseAdmin.getRtdb()
    const id = this.firebaseAdmin.generateId()
    await rtdb.ref(`students/${data.studentId}/violations/${id}`).set(violation)
    await rtdb.ref(`violations/${id}`).set(violation)

    const snap = await rtdb.ref(`students/${data.studentId}/disciplineScore`).once('value')
    const currentScore = snap.val() ?? 100
    await rtdb.ref(`students/${data.studentId}/disciplineScore`).set(currentScore - points)

    this.logger.log(`Violation recorded for student ${data.studentId}`)
    await this.firebaseAdmin.logActivity('Lapor Pelanggaran', data.reportedBy || 'System', `${data.type}: ${data.category} — ${student.name}`)

    return { id, ...violation }
  }

  async deleteViolation(id: string) {
    const violation = await this.firebaseAdmin.getById('violations', id)
    if (!violation) throw new NotFoundException('Violation not found')

    await this.firebaseAdmin.remove('violations', id)
    this.logger.log(`Violation deleted: ${id}`)
    await this.firebaseAdmin.logActivity('Hapus Pelanggaran', 'System', `Pelanggaran ${id} dihapus`)
    return { message: 'Violation deleted' }
  }

  async getAttendance(filters?: { date?: string; class?: string }) {
    let records = await this.firebaseAdmin.getList('attendance', 'studentName')
    if (filters?.date) records = records.filter(r => r.date === filters.date)
    if (filters?.class) records = records.filter(r => r.class === filters.class)
    return records
  }

  async getAttendanceById(id: string) {
    const record = await this.firebaseAdmin.getById('attendance', id)
    if (!record) throw new NotFoundException('Attendance not found')
    return record
  }

  async recordAttendance(data: {
    studentId: string
    studentName: string
    class: string
    date: string
    status: string
    activity: string
  }) {
    const result = await this.firebaseAdmin.add('attendance', {
      ...data,
      createdAt: new Date().toISOString(),
    })

    await this.firebaseAdmin.logActivity('Catat Absensi', 'System', `${data.studentName}: ${data.status} — ${data.date}`)
    return result
  }

  async updateAttendance(id: string, data: { studentName?: string; class?: string; date?: string; status?: string; activity?: string }) {
    const record = await this.firebaseAdmin.getById('attendance', id)
    if (!record) throw new NotFoundException('Attendance not found')

    await this.firebaseAdmin.update('attendance', id, {
      ...data,
      updatedAt: new Date().toISOString(),
    })

    await this.firebaseAdmin.logActivity('Ubah Absensi', 'System', `Absensi ${id} diperbarui`)
    return this.firebaseAdmin.getById('attendance', id)
  }

  async deleteAttendance(id: string) {
    const record = await this.firebaseAdmin.getById('attendance', id)
    if (!record) throw new NotFoundException('Attendance not found')

    await this.firebaseAdmin.remove('attendance', id)
    await this.firebaseAdmin.logActivity('Hapus Absensi', 'System', `Absensi ${id} dihapus`)
    return { message: 'Attendance deleted' }
  }
}
