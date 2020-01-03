import { IsAlpha, IsBoolean, IsEnum, IsISO8601, IsNumber, IsPositive, IsString } from 'class-validator'
import { IsValidTimezone } from '../validators/TimezoneValidator'

export enum Frequency {
    weekly = "weekly",
    fortnightly = "fortnightly",
    monthly = "monthly",
}

export class LedgerRequestDto {

    @IsISO8601()
    start_date: string

    @IsISO8601()
    end_date: string

    @IsEnum(Frequency)
    frequency: Frequency

    @IsNumber()
    @IsPositive()
    weekly_rent: number

    @IsValidTimezone()
    timezone: string

}
