import { DateTime } from 'luxon'
import { LedgerRequestDto } from '../dto/LedgerDto'
import { calculateRent } from './helpers/rent'
import { CalendarFactory } from './Calendar'
import { getEndDay } from './helpers/calendar'

export interface LineItem {
    startDate: string
    endDate: string
    totalAmount: number
}

export const LedgerFactory = ({
    start_date: startDate,
    end_date: endDate,
    frequency,
    timezone,
    weekly_rent: weeklyRent,
}: LedgerRequestDto) => {
    const { boundaryDates } = CalendarFactory(startDate, endDate, frequency, timezone)

    // the displayed start date is the beginning of the day in the property's timezone
    const displayStartDate = (date: DateTime, zone: string): string =>
        date
            .setZone(zone)
            .startOf('day')
            .toISO()
    // the displayed end date is the end of the day, in the property's timezone
    const displayEndDate = (date: DateTime, zone: string): string =>
        date
            .setZone(zone)
            .endOf('day')
            .toISO()

    /*
     * create line items from boundary dates
     * treat all boundary dates as start dates, except the last date which is the end date
     *
     * */
    const createLineItemsFromDates = (ledger: LineItem[], date: string, index: number): LineItem[] => {
        // exit if last item encountered
        if (index === boundaryDates.length - 1) return ledger

        const start = DateTime.fromISO(date)
        let end = getEndDay(start, frequency)

        if (index === boundaryDates.length - 2) {
            end = DateTime.fromISO(boundaryDates[boundaryDates.length - 1])
        }

        return [
            ...ledger,
            {
                startDate: displayStartDate(start, timezone),
                endDate: displayEndDate(end, timezone),
                totalAmount: calculateRent(start, end, getEndDay, frequency, weeklyRent),
            },
        ]
    }

    const lineItems = (): LineItem[] => {
        return boundaryDates.reduce(createLineItemsFromDates, [])
    }

    return {
        get lineItems() {
            return lineItems()
        },
    }
}
