import { TreeSelect as OriginalTreeSelect } from 'antd';

import withFinalForm from '../withFinalForm';

export const TreeSelect = withFinalForm(OriginalTreeSelect);
export const TreeNode = OriginalTreeSelect.TreeNode;

export default TreeSelect;
