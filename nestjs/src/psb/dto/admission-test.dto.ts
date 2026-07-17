import { IsString, IsNumber, Min, Max, IsOptional, IsIn } from 'class-validator'

export class CreateAdmissionTestDto {
  @IsString()
  registrationId: string

  @IsString()
  studentName: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  academicScore?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  quranScore?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  interviewScore?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  psychologyScore?: number

  @IsOptional()
  @IsString()
  @IsIn(['passed', 'failed', 'waiting_list'])
  result?: string

  @IsOptional()
  @IsString()
  notes?: string
}
