import { IsString, IsOptional, IsIn } from 'class-validator'

export class CreateClassDto {
  @IsString()
  name: string

  @IsString()
  @IsIn(['VII', 'VIII', 'IX', 'X', 'XI', 'XII'])
  level: string

  @IsString()
  @IsIn(['A', 'B', 'C', 'D', 'IPA 1', 'IPA 2', 'IPS 1', 'IPS 2'])
  group: string

  @IsOptional()
  @IsString()
  homeroomTeacher?: string
}

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  name?: string
  @IsOptional()
  @IsString()
  homeroomTeacher?: string
}
