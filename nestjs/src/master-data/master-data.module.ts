import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { MasterDataController } from './master-data.controller'
import { MasterDataService } from './master-data.service'

@Module({
  imports: [CommonModule],
  controllers: [MasterDataController],
  providers: [MasterDataService],
  exports: [MasterDataService],
})
export class MasterDataModule {}
