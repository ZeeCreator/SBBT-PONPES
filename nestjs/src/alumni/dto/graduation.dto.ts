import { IsString, IsDateString, IsOptional, IsNumber, Min } from 'class-validator'

export class CreateGraduationDto {
  @IsString()
  studentId: string

  @IsString()
  studentName: string

  @IsDateString()
  graduationDate: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  tahfidzJuz?: number

  @IsOptional()
  @IsString()
  certificateNumber?: string

  @IsOptional()
  @IsString()
  notes?: string
}

export class UpdateGraduationDto {
  @IsOptional()
  @IsString()
  studentId?: string

  @IsOptional()
  @IsString()
  studentName?: string

  @IsOptional()
  @IsDateString()
  graduationDate?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  tahfidzJuz?: number

  @IsOptional()
  @IsString()
  certificateNumber?: string

  @IsOptional()
  @IsString()
  notes?: string
}
