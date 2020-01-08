import RRule, { Options, RRuleSet } from 'rrule'
import { DateTime } from 'luxon'
import { Frequency } from '../dto/LedgerDto'

// used for date calculation
export const ONE_DAY = 1
export const ONE_WEEK = 7
export const TWO_WEEKS = 14
export const ONE_YEAR = 365

export interface Calendar {
    boundaryDates: string[]
}

export const CalendarFactory = (
    startDate: string,
    endDate: string,
    frequency: Frequency,
    timezone: string,
): Calendar => {
    const getRuleOptions = (): Partial<Options> => {
        // set rule options.
        const ruleOptions: Partial<Options> = {
            freq: RRule.WEEKLY,
            interval: 1,
            dtstart: new Date(startDate),
            until: new Date(endDate),
            tzid: timezone,
        }

        /** ******************* Frequency. ******************************* */
        // Fortnightly frequency is the same as weekly frequency with an interval of 2.
        // (the icalendar RFC spec does not specify a fortnightly frequency) - https://tools.ietf.org/html/rfc5545
        if (frequency === Frequency.monthly) ruleOptions.freq = RRule.MONTHLY
        else if (frequency === Frequency.fortnightly) ruleOptions.interval = 2

        /** ******************* Fallback for skipped dates. ******************************* */
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
        const generatedEndDate = DateTime.fromISO(allRules[allRules.length - 1].toISOString())
        const endDateWithTZ = DateTime.fromISO(endDate)

        // add endDate to ruleSet if the last-generated-date succeeds the endDate AND
        // the last-generated-date does not equal the endDate i.e. they are not the same day
        if (endDateWithTZ > generatedEndDate && endDateWithTZ.ordinal !== generatedEndDate.ordinal) {
            ruleSet.rdate(new Date(endDate))
        }

        // convert JS Date to luxon ISODate
        return ruleSet.all().map(date => DateTime.fromJSDate(date).toISODate())
    }

    return {
        get boundaryDates() {
            return getBoundaryDates()
        },
    }
}
