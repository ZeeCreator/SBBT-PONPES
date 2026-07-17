import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  displayName: string

  @IsOptional()
  @IsIn(['super_admin', 'bendahara', 'kesantrian', 'wali_santri'])
  role?: string
}

export class SetRoleDto {
  @IsString()
  uid: string

  @IsString()
  @IsIn(['super_admin', 'bendahara', 'kesantrian', 'wali_santri'])
  role: string
}
