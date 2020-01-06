import * as request from 'supertest'
import { expressApp } from '../../app'
import { Frequency, LedgerRequestDto } from '../../dto/LedgerDto'

const ledgerRequest: LedgerRequestDto = {
    start_date: '2020-03-28',
    end_date: '2020-04-30',
    weekly_rent: 555,
    frequency: Frequency.weekly,
    timezone: 'Australia/Sydney',
}

const getRequestURL = (requestObject: LedgerRequestDto) => {
    const { start_date, end_date, frequency, timezone, weekly_rent } = requestObject
    return `/ledger?end_date=${end_date}&start_date=${start_date}&weekly_rent=${weekly_rent}&frequency=${frequency}&timezone=${timezone}`
}

describe('/GET ledger', () => {
    describe('returns list of line items', () => {
        const requestObject = {
            ...ledgerRequest,
        }

        it('should return list of line items for monthly frequency', async () => {
            requestObject.frequency = Frequency.monthly
            const res = await request(expressApp).get(getRequestURL(requestObject))

            expect(res.status).toBe(200)
            expect(res.header['content-type']).toContain('application/json')
            expect(res.body).toMatchInlineSnapshot(`
                Array [
                  Object {
                    "endDate": "2020-04-27",
                    "startDate": "2020-03-28",
                    "totalAmount": 2411.61,
                  },
                  Object {
                    "endDate": "2020-04-30",
                    "startDate": "2020-04-28",
                    "totalAmount": 237.86,
                  },
                ]
            `)
        })

        it('should return list of line items for fortnightly frequency', async () => {
            requestObject.frequency = Frequency.fortnightly
            const res = await request(expressApp).get(getRequestURL(requestObject))

            expect(res.status).toBe(200)
            expect(res.header['content-type']).toContain('application/json')
            expect(res.body).toMatchInlineSnapshot(`
                Array [
                  Object {
                    "endDate": "2020-04-10",
                    "startDate": "2020-03-28",
                    "totalAmount": 1110,
                  },
                  Object {
                    "endDate": "2020-04-24",
                    "startDate": "2020-04-11",
                    "totalAmount": 1110,
                  },
                  Object {
                    "endDate": "2020-04-30",
                    "startDate": "2020-04-25",
                    "totalAmount": 475.71,
                  },
                ]
            `)
        })

        it('should return list of line items for weekly frequency', async () => {
            requestObject.frequency = Frequency.weekly
            const res = await request(expressApp).get(getRequestURL(requestObject))

            expect(res.status).toBe(200)
            expect(res.header['content-type']).toContain('application/json')
            expect(res.body).toMatchInlineSnapshot(`
                Array [
                  Object {
                    "endDate": "2020-04-03",
                    "startDate": "2020-03-28",
                    "totalAmount": 555,
                  },
                  Object {
                    "endDate": "2020-04-10",
                    "startDate": "2020-04-04",
                    "totalAmount": 555,
                  },
                  Object {
                    "endDate": "2020-04-17",
                    "startDate": "2020-04-11",
                    "totalAmount": 555,
                  },
                  Object {
                    "endDate": "2020-04-24",
                    "startDate": "2020-04-18",
                    "totalAmount": 555,
                  },
                  Object {
                    "endDate": "2020-04-30",
                    "startDate": "2020-04-25",
                    "totalAmount": 475.71,
                  },
                ]
            `)
        })
    })
    describe('Error handling', () => {
        const requestObject = {
            ...ledgerRequest,
        }
        it('should return a list of errors for each missing param', async () => {
            const res = await request(expressApp).get('/ledger')

            expect(res.status).toBe(400)
            expect(res.body.errors).toMatchInlineSnapshot(`
                Array [
                  Object {
                    "children": Array [],
                    "constraints": Object {
                      "isDateBefore": "start_date($value) must be before end_date (undefined)",
                      "isIso8601": "start_date must be a valid ISO 8601 date string",
                    },
                    "property": "start_date",
                    "target": Object {},
                  },
                  Object {
                    "children": Array [],
                    "constraints": Object {
                      "isIso8601": "end_date must be a valid ISO 8601 date string",
                    },
                    "property": "end_date",
                    "target": Object {},
                  },
                  Object {
                    "children": Array [],
                    "constraints": Object {
                      "isEnum": "frequency must be a valid enum value",
                    },
                    "property": "frequency",
                    "target": Object {},
                  },
                  Object {
                    "children": Array [],
                    "constraints": Object {
                      "isNumber": "weekly_rent must be a number conforming to the specified constraints",
                      "isPositive": "weekly_rent must be a positive number",
                    },
                    "property": "weekly_rent",
                    "target": Object {},
                  },
                  Object {
                    "children": Array [],
                    "constraints": Object {
                      "IsValidTimezone": "Text ($value) is not a valid timezone!",
                    },
                    "property": "timezone",
                    "target": Object {},
                  },
                ]
            `)
        })

        it('should reject invalid timezone string', async () => {
            requestObject.timezone = 'gibberish'
            const res = await request(expressApp).get(getRequestURL(requestObject))

            expect(res.status).toBe(400)
            expect(res.body.errors).toMatchInlineSnapshot(`
                Array [
                  Object {
                    "children": Array [],
                    "constraints": Object {
                      "IsValidTimezone": "Text (gibberish) is not a valid timezone!",
                    },
                    "property": "timezone",
                    "target": Object {
                      "end_date": "2020-04-30",
                      "frequency": "weekly",
                      "start_date": "2020-03-28",
                      "timezone": "gibberish",
                      "weekly_rent": 555,
                    },
                    "value": "gibberish",
                  },
                ]
            `)
        })

        it('start date must come before end date', async () => {
            requestObject.timezone = 'Australia/Sydney'
            requestObject.start_date = '2020-03-29'
            requestObject.end_date = '2020-01-20'
            const res = await request(expressApp).get(getRequestURL(requestObject))

            expect(res.status).toBe(400)
            expect(res.body.errors).toMatchInlineSnapshot(`
                Array [
                  Object {
                    "children": Array [],
                    "constraints": Object {
                      "isDateBefore": "start_date(2020-03-29) must be before end_date (2020-01-20)",
                    },
                    "property": "start_date",
                    "target": Object {
                      "end_date": "2020-01-20",
                      "frequency": "weekly",
                      "start_date": "2020-03-29",
                      "timezone": "Australia/Sydney",
                      "weekly_rent": 555,
                    },
                    "value": "2020-03-29",
                  },
                ]
            `)
        })
    })
})
