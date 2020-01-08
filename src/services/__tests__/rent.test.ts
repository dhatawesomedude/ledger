import { DateTime } from 'luxon'
import { calculateRent } from '../helpers/rent'
import { Frequency } from '../../dto/LedgerDto'
import { ONE_WEEK, ONE_YEAR } from '../Calendar'
import { getEndDay } from '../helpers/calendar'

describe('Rent', () => {
    describe('rent - happy path', () => {
        it('should call getEndDay with correct arguments', () => {
            const startDate = DateTime.fromISO('2017-02-01')
            const endDate = DateTime.fromISO('2017-02-30')
            const endDayMock = jest.fn((a, b) => a)

            calculateRent(startDate, endDate, endDayMock, Frequency.weekly, 120)

            expect(endDayMock).toHaveBeenCalledWith(startDate, Frequency.weekly)
        })

        it('weekly -> should return rent for 7days when a weekly frequency is specified and the end Date is 7days away', () => {
            const startDate = DateTime.fromISO('2020-01-01')
            const endDate = DateTime.fromISO('2020-01-07')
            const amount = 100

            const rent = calculateRent(startDate, endDate, (a, b) => a, Frequency.weekly, amount)

            expect(rent).toEqual(amount)
        })

        it('fortnightly -> should return rent for 14days when a fortnightly frequency is specified and the end Date is 14days away', () => {
            const startDate = DateTime.fromISO('2020-01-01')
            const endDate = DateTime.fromISO('2020-01-14')
            const amount = 100

            const rent = calculateRent(startDate, endDate, (a, b) => a, Frequency.weekly, amount)

            expect(rent).toEqual(amount * 2)
        })

        it('monthly -> should return rent for 1 month when a monthly frequency is specified and the end Date is 1 month away', () => {
            const startDate = DateTime.fromISO('2020-01-02')
            const amount = 100

            const rent = calculateRent(startDate, DateTime.fromISO('2020-02-01'), getEndDay, Frequency.monthly, amount)

            const expectedResult = ((amount / ONE_WEEK) * ONE_YEAR) / 12
            // result is round to 2 decimal places
            expect(rent).toBeCloseTo(expectedResult)
        })
    })
    describe('rent - non-happy-path', () => {
        it('weekly -> should return rent based on the number of days when the duration is less than 7 days', () => {
            const startDate = DateTime.fromISO('2020-01-01')
            const endDate = DateTime.fromISO('2020-01-04')
            const weeklyRent = 550

            const rent = calculateRent(startDate, endDate, (a, b) => a, Frequency.weekly, weeklyRent)

            const expectedResult = (weeklyRent / ONE_WEEK) * 4
            // result is round to 2 decimal places
            expect(rent).toBeCloseTo(expectedResult)
        })

        it('fortnightly -> should return rent based on the number of days when the duration is less than 14 days', () => {
            const startDate = DateTime.fromISO('2020-01-01')
            const endDate = DateTime.fromISO('2020-01-13')
            const weeklyRent = 550

            const rent = calculateRent(startDate, endDate, (a, b) => a, Frequency.fortnightly, weeklyRent)

            const expectedResult = (weeklyRent / ONE_WEEK) * 13
            // result is round to 2 decimal places
            expect(rent).toBeCloseTo(expectedResult)
        })

        it('monthly -> should return rent based on the number of days when the duration is less than 1 month', () => {
            const startDate = DateTime.fromISO('2020-01-01')
            const endDate = DateTime.fromISO('2020-01-29')
            const weeklyRent = 550

            const rent = calculateRent(startDate, endDate, getEndDay, Frequency.monthly, weeklyRent)

            const expectedResult = (weeklyRent / ONE_WEEK) * 29
            // result is round to 2 decimal places
            expect(rent).toBeCloseTo(expectedResult)
        })
    })
})
