import { IsString, IsIn, IsOptional } from 'class-validator'

export class RecordTahajjudDto {
  @IsString()
  studentId: string

  @IsString()
  studentName: string

  @IsString()
  date: string

  @IsString()
  @IsIn(['yes', 'no', 'uzur'])
  status: string

  @IsOptional()
  @IsString()
  notes?: string
}

export class UpdateTahajjudDto {
  @IsOptional()
  @IsString()
  @IsIn(['yes', 'no', 'uzur'])
  status?: string

  @IsOptional()
  @IsString()
  notes?: string
}
