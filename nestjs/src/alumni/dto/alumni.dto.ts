import { IsString, IsOptional, IsIn, IsNumber, IsEmail } from 'class-validator'

export class CreateAlumniDto {
  @IsString()
  name: string

  @IsNumber()
  graduationYear: number

  @IsOptional()
  @IsString()
  graduationMajor?: string

  @IsString()
  @IsIn(['kuliah', 'kerja', 'pondok_lanjutan', 'lainnya'])
  currentStatus: string

  @IsOptional()
  @IsString()
  institution?: string

  @IsOptional()
  @IsString()
  major?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  address?: string
}

export class UpdateAlumniDto {
  @IsOptional()
  @IsString()
  currentStatus?: string

  @IsOptional()
  @IsString()
  institution?: string

  @IsOptional()
  @IsString()
  major?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  phone?: string
}
