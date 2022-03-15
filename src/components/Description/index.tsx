import { Typography } from 'antd';
import classNames from 'classnames';
import React from 'react';

import styles from './styles.module.less';
interface Props {
  text: string | null | undefined;
  fullHeight?: boolean;
}

// TODO: ellipsis support
export const Description = ({ text, fullHeight }: Props) => {
  if (!text) {
    return null;
  }
  return (
    <div className={classNames([styles.descriptionContainer, { [styles.fullHeight]: fullHeight }])}>
      {text.split('\n').map((p, i) => (
        <Typography.Paragraph key={i}>{p}</Typography.Paragraph>
      ))}
    </div>
  );
};

export default Description;
