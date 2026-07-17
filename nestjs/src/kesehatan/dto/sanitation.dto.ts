import { IsString, IsNumber, IsIn, IsOptional, Min, Max, IsInt } from 'class-validator'

export class CreateSanitationDto {
  @IsString()
  @IsIn(['Kamar', 'MCK', 'Kelas', 'Halaman', 'Lainnya'])
  area: string

  @IsString()
  date: string

  @IsString()
  inspectorName: string

  @IsInt()
  @Min(0)
  @Max(100)
  score: number

  @IsOptional()
  @IsString()
  notes?: string
}
