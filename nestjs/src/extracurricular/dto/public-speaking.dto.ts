import { IsString, IsIn, IsOptional } from 'class-validator'

export class CreatePublicSpeakingDto {
  @IsString()
  studentId: string

  @IsString()
  studentName: string

  @IsString()
  date: string

  @IsString()
  @IsIn(['Arab', 'Inggris', 'Indonesia'])
  language: string

  @IsString()
  topic: string

  @IsString()
  @IsIn(['completed', 'upcoming', 'cancelled'])
  status: string

  @IsOptional()
  @IsString()
  notes?: string
}

export class UpdatePublicSpeakingDto {
  @IsOptional()
  @IsString()
  topic?: string

  @IsOptional()
  @IsString()
  @IsIn(['completed', 'upcoming', 'cancelled'])
  status?: string

  @IsOptional()
  @IsString()
  notes?: string
}
