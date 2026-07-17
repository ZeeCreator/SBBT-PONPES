import { Controller, Get, Param, Query } from '@nestjs/common'
import { LaporanService } from './laporan.service'
import { Auth, Roles } from '../common/roles.guard'

@Controller('laporan')
export class LaporanController {
  constructor(private readonly laporanService: LaporanService) {}

  @Get('rapor/:studentId')
  @Auth()
  async generateRapor(
    @Param('studentId') studentId: string,
    @Query('semester') semester: string,
  ) {
    return this.laporanService.generateRapor(studentId, Number(semester) || 1)
  }

  @Get('receipt/:invoiceId')
  @Auth()
  async generateReceipt(@Param('invoiceId') invoiceId: string) {
    return this.laporanService.generateReceipt(invoiceId)
  }

  @Get('financial')
  @Roles('super_admin', 'bendahara')
  async getFinancialReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.laporanService.getFinancialReport(startDate, endDate)
  }
}
