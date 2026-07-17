import { IsString, IsIn, IsOptional } from 'class-validator'

export class CreateMediaDto {
  @IsString()
  title: string

  @IsString()
  @IsIn(['Mading', 'Buletin', 'Majalah', 'Artikel'])
  type: string

  @IsString()
  author: string

  @IsString()
  publishDate: string

  @IsOptional()
  @IsString()
  content?: string

  @IsString()
  @IsIn(['draft', 'published'])
  status: string
}

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  @IsIn(['Mading', 'Buletin', 'Majalah', 'Artikel'])
  type?: string

  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsString()
  @IsIn(['draft', 'published'])
  status?: string
}
