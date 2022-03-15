import { Select as OriginalSelect } from 'antd';

import withFinalForm from '../withFinalForm';

export const Select = withFinalForm(OriginalSelect);
export const Option = OriginalSelect.Option;
export const OptGroup = OriginalSelect.OptGroup;
export default Select;
