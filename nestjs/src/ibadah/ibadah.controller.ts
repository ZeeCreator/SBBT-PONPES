import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { IbadahService } from './ibadah.service'
import { Auth, Roles } from '../common/roles.guard'
import { RecordPrayerAttendanceDto, UpdatePrayerAttendanceDto } from './dto/prayer-attendance.dto'
import { RecordFastingDto } from './dto/fasting.dto'
import { RecordTahajjudDto, UpdateTahajjudDto } from './dto/tahajjud.dto'
import { RecordWiridDto } from './dto/wirid.dto'
import { RecordInfaqDto } from './dto/infaq.dto'
import { RecordZakatDto } from './dto/zakat.dto'

@Controller('ibadah')
export class IbadahController {
  constructor(private readonly ibadahService: IbadahService) {}

  @Get('prayer-attendance')
  @Roles('super_admin', 'kesantrian')
  async findAllPrayerAttendance(
    @Query('studentId') studentId?: string,
    @Query('date') date?: string,
  ) {
    return this.ibadahService.findAllPrayerAttendance({ studentId, date })
  }

  @Get('prayer-attendance/:id')
  @Roles('super_admin', 'kesantrian')
  async findPrayerAttendanceById(@Param('id') id: string) {
    return this.ibadahService.findPrayerAttendanceById(id)
  }

  @Post('prayer-attendance')
  @Roles('super_admin', 'kesantrian')
  async createPrayerAttendance(@Body() dto: RecordPrayerAttendanceDto) {
    return this.ibadahService.createPrayerAttendance(dto)
  }

  @Put('prayer-attendance/:id')
  @Roles('super_admin', 'kesantrian')
  async updatePrayerAttendance(@Param('id') id: string, @Body() dto: UpdatePrayerAttendanceDto) {
    return this.ibadahService.updatePrayerAttendance(id, dto)
  }

  @Delete('prayer-attendance/:id')
  @Roles('super_admin')
  async removePrayerAttendance(@Param('id') id: string) {
    return this.ibadahService.removePrayerAttendance(id)
  }

  @Get('fasting')
  @Roles('super_admin', 'kesantrian')
  async findAllFasting(@Query('studentId') studentId?: string) {
    return this.ibadahService.findAllFasting({ studentId })
  }

  @Get('fasting/:id')
  @Roles('super_admin', 'kesantrian')
  async findFastingById(@Param('id') id: string) {
    return this.ibadahService.findFastingById(id)
  }

  @Post('fasting')
  @Roles('super_admin', 'kesantrian')
  async createFasting(@Body() dto: RecordFastingDto) {
    return this.ibadahService.createFasting(dto)
  }

  @Delete('fasting/:id')
  @Roles('super_admin')
  async removeFasting(@Param('id') id: string) {
    return this.ibadahService.removeFasting(id)
  }

  @Get('tahajjud')
  @Roles('super_admin', 'kesantrian')
  async findAllTahajjud(
    @Query('studentId') studentId?: string,
    @Query('date') date?: string,
  ) {
    return this.ibadahService.findAllTahajjud({ studentId, date })
  }

  @Get('tahajjud/:id')
  @Roles('super_admin', 'kesantrian')
  async findTahajjudById(@Param('id') id: string) {
    return this.ibadahService.findTahajjudById(id)
  }

  @Post('tahajjud')
  @Roles('super_admin', 'kesantrian')
  async createTahajjud(@Body() dto: RecordTahajjudDto) {
    return this.ibadahService.createTahajjud(dto)
  }

  @Put('tahajjud/:id')
  @Roles('super_admin', 'kesantrian')
  async updateTahajjud(@Param('id') id: string, @Body() dto: UpdateTahajjudDto) {
    return this.ibadahService.updateTahajjud(id, dto)
  }

  @Delete('tahajjud/:id')
  @Roles('super_admin')
  async removeTahajjud(@Param('id') id: string) {
    return this.ibadahService.removeTahajjud(id)
  }

  @Get('wirid')
  @Roles('super_admin', 'kesantrian')
  async findAllWirid(@Query('studentId') studentId?: string) {
    return this.ibadahService.findAllWirid({ studentId })
  }

  @Get('wirid/:id')
  @Roles('super_admin', 'kesantrian')
  async findWiridById(@Param('id') id: string) {
    return this.ibadahService.findWiridById(id)
  }

  @Post('wirid')
  @Roles('super_admin', 'kesantrian')
  async createWirid(@Body() dto: RecordWiridDto) {
    return this.ibadahService.createWirid(dto)
  }

  @Delete('wirid/:id')
  @Roles('super_admin')
  async removeWirid(@Param('id') id: string) {
    return this.ibadahService.removeWirid(id)
  }

  @Get('infaq')
  @Roles('super_admin', 'kesantrian')
  async findAllInfaq(
    @Query('studentId') studentId?: string,
    @Query('date') date?: string,
  ) {
    return this.ibadahService.findAllInfaq({ studentId, date })
  }

  @Get('infaq/:id')
  @Roles('super_admin', 'kesantrian')
  async findInfaqById(@Param('id') id: string) {
    return this.ibadahService.findInfaqById(id)
  }

  @Post('infaq')
  @Roles('super_admin', 'kesantrian')
  async createInfaq(@Body() dto: RecordInfaqDto) {
    return this.ibadahService.createInfaq(dto)
  }

  @Delete('infaq/:id')
  @Roles('super_admin')
  async removeInfaq(@Param('id') id: string) {
    return this.ibadahService.removeInfaq(id)
  }

  @Get('zakat')
  @Roles('super_admin', 'kesantrian')
  async findAllZakat(@Query('type') type?: string) {
    return this.ibadahService.findAllZakat({ type })
  }

  @Get('zakat/:id')
  @Roles('super_admin', 'kesantrian')
  async findZakatById(@Param('id') id: string) {
    return this.ibadahService.findZakatById(id)
  }

  @Post('zakat')
  @Roles('super_admin', 'kesantrian')
  async createZakat(@Body() dto: RecordZakatDto) {
    return this.ibadahService.createZakat(dto)
  }

  @Delete('zakat/:id')
  @Roles('super_admin')
  async removeZakat(@Param('id') id: string) {
    return this.ibadahService.removeZakat(id)
  }
}
