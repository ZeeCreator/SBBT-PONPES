import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { FirebaseAdminService } from '../common/firebase-admin.service'

@Injectable()
export class IbadahService {
  private readonly logger = new Logger(IbadahService.name)

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async findAllPrayerAttendance(filters?: { studentId?: string; date?: string }) {
    let items = await this.firebaseAdmin.getList('prayer_attendance')
    if (filters?.studentId) items = items.filter(i => i.studentId === filters.studentId)
    if (filters?.date) items = items.filter(i => i.date === filters.date)
    return items
  }

  async findPrayerAttendanceById(id: string) {
    const item = await this.firebaseAdmin.getById('prayer_attendance', id)
    if (!item) throw new NotFoundException('Prayer attendance not found')
    return item
  }

  async createPrayerAttendance(dto: any) {
    const result = await this.firebaseAdmin.add('prayer_attendance', dto)
    this.logger.log(`Prayer attendance created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Ibadah', 'System', 'Prayer attendance recorded')
    return result
  }

  async updatePrayerAttendance(id: string, dto: any) {
    const item = await this.firebaseAdmin.getById('prayer_attendance', id)
    if (!item) throw new NotFoundException('Prayer attendance not found')
    await this.firebaseAdmin.update('prayer_attendance', id, dto)
    this.logger.log(`Prayer attendance updated: ${id}`)
    await this.firebaseAdmin.logActivity('Ubah Ibadah', 'System', 'Prayer attendance updated')
    return this.firebaseAdmin.getById('prayer_attendance', id)
  }

  async removePrayerAttendance(id: string) {
    const item = await this.firebaseAdmin.getById('prayer_attendance', id)
    if (!item) throw new NotFoundException('Prayer attendance not found')
    await this.firebaseAdmin.remove('prayer_attendance', id)
    this.logger.log(`Prayer attendance deleted: ${id}`)
    await this.firebaseAdmin.logActivity('Hapus Ibadah', 'System', 'Prayer attendance deleted')
    return { message: 'Prayer attendance deleted' }
  }

  async findAllFasting(filters?: { studentId?: string }) {
    let items = await this.firebaseAdmin.getList('fasting_tracking')
    if (filters?.studentId) items = items.filter(i => i.studentId === filters.studentId)
    return items
  }

  async findFastingById(id: string) {
    const item = await this.firebaseAdmin.getById('fasting_tracking', id)
    if (!item) throw new NotFoundException('Fasting record not found')
    return item
  }

  async createFasting(dto: any) {
    const result = await this.firebaseAdmin.add('fasting_tracking', dto)
    this.logger.log(`Fasting record created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Ibadah', 'System', 'Fasting record created')
    return result
  }

  async removeFasting(id: string) {
    const item = await this.firebaseAdmin.getById('fasting_tracking', id)
    if (!item) throw new NotFoundException('Fasting record not found')
    await this.firebaseAdmin.remove('fasting_tracking', id)
    this.logger.log(`Fasting record deleted: ${id}`)
    await this.firebaseAdmin.logActivity('Hapus Ibadah', 'System', 'Fasting record deleted')
    return { message: 'Fasting record deleted' }
  }

  async findAllTahajjud(filters?: { studentId?: string; date?: string }) {
    let items = await this.firebaseAdmin.getList('tahajjud_tracking')
    if (filters?.studentId) items = items.filter(i => i.studentId === filters.studentId)
    if (filters?.date) items = items.filter(i => i.date === filters.date)
    return items
  }

  async findTahajjudById(id: string) {
    const item = await this.firebaseAdmin.getById('tahajjud_tracking', id)
    if (!item) throw new NotFoundException('Tahajjud record not found')
    return item
  }

  async createTahajjud(dto: any) {
    const result = await this.firebaseAdmin.add('tahajjud_tracking', dto)
    this.logger.log(`Tahajjud record created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Ibadah', 'System', 'Tahajjud record created')
    return result
  }

  async updateTahajjud(id: string, dto: any) {
    const item = await this.firebaseAdmin.getById('tahajjud_tracking', id)
    if (!item) throw new NotFoundException('Tahajjud record not found')
    await this.firebaseAdmin.update('tahajjud_tracking', id, dto)
    this.logger.log(`Tahajjud record updated: ${id}`)
    await this.firebaseAdmin.logActivity('Ubah Ibadah', 'System', 'Tahajjud record updated')
    return this.firebaseAdmin.getById('tahajjud_tracking', id)
  }

  async removeTahajjud(id: string) {
    const item = await this.firebaseAdmin.getById('tahajjud_tracking', id)
    if (!item) throw new NotFoundException('Tahajjud record not found')
    await this.firebaseAdmin.remove('tahajjud_tracking', id)
    this.logger.log(`Tahajjud record deleted: ${id}`)
    await this.firebaseAdmin.logActivity('Hapus Ibadah', 'System', 'Tahajjud record deleted')
    return { message: 'Tahajjud record deleted' }
  }

  async findAllWirid(filters?: { studentId?: string }) {
    let items = await this.firebaseAdmin.getList('daily_wirid')
    if (filters?.studentId) items = items.filter(i => i.studentId === filters.studentId)
    return items
  }

  async findWiridById(id: string) {
    const item = await this.firebaseAdmin.getById('daily_wirid', id)
    if (!item) throw new NotFoundException('Wirid record not found')
    return item
  }

  async createWirid(dto: any) {
    const result = await this.firebaseAdmin.add('daily_wirid', dto)
    this.logger.log(`Wirid record created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Ibadah', 'System', 'Wirid record created')
    return result
  }

  async removeWirid(id: string) {
    const item = await this.firebaseAdmin.getById('daily_wirid', id)
    if (!item) throw new NotFoundException('Wirid record not found')
    await this.firebaseAdmin.remove('daily_wirid', id)
    this.logger.log(`Wirid record deleted: ${id}`)
    await this.firebaseAdmin.logActivity('Hapus Ibadah', 'System', 'Wirid record deleted')
    return { message: 'Wirid record deleted' }
  }

  async findAllInfaq(filters?: { studentId?: string; date?: string }) {
    let items = await this.firebaseAdmin.getList('daily_infaq')
    if (filters?.studentId) items = items.filter(i => i.studentId === filters.studentId)
    if (filters?.date) items = items.filter(i => i.date === filters.date)
    return items
  }

  async findInfaqById(id: string) {
    const item = await this.firebaseAdmin.getById('daily_infaq', id)
    if (!item) throw new NotFoundException('Infaq record not found')
    return item
  }

  async createInfaq(dto: any) {
    const result = await this.firebaseAdmin.add('daily_infaq', dto)
    this.logger.log(`Infaq record created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Ibadah', 'System', 'Infaq record created')
    return result
  }

  async removeInfaq(id: string) {
    const item = await this.firebaseAdmin.getById('daily_infaq', id)
    if (!item) throw new NotFoundException('Infaq record not found')
    await this.firebaseAdmin.remove('daily_infaq', id)
    this.logger.log(`Infaq record deleted: ${id}`)
    await this.firebaseAdmin.logActivity('Hapus Ibadah', 'System', 'Infaq record deleted')
    return { message: 'Infaq record deleted' }
  }

  async findAllZakat(filters?: { type?: string }) {
    let items = await this.firebaseAdmin.getList('zakat')
    if (filters?.type) items = items.filter(i => i.type === filters.type)
    return items
  }

  async findZakatById(id: string) {
    const item = await this.firebaseAdmin.getById('zakat', id)
    if (!item) throw new NotFoundException('Zakat record not found')
    return item
  }

  async createZakat(dto: any) {
    const result = await this.firebaseAdmin.add('zakat', dto)
    this.logger.log(`Zakat record created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Ibadah', 'System', 'Zakat record created')
    return result
  }

  async removeZakat(id: string) {
    const item = await this.firebaseAdmin.getById('zakat', id)
    if (!item) throw new NotFoundException('Zakat record not found')
    await this.firebaseAdmin.remove('zakat', id)
    this.logger.log(`Zakat record deleted: ${id}`)
    await this.firebaseAdmin.logActivity('Hapus Ibadah', 'System', 'Zakat record deleted')
    return { message: 'Zakat record deleted' }
  }
}
