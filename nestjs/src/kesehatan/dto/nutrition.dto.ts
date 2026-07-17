import { IsString, IsIn, IsOptional } from 'class-validator'

export class CreateNutritionDto {
  @IsString()
  date: string

  @IsString()
  @IsIn(['Pagi', 'Siang', 'Malam', 'Snack'])
  mealTime: string

  @IsString()
  menu: string

  @IsOptional()
  @IsString()
  notes?: string
}
