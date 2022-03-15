import { Checkbox as OriginalCheckbox } from 'antd';

import withFinalForm from '../withFinalForm';

export const Checkbox = withFinalForm(OriginalCheckbox);
export const Group = withFinalForm(OriginalCheckbox.Group);

export default Checkbox;
