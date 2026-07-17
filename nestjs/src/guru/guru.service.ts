import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common'
import { FirebaseAdminService } from '../common/firebase-admin.service'
import { CreateGuruDto, UpdateGuruDto } from './dto/create-guru.dto'

@Injectable()
export class GuruService {
  private readonly logger = new Logger(GuruService.name)

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async findAll(filters?: { specialization?: string; status?: string }) {
    let teachers = await this.firebaseAdmin.getList('teachers', 'name')
    if (filters?.specialization) teachers = teachers.filter(t => t.specialization === filters.specialization)
    if (filters?.status) teachers = teachers.filter(t => t.status === filters.status)
    return teachers
  }

  async findById(id: string) {
    const teacher = await this.firebaseAdmin.getById('teachers', id)
    if (!teacher) throw new NotFoundException('Teacher not found')
    return teacher
  }

  async create(dto: CreateGuruDto) {
    const teachers = await this.firebaseAdmin.getList('teachers')
    if (teachers.some(t => t.email === dto.email)) {
      throw new ConflictException('Email already registered as teacher')
    }

    const teacher = {
      name: dto.name,
      email: dto.email,
      phone: dto.phone || '',
      specialization: dto.specialization,
      subjects: dto.subjects,
      nuptk: dto.nuptk || '',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await this.firebaseAdmin.add('teachers', teacher)
    this.logger.log(`Teacher created: ${result.id} - ${dto.name}`)

    await this.firebaseAdmin.logActivity('Tambah Guru', 'System', `Guru ${dto.name} (${dto.specialization})`)
    return result
  }

  async update(id: string, dto: UpdateGuruDto) {
    const teacher = await this.firebaseAdmin.getById('teachers', id)
    if (!teacher) throw new NotFoundException('Teacher not found')

    const updates: any = { ...dto, updatedAt: new Date().toISOString() }
    await this.firebaseAdmin.update('teachers', id, updates)

    await this.firebaseAdmin.logActivity('Ubah Guru', 'System', `Guru ${teacher.name || id} diperbarui`)
    return this.firebaseAdmin.getById('teachers', id)
  }

  async remove(id: string) {
    const teacher = await this.firebaseAdmin.getById('teachers', id)
    if (!teacher) throw new NotFoundException('Teacher not found')

    await this.firebaseAdmin.remove('teachers', id)
    this.logger.log(`Teacher deleted: ${id}`)
    await this.firebaseAdmin.logActivity('Hapus Guru', 'System', `Guru ${teacher.name || id} dihapus`)
    return { message: 'Teacher deleted' }
  }
}
