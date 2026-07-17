import { IsString, IsNumber, Min } from 'class-validator'

export class AddSubjectDto {
  @IsString()
  code: string

  @IsString()
  name: string

  @IsString()
  department: string

  @IsNumber()
  @Min(1)
  hours: number

  @IsString()
  teacher: string
}
