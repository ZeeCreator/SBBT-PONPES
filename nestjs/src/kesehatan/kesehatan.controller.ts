import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { KesehatanService } from './kesehatan.service'
import { Auth, Roles } from '../common/roles.guard'

@Controller('kesehatan')
export class KesehatanController {
  constructor(private readonly kesehatanService: KesehatanService) {}

  @Get('medical-records')
  @Roles('super_admin', 'kesantrian')
  async findAllMedicalRecords(@Query('studentId') studentId?: string) {
    return this.kesehatanService.findAllMedicalRecords({ studentId })
  }

  @Get('medical-records/:id')
  @Roles('super_admin', 'kesantrian')
  async findMedicalRecordById(@Param('id') id: string) {
    return this.kesehatanService.findMedicalRecordById(id)
  }

  @Post('medical-records')
  @Roles('super_admin', 'kesantrian')
  async createMedicalRecord(@Body() body: any) {
    return this.kesehatanService.createMedicalRecord(body)
  }

  @Patch('medical-records/:id')
  @Roles('super_admin', 'kesantrian')
  async updateMedicalRecord(@Param('id') id: string, @Body() body: any) {
    return this.kesehatanService.updateMedicalRecord(id, body)
  }

  @Delete('medical-records/:id')
  @Roles('super_admin')
  async removeMedicalRecord(@Param('id') id: string) {
    return this.kesehatanService.removeMedicalRecord(id)
  }

  @Get('growth')
  @Roles('super_admin', 'kesantrian')
  async findAllGrowth(@Query('studentId') studentId?: string) {
    return this.kesehatanService.findAllGrowthRecords({ studentId })
  }

  @Get('growth/:id')
  @Roles('super_admin', 'kesantrian')
  async findGrowthById(@Param('id') id: string) {
    return this.kesehatanService.findGrowthRecordById(id)
  }

  @Post('growth')
  @Roles('super_admin', 'kesantrian')
  async createGrowth(@Body() body: any) {
    return this.kesehatanService.createGrowthRecord(body)
  }

  @Delete('growth/:id')
  @Roles('super_admin')
  async removeGrowth(@Param('id') id: string) {
    return this.kesehatanService.removeGrowthRecord(id)
  }

  @Get('sanitation')
  @Roles('super_admin', 'kesantrian')
  async findAllSanitation() {
    return this.kesehatanService.findAllSanitation()
  }

  @Get('sanitation/:id')
  @Roles('super_admin', 'kesantrian')
  async findSanitationById(@Param('id') id: string) {
    return this.kesehatanService.findSanitationById(id)
  }

  @Post('sanitation')
  @Roles('super_admin', 'kesantrian')
  async createSanitation(@Body() body: any) {
    return this.kesehatanService.createSanitation(body)
  }

  @Delete('sanitation/:id')
  @Roles('super_admin')
  async removeSanitation(@Param('id') id: string) {
    return this.kesehatanService.removeSanitation(id)
  }

  @Get('nutrition')
  @Roles('super_admin', 'kesantrian')
  async findAllNutrition() {
    return this.kesehatanService.findAllNutrition()
  }

  @Get('nutrition/:id')
  @Roles('super_admin', 'kesantrian')
  async findNutritionById(@Param('id') id: string) {
    return this.kesehatanService.findNutritionById(id)
  }

  @Post('nutrition')
  @Roles('super_admin', 'kesantrian')
  async createNutrition(@Body() body: any) {
    return this.kesehatanService.createNutrition(body)
  }

  @Delete('nutrition/:id')
  @Roles('super_admin')
  async removeNutrition(@Param('id') id: string) {
    return this.kesehatanService.removeNutrition(id)
  }
}
