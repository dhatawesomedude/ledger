## ledger

Express-js application that generates ledgers for leases

## Requirements

-   node >= 12.10 [install Nodejs](https://nodejs.org/en/)
-   yarn >= 1.21.1 `npm install -g yarn`

## Getting started

The dev server is based on [ts-node-dev](https://github.com/whitecolor/ts-node-dev) which is a [node-dev server](https://github.com/fgnass/node-dev) that uses [ts-node](https://github.com/TypeStrong/ts-node) to execute typescript.

-   install dependencies: Run `yarn` or `yarn install`
-   start the app `yarn start` This runs an express server that listens for requests on PORT 8080
-   The ledger can be accesseed by sending a GET request to the `/ledger` endpoint. i.e. `http://localhost:8080/ledger`

## Application structure

The app is a 2 layer architecture that consists of:

-   Controllers:
    -   [Routing controller](https://github.com/typestack/routing-controllers) classes which manage routing and request validation.
    -   Validators: Decorators implemented using [class-validator](https://github.com/typestack/class-validator)
-   Services: Functions, and factories that manage business logic and use-cases.

### Main Dependencies

#### Business Logic

The core of the business rules(the calendar factory) is based on [rrulejs](https://github.com/jakubroztocil/rrule) which is a js implementation of [RRULE icalendar spec](https://tools.ietf.org/html/rfc5545).
The rrulejs library includes some limitations([seen here](https://github.com/jakubroztocil/rrule/issues/114)), which have been fixed in the [RSCALE spec](https://tools.ietf.org/html/rfc7529) unfortunately
I was unable to find a js library that implements this spec and I ended up fixing up the limitations manually.

All of the date manipulation is done using the [luxon library](https://moment.github.io/luxon/).

#### Server

The server is based on expressjs and [routing controllers](https://github.com/typestack/routing-controllers).
In addition to these 2, I've used the following libraries.

-   typedi for dependency management - https://github.com/typestack/typedi
-   class-validator for input validation - https://github.com/typestack/class-validator

### Tests

Tests are implemented in [jest](https://jestjs.io/), config file in `./jest.config.js`

There are 2 tiers of tests (with some overlap).
- API test `(controllers/__tests__)`: Which tests things to do with routing, request, response, and validation.
- unit/Use-case/business-logic tests `(services/__tests__)` : tests for various use cases. Most of the use-cases from the spec are handled in the rent and calendar tests(`rent.test.ts` and `calendar.test.ts`) as all of the logic exists there.

Tests are run using Github actions. You can click on the actions tab, or checkout the workflows in the github workflows directory (`./.github/workflows`)

#### Run Tests locally.
Run `yarn test` to run tests locally.
