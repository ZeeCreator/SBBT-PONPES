import { IsString, IsNumber, IsIn, IsOptional, Min } from 'class-validator'

export class RecordZakatDto {
  @IsString()
  studentId: string

  @IsString()
  studentName: string

  @IsString()
  date: string

  @IsString()
  @IsIn(['Fitrah', 'Mal'])
  type: string

  @IsNumber()
  @Min(0)
  amount: number

  @IsOptional()
  @IsString()
  mustahiq?: string
}
