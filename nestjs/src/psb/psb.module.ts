import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { PsbController } from './psb.controller'
import { PsbService } from './psb.service'

@Module({
  imports: [CommonModule],
  controllers: [PsbController],
  providers: [PsbService],
  exports: [PsbService],
})
export class PsbModule {}
