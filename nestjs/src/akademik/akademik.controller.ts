import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { AkademikService } from './akademik.service'
import { Auth, Roles } from '../common/roles.guard'
import { AddGradeDto } from './dto/add-grade.dto'
import { AddSubjectDto } from './dto/add-subject.dto'

@Controller('akademik')
export class AkademikController {
  constructor(private readonly akademikService: AkademikService) {}

  @Get('students')
  @Auth()
  async getStudents() {
    return this.akademikService.getStudents()
  }

  @Get('students/:id')
  @Auth()
  async getStudentById(@Param('id') id: string) {
    return this.akademikService.getStudentById(id)
  }

  @Get('students/:id/grades')
  @Auth()
  async getStudentGrades(@Param('id') studentId: string) {
    return this.akademikService.getStudentGrades(studentId)
  }

  @Post('grades')
  @Roles('super_admin')
  async addGrade(@Body() dto: AddGradeDto) {
    return this.akademikService.addGrade(dto)
  }

  @Delete('grades/:studentId/:gradeId')
  @Roles('super_admin')
  async deleteGrade(@Param('studentId') studentId: string, @Param('gradeId') gradeId: string) {
    return this.akademikService.deleteGrade(studentId, gradeId)
  }

  @Get('curriculum')
  @Auth()
  async getCurriculum() {
    return this.akademikService.getCurriculum()
  }

  @Get('curriculum/:id')
  @Auth()
  async getCurriculumById(@Param('id') id: string) {
    return this.akademikService.getCurriculumById(id)
  }

  @Post('curriculum')
  @Roles('super_admin')
  async addSubject(@Body() dto: AddSubjectDto) {
    return this.akademikService.addSubject(dto)
  }

  @Put('curriculum/:id')
  @Roles('super_admin')
  async updateSubject(@Param('id') id: string, @Body() dto: Partial<AddSubjectDto>) {
    return this.akademikService.updateSubject(id, dto)
  }

  @Delete('curriculum/:id')
  @Roles('super_admin')
  async deleteSubject(@Param('id') id: string) {
    return this.akademikService.deleteSubject(id)
  }
}
