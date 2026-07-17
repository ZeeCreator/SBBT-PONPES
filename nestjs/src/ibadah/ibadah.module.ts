import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { IbadahController } from './ibadah.controller'
import { IbadahService } from './ibadah.service'

@Module({
  imports: [CommonModule],
  controllers: [IbadahController],
  providers: [IbadahService],
  exports: [IbadahService],
})
export class IbadahModule {}
