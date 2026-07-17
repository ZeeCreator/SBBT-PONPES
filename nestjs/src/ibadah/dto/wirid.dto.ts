import { IsString, IsIn, IsOptional } from 'class-validator'

export class RecordWiridDto {
  @IsString()
  studentId: string

  @IsString()
  studentName: string

  @IsString()
  date: string

  @IsString()
  @IsIn(['Ratib', 'Hizib', 'Yasin', 'Lainnya'])
  wiridType: string

  @IsString()
  @IsIn(['completed', 'partial', 'incomplete'])
  status: string

  @IsOptional()
  @IsString()
  notes?: string
}
