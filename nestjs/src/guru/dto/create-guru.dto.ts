import { IsString, IsEmail, IsOptional, IsIn, IsArray } from 'class-validator'

export class CreateGuruDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsString()
  @IsIn(['Tahfidz', 'Kitab Kuning', 'Umum', 'Bahasa Arab', 'Mahir'])
  specialization: string

  @IsArray()
  @IsString({ each: true })
  subjects: string[]

  @IsOptional()
  @IsString()
  nuptk?: string
}

export class UpdateGuruDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsIn(['Tahfidz', 'Kitab Kuning', 'Umum', 'Bahasa Arab', 'Mahir'])
  specialization?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[]

  @IsOptional()
  @IsIn(['active', 'inactive', 'resigned'])
  status?: string

  @IsOptional()
  @IsString()
  nuptk?: string
}
