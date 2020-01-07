import { DateTime, Interval } from 'luxon'
import { Frequency } from '../dto/LedgerDto'
import { Calendar, ONE_WEEK, ONE_YEAR, TWO_WEEKS } from './Calendar'

// Calculates rental amount for a given period (rounded to 2 decimal places).
export const calculateRent = (
    start: DateTime,
    end: DateTime,
    getEndDay: Calendar['getEndDay'],
    frequency: Frequency,
    weeklyRent: number,
) => {
    const durationInDays = Interval.fromDateTimes(start, end).count('days')
    const isMonthCutShort = !(getEndDay(start, frequency).toISODate() === end.toISODate())

    const getAmount = (): number => {
        // if item is cut-short, use the formula => weeklyRent / 7 * numberOfDays
        switch (frequency) {
            case Frequency.monthly:
                return isMonthCutShort
                    ? (weeklyRent / ONE_WEEK) * durationInDays
                    : ((weeklyRent / ONE_WEEK) * ONE_YEAR) / 12
            case Frequency.fortnightly:
                return durationInDays === TWO_WEEKS ? weeklyRent * 2 : (weeklyRent / ONE_WEEK) * durationInDays
            case Frequency.weekly:
                return durationInDays === ONE_WEEK ? weeklyRent : (weeklyRent / ONE_WEEK) * durationInDays
        }
    }

    // round to 2 decimal places. Number.EPSILON is used here to avoid issues with rounding to 2 decimal places.
    const roundAmount = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100

    return roundAmount(getAmount())
}
