import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { KesehatanController } from './kesehatan.controller'
import { KesehatanService } from './kesehatan.service'

@Module({
  imports: [CommonModule],
  controllers: [KesehatanController],
  providers: [KesehatanService],
  exports: [KesehatanService],
})
export class KesehatanModule {}
