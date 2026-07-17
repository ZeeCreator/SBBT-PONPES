import { IsString, IsNumber, Min, Max, IsInt } from 'class-validator'

export class AddGradeDto {
  @IsString()
  studentId: string

  @IsString()
  subject: string

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number

  @IsInt()
  @Min(1)
  semester: number

  @IsString()
  academicYear: string
}
