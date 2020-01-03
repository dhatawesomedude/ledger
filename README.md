- typedi for dependincy management - https://github.com/typestack/typedi
- class-validator for input validation - https://github.com/typestack/class-validator
- rrule for tracking recurring dates - See RFC [here](https://tools.ietf.org/html/rfc5545)
- inline interfaces for request data interface and dto files for response interface
- If the timezone is invalid, it defaults to UTC.
- date manipulation done using luxon


# Spec
- request
    - start_date ISO String
    - end_date ISO String
    - frequency weekly | fortnightly | monthly
    - weekly_rent
    - timezone

- response
    - Array of line items
    - start_date ISO string
    - end_date ISO string
    - amount Number

- test cases
    - response sent in UTC ?
    - request dates in valid format
    - all response dates must be within the min and max (request start and end dates)
    - weekly payment frequency every 7 days
    - the end date must be the last date
    - fortnightly payment frequency every 24 days
    - monthly - the same day every month
        - start date does not exist => should use the next closes day for any month where the date doesn't exist.
        - 
fortnightly
    - freq=weekly | interval=2
weekly
    - freq=weekly
monthly
    - freq=monthly
