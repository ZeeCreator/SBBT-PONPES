import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { AkademikController } from './akademik.controller'
import { AkademikService } from './akademik.service'

@Module({
  imports: [CommonModule],
  controllers: [AkademikController],
  providers: [AkademikService],
  exports: [AkademikService],
})
export class AkademikModule {}
