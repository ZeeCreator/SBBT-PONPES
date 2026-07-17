import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common'
import { FirebaseAdminService } from '../common/firebase-admin.service'
import * as crypto from 'crypto'

@Injectable()
export class KeuanganService {
  private readonly logger = new Logger(KeuanganService.name)

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async createInvoice(data: {
    studentId: string
    studentName: string
    month: string
    year: number
    amount: number
    dueDate: string
  }) {
    const uniqueCode = Math.floor(Math.random() * 900) + 100
    const serviceFee = 2500

    const invoice = {
      studentId: data.studentId,
      studentName: data.studentName,
      month: data.month,
      year: data.year,
      amount: data.amount,
      serviceFee,
      uniqueCode,
      totalAmount: data.amount + serviceFee + uniqueCode,
      status: 'pending',
      dueDate: data.dueDate,
      createdAt: new Date().toISOString(),
    }

    const result = await this.firebaseAdmin.add('invoices', invoice)
    this.logger.log(`Invoice created: ${result.id}`)

    await this.firebaseAdmin.logActivity('Buat Tagihan', 'System', `SPP ${data.month} ${data.year} — ${data.studentName}`)
    return result
  }

  async getInvoiceById(id: string) {
    const invoice = await this.firebaseAdmin.getById('invoices', id)
    if (!invoice) throw new NotFoundException('Invoice not found')
    return invoice
  }

  async updateInvoice(id: string, data: { status?: string; dueDate?: string; amount?: number }) {
    const invoice = await this.firebaseAdmin.getById('invoices', id)
    if (!invoice) throw new NotFoundException('Invoice not found')

    await this.firebaseAdmin.update('invoices', id, {
      ...data,
      updatedAt: new Date().toISOString(),
    })

    await this.firebaseAdmin.logActivity('Ubah Tagihan', 'System', `Invoice ${id} diperbarui`)
    return this.firebaseAdmin.getById('invoices', id)
  }

  async deleteInvoice(id: string) {
    const invoice = await this.firebaseAdmin.getById('invoices', id)
    if (!invoice) throw new NotFoundException('Invoice not found')

    await this.firebaseAdmin.remove('invoices', id)
    await this.firebaseAdmin.logActivity('Hapus Tagihan', 'System', `Invoice ${id} dihapus`)
    return { message: 'Invoice deleted' }
  }

  async handleMidtransWebhook(payload: any) {
    const { order_id, transaction_status, signature_key, status_code, gross_amount } = payload

    const serverKey = process.env.MIDTRANS_SERVER_KEY || ''
    const computedSignature = crypto
      .createHash('sha512')
      .update(order_id + status_code + gross_amount + serverKey)
      .digest('hex')

    if (computedSignature !== signature_key) {
      throw new BadRequestException('Invalid signature key')
    }

    const invoiceId = order_id.replace('SIMPPT-', '')

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      const rtdb = this.firebaseAdmin.getRtdb()

      await rtdb.ref(`invoices/${invoiceId}`).update({
        status: 'paid',
        paidAt: new Date().toISOString(),
        paymentMethod: payload.payment_type || 'unknown',
        transactionId: payload.transaction_id,
      })

      const paymentId = this.firebaseAdmin.generateId()
      await rtdb.ref(`payments/${paymentId}`).set({
        invoiceId,
        amount: Number(gross_amount),
        status: 'success',
        transactionId: payload.transaction_id,
        paymentMethod: payload.payment_type,
        paidAt: new Date().toISOString(),
      })

      this.logger.log(`Payment successful for invoice ${invoiceId}`)
      await this.firebaseAdmin.logActivity('Pembayaran Diterima', 'System', `Invoice ${invoiceId} — Rp ${Number(gross_amount).toLocaleString('id-ID')}`)
    }

    return { status: 'ok' }
  }

  async getInvoices(filters?: { status?: string; studentId?: string }) {
    let invoices = await this.firebaseAdmin.getList('invoices')
    if (filters?.status) invoices = invoices.filter(inv => inv.status === filters.status)
    if (filters?.studentId) invoices = invoices.filter(inv => inv.studentId === filters.studentId)
    invoices.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return invoices
  }

  async getPaymentHistory(invoiceId?: string) {
    let payments = await this.firebaseAdmin.getList('payments')
    if (invoiceId) payments = payments.filter(p => p.invoiceId === invoiceId)
    payments.sort((a: any, b: any) => new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime())
    return payments
  }
}
