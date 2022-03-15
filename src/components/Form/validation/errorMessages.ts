import _ from 'lodash';
import { defineMessages } from 'react-intl';

export const transformMessages = (messages: Record<string, string>) => {
  return _.keyBy(
    Object.keys(messages).map((key) => ({
      key,
      id: key,
      defaultMessage: messages[key],
    })),
    'key',
  );
};

const errorTypes = {
  generic: 'Validációs hiba.',

  'any.unknown': 'Nem megengedett.',
  'any.invalid': 'Inavlid value.',
  'any.empty': 'Nem lehet üres.',
  'any.required': 'This field is required.',
  'any.allowOnly': 'Az alábbiak közül legyen valamelyik: {valids}.',
  'any.allowOnly.confirmPassword': 'A jelszavaknak meg kell egyezniük.',
  'any.match': 'Egyeznie kell ezzel: {query}.',
  'any.default': 'Threw an error when running default method.',

  'alternatives.base': 'Semelyik megengedett lehetőséggel sem egyezik meg.',

  'array.base': 'Must be an array.',
  'array.includes': 'At position {pos} does not match any of the allowed types.',
  'array.includesSingle': 'Single value of label does not match any of the allowed types.',
  'array.includesOne': 'At position {pos} fails because {reason}.',
  'array.includesOneSingle': 'Single value fails because {reason}.',
  'array.includesRequiredUnknowns': 'Does not contain {unknownMisses} required value(s).',
  'array.includesRequiredKnowns': 'Does not contain {knownMisses}.',
  'array.includesRequiredBoth':
    'Does not contain {knownMisses} and {unknownMisses} other required value(s).',
  'array.excludes': 'At position {pos} contains an excluded value.',
  'array.excludesSingle': 'Single value contains an excluded value.',
  'array.min': 'Legalább {limit} elemet tartalmaznia kell.',
  'array.max': 'Must contain less than or equal to {limit} items.',
  'array.length': 'Must contain {limit} items.',
  'array.ordered': 'At position {pos} fails because {reason}.',
  'array.orderedLength':
    'At position {pos} fails because array must contain at most {limit} items.',
  'array.ref': 'References {ref} which is not a positive integer.',
  'array.sparse': 'Must not be a sparse array.',
  'array.unique': 'Position {pos} contains a duplicate value.',

  'boolean.base': 'Igaz / hamis értéknek kell lennie.',

  'binary.base': 'Must be a buffer or a string.',
  'binary.min': 'Must be at least {limit} bytes.',
  'binary.max': 'Must be less than or equal to {limit} bytes.',
  'binary.length': 'Must be {limit} bytes.',

  'date.base': 'Az értéknek milliszekundumnak vagy érvényes dátumnak kell lennie.',
  'date.format': 'Szövegnek kell lenni az alábbi formátumok valamelyikében: {format}.',
  'date.strict': 'Érvényes dátumnak kell lennie.',
  'date.min': 'Legalább {limit} kell hogy legyen.',
  'date.max': 'Legfeljebb {limit} lehet.',
  'date.less': 'Kisebbnek kell lennie mint {limit}.',
  'date.greater': 'Nagyobbnak kell lennie mint {limit}.',
  'date.isoDate': 'Érvényes ISO 8601 dátumnak kell lennie.',
  'date.ref': 'Töltsd ki a másik dátum mezőt is!',
  'date.timestamp.javascript': 'Az értéknek érvényes dátumnak vagy milliszekundumnak kell lennie.',
  'date.timestamp.unix': 'Az értéknek érvényes időbélyegnek vagy másodpercnek kell lennie.',

  'object.base': 'Hiányzó érték.',
  'object.child': '{child}  fails because {reason}.',
  'object.min': 'Must have at least {limit} children.',
  'object.max': 'Must have less than or equal to {limit} children.',
  'object.length': 'Must have {limit} children.',
  'object.allowUnknown': '{child} is not allowed.',
  'object.with': '{mainWithLabel} missing required peer {peerWithLabel}.',
  'object.without': '{mainWithLabel} conflict with forbidden peer {peerWithLabel}.',
  'object.missing': 'Must contain at least one of {peersWithLabels}.',
  'object.xor': 'Contains a conflict between exclusive peers {peersWithLabels}.',
  'object.or': 'Must contain at least one of {peersWithLabels}.',
  'object.and': 'Contains {presentWithLabels} without its required peers {missingWithLabels}.',
  'object.nand': '{mainWithLabel} must not exist simultaneously with {peersWithLabels}.',
  'object.assert': '{ref} validation failed because {ref} failed to {message}.',
  'object.rename.multiple':
    'Cannot rename child {from} because multiple renames are disabled and another key was already renamed to {to}.',
  'object.rename.override':
    'Cannot rename child {from} because override is disabled and target {to} exists.',
  'object.rename.regex.multiple':
    'Cannot rename children {from} because multiple renames are disabled and another key was already renamed to {to}.',
  'object.rename.regex.override':
    'Cannot rename children {from} because override is disabled and target {to} exists.',
  'object.type': 'Must be an instance of {type}.',
  'object.schema': 'Must be a Joi instance.',

  'number.base': 'The value has to be a number.',
  'number.min': 'It has to be at least {limit}.',
  'number.max': 'Az érték legfeljebb {limit} lehet.',
  'number.less': 'Must be less than {limit}.',
  'number.greater': 'Must be greater than {limit}.',
  'number.float': 'Must be a float or double.',
  'number.integer': 'Must be an integer.',
  'number.negative': 'Must be a negative number.',
  'number.positive': 'Must be a positive number.',
  'number.precision': 'Must have no more than {limit} decimal places.',
  'number.ref': 'References {ref} which is not a number.',
  'number.multiple': 'Must be a multiple of {multiple}.',
  'number.port': 'Must be a valid port.',

  'string.base': 'This field is required.',
  'string.min': 'Legalább {limit} karakter hosszúnak kell lennie.',
  'string.max': 'Should have at most {limit} characters.',
  'string.length': 'Should have exactly {limit} characters.',
  'string.alphanum': 'Must only contain alpha-numeric characters.',
  'string.token': 'Must only contain alpha-numeric and underscore characters',
  'string.regex.base': 'Should match the required pattern: {pattern}.',
  'string.regex.name': 'Should match to match the {name} pattern.',
  'string.regex.invert.base': 'Should not match the pattern {pattern}.',
  'string.regex.invert.name': 'Should not match the {name} pattern.',
  'string.email': 'Incorrect e-mail format.',
  'string.uri': 'Must be a valid uri.',
  'string.uriRelativeOnly': 'Must be a valid relative uri.',
  'string.uriCustomScheme': 'Must be a valid uri with a scheme matching the {scheme} pattern.',
  'string.isoDate': 'Must be a valid ISO 8601 date.',
  'string.guid': 'Must be a valid GUID.',
  'string.hex': 'Must only contain hexadecimal characters.',
  'string.hexAlign': 'Hex decoded representation must be byte aligned.',
  'string.base64': 'Must be a valid base64 string.',
  'string.dataUri': 'Must be a valid dataUri string.',
  'string.hostname': 'Must be a valid hostname.',
  'string.normalize': 'Must be unicode normalized in the {form} form.',
  'string.lowercase': 'Must only contain lowercase characters.',
  'string.uppercase': 'Must only contain uppercase characters.',
  'string.trim': 'Must not have leading or trailing whitespace.',
  'string.creditCard': 'Must be a credit card.',
  'string.ref': 'References {ref} which is not a number.',
  'string.ip': 'Must be a valid ip address with a {cidr} CIDR.',
  'string.ipVersion':
    'Must be a valid ip address of one of the following versions {version} with a {cidr} CIDR.',

  'symbol.base': 'Must be a symbol.',
  'symbol.map': 'Must be one of {map}.',

  'phoneNumber.invalid': 'A telefonszám nem megfelelő.',
};

const fieldErrorType = defineMessages(transformMessages(errorTypes));

const fieldErrorMessages = {
  requiredEmail: 'Az email cím megadása kötelező',
  isEmail: 'Ez az email cím érvénytelen',
  requiredPassword: 'A jelszó megadása kötelező',
  minCharacters: 'Legalább {min} karaktert kell tartalmaznia.',
  maxCharacters: 'Legfeljebb {max} karaktert tartalmazhat.',
  requiredLicensePlate: 'A rendszám megadása kötelező',
  requiredPrice: 'Az utazás árának megadása kötelező',
  greaterThan: 'Legalább {min} kell lennie',
  requiredManufactureYear: 'A gyártás év megadása kötelező',
  requiredServiceProvider: 'A szolgáltató megadása kötelező',
  requiredReservationDate: 'A dátum megadása kötelező',
  requiredFirstName: 'A keresztnév megadása kötelező',
  requiredLastName: 'A vezetéknév megadása kötelező',
  requiredBirthDate: 'A születési dátum megadása kötelező',
  minAge: 'Legalább {min} évesnek kell lennie',
  requiredNationality: 'A nemzetiség megadása kötelező',
  requiredMotherName: 'Az anyja nevének megadása kötelező',
  requiredCity: 'A város megadása kötelező',
  requiredCountry: 'Az ország megadása kötelező',
  requiredAddress: 'A cím megadása kötelező',
  requiredPostalCode: 'Az irányítószám megadása kötelező',
  numericPostalCode: 'Csak számokat írhatsz ide',
  requiredPhoneNumber: 'A telefonszám megadása kötelező',
  numericPhoneNumber: 'Csak számokat írhatsz ide',
};

export const fieldError = defineMessages(transformMessages(fieldErrorMessages));

const errorMessages = {
  fieldErrorType,
  fieldError,
};

export default errorMessages;
