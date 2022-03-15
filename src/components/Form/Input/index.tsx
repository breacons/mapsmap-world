import { Input as OriginalInput } from 'antd';

import withFinalForm from '../withFinalForm';

export const Input = withFinalForm(OriginalInput);
export const TextArea = withFinalForm(OriginalInput.TextArea);
export const Search = withFinalForm(OriginalInput.Search);
export const InputGroup = withFinalForm(OriginalInput.Group);
export const Password = withFinalForm(OriginalInput.Password);

export default Input;
