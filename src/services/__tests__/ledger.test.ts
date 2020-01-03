import { generateLedger } from '../LedgerService'
import { Frequency } from '../../dto/LedgerDto'

it('We should have the right data for weekly', () => {
    const ledger = generateLedger({
        start_date: '2020-03-28',
        end_date: '2020-05-27',
        frequency: Frequency.weekly,
        timezone: 'Australia/Sydney',
        weekly_rent: 555,
    }).ledger
    expect(ledger).toEqual(
        expect.arrayContaining([
            {
                startDate: '2020-03-28',
                endDate: '2020-04-03',
                totalAmount: 555,
            },
            {
                startDate: '2020-04-04',
                endDate: '2020-04-10',
                totalAmount: 555,
            },
            {
                startDate: '2020-04-11',
                endDate: '2020-04-17',
                totalAmount: 555,
            },
            {
                startDate: '2020-04-18',
                endDate: '2020-04-24',
                totalAmount: 555,
            },
            {
                startDate: '2020-04-25',
                endDate: '2020-05-01',
                totalAmount: 555,
            },
            {
                startDate: '2020-05-02',
                endDate: '2020-05-08',
                totalAmount: 555,
            },
            {
                startDate: '2020-05-09',
                endDate: '2020-05-15',
                totalAmount: 555,
            },
            {
                startDate: '2020-05-16',
                endDate: '2020-05-22',
                totalAmount: 555,
            },
            {
                startDate: '2020-05-23',
                endDate: '2020-05-27',
                totalAmount: 396.43,
            },
        ]),
    )
})

it('We should have the right data for fortnightly', () => {
    const ledger = generateLedger({
        start_date: '2020-03-28',
        end_date: '2020-05-27',
        frequency: Frequency.fortnightly,
        timezone: 'Australia/Sydney',
        weekly_rent: 555,
    }).ledger
    expect(ledger).toEqual(
        expect.arrayContaining([
            {
                "startDate": "2020-03-28",
                "endDate": "2020-04-10",
                "totalAmount": 1110
            },
            {
                "startDate": "2020-04-11",
                "endDate": "2020-04-24",
                "totalAmount": 1110
            },
            {
                "startDate": "2020-04-25",
                "endDate": "2020-05-08",
                "totalAmount": 1110
            },
            {
                "startDate": "2020-05-09",
                "endDate": "2020-05-22",
                "totalAmount": 1110
            },
            {
                "startDate": "2020-05-23",
                "endDate": "2020-05-27",
                "totalAmount": 396.43
            }
        ]),
    )
})

it('We should have the write data for monthly', () => {
    const ledger = generateLedger({
        start_date: '2020-03-28',
        end_date: '2020-05-27',
        frequency: Frequency.monthly,
        timezone: 'Australia/Sydney',
        weekly_rent: 555,
    }).ledger

    expect(ledger).toEqual(
        expect.arrayContaining([
            {
                "startDate": "2020-03-28",
                "endDate": "2020-04-27",
                "totalAmount": 2411.61
            },
            {
                "startDate": "2020-04-28",
                "endDate": "2020-05-27",
                "totalAmount": 2411.61
            }
        ]),
    )
})
