import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { PsbService } from './psb.service'
import { Auth, Roles } from '../common/roles.guard'
import { CreateRegistrationDto, UpdateRegistrationDto } from './dto/registration.dto'
import { CreateAdmissionTestDto } from './dto/admission-test.dto'
import { CreateAdmissionResultDto, UpdateAdmissionResultDto } from './dto/admission-result.dto'

@Controller('psb')
export class PsbController {
  constructor(private readonly psbService: PsbService) {}

  // ── Registrations ──────────────────────────────────────

  @Get('registrations')
  @Roles('super_admin', 'kesantrian')
  async findAllRegistrations(@Query('status') status?: string) {
    return this.psbService.findAllRegistrations(status)
  }

  @Get('registrations/:id')
  @Roles('super_admin', 'kesantrian')
  async findRegistrationById(@Param('id') id: string) {
    return this.psbService.findRegistrationById(id)
  }

  @Post('registrations')
  async createRegistration(@Body() dto: CreateRegistrationDto) {
    return this.psbService.createRegistration(dto)
  }

  @Patch('registrations/:id')
  @Roles('super_admin', 'kesantrian')
  async updateRegistration(@Param('id') id: string, @Body() dto: UpdateRegistrationDto) {
    return this.psbService.updateRegistration(id, dto)
  }

  @Delete('registrations/:id')
  @Roles('super_admin')
  async removeRegistration(@Param('id') id: string) {
    return this.psbService.removeRegistration(id)
  }

  // ── Admission Tests ────────────────────────────────────

  @Get('tests')
  @Roles('super_admin', 'kesantrian')
  async findAllTests(@Query('registrationId') registrationId?: string) {
    return this.psbService.findAllTests(registrationId)
  }

  @Get('tests/:id')
  @Roles('super_admin', 'kesantrian')
  async findTestById(@Param('id') id: string) {
    return this.psbService.findTestById(id)
  }

  @Post('tests')
  @Roles('super_admin', 'kesantrian')
  async createTest(@Body() dto: CreateAdmissionTestDto) {
    return this.psbService.createTest(dto)
  }

  @Patch('tests/:id')
  @Roles('super_admin', 'kesantrian')
  async updateTest(@Param('id') id: string, @Body() dto: Partial<CreateAdmissionTestDto>) {
    return this.psbService.updateTest(id, dto)
  }

  @Delete('tests/:id')
  @Roles('super_admin')
  async removeTest(@Param('id') id: string) {
    return this.psbService.removeTest(id)
  }

  // ── Admission Results ──────────────────────────────────

  @Get('results')
  @Roles('super_admin', 'kesantrian')
  async findAllResults(@Query('status') status?: string) {
    return this.psbService.findAllResults(status)
  }

  @Get('results/:id')
  @Roles('super_admin', 'kesantrian')
  async findResultById(@Param('id') id: string) {
    return this.psbService.findResultById(id)
  }

  @Post('results')
  @Roles('super_admin', 'kesantrian')
  async createResult(@Body() dto: CreateAdmissionResultDto) {
    return this.psbService.createResult(dto)
  }

  @Patch('results/:id')
  @Roles('super_admin', 'kesantrian')
  async updateResult(@Param('id') id: string, @Body() dto: UpdateAdmissionResultDto) {
    return this.psbService.updateResult(id, dto)
  }

  @Delete('results/:id')
  @Roles('super_admin')
  async removeResult(@Param('id') id: string) {
    return this.psbService.removeResult(id)
  }
}
