import { IsString, IsNumber, IsOptional } from 'class-validator'

export class CreateGrowthDto {
  @IsString()
  studentId: string

  @IsString()
  studentName: string

  @IsString()
  date: string

  @IsNumber()
  height: number

  @IsNumber()
  weight: number

  @IsOptional()
  @IsString()
  notes?: string
}
