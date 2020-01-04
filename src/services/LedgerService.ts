import RRule, { Options, RRuleSet } from 'rrule'
import { DateTime, Interval } from 'luxon'
import { Frequency, LedgerRequestDto } from '../dto/LedgerDto'

export interface LineItem {
    startDate: string
    endDate: string
    totalAmount: number
}

// used for date calculation
const ONE_DAY = 1
const ONE_WEEK = 7
const TwO_WEEKS = 14
const ONE_YEAR = 365


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

    /*
     * Boundary dates includes the start date, end date, and all payment dates in between.
     * The dates are generated using the icalendar RRULE spec, implemented in the rrulejs library
     * The endDate is added manually if it isn't added automatically added by the library (in cases where the line item is cut short)
     * */
    const getBoundaryDates = (): string[] => {
        // Create a ruleSet for the ledger dates
        const ruleSet = new RRuleSet()
        const ruleOptions = getRuleOptions()

        // create rule and add rule to ruleSet
        const rule = new RRule(ruleOptions)
        ruleSet.rrule(rule)

        const allRules = rule.all()
        // get the last date from the ruleSet
        const generatedEndDate = DateTime.fromISO(allRules[allRules.length - 1].toISOString(), { zone: timezone })
        const endDateWithTZ = DateTime.fromISO(endDate, { zone: timezone })

        // add endDate to ruleSet if the last-generated-date succeeds the endDate AND
        // the last-generated-date does not equal the endDate i.e. they are not the same day
        if (endDateWithTZ > generatedEndDate && endDateWithTZ.ordinal !== generatedEndDate.ordinal) {
            ruleSet.rdate(new Date(endDate))
        }

        return ruleSet.all().map(date => DateTime.fromJSDate(date, {zone: timezone}).toISODate())
    }

    const calculateRent = (start: DateTime, end: DateTime, freq: Frequency, weeklyRent: number) => {
        const durationInDays = Interval.fromDateTimes(start, end).count('days')
        const isMonthCutShort = !(getEndDay(start, freq).toISODate() === end.toISODate())

        // round to 2 decimal places. Number.EPSILON is used here to avoid issues with rounding to 2 decimal places.
        const roundAmount = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100

        let amount = 0

        // if item is cut-short use the formula => weeklyRent / 7 * numberOfDays
        switch (freq) {
            case Frequency.monthly:
                amount = isMonthCutShort ? (weeklyRent / ONE_WEEK) * durationInDays : ((weeklyRent / ONE_WEEK) * ONE_YEAR) / 12
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

    const getEndDay = (start: DateTime, freq: Frequency): DateTime => {
        switch (freq) {
            case Frequency.fortnightly:
                return start.plus({ days: TwO_WEEKS - ONE_DAY })
            case Frequency.weekly:
                return start.plus({ days: ONE_WEEK - ONE_DAY })
            case Frequency.monthly:
                return start.plus({ months: 1 }).minus({ days: ONE_DAY })
        }
    }

    const ledger = (): LineItem[] => {
        const boundaryDates = getBoundaryDates()
        const ledgerDates: LineItem[] = boundaryDates.reduce((ledger: LineItem[], date: string, index) => {

            // exit if last item encountered
            if (index === boundaryDates.length - 1) return ledger

            let start = DateTime.fromISO(date)
            let end = getEndDay(start, frequency)

            if (index === boundaryDates.length - 2) {
                end = DateTime.fromISO(boundaryDates[boundaryDates.length - 1])
            }

            return [
                ...ledger,
                {
                    startDate: start.setZone(timezone).toISODate(),
                    endDate: end.setZone(timezone).toISODate(),
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
