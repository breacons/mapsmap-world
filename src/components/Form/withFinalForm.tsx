import { Form } from 'antd';
import React, { ReactElement, ReactNode, useState } from 'react';
import { FieldInputProps, FieldMetaState } from 'react-final-form';

export interface WithFinalFormProps {
  input: FieldInputProps<any>;
  meta: FieldMetaState<any>;
  children?: ReactElement | Array<ReactElement>;
  label: string | ReactNode;
  helperText?: string | ReactNode;
}

export const withFinalForm = (Component: any) => ({
  input: { id, name, onChange, value, type, ...inputProps },
  helperText,
  meta,
  label,
  children,
  ...rest
}: WithFinalFormProps) => {
  const [childrenTouched, setChildrenTouched] = useState(false);

  return (
    <Form.Item
      label={label}
      validateStatus={meta.error && (meta.touched || childrenTouched) ? 'error' : ''}
      help={meta.touched || childrenTouched ? meta.error : helperText || undefined}
      colon={false}
      labelCol={{ span: 24 }}
    >
      <Component
        id={id}
        type={type}
        name={name}
        value={value}
        defaultValue={value}
        defaultChecked={value}
        disabled={false}
        onChange={onChange}
        size="large"
        {...inputProps}
        {...rest}
      >
        {children &&
          React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onBlur: () => setChildrenTouched(true),
            }),
          )}
      </Component>
    </Form.Item>
  );
};

withFinalForm.displayName = 'withFinalForm';

export default withFinalForm;
