import { LedgerFactory } from '../Ledger'
import { Frequency } from '../../dto/LedgerDto'

describe('ledger', () => {
    it('should have the right data for weekly', () => {
        const { lineItems } = LedgerFactory({
            start_date: '2020-03-28',
            end_date: '2020-05-27',
            frequency: Frequency.weekly,
            timezone: 'Australia/Sydney',
            weekly_rent: 555,
        })
        expect(lineItems).toEqual(
            expect.arrayContaining([
                {
                    endDate: '2020-04-03T23:59:59.999+11:00',
                    startDate: '2020-03-28T00:00:00.000+11:00',
                    totalAmount: 555,
                },
                {
                    endDate: '2020-04-10T23:59:59.999+10:00',
                    startDate: '2020-04-04T00:00:00.000+11:00',
                    totalAmount: 555,
                },
                {
                    endDate: '2020-04-17T23:59:59.999+10:00',
                    startDate: '2020-04-11T00:00:00.000+10:00',
                    totalAmount: 555,
                },
                {
                    endDate: '2020-04-24T23:59:59.999+10:00',
                    startDate: '2020-04-18T00:00:00.000+10:00',
                    totalAmount: 555,
                },
                {
                    endDate: '2020-05-01T23:59:59.999+10:00',
                    startDate: '2020-04-25T00:00:00.000+10:00',
                    totalAmount: 555,
                },
                {
                    endDate: '2020-05-08T23:59:59.999+10:00',
                    startDate: '2020-05-02T00:00:00.000+10:00',
                    totalAmount: 555,
                },
                {
                    endDate: '2020-05-15T23:59:59.999+10:00',
                    startDate: '2020-05-09T00:00:00.000+10:00',
                    totalAmount: 555,
                },
                {
                    endDate: '2020-05-22T23:59:59.999+10:00',
                    startDate: '2020-05-16T00:00:00.000+10:00',
                    totalAmount: 555,
                },
                {
                    endDate: '2020-05-27T23:59:59.999+10:00',
                    startDate: '2020-05-23T00:00:00.000+10:00',
                    totalAmount: 396.43,
                },
            ]),
        )
    })

    it('it should have the right data for fortnightly', () => {
        const { lineItems } = LedgerFactory({
            start_date: '2020-03-28',
            end_date: '2020-05-27',
            frequency: Frequency.fortnightly,
            timezone: 'Australia/Sydney',
            weekly_rent: 555,
        })
        expect(lineItems).toEqual(
            expect.arrayContaining([
                {
                    endDate: '2020-04-10T23:59:59.999+10:00',
                    startDate: '2020-03-28T00:00:00.000+11:00',
                    totalAmount: 1110,
                },
                {
                    endDate: '2020-04-24T23:59:59.999+10:00',
                    startDate: '2020-04-11T00:00:00.000+10:00',
                    totalAmount: 1110,
                },
                {
                    endDate: '2020-05-08T23:59:59.999+10:00',
                    startDate: '2020-04-25T00:00:00.000+10:00',
                    totalAmount: 1110,
                },
                {
                    endDate: '2020-05-22T23:59:59.999+10:00',
                    startDate: '2020-05-09T00:00:00.000+10:00',
                    totalAmount: 1110,
                },
                {
                    endDate: '2020-05-27T23:59:59.999+10:00',
                    startDate: '2020-05-23T00:00:00.000+10:00',
                    totalAmount: 396.43,
                },
            ]),
        )
    })

    it('it should have the right data for monthly', () => {
        const { lineItems } = LedgerFactory({
            start_date: '2020-03-28',
            end_date: '2020-05-27',
            frequency: Frequency.monthly,
            timezone: 'Australia/Sydney',
            weekly_rent: 555,
        })

        expect(lineItems).toEqual(
            expect.arrayContaining([
                {
                    endDate: '2020-04-27T23:59:59.999+10:00',
                    startDate: '2020-03-28T00:00:00.000+11:00',
                    totalAmount: 2411.61,
                },
                {
                    endDate: '2020-05-27T23:59:59.999+10:00',
                    startDate: '2020-04-28T00:00:00.000+10:00',
                    totalAmount: 2411.61,
                },
            ]),
        )
    })
})
