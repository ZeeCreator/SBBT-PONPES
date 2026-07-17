import { IsString, IsIn, IsOptional } from 'class-validator'

export class RecordFastingDto {
  @IsString()
  studentId: string

  @IsString()
  studentName: string

  @IsString()
  date: string

  @IsString()
  @IsIn(['Senin-Kamis', 'Ayyamul Bidh', 'Daud', 'Sunnah Lainnya'])
  type: string

  @IsString()
  @IsIn(['yes', 'no', 'uzur'])
  status: string
}
