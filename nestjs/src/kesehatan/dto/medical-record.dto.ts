import { IsString, IsOptional } from 'class-validator'

export class CreateMedicalRecordDto {
  @IsString()
  studentId: string

  @IsString()
  studentName: string

  @IsString()
  date: string

  @IsString()
  complaint: string

  @IsString()
  diagnosis: string

  @IsString()
  treatment: string

  @IsOptional()
  @IsString()
  medication?: string

  @IsOptional()
  @IsString()
  referral?: string

  @IsString()
  doctorName: string
}
