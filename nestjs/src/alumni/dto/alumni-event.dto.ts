import { IsString, IsDateString, IsIn, IsOptional } from 'class-validator'

export class CreateAlumniEventDto {
  @IsString()
  name: string

  @IsDateString()
  date: string

  @IsString()
  @IsIn(['Reuni', 'Halal bihalal', 'Pengajian', 'Lainnya'])
  type: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  location?: string
}

export class UpdateAlumniEventDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsDateString()
  date?: string

  @IsOptional()
  @IsString()
  @IsIn(['Reuni', 'Halal bihalal', 'Pengajian', 'Lainnya'])
  type?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  location?: string
}
