import originalJoi, { Extension } from 'joi';
import joiPhoneNumber from 'joi-phone-number';

const joi = originalJoi.extend(joiPhoneNumber);

export { joi };
