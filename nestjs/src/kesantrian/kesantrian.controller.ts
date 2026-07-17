import { Controller, Get, Post, Put, Delete, Body, Query, Param } from '@nestjs/common'
import { KesantrianService } from './kesantrian.service'
import { Auth, Roles } from '../common/roles.guard'
import { AddStudentDto } from './dto/add-student.dto'
import { AddViolationDto } from './dto/add-violation.dto'
import { RecordAttendanceDto } from './dto/record-attendance.dto'

@Controller('kesantrian')
export class KesantrianController {
  constructor(private readonly kesantrianService: KesantrianService) {}

  @Get('students')
  @Auth()
  async getStudents(
    @Query('class') classFilter?: string,
    @Query('status') status?: string,
  ) {
    return this.kesantrianService.getStudents({ class: classFilter, status })
  }

  @Get('students/:id')
  @Auth()
  async getStudentById(@Param('id') id: string) {
    return this.kesantrianService.getStudentById(id)
  }

  @Post('students')
  @Roles('super_admin', 'kesantrian')
  async addStudent(@Body() dto: AddStudentDto) {
    return this.kesantrianService.addStudent(dto)
  }

  @Put('students/:id')
  @Roles('super_admin', 'kesantrian')
  async updateStudent(@Param('id') id: string, @Body() dto: Partial<AddStudentDto>) {
    return this.kesantrianService.updateStudent(id, dto)
  }

  @Delete('students/:id')
  @Roles('super_admin', 'kesantrian')
  async deleteStudent(@Param('id') id: string) {
    return this.kesantrianService.deleteStudent(id)
  }

  @Get('violations')
  @Auth()
  async getViolations(@Query('studentId') studentId?: string) {
    return this.kesantrianService.getViolations(studentId)
  }

  @Get('violations/:id')
  @Auth()
  async getViolationById(@Param('id') id: string) {
    return this.kesantrianService.getViolationById(id)
  }

  @Post('violations')
  @Roles('super_admin', 'kesantrian')
  async addViolation(@Body() dto: AddViolationDto) {
    return this.kesantrianService.addViolation(dto)
  }

  @Delete('violations/:id')
  @Roles('super_admin', 'kesantrian')
  async deleteViolation(@Param('id') id: string) {
    return this.kesantrianService.deleteViolation(id)
  }

  @Get('attendance')
  @Auth()
  async getAttendance(
    @Query('date') date?: string,
    @Query('class') classFilter?: string,
  ) {
    return this.kesantrianService.getAttendance({ date, class: classFilter })
  }

  @Get('attendance/:id')
  @Auth()
  async getAttendanceById(@Param('id') id: string) {
    return this.kesantrianService.getAttendanceById(id)
  }

  @Post('attendance')
  @Roles('super_admin', 'kesantrian')
  async recordAttendance(@Body() dto: RecordAttendanceDto) {
    return this.kesantrianService.recordAttendance(dto)
  }

  @Put('attendance/:id')
  @Roles('super_admin', 'kesantrian')
  async updateAttendance(@Param('id') id: string, @Body() dto: Partial<RecordAttendanceDto>) {
    return this.kesantrianService.updateAttendance(id, dto)
  }

  @Delete('attendance/:id')
  @Roles('super_admin', 'kesantrian')
  async deleteAttendance(@Param('id') id: string) {
    return this.kesantrianService.deleteAttendance(id)
  }
}
