import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { FirebaseAdminService } from '../common/firebase-admin.service'
import { CreateRegistrationDto, UpdateRegistrationDto } from './dto/registration.dto'
import { CreateAdmissionTestDto } from './dto/admission-test.dto'
import { CreateAdmissionResultDto, UpdateAdmissionResultDto } from './dto/admission-result.dto'

@Injectable()
export class PsbService {
  private readonly logger = new Logger(PsbService.name)

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  // ── Registrations ──────────────────────────────────────

  async findAllRegistrations(status?: string) {
    let registrations = await this.firebaseAdmin.getList('registrations', 'fullName')
    if (status) registrations = registrations.filter(r => r.status === status)
    return registrations
  }

  async findRegistrationById(id: string) {
    const reg = await this.firebaseAdmin.getById('registrations', id)
    if (!reg) throw new NotFoundException('Registration not found')
    return reg
  }

  async createRegistration(dto: CreateRegistrationDto) {
    const data = {
      ...dto,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const result = await this.firebaseAdmin.add('registrations', data)
    this.logger.log(`Registration created: ${result.id} - ${dto.fullName}`)
    await this.firebaseAdmin.logActivity('Registrasi PSB', 'System', `Pendaftaran ${dto.fullName}`)
    return result
  }

  async updateRegistration(id: string, dto: UpdateRegistrationDto) {
    const reg = await this.firebaseAdmin.getById('registrations', id)
    if (!reg) throw new NotFoundException('Registration not found')
    const updates = { ...dto, updatedAt: new Date().toISOString() }
    await this.firebaseAdmin.update('registrations', id, updates)
    await this.firebaseAdmin.logActivity('Ubah Registrasi PSB', 'System', `Registrasi ${reg.fullName || id} diperbarui`)
    return this.firebaseAdmin.getById('registrations', id)
  }

  async removeRegistration(id: string) {
    const reg = await this.firebaseAdmin.getById('registrations', id)
    if (!reg) throw new NotFoundException('Registration not found')
    await this.firebaseAdmin.remove('registrations', id)
    await this.firebaseAdmin.logActivity('Hapus Registrasi PSB', 'System', `Registrasi ${reg.fullName || id} dihapus`)
    return { message: 'Registration deleted' }
  }

  // ── Admission Tests ────────────────────────────────────

  async findAllTests(registrationId?: string) {
    let tests = await this.firebaseAdmin.getList('admissions_tests', 'studentName')
    if (registrationId) tests = tests.filter(t => t.registrationId === registrationId)
    return tests
  }

  async findTestById(id: string) {
    const test = await this.firebaseAdmin.getById('admissions_tests', id)
    if (!test) throw new NotFoundException('Admission test not found')
    return test
  }

  async createTest(dto: CreateAdmissionTestDto) {
    const data = {
      ...dto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const result = await this.firebaseAdmin.add('admissions_tests', data)
    this.logger.log(`Admission test created: ${result.id} - ${dto.studentName}`)
    await this.firebaseAdmin.logActivity('Tambah Tes PSB', 'System', `Tes ${dto.studentName}`)
    return result
  }

  async updateTest(id: string, dto: Partial<CreateAdmissionTestDto>) {
    const test = await this.firebaseAdmin.getById('admissions_tests', id)
    if (!test) throw new NotFoundException('Admission test not found')
    const updates = { ...dto, updatedAt: new Date().toISOString() }
    await this.firebaseAdmin.update('admissions_tests', id, updates)
    await this.firebaseAdmin.logActivity('Ubah Tes PSB', 'System', `Tes ${test.studentName || id} diperbarui`)
    return this.firebaseAdmin.getById('admissions_tests', id)
  }

  async removeTest(id: string) {
    const test = await this.firebaseAdmin.getById('admissions_tests', id)
    if (!test) throw new NotFoundException('Admission test not found')
    await this.firebaseAdmin.remove('admissions_tests', id)
    await this.firebaseAdmin.logActivity('Hapus Tes PSB', 'System', `Tes ${test.studentName || id} dihapus`)
    return { message: 'Admission test deleted' }
  }

  // ── Admission Results ──────────────────────────────────

  async findAllResults(status?: string) {
    let results = await this.firebaseAdmin.getList('admissions_results', 'studentName')
    if (status) results = results.filter(r => r.status === status)
    return results
  }

  async findResultById(id: string) {
    const result = await this.firebaseAdmin.getById('admissions_results', id)
    if (!result) throw new NotFoundException('Admission result not found')
    return result
  }

  async createResult(dto: CreateAdmissionResultDto) {
    const data = {
      ...dto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const result = await this.firebaseAdmin.add('admissions_results', data)
    this.logger.log(`Admission result created: ${result.id} - ${dto.studentName}`)
    await this.firebaseAdmin.logActivity('Tambah Hasil PSB', 'System', `Hasil ${dto.studentName}`)
    return result
  }

  async updateResult(id: string, dto: UpdateAdmissionResultDto) {
    const result = await this.firebaseAdmin.getById('admissions_results', id)
    if (!result) throw new NotFoundException('Admission result not found')
    const updates = { ...dto, updatedAt: new Date().toISOString() }
    await this.firebaseAdmin.update('admissions_results', id, updates)
    await this.firebaseAdmin.logActivity('Ubah Hasil PSB', 'System', `Hasil ${result.studentName || id} diperbarui`)
    return this.firebaseAdmin.getById('admissions_results', id)
  }

  async removeResult(id: string) {
    const result = await this.firebaseAdmin.getById('admissions_results', id)
    if (!result) throw new NotFoundException('Admission result not found')
    await this.firebaseAdmin.remove('admissions_results', id)
    await this.firebaseAdmin.logActivity('Hapus Hasil PSB', 'System', `Hasil ${result.studentName || id} dihapus`)
    return { message: 'Admission result deleted' }
  }
}
