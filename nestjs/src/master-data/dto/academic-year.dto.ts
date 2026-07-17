import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator'

export class CreateAcademicYearDto {
  @IsString()
  name: string

  @IsString()
  @IsIn(['Ganjil', 'Genap'])
  semester: string

  @IsString()
  startDate: string

  @IsString()
  endDate: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class UpdateAcademicYearDto {
  @IsOptional()
  @IsString()
  name?: string
  @IsOptional()
  @IsString()
  endDate?: string
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
