import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { FirebaseAdminService } from '../common/firebase-admin.service'

@Injectable()
export class KesehatanService {
  private readonly logger = new Logger(KesehatanService.name)

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async findAllMedicalRecords(filters?: { studentId?: string }) {
    let items = await this.firebaseAdmin.getList('medical_records', 'date')
    if (filters?.studentId) items = items.filter(i => i.studentId === filters.studentId)
    return items
  }

  async findMedicalRecordById(id: string) {
    const item = await this.firebaseAdmin.getById('medical_records', id)
    if (!item) throw new NotFoundException('Medical record not found')
    return item
  }

  async createMedicalRecord(dto: any) {
    const data = { ...dto, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    const result = await this.firebaseAdmin.add('medical_records', data)
    this.logger.log(`Medical record created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Rekam Medis', 'System', `Rekam medis ${result.id}`)
    return result
  }

  async updateMedicalRecord(id: string, dto: any) {
    await this.findMedicalRecordById(id)
    const updates = { ...dto, updatedAt: new Date().toISOString() }
    await this.firebaseAdmin.update('medical_records', id, updates)
    await this.firebaseAdmin.logActivity('Ubah Rekam Medis', 'System', `Rekam medis ${id} diperbarui`)
    return this.firebaseAdmin.getById('medical_records', id)
  }

  async removeMedicalRecord(id: string) {
    await this.findMedicalRecordById(id)
    await this.firebaseAdmin.remove('medical_records', id)
    await this.firebaseAdmin.logActivity('Hapus Rekam Medis', 'System', `Rekam medis ${id} dihapus`)
    return { message: 'Medical record deleted' }
  }

  async findAllGrowthRecords(filters?: { studentId?: string }) {
    let items = await this.firebaseAdmin.getList('growth_monitoring', 'date')
    if (filters?.studentId) items = items.filter(i => i.studentId === filters.studentId)
    return items
  }

  async findGrowthRecordById(id: string) {
    const item = await this.firebaseAdmin.getById('growth_monitoring', id)
    if (!item) throw new NotFoundException('Growth record not found')
    return item
  }

  async createGrowthRecord(dto: any) {
    const data = { ...dto, createdAt: new Date().toISOString() }
    const result = await this.firebaseAdmin.add('growth_monitoring', data)
    this.logger.log(`Growth record created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Data Tumbuh Kembang', 'System', `TB/BB ${result.id}`)
    return result
  }

  async removeGrowthRecord(id: string) {
    await this.findGrowthRecordById(id)
    await this.firebaseAdmin.remove('growth_monitoring', id)
    await this.firebaseAdmin.logActivity('Hapus Data Tumbuh Kembang', 'System', `TB/BB ${id} dihapus`)
    return { message: 'Growth record deleted' }
  }

  async findAllSanitation() {
    return this.firebaseAdmin.getList('sanitation', 'date')
  }

  async findSanitationById(id: string) {
    const item = await this.firebaseAdmin.getById('sanitation', id)
    if (!item) throw new NotFoundException('Sanitation record not found')
    return item
  }

  async createSanitation(dto: any) {
    const data = { ...dto, createdAt: new Date().toISOString() }
    const result = await this.firebaseAdmin.add('sanitation', data)
    this.logger.log(`Sanitation record created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Data Sanitasi', 'System', `Sanitasi ${result.id}`)
    return result
  }

  async removeSanitation(id: string) {
    await this.findSanitationById(id)
    await this.firebaseAdmin.remove('sanitation', id)
    await this.firebaseAdmin.logActivity('Hapus Data Sanitasi', 'System', `Sanitasi ${id} dihapus`)
    return { message: 'Sanitation deleted' }
  }

  async findAllNutrition() {
    return this.firebaseAdmin.getList('nutrition', 'date')
  }

  async findNutritionById(id: string) {
    const item = await this.firebaseAdmin.getById('nutrition', id)
    if (!item) throw new NotFoundException('Nutrition record not found')
    return item
  }

  async createNutrition(dto: any) {
    const data = { ...dto, createdAt: new Date().toISOString() }
    const result = await this.firebaseAdmin.add('nutrition', data)
    this.logger.log(`Nutrition record created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Data Gizi', 'System', `Gizi ${result.id}`)
    return result
  }

  async removeNutrition(id: string) {
    await this.findNutritionById(id)
    await this.firebaseAdmin.remove('nutrition', id)
    await this.firebaseAdmin.logActivity('Hapus Data Gizi', 'System', `Gizi ${id} dihapus`)
    return { message: 'Nutrition deleted' }
  }
}
