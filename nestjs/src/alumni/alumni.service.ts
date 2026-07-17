import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { FirebaseAdminService } from '../common/firebase-admin.service'
import { CreateAlumniDto, UpdateAlumniDto } from './dto/alumni.dto'
import { CreateAlumniEventDto, UpdateAlumniEventDto } from './dto/alumni-event.dto'
import { CreateGraduationDto, UpdateGraduationDto } from './dto/graduation.dto'

@Injectable()
export class AlumniService {
  private readonly logger = new Logger(AlumniService.name)

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  // ── Alumni ─────────────────────────────────────────────

  async findAllAlumni(filters?: { currentStatus?: string; graduationYear?: number }) {
    let alumni = await this.firebaseAdmin.getList('alumni', 'name')
    if (filters?.currentStatus) alumni = alumni.filter(a => a.currentStatus === filters.currentStatus)
    if (filters?.graduationYear) alumni = alumni.filter(a => a.graduationYear === filters.graduationYear)
    return alumni
  }

  async findAlumniById(id: string) {
    const alumni = await this.firebaseAdmin.getById('alumni', id)
    if (!alumni) throw new NotFoundException('Alumni not found')
    return alumni
  }

  async createAlumni(dto: CreateAlumniDto) {
    const data = {
      ...dto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const result = await this.firebaseAdmin.add('alumni', data)
    this.logger.log(`Alumni created: ${result.id} - ${dto.name}`)
    await this.firebaseAdmin.logActivity('Tambah Alumni', 'System', `Alumni ${dto.name}`)
    return result
  }

  async updateAlumni(id: string, dto: UpdateAlumniDto) {
    const alumni = await this.firebaseAdmin.getById('alumni', id)
    if (!alumni) throw new NotFoundException('Alumni not found')
    const updates = { ...dto, updatedAt: new Date().toISOString() }
    await this.firebaseAdmin.update('alumni', id, updates)
    await this.firebaseAdmin.logActivity('Ubah Alumni', 'System', `Alumni ${alumni.name || id} diperbarui`)
    return this.firebaseAdmin.getById('alumni', id)
  }

  async removeAlumni(id: string) {
    const alumni = await this.firebaseAdmin.getById('alumni', id)
    if (!alumni) throw new NotFoundException('Alumni not found')
    await this.firebaseAdmin.remove('alumni', id)
    await this.firebaseAdmin.logActivity('Hapus Alumni', 'System', `Alumni ${alumni.name || id} dihapus`)
    return { message: 'Alumni deleted' }
  }

  // ── Alumni Events ──────────────────────────────────────

  async findAllEvents(type?: string) {
    let events = await this.firebaseAdmin.getList('alumni_events', 'date')
    if (type) events = events.filter(e => e.type === type)
    return events
  }

  async findEventById(id: string) {
    const event = await this.firebaseAdmin.getById('alumni_events', id)
    if (!event) throw new NotFoundException('Alumni event not found')
    return event
  }

  async createEvent(dto: CreateAlumniEventDto) {
    const data = {
      ...dto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const result = await this.firebaseAdmin.add('alumni_events', data)
    this.logger.log(`Alumni event created: ${result.id} - ${dto.name}`)
    await this.firebaseAdmin.logActivity('Tambah Acara Alumni', 'System', `Acara ${dto.name}`)
    return result
  }

  async updateEvent(id: string, dto: UpdateAlumniEventDto) {
    const event = await this.firebaseAdmin.getById('alumni_events', id)
    if (!event) throw new NotFoundException('Alumni event not found')
    const updates = { ...dto, updatedAt: new Date().toISOString() }
    await this.firebaseAdmin.update('alumni_events', id, updates)
    await this.firebaseAdmin.logActivity('Ubah Acara Alumni', 'System', `Acara ${event.name || id} diperbarui`)
    return this.firebaseAdmin.getById('alumni_events', id)
  }

  async removeEvent(id: string) {
    const event = await this.firebaseAdmin.getById('alumni_events', id)
    if (!event) throw new NotFoundException('Alumni event not found')
    await this.firebaseAdmin.remove('alumni_events', id)
    await this.firebaseAdmin.logActivity('Hapus Acara Alumni', 'System', `Acara ${event.name || id} dihapus`)
    return { message: 'Alumni event deleted' }
  }

  // ── Graduations ────────────────────────────────────────

  async findAllGraduations() {
    return this.firebaseAdmin.getList('graduations', 'graduationDate')
  }

  async findGraduationById(id: string) {
    const grad = await this.firebaseAdmin.getById('graduations', id)
    if (!grad) throw new NotFoundException('Graduation not found')
    return grad
  }

  async createGraduation(dto: CreateGraduationDto) {
    const data = {
      ...dto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const result = await this.firebaseAdmin.add('graduations', data)
    this.logger.log(`Graduation created: ${result.id} - ${dto.studentName}`)
    await this.firebaseAdmin.logActivity('Tambah Wisuda', 'System', `Wisuda ${dto.studentName}`)
    return result
  }

  async updateGraduation(id: string, dto: UpdateGraduationDto) {
    const grad = await this.firebaseAdmin.getById('graduations', id)
    if (!grad) throw new NotFoundException('Graduation not found')
    const updates = { ...dto, updatedAt: new Date().toISOString() }
    await this.firebaseAdmin.update('graduations', id, updates)
    await this.firebaseAdmin.logActivity('Ubah Wisuda', 'System', `Wisuda ${grad.studentName || id} diperbarui`)
    return this.firebaseAdmin.getById('graduations', id)
  }

  async removeGraduation(id: string) {
    const grad = await this.firebaseAdmin.getById('graduations', id)
    if (!grad) throw new NotFoundException('Graduation not found')
    await this.firebaseAdmin.remove('graduations', id)
    await this.firebaseAdmin.logActivity('Hapus Wisuda', 'System', `Wisuda ${grad.studentName || id} dihapus`)
    return { message: 'Graduation deleted' }
  }
}
