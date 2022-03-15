import 'moment/locale/hu';

import { DatePicker as OriginalDatePicker, Form } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import locale from 'antd/es/date-picker/locale/hu_HU';
import { omit } from 'lodash-es';
import moment from 'moment';
import React from 'react';
import { useField } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import withFinalForm, { WithFinalFormProps } from '../withFinalForm';

const dateFormat = 'YYYY.MM.DD. HH:mm';

type Props = WithFinalFormProps &
  RangePickerProps & {
    startField: string;
    endField: string;
  };

export const RangePicker = ({
  input: { id, name, onChange, ...inputProps },
  helperText,
  meta,
  label,
  startField = 'start',
  endField = 'end',
  onChange: onOriginalChange = () => undefined,
  ...rest
}: Props) => {
  const startError = useField(startField).meta.error;
  const endError = useField(endField).meta.error;

  const hasError = startError || endError;

  const startErrorMessage = (
    <FormattedMessage
      id="RangePicker.Start"
      defaultMessage="Kezdődátum: {error}"
      values={{ error: startError }}
    />
  );
  const endErrorMessage = (
    <FormattedMessage
      id="RangePicker.End"
      defaultMessage="Végdátum: {error}"
      values={{ error: endError }}
    />
  );

  const errorMessage = (
    <span>
      {startError && startErrorMessage}
      {startError && <br />}
      {endError && endErrorMessage}
    </span>
  );

  return (
    <Form.Item
      label={label}
      validateStatus={hasError && meta.touched ? 'error' : ''}
      help={meta.touched ? hasError && errorMessage : helperText || undefined}
      colon={false}
    >
      <OriginalDatePicker.RangePicker
        {...omit(inputProps, ['type', 'value'])}
        {...rest}
        id={id}
        name={name}
        value={[
          inputProps.value.start ? moment.unix(inputProps.value.start) : null,
          inputProps.value.end ? moment.unix(inputProps.value.end) : null,
        ]}
        onChange={(dates) => {
          if (!dates) {
            onChange({ start: null, end: null });
            onOriginalChange([] as any, ['', '']);
            return;
          }
          onOriginalChange([dates[0], dates[1]], ['', '']);
          onChange({ start: (dates[0] as any).unix(), end: (dates[1] as any).unix() });
        }} // you cannot call method of undefined
        disabled={false}
      />
    </Form.Item>
  );
};

export const DatePicker = withFinalForm(({ value, onChange, ...rest }: any) => (
  <OriginalDatePicker
    locale={locale}
    format={dateFormat}
    value={value ? moment.unix(value) : null}
    onChange={(momentDate) => onChange(momentDate?.unix())}
    {...rest}
  />
));

export const MonthPicker = withFinalForm(({ value, onChange, ...rest }: any) => (
  <OriginalDatePicker.MonthPicker
    value={value ? moment(value) : null}
    onChange={(momentDate) => onChange(momentDate?.toISOString())}
    {...rest}
  />
));

export default DatePicker;
