import * as React from 'react';
import { Button, Modal, Tabs, Input as AntInput, Spin, Result } from 'antd';
// @ts-ignore
import CreditCardInput from 'react-credit-card-input';
import { useState } from 'react';
import Cards from 'react-credit-cards';
import { Field } from 'react-final-form';
import Input from '../../../../components/Form/Input';
import DatePicker from '../../../../components/Form/DatePicker';
import Select, { Option } from '../../../../components/Form/Select';
import { Form } from '../../../../components/Form';
import { validateSchema } from '../../../../components/Form/validation';
import { joi } from '../../../../lib/joi';
import InputNumber from '../../../../components/Form/InputNumber';
import { useAppDispatch } from '../../../../redux/store';
import { submitDonation } from '../../../../service/topics';
import { Project, Topic, TopicVersion } from '../../../../interfaces/map';

import styles from './style.module.less';
import { useSelector } from 'react-redux';
import { getUser } from '../../../../redux/selectors';
import { SpinnerOverlay } from '../../../../components/SpinnerOverlay';
import CustomSpinner from '../../../../components/CustomSpinner';
import If from '../../../../components/If';

interface Props {
  show: boolean;
  closeModal: () => void;
  topic: Topic;
  version: TopicVersion;
  project: Project;
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const validator = validateSchema(
  joi
    .object({
      amount: joi.number().required(),
    })
    .unknown(),
);

const { TabPane } = Tabs;

// TODO: success notification
// TODO: loading state
// 4000 0200 0000 0000
export const DonationModal = ({ show, closeModal, topic, version, project }: Props) => {
  const dispatch = useAppDispatch();
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' });
  const profile = useSelector(getUser());
  const [amount, setAmount] = useState<null | number | any>();
  const [formState, setFormState] = useState('collect');

  const submit = async () => {
    if (!amount || amount <= 0) {
      return;
    }

    setFormState('loading');
    await new Promise((r) => setTimeout(r, 2000));

    await dispatch(submitDonation({ topic, version, project, amount }));

    setFormState('finished');

    setAmount(null);
    setCard({ number: '', expiry: '', cvc: '' });
  };

  return (
    <Modal
      title="Back this project"
      visible={show}
      footer={null}
      onCancel={() => {
        setFormState('collect');
        closeModal();
      }}
    >
      <Spin
        spinning={formState === 'loading'}
        indicator={<CustomSpinner size={64} />}
        className={styles.spinner}
      >
        <Tabs defaultActiveKey="1" className={styles.tabs} centered>
          <TabPane tab="Traditional Currencies" key="1">
            <If
              condition={formState === 'finished'}
              then={() => (
                <Result
                  status="success"
                  title="You successfully funded this project!"
                  subTitle="Transaction number: 2017182818828182881"
                  extra={[
                    <Button
                      key="console"
                      type="primary"
                      block
                      size="large"
                      className={styles.confirm}
                      onClick={() => {
                        setFormState('collect');
                        closeModal();
                      }}
                    >
                      Finish
                    </Button>,
                  ]}
                />
              )}
              else={() => (
                <div className={styles.cardInputs}>
                  <Cards
                    cvc={card.cvc}
                    expiry={card.expiry.replaceAll(' ', '').replace('/', '')}
                    focused={undefined}
                    name={`${profile.firstName} ${profile.lastName}`}
                    number={card.number}
                  />
                  <div style={{ marginTop: 12, textAlign: 'center' }}>
                    <CreditCardInput
                      // fieldClassName="input"
                      fieldStyle={{ color: 'black', marginTop: 12, width: 320 }}
                      inputStyle={{ color: 'black' }}
                      cardNumberInputProps={{
                        autoFocus: true,
                        value: card.number,
                        onChange: (e: any) => setCard({ ...card, number: e.target.value }),
                      }}
                      cardExpiryInputProps={{
                        value: card.expiry,
                        onChange: (e: any) => setCard({ ...card, expiry: e.target.value }),
                      }}
                      cardCVCInputProps={{
                        value: card.cvc,
                        onChange: (e: any) => setCard({ ...card, cvc: e.target.value }),
                      }}
                    />
                    <AntInput
                      className={styles.amount}
                      placeholder={'$150'}
                      // type="number"
                      value={amount ? formatter.format(amount) : ''}
                      // prefix={'$'}
                      onChange={(event) => {
                        setAmount(parseInt(event.target.value.replace('$', '').replace(',', '')));
                      }}
                    />
                    <Button
                      type="primary"
                      block
                      size="large"
                      className={styles.confirm}
                      onClick={submit}
                      disabled={!amount || !card.cvc || !card.number || !card.expiry}
                    >
                      Confirm payment
                    </Button>
                  </div>
                </div>
              )}
            />
          </TabPane>
          <TabPane tab="Cryptocurrencies" key="2" disabled></TabPane>
        </Tabs>
      </Spin>
    </Modal>
  );
};
