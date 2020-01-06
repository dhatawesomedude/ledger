import { DateTime, Interval } from 'luxon'
import { Frequency } from '../dto/LedgerDto'
import { Calendar, ONE_WEEK, ONE_YEAR, TwO_WEEKS } from './Calendar'

export const calculateRent = (
    start: DateTime,
    end: DateTime,
    getEndDay: Calendar['getEndDay'],
    freq: Frequency,
    weeklyRent: number,
) => {
    const durationInDays = Interval.fromDateTimes(start, end).count('days')
    const isMonthCutShort = !(getEndDay(start, freq).toISODate() === end.toISODate())

    // round to 2 decimal places. Number.EPSILON is used here to avoid issues with rounding to 2 decimal places.
    const roundAmount = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100

    let amount = 0

    // if item is cut-short use the formula => weeklyRent / 7 * numberOfDays
    switch (freq) {
        case Frequency.monthly:
            amount = isMonthCutShort
                ? (weeklyRent / ONE_WEEK) * durationInDays
                : ((weeklyRent / ONE_WEEK) * ONE_YEAR) / 12
            break
        case Frequency.fortnightly:
            amount = durationInDays === TwO_WEEKS ? weeklyRent * 2 : (weeklyRent / ONE_WEEK) * durationInDays
            break
        case Frequency.weekly:
            amount = durationInDays === ONE_WEEK ? weeklyRent : (weeklyRent / ONE_WEEK) * durationInDays
            break
    }
    return roundAmount(amount)
}
