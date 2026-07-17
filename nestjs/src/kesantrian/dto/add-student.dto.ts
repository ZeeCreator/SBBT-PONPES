import { IsString, IsIn } from 'class-validator'

export class AddStudentDto {
  @IsString()
  name: string

  @IsString()
  nis: string

  @IsString()
  class: string

  @IsString()
  city: string

  @IsString()
  @IsIn(['Laki-laki', 'Perempuan'])
  gender: string
}
