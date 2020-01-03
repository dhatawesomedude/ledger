import RRule, { Options, RRuleSet } from 'rrule'
import { DateTime, Interval } from 'luxon'
import { Frequency, LedgerRequestDto } from '../dto/LedgerDto'

export interface LineItem {
    startDate: string
    endDate: string
    totalAmount: number
}

export const generateLedger = ({
    start_date: startDate,
    end_date: endDate,
    frequency,
    timezone,
    weekly_rent: weeklyRent,
}: LedgerRequestDto) => {

    const getRuleOptions = (): Partial<Options> => {
        // set rule options.
        const ruleOptions: Partial<Options> = {
            freq: RRule.WEEKLY,
            interval: 1,
            dtstart: new Date(startDate),
            until: new Date(endDate),
            tzid: timezone,
        }

        /********************* Frequency. ********************************/
        // Fortnightly frequency is the same as weekly frequency with an interval of 2.
        // (the icalendar RFC spec does not specify a fortnightly frequency) - https://tools.ietf.org/html/rfc5545
        if (frequency === Frequency.monthly) ruleOptions.freq = RRule.MONTHLY
        else if (frequency === Frequency.fortnightly) ruleOptions.interval = 2

        /********************* Fallback for skipped dates. ********************************/
        // if day is 31st, fall back to the last valid day of the month.
        if (DateTime.fromISO(startDate).day === 31) {
            ruleOptions.bymonthday = [28, 29, 30, 31]
            ruleOptions.bysetpos = -1
        }
        // if day is 30th, fall back to the 28th or 29th (for leap year) in February.
        else if (DateTime.fromISO(startDate).day === 30) {
            ruleOptions.bymonthday = [28, 29, 30]
            ruleOptions.bysetpos = -1
        }
        // if day is 29th, fall back to the 28th in non-leap-year in February
        else if (DateTime.fromISO(startDate).day === 29) {
            ruleOptions.bymonthday = [28, 29]
            ruleOptions.bysetpos = -1
        }

        return ruleOptions
    }

    // boundary dates are dates generated
    const getBoundaryDates = (): Date[] => {
        // Create a ruleSet for the ledger dates
        const ruleSet = new RRuleSet()
        const ruleOptions = getRuleOptions()

        // create rule and add rule to ruleSet
        const rule = new RRule(ruleOptions)
        ruleSet.rrule(rule)

        // get the last date from the ruleSet
        const generatedEndDate = DateTime.fromISO(
            rule
                .all()
                .pop()
                .toISOString(),
            { zone: timezone },
        )
        const endDateWithTZ = DateTime.fromISO(endDate, { zone: timezone })

        // add endDate to ruleSet if the last-generated-date succeeds the endDate AND
        // the last-generated-date does not equal the endDate i.e. they are not the same day
        if (endDateWithTZ > generatedEndDate && endDateWithTZ.ordinal !== generatedEndDate.ordinal) {
            ruleSet.rdate(new Date(endDate))
        }

        console.log(ruleSet.all())
        return ruleSet.all()
    }

    const calculateRent = (start, end, frequency, weeklyRent) => {
        const durationInDays = Interval.fromDateTimes(DateTime.fromJSDate(start), DateTime.fromJSDate(end)).count('days')
        // const isMonthCutShort = () => Interval.fromDateTimes(DateTime.fromJSDate(start), DateTime.fromJSDate(end)).count('months') !== 1
        const isMonthCutShort = DateTime.fromJSDate(getEndDay(start, frequency)).equals(DateTime.fromJSDate(end)) === false
        // round to 2 decimal places
        const roundAmount = (amount) => Math.round( ( amount + Number.EPSILON ) * 100 ) / 100

        let amount = 0

        // if item is cut-short use the formula => weeklyRent / 7 * numberOfDays
        switch (frequency) {
            case Frequency.monthly:
                amount = isMonthCutShort ? (weeklyRent / 7) * durationInDays : ((weeklyRent / 7) * 365) / 12
                break
            case Frequency.fortnightly:
                amount = durationInDays === 14 ? weeklyRent * 2 : (weeklyRent / 7) * durationInDays
                break
            case Frequency.weekly:
                amount = durationInDays === 7 ? weeklyRent : (weeklyRent / 7) * durationInDays
                break
        }
        return roundAmount(amount)
    }

    const getEndDay = (start, freq) => {
        switch(freq) {
            case Frequency.fortnightly:
                return DateTime.fromJSDate(start).plus({days: 13}).toJSDate()
            case Frequency.weekly:
                return DateTime.fromJSDate(start).plus({days: 6}).toJSDate()
            case Frequency.monthly:
                return DateTime.fromJSDate(start).plus({months: 1}).minus({days: 1}).toJSDate()
        }
    }

    const ledger = (): LineItem[] => {
        const boundaryDates = getBoundaryDates()
        const ledgerDates: LineItem[] = boundaryDates.reduce((ledger, date, index) => {
            // if ledger is not last element in list, startDate is current item, end date is next item.
            if (index === boundaryDates.length - 1) return ledger

            let start = DateTime.fromJSDate(date)
                .toJSDate()
            let end = getEndDay(start, frequency)

            if (index === boundaryDates.length - 2) {
                end = DateTime.fromJSDate(boundaryDates[boundaryDates.length - 1]).toJSDate()
            }


            return [
                ...ledger,
                {
                    startDate: DateTime.fromJSDate(start).toISODate(),
                    endDate: DateTime.fromJSDate(end).toISODate(),
                    totalAmount: calculateRent(start, end, frequency, weeklyRent),
                },
            ]
        }, [])

        return ledgerDates
    }

    return {
        get ledger() {
            return ledger()
        },
    }
}
