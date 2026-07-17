import { Controller, Post, Get, Put, Delete, Body, Query, Param } from '@nestjs/common'
import { KeuanganService } from './keuangan.service'
import { Roles } from '../common/roles.guard'
import { CreateInvoiceDto } from './dto/create-invoice.dto'

@Controller('keuangan')
export class KeuanganController {
  constructor(private readonly keuanganService: KeuanganService) {}

  @Post('invoice')
  @Roles('super_admin', 'bendahara')
  async createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.keuanganService.createInvoice(dto)
  }

  @Get('invoices')
  @Roles('super_admin', 'bendahara')
  async getInvoices(
    @Query('status') status?: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.keuanganService.getInvoices({ status, studentId })
  }

  @Get('invoices/:id')
  @Roles('super_admin', 'bendahara')
  async getInvoiceById(@Param('id') id: string) {
    return this.keuanganService.getInvoiceById(id)
  }

  @Put('invoices/:id')
  @Roles('super_admin', 'bendahara')
  async updateInvoice(@Param('id') id: string, @Body() dto: Partial<CreateInvoiceDto>) {
    return this.keuanganService.updateInvoice(id, dto)
  }

  @Delete('invoices/:id')
  @Roles('super_admin')
  async deleteInvoice(@Param('id') id: string) {
    return this.keuanganService.deleteInvoice(id)
  }

  @Post('midtrans-webhook')
  async midtransWebhook(@Body() payload: any) {
    return this.keuanganService.handleMidtransWebhook(payload)
  }

  @Get('payments')
  @Roles('super_admin', 'bendahara')
  async getPayments(@Query('invoiceId') invoiceId?: string) {
    return this.keuanganService.getPaymentHistory(invoiceId)
  }
}
