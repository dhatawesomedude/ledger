import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'
import { DateTime } from 'luxon'

export function IsValidTimezone(validationOptions?: ValidationOptions) {
    return function(object: Record<string, any>, propertyName: string) {
        registerDecorator({
            name: 'IsValidTimezone',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    return value && typeof value === 'string' && DateTime.local().setZone(value).isValid
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Text ($value) is not a valid timezone!'
                },
            },
        })
    }
}
