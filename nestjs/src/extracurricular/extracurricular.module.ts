import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { ExtracurricularController } from './extracurricular.controller'
import { ExtracurricularService } from './extracurricular.service'

@Module({
  imports: [CommonModule],
  controllers: [ExtracurricularController],
  providers: [ExtracurricularService],
  exports: [ExtracurricularService],
})
export class ExtracurricularModule {}
