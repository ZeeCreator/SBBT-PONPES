import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { GuruService } from './guru.service'
import { Auth, Roles } from '../common/roles.guard'
import { CreateGuruDto, UpdateGuruDto } from './dto/create-guru.dto'

@Controller('guru')
export class GuruController {
  constructor(private readonly guruService: GuruService) {}

  @Get()
  @Roles('super_admin', 'kesantrian')
  async findAll(
    @Query('specialization') specialization?: string,
    @Query('status') status?: string,
  ) {
    return this.guruService.findAll({ specialization, status })
  }

  @Get(':id')
  @Roles('super_admin', 'kesantrian')
  async findById(@Param('id') id: string) {
    return this.guruService.findById(id)
  }

  @Post()
  @Roles('super_admin')
  async create(@Body() dto: CreateGuruDto) {
    return this.guruService.create(dto)
  }

  @Patch(':id')
  @Roles('super_admin')
  async update(@Param('id') id: string, @Body() dto: UpdateGuruDto) {
    return this.guruService.update(id, dto)
  }

  @Delete(':id')
  @Roles('super_admin')
  async remove(@Param('id') id: string) {
    return this.guruService.remove(id)
  }
}
