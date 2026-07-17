import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { LaporanController } from './laporan.controller'
import { LaporanService } from './laporan.service'

@Module({
  imports: [CommonModule],
  controllers: [LaporanController],
  providers: [LaporanService],
  exports: [LaporanService],
})
export class LaporanModule {}
