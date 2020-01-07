import { DateTime } from 'luxon'
import { LedgerRequestDto } from '../dto/LedgerDto'
import { calculateRent } from './Rent'
import { CalendarFactory } from './Calendar'

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
    const { boundaryDates, getEndDay } = CalendarFactory(startDate, endDate, frequency, timezone)

    const createLineItemsFromDates = (ledger: LineItem[], date: string, index: number) => {
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
                startDate: start
                    .setZone(timezone)
                    .startOf('day')
                    .toISO(),
                endDate: end
                    .setZone(timezone)
                    .endOf('day')
                    .toISO(),
                totalAmount: calculateRent(start, end, getEndDay, frequency, weeklyRent),
            },
        ]
    }

    const ledger = (): LineItem[] => {
        return boundaryDates.reduce(createLineItemsFromDates, [])
    }

    return {
        get ledger() {
            return ledger()
        },
    }
}
