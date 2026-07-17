import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { AlumniController } from './alumni.controller'
import { AlumniService } from './alumni.service'

@Module({
  imports: [CommonModule],
  controllers: [AlumniController],
  providers: [AlumniService],
  exports: [AlumniService],
})
export class AlumniModule {}
