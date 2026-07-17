import { IsString, IsIn } from 'class-validator'

export class AddViolationDto {
  @IsString()
  studentId: string

  @IsString()
  @IsIn(['Minor', 'Moderate', 'Severe'])
  type: string

  @IsString()
  category: string

  @IsString()
  description: string

  @IsString()
  reportedBy: string
}
