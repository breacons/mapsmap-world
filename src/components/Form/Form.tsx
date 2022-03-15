import { Spin } from 'antd';
import classNames from 'classnames';
import { FORM_ERROR, FormApi, ValidationErrors } from 'final-form';
import arrayMutators from 'final-form-arrays';
import React, { Fragment, ReactElement } from 'react';
import { Beforeunload } from 'react-beforeunload';
import {
  Form as OriginalForm,
  FormProps as OriginalFormProps,
  FormRenderProps as OriginalFormRenderProps,
  FormSpy,
} from 'react-final-form';
import { defineMessages, useIntl } from 'react-intl';
// import { Prompt } from 'react-router-dom';

// import { FORM_VERBOSE } from '../../config';
const FORM_VERBOSE = true; // FIXME
// import { report } from '../../service/reporting';
import If from '../If';
import { validationMessages } from './validation';
export type FormRenderProps = OriginalFormRenderProps;

export interface FormProps<T> extends OriginalFormProps {
  children: (form: T) => any;
  className?: any;
  validator: Function;
  isLoading?: boolean;
  preventPrompt?: boolean;
  mutators?: { [key: string]: (...args: any[]) => any };
}

interface LoggerProps {
  values: any;
  errors: ValidationErrors;
}

const messages = defineMessages({
  prompt: {
    id: 'Form.prompt',
    defaultMessage: 'Biztosan el akarsz navigálni mentés nélkül?',
  },
});

export const Form = ({
  className,
  children,
  validator,
  onSubmit,
  isLoading = false,
  preventPrompt = false,
  mutators,
  ...rest
}: FormProps<FormRenderProps>) => {
  const intl = useIntl();
  const submit = async (values: any, form: FormApi): Promise<any | void> => {
    try {
      const result = await onSubmit(values, form);
      if (typeof result === 'string') {
        return {
          [FORM_ERROR]: result,
        };
      }

      return result;
    } catch (error) {
      // report(error);

      return {
        [FORM_ERROR]: 'Something went wrong.',
      };
    }
  };

  const logger = ({ values, errors }: LoggerProps) => {
    /* eslint-disable no-console */
    console.groupCollapsed('Form Details');
    console.log('%cvalues', 'color: DarkTurquoise; font-weight: 600', values);
    console.log('%cerrors', 'color: red; font-weight: 600', errors);
    console.groupEnd();
    /* eslint-enable no-console */
  };

  return (
    <Spin spinning={isLoading}>
      <OriginalForm
        {...rest}
        onSubmit={submit}
        validate={(values): any => validationMessages(validator(values))}
        mutators={{ ...arrayMutators, ...mutators }}
        render={(form): ReactElement => {
          return (
            <Fragment>
              <If
                condition={process.env.NODE_ENV === 'development' && FORM_VERBOSE}
                then={() => (
                  <FormSpy subscription={{ values: true, errors: true }} onChange={logger} />
                )}
              />
              <form
                onSubmit={form.handleSubmit}
                autoComplete="off"
                spellCheck="false"
                noValidate
                className={classNames(
                  {
                    'ant-form-vertical': true,
                  },
                  className,
                )}
              >
                {children(form)}
              </form>
              <Beforeunload
                onBeforeunload={() =>
                  !preventPrompt &&
                  !form.pristine &&
                  !form.submitSucceeded &&
                  intl.formatMessage(messages.prompt)
                }
              />
              {/*<Prompt*/}
              {/*  when={!preventPrompt && !form.pristine && !form.submitSucceeded}*/}
              {/*  message={(location) => {*/}
              {/*    const state = location.state as {*/}
              {/*      confirmed?: boolean;*/}
              {/*    } | null;*/}
              {/*    if (state?.confirmed === true) {*/}
              {/*      return true;*/}
              {/*    }*/}
              {/*    return intl.formatMessage(messages.prompt);*/}
              {/*  }}*/}
              {/*/>*/}
            </Fragment>
          );
        }}
      />
    </Spin>
  );
};

export default Form;
