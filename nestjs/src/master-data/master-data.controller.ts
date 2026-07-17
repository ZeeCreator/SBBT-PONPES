import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { MasterDataService } from './master-data.service'
import { Auth, Roles } from '../common/roles.guard'
import { CreateClassDto, UpdateClassDto } from './dto/class.dto'
import { CreateDormitoryDto, UpdateDormitoryDto, AddRoomDto } from './dto/dormitory.dto'
import { CreateAcademicYearDto, UpdateAcademicYearDto } from './dto/academic-year.dto'
import { CreatePeriodDto, UpdatePeriodDto } from './dto/period.dto'

@Controller('master-data')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  // ── Classes ────────────────────────────────────────────────

  @Get('classes')
  @Auth()
  async getAllClasses() {
    return this.masterDataService.getAllClasses()
  }

  @Get('classes/:id')
  @Auth()
  async getClassById(@Param('id') id: string) {
    return this.masterDataService.getClassById(id)
  }

  @Post('classes')
  @Roles('super_admin')
  async createClass(@Body() dto: CreateClassDto) {
    return this.masterDataService.createClass(dto)
  }

  @Put('classes/:id')
  @Roles('super_admin')
  async updateClass(@Param('id') id: string, @Body() dto: UpdateClassDto) {
    return this.masterDataService.updateClass(id, dto)
  }

  @Delete('classes/:id')
  @Roles('super_admin')
  async deleteClass(@Param('id') id: string) {
    return this.masterDataService.deleteClass(id)
  }

  // ── Dormitories ────────────────────────────────────────────

  @Get('dormitories')
  @Auth()
  async getAllDormitories() {
    return this.masterDataService.getAllDormitories()
  }

  @Get('dormitories/:id')
  @Auth()
  async getDormitoryById(@Param('id') id: string) {
    return this.masterDataService.getDormitoryById(id)
  }

  @Post('dormitories')
  @Roles('super_admin')
  async createDormitory(@Body() dto: CreateDormitoryDto) {
    return this.masterDataService.createDormitory(dto)
  }

  @Put('dormitories/:id')
  @Roles('super_admin')
  async updateDormitory(@Param('id') id: string, @Body() dto: UpdateDormitoryDto) {
    return this.masterDataService.updateDormitory(id, dto)
  }

  @Delete('dormitories/:id')
  @Roles('super_admin')
  async deleteDormitory(@Param('id') id: string) {
    return this.masterDataService.deleteDormitory(id)
  }

  @Post('dormitories/:id/rooms')
  @Roles('super_admin')
  async addRoom(@Param('id') id: string, @Body() dto: AddRoomDto) {
    return this.masterDataService.addRoom(id, dto)
  }

  @Delete('dormitories/:id/rooms/:roomId')
  @Roles('super_admin')
  async removeRoom(@Param('id') id: string, @Param('roomId') roomId: string) {
    return this.masterDataService.removeRoom(id, roomId)
  }

  // ── Academic Years ─────────────────────────────────────────

  @Get('academic-years')
  @Auth()
  async getAllAcademicYears() {
    return this.masterDataService.getAllAcademicYears()
  }

  @Get('academic-years/:id')
  @Auth()
  async getAcademicYearById(@Param('id') id: string) {
    return this.masterDataService.getAcademicYearById(id)
  }

  @Post('academic-years')
  @Roles('super_admin')
  async createAcademicYear(@Body() dto: CreateAcademicYearDto) {
    return this.masterDataService.createAcademicYear(dto)
  }

  @Put('academic-years/:id')
  @Roles('super_admin')
  async updateAcademicYear(@Param('id') id: string, @Body() dto: UpdateAcademicYearDto) {
    return this.masterDataService.updateAcademicYear(id, dto)
  }

  @Delete('academic-years/:id')
  @Roles('super_admin')
  async deleteAcademicYear(@Param('id') id: string) {
    return this.masterDataService.deleteAcademicYear(id)
  }

  // ── Periods ────────────────────────────────────────────────

  @Get('periods')
  @Auth()
  async getAllPeriods() {
    return this.masterDataService.getAllPeriods()
  }

  @Get('periods/:id')
  @Auth()
  async getPeriodById(@Param('id') id: string) {
    return this.masterDataService.getPeriodById(id)
  }

  @Post('periods')
  @Roles('super_admin')
  async createPeriod(@Body() dto: CreatePeriodDto) {
    return this.masterDataService.createPeriod(dto)
  }

  @Put('periods/:id')
  @Roles('super_admin')
  async updatePeriod(@Param('id') id: string, @Body() dto: UpdatePeriodDto) {
    return this.masterDataService.updatePeriod(id, dto)
  }

  @Delete('periods/:id')
  @Roles('super_admin')
  async deletePeriod(@Param('id') id: string) {
    return this.masterDataService.deletePeriod(id)
  }
}
