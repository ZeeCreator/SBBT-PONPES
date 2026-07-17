import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { GuruController } from './guru.controller'
import { GuruService } from './guru.service'

@Module({
  imports: [CommonModule],
  controllers: [GuruController],
  providers: [GuruService],
  exports: [GuruService],
})
export class GuruModule {}
