import { IsString, IsIn, IsOptional } from 'class-validator'

export class RecordPrayerAttendanceDto {
  @IsString()
  studentId: string

  @IsString()
  studentName: string

  @IsString()
  date: string

  @IsString()
  @IsIn(['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'])
  prayerTime: string

  @IsString()
  @IsIn(['jamaah', 'sendirian', 'absen', 'uzur'])
  status: string
}

export class UpdatePrayerAttendanceDto {
  @IsOptional()
  @IsString()
  @IsIn(['jamaah', 'sendirian', 'absen', 'uzur'])
  status?: string
}
