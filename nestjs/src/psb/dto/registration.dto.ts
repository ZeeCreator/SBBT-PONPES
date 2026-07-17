import { IsString, IsEmail, IsDateString, IsOptional, IsIn, IsNumber, Min } from 'class-validator'

export class CreateRegistrationDto {
  @IsString()
  fullName: string

  @IsString()
  placeOfBirth: string

  @IsDateString()
  dateOfBirth: string

  @IsString()
  @IsIn(['Laki-laki', 'Perempuan'])
  gender: string

  @IsString()
  address: string

  @IsEmail()
  email: string

  @IsString()
  phone: string

  @IsString()
  previousSchool: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  hafalanJuz?: number

  @IsOptional()
  @IsString()
  parentName?: string

  @IsOptional()
  @IsString()
  parentPhone?: string
}

export class UpdateRegistrationDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'test_scheduled', 'test_completed', 'accepted', 'rejected'])
  status?: string

  @IsOptional()
  @IsString()
  notes?: string
}
