import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { KesantrianController } from './kesantrian.controller'
import { KesantrianService } from './kesantrian.service'

@Module({
  imports: [CommonModule],
  controllers: [KesantrianController],
  providers: [KesantrianService],
  exports: [KesantrianService],
})
export class KesantrianModule {}
