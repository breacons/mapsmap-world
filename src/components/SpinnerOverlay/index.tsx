import { Spin, SpinProps } from 'antd';
import React, { PropsWithChildren } from 'react';

import CustomSpinner from '../CustomSpinner';
import If from '../If';
import styles from './spinner-overlay.module.less';

export const SpinnerOverlay = (props: PropsWithChildren<SpinProps>) => (
  <If
    condition={props.spinning}
    then={() => (
      <div className={styles.container}>
        <Spin
          spinning={props.spinning}
          indicator={<CustomSpinner size={64} color="white" />}
          size="large"
        />
      </div>
    )}
  />
);
