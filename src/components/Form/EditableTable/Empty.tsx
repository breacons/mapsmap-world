import { Empty as OriginalEmpty } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const Empty = () => (
  <OriginalEmpty
    image={OriginalEmpty.PRESENTED_IMAGE_SIMPLE}
    description={<FormattedMessage id="EditableTable.Empty" defaultMessage="Itt még nincs adat" />}
  />
);

export default Empty;
