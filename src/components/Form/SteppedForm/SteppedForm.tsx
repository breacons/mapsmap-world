import { LoadingOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Steps } from 'antd';
import { FormApi, ValidationErrors } from 'final-form';
import _ from 'lodash';
import React, { Fragment, ReactElement, useState } from 'react';
import { FormRenderProps } from 'react-final-form';
import { defineMessages, FormattedMessage } from 'react-intl';

import If from '../../If';
import Form from '../Form';
import { Props as StepProps } from './Step';
import style from './SteppedForm.module.less';

const { Step: NavigationStep } = Steps;

const messages = defineMessages({
  buttonNext: {
    id: 'SteppedForm.button.next',
    defaultMessage: 'Next',
  },
  buttonPrevious: {
    id: 'SteppedForm.button.previous',
    defaultMessage: 'Back',
  },
  buttonSubmit: {
    id: 'SteppedForm.button.submit',
    defaultMessage: 'Submit',
  },
});

type Props = {
  children: ReactElement | Array<ReactElement>;
  validator: any;
  initialValues?: any;
  isLoading?: boolean;
  onSubmit: (values: any, form: FormApi) => Promise<any> | any;
  mutators?: { [key: string]: (...args: any[]) => any };
  keepDirtyOnReinitialize?: boolean;
};

export const SteppedForm = ({
  children,
  validator,
  initialValues,
  onSubmit,
  isLoading = false,
  mutators,
  keepDirtyOnReinitialize,
}: Props) => {
  const [step, setStep] = useState(0);
  const [highestStep, setHighestStep] = useState(step);

  const steps = React.Children.map(
    children,
    (currentStep: ReactElement<StepProps>, index: number) => {
      const fieldsNamesInStep = React.Children.map(
        currentStep.props.children,
        (field: any) => field.props.name,
      );

      return {
        title: currentStep.props.title,
        description: currentStep.props.description,
        index: index,
        fields: fieldsNamesInStep,
      };
    },
  );

  const stepHasError = (step: number, errors: ValidationErrors) => {
    const fieldsInCurrentStep =
      steps[step].fields.map((field: string) => field.split('.')[0]) || [];
    const fieldsWithErrors = _.keys(errors);

    const fieldsWithErrorsInCurrentStep = fieldsWithErrors.filter((error) =>
      fieldsInCurrentStep.includes(error),
    );

    return fieldsWithErrorsInCurrentStep.length > 0;
  };

  const next = () => {
    const nextStep = Math.min(step + 1, steps.length - 1);
    setStep(nextStep);
    setHighestStep(Math.max(highestStep, nextStep));
  };

  return (
    <Form
      onSubmit={onSubmit}
      validator={validator}
      initialValues={initialValues}
      isLoading={isLoading}
      mutators={mutators}
      keepDirtyOnReinitialize={keepDirtyOnReinitialize}
    >
      {({ errors, valid, form }: FormRenderProps): ReactElement => {
        const { mutators } = form;
        return (
          <Fragment>
            {/*<UseEnterWrapper allowed={stepHasError(technology, errors)} callback={next} />*/}
            <Steps
              direction="horizontal"
              size="small"
              current={step}
              onChange={setStep}
              labelPlacement="vertical"
            >
              {steps.map((currentStep, index: number) => {
                const errorInStep = stepHasError(index, errors);
                return (
                  <NavigationStep
                    title={currentStep.title}
                    key={`navigation-step-${index}`}
                    disabled={index > highestStep || (index > step && errorInStep)}
                    icon={isLoading ? <LoadingOutlined /> : undefined}
                    status={
                      index > highestStep
                        ? 'wait'
                        : index === step
                        ? 'process'
                        : errorInStep
                        ? 'error'
                        : 'finish'
                    }
                  />
                );
              })}
            </Steps>
            <Fragment>
              {React.Children.map(children, (child, index) =>
                React.cloneElement(child, { index, step, mutators, form }),
              )}

              <Divider />
              <div className={style.buttonContainer}>
                <Space direction="horizontal" size={8} style={{ justifyItems: 'flex-end' }}>
                  <If
                    condition={step > 0}
                    then={() => (
                      <Button
                        onClick={() => setStep(Math.max(0, step - 1))}
                        className={style.buttonWithSpacing}
                      >
                        <FormattedMessage {...messages.buttonPrevious} />
                      </Button>
                    )}
                  />
                  <If
                    condition={step < steps.length - 1}
                    then={() => (
                      <Button type="primary" onClick={next} disabled={stepHasError(step, errors)}>
                        <FormattedMessage {...messages.buttonNext} />
                      </Button>
                    )}
                  />

                  <If
                    condition={step === steps.length - 1}
                    then={() => (
                      <Button type="primary" htmlType="submit" disabled={!valid}>
                        <FormattedMessage {...messages.buttonSubmit} />
                      </Button>
                    )}
                  />
                </Space>
              </div>
            </Fragment>
          </Fragment>
        );
      }}
    </Form>
  );
};

export default SteppedForm;
