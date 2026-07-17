import { IsString, IsNumber, IsIn, IsOptional, Min } from 'class-validator'

export class RecordInfaqDto {
  @IsString()
  studentId: string

  @IsString()
  studentName: string

  @IsString()
  date: string

  @IsNumber()
  @Min(0)
  amount: number

  @IsString()
  @IsIn(['Infaq', 'Shodaqoh'])
  type: string

  @IsOptional()
  @IsString()
  notes?: string
}
