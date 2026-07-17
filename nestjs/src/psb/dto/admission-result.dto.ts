import { IsString, IsIn, IsOptional, IsNumber, IsDateString } from 'class-validator'

export class CreateAdmissionResultDto {
  @IsString()
  registrationId: string

  @IsString()
  studentName: string

  @IsString()
  @IsIn(['accepted', 'rejected', 'waiting_list'])
  status: string

  @IsOptional()
  @IsString()
  assignedClass?: string

  @IsOptional()
  @IsString()
  assignedDormitory?: string

  @IsOptional()
  @IsNumber()
  paymentAmount?: number

  @IsOptional()
  @IsDateString()
  paymentDueDate?: string

  @IsOptional()
  @IsString()
  notes?: string
}

export class UpdateAdmissionResultDto {
  @IsOptional()
  @IsString()
  @IsIn(['accepted', 'rejected', 'waiting_list'])
  status?: string

  @IsOptional()
  @IsString()
  assignedClass?: string

  @IsOptional()
  @IsString()
  assignedDormitory?: string

  @IsOptional()
  @IsNumber()
  paymentAmount?: number

  @IsOptional()
  @IsDateString()
  paymentDueDate?: string

  @IsOptional()
  @IsString()
  notes?: string
}
