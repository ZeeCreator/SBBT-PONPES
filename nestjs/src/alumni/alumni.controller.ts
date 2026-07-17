import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { AlumniService } from './alumni.service'
import { Auth, Roles } from '../common/roles.guard'
import { CreateAlumniDto, UpdateAlumniDto } from './dto/alumni.dto'
import { CreateAlumniEventDto, UpdateAlumniEventDto } from './dto/alumni-event.dto'
import { CreateGraduationDto, UpdateGraduationDto } from './dto/graduation.dto'

@Controller('alumni')
export class AlumniController {
  constructor(private readonly alumniService: AlumniService) {}

  // ── Alumni ─────────────────────────────────────────────

  @Get()
  @Roles('super_admin', 'kesantrian')
  async findAllAlumni(
    @Query('currentStatus') currentStatus?: string,
    @Query('graduationYear') graduationYear?: number,
  ) {
    return this.alumniService.findAllAlumni({ currentStatus, graduationYear })
  }

  @Get(':id')
  @Roles('super_admin', 'kesantrian')
  async findAlumniById(@Param('id') id: string) {
    return this.alumniService.findAlumniById(id)
  }

  @Post()
  @Roles('super_admin', 'kesantrian')
  async createAlumni(@Body() dto: CreateAlumniDto) {
    return this.alumniService.createAlumni(dto)
  }

  @Patch(':id')
  @Roles('super_admin', 'kesantrian')
  async updateAlumni(@Param('id') id: string, @Body() dto: UpdateAlumniDto) {
    return this.alumniService.updateAlumni(id, dto)
  }

  @Delete(':id')
  @Roles('super_admin')
  async removeAlumni(@Param('id') id: string) {
    return this.alumniService.removeAlumni(id)
  }

  // ── Events ─────────────────────────────────────────────

  @Get('events')
  @Roles('super_admin', 'kesantrian')
  async findAllEvents(@Query('type') type?: string) {
    return this.alumniService.findAllEvents(type)
  }

  @Get('events/:id')
  @Roles('super_admin', 'kesantrian')
  async findEventById(@Param('id') id: string) {
    return this.alumniService.findEventById(id)
  }

  @Post('events')
  @Roles('super_admin', 'kesantrian')
  async createEvent(@Body() dto: CreateAlumniEventDto) {
    return this.alumniService.createEvent(dto)
  }

  @Patch('events/:id')
  @Roles('super_admin', 'kesantrian')
  async updateEvent(@Param('id') id: string, @Body() dto: UpdateAlumniEventDto) {
    return this.alumniService.updateEvent(id, dto)
  }

  @Delete('events/:id')
  @Roles('super_admin')
  async removeEvent(@Param('id') id: string) {
    return this.alumniService.removeEvent(id)
  }

  // ── Graduations ────────────────────────────────────────

  @Get('graduations')
  @Roles('super_admin', 'kesantrian')
  async findAllGraduations() {
    return this.alumniService.findAllGraduations()
  }

  @Get('graduations/:id')
  @Roles('super_admin', 'kesantrian')
  async findGraduationById(@Param('id') id: string) {
    return this.alumniService.findGraduationById(id)
  }

  @Post('graduations')
  @Roles('super_admin', 'kesantrian')
  async createGraduation(@Body() dto: CreateGraduationDto) {
    return this.alumniService.createGraduation(dto)
  }

  @Patch('graduations/:id')
  @Roles('super_admin', 'kesantrian')
  async updateGraduation(@Param('id') id: string, @Body() dto: UpdateGraduationDto) {
    return this.alumniService.updateGraduation(id, dto)
  }

  @Delete('graduations/:id')
  @Roles('super_admin')
  async removeGraduation(@Param('id') id: string) {
    return this.alumniService.removeGraduation(id)
  }
}
