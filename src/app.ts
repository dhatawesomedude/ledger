import 'reflect-metadata'
import { createExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'
import { LedgerController } from './controllers/LedgerController'

const PORT = 8080

/**
 * Setup routing-controllers to use typedi container.
 */
useContainer(Container)

/*
* Create a new express instance
* */
const expressApp = createExpressServer({
    controllers: [LedgerController],
    classTransformer: true,
    validation: true,
})

/*
* Start express app
* */
expressApp.listen(PORT)

console.info(`server is now listening on port ${PORT}`)
