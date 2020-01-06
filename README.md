## ledger

Express-js application that generates ledgers for leases.

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

###Main Dependencies
####Business Logic
The core of the business rules(the calendar factory) is based on [rrulejs](https://github.com/jakubroztocil/rrule) which is a js implementation of [RRULE icalendar spec](https://tools.ietf.org/html/rfc5545)
The rrule library includes some limitations([seen here](https://github.com/jakubroztocil/rrule/issues/114)), which have been fixed in the [RSCALE spec](https://tools.ietf.org/html/rfc7529) however
I was unable to find a js library that implements this spec and I ended up fixing up the limitations manually.

#### Server logic

The server is based on expressjs and [routing controllers](https://github.com/typestack/routing-controllers).
In addition to these 2, I've used the following libraries.

-   typedi for dependency management - https://github.com/typestack/typedi
-   class-validator for input validation - https://github.com/typestack/class-validator

### This section is still being edited.

#### Test strategy.

-   inline interfaces for request data interface and dto files for response interface
-   If the timezone is invalid, it defaults to UTC.
-   date manipulation done using luxon

# Spec

-   request

    -   start_date ISO String
    -   end_date ISO String
    -   frequency weekly | fortnightly | monthly
    -   weekly_rent
    -   timezone

-   response

    -   Array of line items
    -   start_date ISO string
    -   end_date ISO string
    -   amount Number

-   test cases - response sent in UTC ? - request dates in valid format - all response dates must be within the min and max (request start and end dates) - weekly payment frequency every 7 days - the end date must be the last date - fortnightly payment frequency every 24 days - monthly - the same day every month - start date does not exist => should use the next closes day for any month where the date doesn't exist. -
    fortnightly - freq=weekly | interval=2
    weekly - freq=weekly
    monthly - freq=monthly
