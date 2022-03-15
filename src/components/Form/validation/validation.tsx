import { AnyObject, ARRAY_ERROR } from 'final-form';
import { Context, Schema, ValidationErrorItem, ValidationOptions } from 'joi';
import { get, isArray, isDate, isFunction, merge, reduce, set, transform } from 'lodash-es';
import moment from 'moment';

import intl from '../../../lib/intl';
import { joi } from '../../../lib/joi';
import errorMessages from './errorMessages';

export type joiError = {
  [key: string]: ValidationErrorItem;
};

const getKeyFromPath = (path: (string | number)[]): string => {
  const key = reduce(
    path,
    (key: string, item: any) => {
      if (typeof item === 'number') return `${key}[${item}]`;
      return `${key}.${item}`;
    },
    '',
  );

  return key.replace(/^\./, '');
};

export const validateSchema = (schema: Schema, options?: ValidationOptions) => (
  data: AnyObject,
): ValidationErrorItem[] | any => {
  if (!schema) {
    return;
  }
  const result = schema.validate(data, { abortEarly: false, ...options });
  const { error } = result;
  if (!error) return null;

  return reduce(
    error.details,
    (fields: any, error: any) => {
      const key =
        error.path && error.path.length > 1 ? `${getKeyFromPath(error.path)}` : error.context?.key;
      if (!key) {
        return fields;
      }
      if (isArray(get(data, key))) {
        const value: Record<string, unknown> = {};
        value[ARRAY_ERROR] = {
          type: error.type,
          context: error.context,
          message: error.message,
        };

        return merge(fields, { [key]: value });
      }
      return merge(
        fields,
        set({}, key, {
          type: error.type,
          context: error.context,
          message: error.message,
        }),
      );
    },
    {},
  ) as ValidationErrorItem[];
};

export const getValidationMessage = (error: string | ValidationErrorItem): any => {
  if (typeof error === 'string') return error;

  if (!error || !error.type) return getValidationMessage('Unknown error.');

  if (error.type === 'any.invalid' && error.message) {
    return error.message;
  }
  if (error.context?.label === 'custom-error' && error.message) {
    return error.message;
  }

  const { fieldErrorType } = errorMessages;
  const customMessage = fieldErrorType[`${error.type}.${error.context?.key}`];
  const standardMessage = fieldErrorType[error.type];
  const genericMessage = fieldErrorType.generic;

  const type = customMessage || standardMessage || genericMessage;

  const context = error.context
    ? transform(
        error.context,
        (context: Context, value: any, key: string) => {
          if (isDate(value)) {
            context[key] = moment(value).format('YYYY.MM.DD.');
          } else if (isFunction(value)) {
            context[key] = null;
          } else {
            context[key] = value;
          }
        },
        {},
      )
    : {};

  return intl().formatMessage(type, context);
  // return intl().formatMessage(sourceType, context);
};

export const validationMessages = (errors: Array<ValidationErrorItem> | any, level = 0): any => {
  if (errors === null) {
    return {};
  }

  const errorMessages = {} as any;

  Object.keys(errors).forEach((key) => {
    if (isArray(errors[key])) {
      errorMessages[key] = errors[key].map(
        (item: any) => item !== undefined && validationMessages(item, level + 1),
      );
    } else if (
      errors[key] !== null &&
      typeof errors[key] === 'object' &&
      !('type' in errors[key])
    ) {
      errorMessages[key] = validationMessages(errors[key], level + 1);
    } else {
      errorMessages[key] = getValidationMessage(errors[key]);
    }
  });

  return errorMessages;
};

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 64;

export const emailSchema = joi
  .string()
  .email({ tlds: { allow: false } })
  .required();
export const passwordSchema = joi.string().required();
export const strictPasswordSchema = passwordSchema
  .min(MIN_PASSWORD_LENGTH)
  .max(MAX_PASSWORD_LENGTH);

export const addressSchema = joi.object({
  country: joi.string().required(),
  city: joi.string().required(),
  address: joi.string().required(),
  zip: joi.string().required(),
});

export const localizedSchema = joi.object({
  en: joi.string().required(),
  hu: joi.string().required(),
});

export default joi;
