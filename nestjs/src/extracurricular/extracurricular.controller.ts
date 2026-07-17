import { Controller, Get, Post, Put, Patch, Delete, Body, Param } from '@nestjs/common'
import { ExtracurricularService } from './extracurricular.service'
import { Auth, Roles } from '../common/roles.guard'
import { CreateHadrohDto, UpdateHadrohDto } from './dto/hadroh.dto'
import { CreateExtracurricularDto, UpdateExtracurricularDto } from './dto/extracurricular.dto'
import { CreatePublicSpeakingDto, UpdatePublicSpeakingDto } from './dto/public-speaking.dto'
import { CreateMediaDto, UpdateMediaDto } from './dto/media.dto'

@Controller('extracurricular')
export class ExtracurricularController {
  constructor(private readonly extracurricularService: ExtracurricularService) {}

  @Get('hadroh')
  @Roles('super_admin', 'kesantrian')
  async findAllHadroh() {
    return this.extracurricularService.findAllHadroh()
  }

  @Get('hadroh/:id')
  @Roles('super_admin', 'kesantrian')
  async findHadrohById(@Param('id') id: string) {
    return this.extracurricularService.findHadrohById(id)
  }

  @Post('hadroh')
  @Roles('super_admin', 'kesantrian')
  async createHadroh(@Body() dto: CreateHadrohDto) {
    return this.extracurricularService.createHadroh(dto)
  }

  @Put('hadroh/:id')
  @Roles('super_admin', 'kesantrian')
  async updateHadroh(@Param('id') id: string, @Body() dto: UpdateHadrohDto) {
    return this.extracurricularService.updateHadroh(id, dto)
  }

  @Delete('hadroh/:id')
  @Roles('super_admin')
  async removeHadroh(@Param('id') id: string) {
    return this.extracurricularService.removeHadroh(id)
  }

  @Get()
  @Roles('super_admin', 'kesantrian')
  async findAllExtracurricular() {
    return this.extracurricularService.findAllExtracurricular()
  }

  @Get(':id')
  @Roles('super_admin', 'kesantrian')
  async findExtracurricularById(@Param('id') id: string) {
    return this.extracurricularService.findExtracurricularById(id)
  }

  @Post()
  @Roles('super_admin', 'kesantrian')
  async createExtracurricular(@Body() dto: CreateExtracurricularDto) {
    return this.extracurricularService.createExtracurricular(dto)
  }

  @Put(':id')
  @Roles('super_admin', 'kesantrian')
  async updateExtracurricular(@Param('id') id: string, @Body() dto: UpdateExtracurricularDto) {
    return this.extracurricularService.updateExtracurricular(id, dto)
  }

  @Delete(':id')
  @Roles('super_admin')
  async removeExtracurricular(@Param('id') id: string) {
    return this.extracurricularService.removeExtracurricular(id)
  }

  @Get('public-speaking')
  @Roles('super_admin', 'kesantrian')
  async findAllPublicSpeaking() {
    return this.extracurricularService.findAllPublicSpeaking()
  }

  @Get('public-speaking/:id')
  @Roles('super_admin', 'kesantrian')
  async findPublicSpeakingById(@Param('id') id: string) {
    return this.extracurricularService.findPublicSpeakingById(id)
  }

  @Post('public-speaking')
  @Roles('super_admin', 'kesantrian')
  async createPublicSpeaking(@Body() dto: CreatePublicSpeakingDto) {
    return this.extracurricularService.createPublicSpeaking(dto)
  }

  @Put('public-speaking/:id')
  @Roles('super_admin', 'kesantrian')
  async updatePublicSpeaking(@Param('id') id: string, @Body() dto: UpdatePublicSpeakingDto) {
    return this.extracurricularService.updatePublicSpeaking(id, dto)
  }

  @Delete('public-speaking/:id')
  @Roles('super_admin')
  async removePublicSpeaking(@Param('id') id: string) {
    return this.extracurricularService.removePublicSpeaking(id)
  }

  @Get('media')
  @Roles('super_admin', 'kesantrian')
  async findAllMedia() {
    return this.extracurricularService.findAllMedia()
  }

  @Get('media/:id')
  @Roles('super_admin', 'kesantrian')
  async findMediaById(@Param('id') id: string) {
    return this.extracurricularService.findMediaById(id)
  }

  @Post('media')
  @Roles('super_admin', 'kesantrian')
  async createMedia(@Body() dto: CreateMediaDto) {
    return this.extracurricularService.createMedia(dto)
  }

  @Put('media/:id')
  @Roles('super_admin', 'kesantrian')
  async updateMedia(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.extracurricularService.updateMedia(id, dto)
  }

  @Delete('media/:id')
  @Roles('super_admin')
  async removeMedia(@Param('id') id: string) {
    return this.extracurricularService.removeMedia(id)
  }
}
