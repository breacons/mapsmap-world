import { Radio as OriginalRadio } from 'antd';

import withFinalForm from '../withFinalForm';

export const Radio = OriginalRadio;
export const Button = OriginalRadio.Button;
export const Group = withFinalForm(OriginalRadio.Group);
export default Radio;
