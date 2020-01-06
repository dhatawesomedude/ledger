import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'
import { DateTime } from 'luxon'

export function IsDateBefore(property: string, validationOptions?: ValidationOptions) {
    return function(object: Record<string, any>, propertyName: string) {
        registerDecorator({
            name: 'isDateBefore',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints
                    const relatedValue = (args.object as any)[relatedPropertyName]

                    return (
                        typeof value === 'string' &&
                        typeof relatedValue === 'string' &&
                        DateTime.fromISO(value) < DateTime.fromISO(relatedValue)
                    )
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints
                    const relatedValue = (args.object as any)[relatedPropertyName]

                    return `${propertyName}($value) must be before ${relatedPropertyName} (${relatedValue})`
                },
            },
        })
    }
}
