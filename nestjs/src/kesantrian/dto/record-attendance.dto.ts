import { IsString, IsIn } from 'class-validator'

export class RecordAttendanceDto {
  @IsString()
  studentId: string

  @IsString()
  studentName: string

  @IsString()
  class: string

  @IsString()
  date: string

  @IsString()
  @IsIn(['present', 'sick', 'permit', 'absent'])
  status: string

  @IsString()
  activity: string
}
