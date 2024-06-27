import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isURL,
  isString,
  IsNotEmpty,
  IsUrl,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsString,
  Length,
} from 'class-validator';

function IsStringOrUrlAndLength(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrUrlAndLength',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _: ValidationArguments) {
          if (isURL(value)) {
            return true;
          }
          return isString(value) && value.length > 300;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid URL or a string longer than 300 characters`;
        },
      },
    });
  };
}

export class ShortDescriptionDto {
  @IsStringOrUrlAndLength()
  readonly query: string;
}

export class ParseShortPageDto {
  @IsUrl()
  @IsNotEmpty()
  @MaxLength(30000)
  readonly url: string;
}

export class ShortAllDescriptionDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Length(10, 30000, { each: true })
  readonly query: string[];
}
