import classNames from 'classnames';
import React, { ReactNode } from 'react';

import styles from './SectionTitle.module.less';

interface Props {
  children: ReactNode;
  form?: boolean;
}

export const SectionTitle = ({ children, form }: Props) => (
  <div className={classNames([styles.sectionTitle, { [styles.formTitle]: form }])}>{children}</div>
);

export default SectionTitle;
