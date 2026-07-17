import { IsString, IsOptional, IsBoolean } from 'class-validator'

export class CreatePeriodDto {
  @IsString()
  name: string

  @IsString()
  startDate: string

  @IsString()
  endDate: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class UpdatePeriodDto {
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
