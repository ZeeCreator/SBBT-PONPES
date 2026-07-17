import { IsString, IsNumber, Min, IsOptional, IsIn, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class RoomDto {
  @IsString()
  name: string

  @IsNumber()
  @Min(1)
  capacity: number

  @IsString()
  @IsIn(['VIP', 'Regular'])
  type: string
}

export class CreateDormitoryDto {
  @IsString()
  name: string

  @IsString()
  @IsIn(['Putra', 'Putri'])
  gender: string

  @IsOptional()
  @IsString()
  supervisor?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  rooms: RoomDto[]
}

export class UpdateDormitoryDto {
  @IsOptional()
  @IsString()
  name?: string
  @IsOptional()
  @IsString()
  supervisor?: string
}

export class AddRoomDto {
  @IsString()
  name: string

  @IsNumber()
  @Min(1)
  capacity: number

  @IsString()
  @IsIn(['VIP', 'Regular'])
  type: string
}
