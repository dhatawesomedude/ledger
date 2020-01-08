import 'reflect-metadata'
import { createExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'
import { Settings } from 'luxon'
import { LedgerController } from './controllers/LedgerController'

const PORT = 8080

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

/*
 * Start express app
 * */
expressApp.listen(PORT)

console.info(`server is now listening on port ${PORT}`)
