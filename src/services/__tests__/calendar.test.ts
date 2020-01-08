import { DateTime } from 'luxon'
import { CalendarFactory } from '../Calendar'
import { Frequency } from '../../dto/LedgerDto'
import { getEndDay } from '../helpers/calendar'

describe('calendar', () => {
    describe('boundaryDates - happy path', () => {
        it('weekly -> should return an array of boundary dates 7 days apart', () => {
            const { boundaryDates } = CalendarFactory('2020-01-01', '2020-01-29', Frequency.weekly, 'Australia/Sydney')
            expect(boundaryDates).toEqual(
                expect.arrayContaining(['2020-01-01', '2020-01-08', '2020-01-15', '2020-01-22', '2020-01-29']),
            )
        })
        it('fortnightly -> should return an array of boundary dates 14 days apart', () => {
            const { boundaryDates } = CalendarFactory(
                '2020-01-01',
                '2020-01-29',
                Frequency.fortnightly,
                'Australia/Sydney',
            )
            expect(boundaryDates).toEqual(expect.arrayContaining(['2020-01-01', '2020-01-15', '2020-01-29']))
        })
        it('monthly -> should return an array of boundary dates on the same day every month', () => {
            const { boundaryDates } = CalendarFactory('2020-01-01', '2020-05-01', Frequency.monthly, 'Australia/Sydney')
            expect(boundaryDates).toEqual(
                expect.arrayContaining(['2020-01-01', '2020-02-01', '2020-03-01', '2020-04-01', '2020-05-01']),
            )
        })
    })
    describe('boundaryDates - non happy path', () => {
        it("should return 28th when 29th doesn't exist in the specified month (leap year)", () => {
            const { boundaryDates } = CalendarFactory('2021-01-29', '2021-05-29', Frequency.monthly, 'Australia/Sydney')
            expect(boundaryDates).toEqual(
                expect.arrayContaining(['2021-01-29', '2021-02-28', '2021-03-29', '2021-04-29', '2021-05-29']),
            )
        })
        it("should return closest date (29th or 28th) when 30th doesn't exist in the specified month", () => {
            // non leap year
            const { boundaryDates } = CalendarFactory('2021-01-30', '2021-05-30', Frequency.monthly, 'Australia/Sydney')
            // leap year
            const { boundaryDates: leapYearBoundaryDates } = CalendarFactory(
                '2020-01-30',
                '2020-05-30',
                Frequency.monthly,
                'Australia/Sydney',
            )

            expect(boundaryDates).toEqual(
                expect.arrayContaining(['2021-01-30', '2021-02-28', '2021-03-30', '2021-04-30', '2021-05-30']),
            )
            expect(leapYearBoundaryDates).toEqual(
                expect.arrayContaining(['2020-01-30', '2020-02-29', '2020-03-30', '2020-04-30', '2020-05-30']),
            )
        })
        it("should return the next closest date when 31st doesn't exist in the specified month", () => {
            const { boundaryDates } = CalendarFactory('2021-01-31', '2021-08-31', Frequency.monthly, 'Australia/Sydney')
            expect(boundaryDates).toEqual(
                expect.arrayContaining([
                    '2021-01-31',
                    '2021-02-28',
                    '2021-03-31',
                    '2021-04-30',
                    '2021-05-31',
                    '2021-06-30',
                    '2021-07-31',
                    '2021-08-31',
                ]),
            )
        })
    })
    describe('getEndDate', () => {
        it('weekly -> should provide an end date 7 days from the start date(including the start date) when the weekly frequency is specified', () => {
            const startDate = DateTime.fromISO('2021-01-01')
            const endDate = getEndDay(startDate, Frequency.weekly).toISODate()
            expect(endDate).toEqual('2021-01-07')
        })
        it('fortnightly -> should provide an end date 14 days from the start date(including the start date) when the fortnightly frequency is specified', () => {
            const startDate = DateTime.fromISO('2021-01-01')
            const endDate = getEndDay(startDate, Frequency.fortnightly).toISODate()
            expect(endDate).toEqual('2021-01-14')
        })
        it('monthly -> should provide an end date 1 month from the start date(including the start date) when the monthly frequency is specified', () => {
            const startDate = DateTime.fromISO('2021-01-01')
            const endDate = getEndDay(startDate, Frequency.monthly).toISODate()
            expect(endDate).toEqual('2021-01-31')
        })
    })
})
