import { IsString, IsIn, IsOptional, IsArray } from 'class-validator'

export class CreateExtracurricularDto {
  @IsString()
  name: string

  @IsString()
  @IsIn(['Pramuka', 'Pencak Silat', 'Lainnya'])
  type: string

  @IsString()
  schedule: string

  @IsString()
  coach: string

  @IsArray()
  @IsString({ each: true })
  members: string[]

  @IsOptional()
  @IsString()
  notes?: string
}

export class UpdateExtracurricularDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  @IsIn(['Pramuka', 'Pencak Silat', 'Lainnya'])
  type?: string

  @IsOptional()
  @IsString()
  schedule?: string

  @IsOptional()
  @IsString()
  coach?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  members?: string[]

  @IsOptional()
  @IsString()
  notes?: string
}
