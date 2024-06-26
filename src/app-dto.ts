import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isURL,
  isString,
  IsNotEmpty,
  IsUrl,
  MaxLength,
} from 'class-validator';

function IsStringOrUrlAndLength(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrUrlAndLength',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Проверяем, является ли значение URL
          if (isURL(value)) {
            return true; // Если значение является URL, валидация проходит успешно
          }
          // Если значение не URL, проверяем, является ли оно строкой и имеет ли длину более 300 символов
          return isString(value) && value.length > 300;
        },
        defaultMessage(args: ValidationArguments) {
          // Сообщение об ошибке, если валидация не прошла
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
