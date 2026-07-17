import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { FirebaseAdminService } from '../common/firebase-admin.service'

@Injectable()
export class ExtracurricularService {
  private readonly logger = new Logger(ExtracurricularService.name)

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async findAllHadroh() {
    return this.firebaseAdmin.getList('hadroh')
  }

  async findHadrohById(id: string) {
    const item = await this.firebaseAdmin.getById('hadroh', id)
    if (!item) throw new NotFoundException('Hadroh group not found')
    return item
  }

  async createHadroh(dto: any) {
    const result = await this.firebaseAdmin.add('hadroh', dto)
    this.logger.log(`Hadroh group created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Ekstrakurikuler', 'System', `Hadroh group ${dto.groupName} created`)
    return result
  }

  async updateHadroh(id: string, dto: any) {
    const item = await this.firebaseAdmin.getById('hadroh', id)
    if (!item) throw new NotFoundException('Hadroh group not found')
    await this.firebaseAdmin.update('hadroh', id, dto)
    this.logger.log(`Hadroh group updated: ${id}`)
    await this.firebaseAdmin.logActivity('Ubah Ekstrakurikuler', 'System', `Hadroh group ${item.groupName} updated`)
    return this.firebaseAdmin.getById('hadroh', id)
  }

  async removeHadroh(id: string) {
    const item = await this.firebaseAdmin.getById('hadroh', id)
    if (!item) throw new NotFoundException('Hadroh group not found')
    await this.firebaseAdmin.remove('hadroh', id)
    this.logger.log(`Hadroh group deleted: ${id}`)
    await this.firebaseAdmin.logActivity('Hapus Ekstrakurikuler', 'System', `Hadroh group ${item.groupName} deleted`)
    return { message: 'Hadroh group deleted' }
  }

  async findAllExtracurricular() {
    return this.firebaseAdmin.getList('extracurricular')
  }

  async findExtracurricularById(id: string) {
    const item = await this.firebaseAdmin.getById('extracurricular', id)
    if (!item) throw new NotFoundException('Extracurricular not found')
    return item
  }

  async createExtracurricular(dto: any) {
    const result = await this.firebaseAdmin.add('extracurricular', dto)
    this.logger.log(`Extracurricular created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Ekstrakurikuler', 'System', `Extracurricular ${dto.name} created`)
    return result
  }

  async updateExtracurricular(id: string, dto: any) {
    const item = await this.firebaseAdmin.getById('extracurricular', id)
    if (!item) throw new NotFoundException('Extracurricular not found')
    await this.firebaseAdmin.update('extracurricular', id, dto)
    this.logger.log(`Extracurricular updated: ${id}`)
    await this.firebaseAdmin.logActivity('Ubah Ekstrakurikuler', 'System', `Extracurricular ${item.name} updated`)
    return this.firebaseAdmin.getById('extracurricular', id)
  }

  async removeExtracurricular(id: string) {
    const item = await this.firebaseAdmin.getById('extracurricular', id)
    if (!item) throw new NotFoundException('Extracurricular not found')
    await this.firebaseAdmin.remove('extracurricular', id)
    this.logger.log(`Extracurricular deleted: ${id}`)
    await this.firebaseAdmin.logActivity('Hapus Ekstrakurikuler', 'System', `Extracurricular ${item.name} deleted`)
    return { message: 'Extracurricular deleted' }
  }

  async findAllPublicSpeaking() {
    return this.firebaseAdmin.getList('public_speaking')
  }

  async findPublicSpeakingById(id: string) {
    const item = await this.firebaseAdmin.getById('public_speaking', id)
    if (!item) throw new NotFoundException('Public speaking record not found')
    return item
  }

  async createPublicSpeaking(dto: any) {
    const result = await this.firebaseAdmin.add('public_speaking', dto)
    this.logger.log(`Public speaking record created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Ekstrakurikuler', 'System', 'Public speaking record created')
    return result
  }

  async updatePublicSpeaking(id: string, dto: any) {
    const item = await this.firebaseAdmin.getById('public_speaking', id)
    if (!item) throw new NotFoundException('Public speaking record not found')
    await this.firebaseAdmin.update('public_speaking', id, dto)
    this.logger.log(`Public speaking record updated: ${id}`)
    await this.firebaseAdmin.logActivity('Ubah Ekstrakurikuler', 'System', 'Public speaking record updated')
    return this.firebaseAdmin.getById('public_speaking', id)
  }

  async removePublicSpeaking(id: string) {
    const item = await this.firebaseAdmin.getById('public_speaking', id)
    if (!item) throw new NotFoundException('Public speaking record not found')
    await this.firebaseAdmin.remove('public_speaking', id)
    this.logger.log(`Public speaking record deleted: ${id}`)
    await this.firebaseAdmin.logActivity('Hapus Ekstrakurikuler', 'System', 'Public speaking record deleted')
    return { message: 'Public speaking record deleted' }
  }

  async findAllMedia() {
    return this.firebaseAdmin.getList('media')
  }

  async findMediaById(id: string) {
    const item = await this.firebaseAdmin.getById('media', id)
    if (!item) throw new NotFoundException('Media not found')
    return item
  }

  async createMedia(dto: any) {
    const result = await this.firebaseAdmin.add('media', dto)
    this.logger.log(`Media created: ${result.id}`)
    await this.firebaseAdmin.logActivity('Tambah Ekstrakurikuler', 'System', `Media ${dto.title} created`)
    return result
  }

  async updateMedia(id: string, dto: any) {
    const item = await this.firebaseAdmin.getById('media', id)
    if (!item) throw new NotFoundException('Media not found')
    await this.firebaseAdmin.update('media', id, dto)
    this.logger.log(`Media updated: ${id}`)
    await this.firebaseAdmin.logActivity('Ubah Ekstrakurikuler', 'System', `Media ${item.title} updated`)
    return this.firebaseAdmin.getById('media', id)
  }

  async removeMedia(id: string) {
    const item = await this.firebaseAdmin.getById('media', id)
    if (!item) throw new NotFoundException('Media not found')
    await this.firebaseAdmin.remove('media', id)
    this.logger.log(`Media deleted: ${id}`)
    await this.firebaseAdmin.logActivity('Hapus Ekstrakurikuler', 'System', `Media ${item.title} deleted`)
    return { message: 'Media deleted' }
  }
}
