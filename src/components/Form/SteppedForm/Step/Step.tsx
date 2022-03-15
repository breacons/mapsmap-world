import { Col, Row } from 'antd';
import cx from 'classnames';
import { AnyObject, FormApi } from 'final-form';
import React, { ReactElement, ReactNode } from 'react';

import style from './Step.module.less';

export type Props = {
  index?: number;
  step?: number;
  children: ReactElement | Array<ReactElement> | ((form?: FormApi<AnyObject>) => ReactNode);
  title: string | ReactElement;
  description?: string | ReactElement;
  expand?: boolean;
  form?: FormApi<AnyObject>;
};

export const Step = ({ index, step, description, children, expand = false, form }: Props) => {
  const kids = typeof children === 'function' ? children(form) : children;

  /* Even though the current technology (index) is not the active one (technology) then we
   * should still render the fields.
   * Because if the form gets rerendered (eg failure on the server side -
   * either 4xx or 5xx) the non rendered field values will be dropped  and they
   * have to be reentered again. (BNFT-316)
   * So simply let's `display: none` them there making sure all the listeners
   * and fields are registered.
   */

  return (
    <div
      className={cx({
        [style.hidden]: step !== index,
      })}
    >
      <div className={style.title}>{description}</div>
      {/*<If*/}
      {/*  condition={description}*/}
      {/*  then={() => (*/}
      {/*    <Typography.Text sourceType="secondary" className={style.description}>*/}
      {/*      {description}*/}
      {/*    </Typography.Text>*/}
      {/*  )}*/}
      {/*/>*/}
      <Row gutter={16}>
        {React.Children.map(kids, (child, index) => (
          <Col span={expand ? 24 : 12}>
            {React.cloneElement(child as ReactElement, { autoFocus: index === 0 })}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Step;
