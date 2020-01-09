import 'reflect-metadata'

import { Settings } from 'luxon'
import { createExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'
import { LedgerController } from './controllers/LedgerController'

// Set the default time zone to create DateTimes in
Settings.defaultZoneName = 'Australia/Sydney'

/**
 * Setup routing-controllers to use typedi container.
 */
useContainer(Container)
/*
 * Create a new express instance
 * */
export const expressApp = createExpressServer({
    controllers: [LedgerController],
    classTransformer: true,
    validation: true,
})
