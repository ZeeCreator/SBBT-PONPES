import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { FirebaseAdminService } from '../common/firebase-admin.service'

@Injectable()
export class MasterDataService {
  private readonly logger = new Logger(MasterDataService.name)

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  // ── Classes ────────────────────────────────────────────────

  async getAllClasses() {
    return this.firebaseAdmin.getList('classes', 'name')
  }

  async getClassById(id: string) {
    const item = await this.firebaseAdmin.getById('classes', id)
    if (!item) throw new NotFoundException('Class not found')
    return item
  }

  async createClass(data: { name: string; level: string; group: string; homeroomTeacher?: string }) {
    const result = await this.firebaseAdmin.add('classes', {
      ...data,
      createdAt: new Date().toISOString(),
    })
    await this.firebaseAdmin.logActivity('Tambah Kelas', 'System', `Kelas ${data.name} ditambahkan`)
    return result
  }

  async updateClass(id: string, data: { name?: string; homeroomTeacher?: string }) {
    await this.getClassById(id)
    await this.firebaseAdmin.update('classes', id, { ...data, updatedAt: new Date().toISOString() })
    await this.firebaseAdmin.logActivity('Ubah Kelas', 'System', `Kelas ${id} diperbarui`)
    return this.firebaseAdmin.getById('classes', id)
  }

  async deleteClass(id: string) {
    await this.getClassById(id)
    await this.firebaseAdmin.remove('classes', id)
    await this.firebaseAdmin.logActivity('Hapus Kelas', 'System', `Kelas ${id} dihapus`)
    return { message: 'Class deleted' }
  }

  // ── Dormitories ────────────────────────────────────────────

  async getAllDormitories() {
    return this.firebaseAdmin.getList('dormitories', 'name')
  }

  async getDormitoryById(id: string) {
    const item = await this.firebaseAdmin.getById('dormitories', id)
    if (!item) throw new NotFoundException('Dormitory not found')
    return item
  }

  async createDormitory(data: { name: string; gender: string; supervisor?: string; rooms: any[] }) {
    const result = await this.firebaseAdmin.add('dormitories', {
      ...data,
      createdAt: new Date().toISOString(),
    })
    await this.firebaseAdmin.logActivity('Tambah Gedung', 'System', `Gedung ${data.name} ditambahkan`)
    return result
  }

  async updateDormitory(id: string, data: { name?: string; supervisor?: string }) {
    await this.getDormitoryById(id)
    await this.firebaseAdmin.update('dormitories', id, { ...data, updatedAt: new Date().toISOString() })
    await this.firebaseAdmin.logActivity('Ubah Gedung', 'System', `Gedung ${id} diperbarui`)
    return this.firebaseAdmin.getById('dormitories', id)
  }

  async deleteDormitory(id: string) {
    await this.getDormitoryById(id)
    await this.firebaseAdmin.remove('dormitories', id)
    await this.firebaseAdmin.logActivity('Hapus Gedung', 'System', `Gedung ${id} dihapus`)
    return { message: 'Dormitory deleted' }
  }

  async addRoom(dormitoryId: string, roomData: { name: string; capacity: number; type: string }) {
    await this.getDormitoryById(dormitoryId)
    const result = await this.firebaseAdmin.addSub('dormitories', dormitoryId, 'rooms', {
      ...roomData,
      createdAt: new Date().toISOString(),
    })
    await this.firebaseAdmin.logActivity('Tambah Kamar', 'System', `Kamar ${roomData.name} ditambahkan ke gedung ${dormitoryId}`)
    return result
  }

  async removeRoom(dormitoryId: string, roomId: string) {
    await this.getDormitoryById(dormitoryId)
    await this.firebaseAdmin.removeSub('dormitories', dormitoryId, 'rooms', roomId)
    await this.firebaseAdmin.logActivity('Hapus Kamar', 'System', `Kamar ${roomId} dari gedung ${dormitoryId}`)
    return { message: 'Room deleted' }
  }

  // ── Academic Years ─────────────────────────────────────────

  async getAllAcademicYears() {
    return this.firebaseAdmin.getList('academic_years', 'name')
  }

  async getAcademicYearById(id: string) {
    const item = await this.firebaseAdmin.getById('academic_years', id)
    if (!item) throw new NotFoundException('Academic year not found')
    return item
  }

  async createAcademicYear(data: { name: string; semester: string; startDate: string; endDate: string; isActive?: boolean }) {
    const result = await this.firebaseAdmin.add('academic_years', {
      ...data,
      createdAt: new Date().toISOString(),
    })
    await this.firebaseAdmin.logActivity('Tambah Tahun Ajaran', 'System', `Tahun Ajaran ${data.name} semester ${data.semester} ditambahkan`)
    return result
  }

  async updateAcademicYear(id: string, data: { name?: string; endDate?: string; isActive?: boolean }) {
    await this.getAcademicYearById(id)
    await this.firebaseAdmin.update('academic_years', id, { ...data, updatedAt: new Date().toISOString() })
    await this.firebaseAdmin.logActivity('Ubah Tahun Ajaran', 'System', `Tahun Ajaran ${id} diperbarui`)
    return this.firebaseAdmin.getById('academic_years', id)
  }

  async deleteAcademicYear(id: string) {
    await this.getAcademicYearById(id)
    await this.firebaseAdmin.remove('academic_years', id)
    await this.firebaseAdmin.logActivity('Hapus Tahun Ajaran', 'System', `Tahun Ajaran ${id} dihapus`)
    return { message: 'Academic year deleted' }
  }

  // ── Periods ────────────────────────────────────────────────

  async getAllPeriods() {
    return this.firebaseAdmin.getList('periods', 'name')
  }

  async getPeriodById(id: string) {
    const item = await this.firebaseAdmin.getById('periods', id)
    if (!item) throw new NotFoundException('Period not found')
    return item
  }

  async createPeriod(data: { name: string; startDate: string; endDate: string; isActive?: boolean }) {
    const result = await this.firebaseAdmin.add('periods', {
      ...data,
      createdAt: new Date().toISOString(),
    })
    await this.firebaseAdmin.logActivity('Tambah Periode', 'System', `Periode ${data.name} ditambahkan`)
    return result
  }

  async updatePeriod(id: string, data: { name?: string; endDate?: string; isActive?: boolean }) {
    await this.getPeriodById(id)
    await this.firebaseAdmin.update('periods', id, { ...data, updatedAt: new Date().toISOString() })
    await this.firebaseAdmin.logActivity('Ubah Periode', 'System', `Periode ${id} diperbarui`)
    return this.firebaseAdmin.getById('periods', id)
  }

  async deletePeriod(id: string) {
    await this.getPeriodById(id)
    await this.firebaseAdmin.remove('periods', id)
    await this.firebaseAdmin.logActivity('Hapus Periode', 'System', `Periode ${id} dihapus`)
    return { message: 'Period deleted' }
  }
}
