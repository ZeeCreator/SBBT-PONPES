import { IsString, IsNumber, Min } from 'class-validator'

export class CreateInvoiceDto {
  @IsString()
  studentId: string

  @IsString()
  studentName: string

  @IsString()
  month: string

  @IsNumber()
  year: number

  @IsNumber()
  @Min(0)
  amount: number

  @IsString()
  dueDate: string
}
