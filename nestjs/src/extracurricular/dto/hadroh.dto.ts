import { IsString, IsIn, IsOptional, IsArray } from 'class-validator'

export class CreateHadrohDto {
  @IsString()
  groupName: string

  @IsString()
  @IsIn(['Hadroh', 'Qiroah', 'Kaligrafi'])
  activityType: string

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

export class UpdateHadrohDto {
  @IsOptional()
  @IsString()
  groupName?: string

  @IsOptional()
  @IsString()
  @IsIn(['Hadroh', 'Qiroah', 'Kaligrafi'])
  activityType?: string

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
