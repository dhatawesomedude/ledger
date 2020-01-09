import { expressApp } from './app'

const PORT = 8080

expressApp.listen(PORT)

console.info(`server is now listening on port ${PORT}`)
