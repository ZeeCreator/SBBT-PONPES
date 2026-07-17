import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { KeuanganController } from './keuangan.controller'
import { KeuanganService } from './keuangan.service'

@Module({
  imports: [CommonModule],
  controllers: [KeuanganController],
  providers: [KeuanganService],
  exports: [KeuanganService],
})
export class KeuanganModule {}
