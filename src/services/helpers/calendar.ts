import { DateTime } from 'luxon'
import { Frequency } from '../../dto/LedgerDto'
import { ONE_DAY, ONE_WEEK, TWO_WEEKS } from '../Calendar'

export const getEndDay = (start: DateTime, freq: Frequency) => {
    switch (freq) {
        case Frequency.fortnightly:
            return start.plus({ days: TWO_WEEKS - ONE_DAY })
        case Frequency.weekly:
            return start.plus({ days: ONE_WEEK - ONE_DAY })
        case Frequency.monthly:
            return start.plus({ months: 1 }).minus({ days: ONE_DAY })
    }
}

export type GetEndDay = (...args: Parameters<typeof getEndDay>) => ReturnType<typeof getEndDay>
