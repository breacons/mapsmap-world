import { Button, Divider, Modal, Space } from 'antd';
import * as React from 'react';
import { Milestone, Topic, TopicVersion } from '../../../../interfaces/map';
import { Form } from '../../../../components/Form';
import { joi } from '../../../../lib/joi';
import { validateSchema } from '../../../../components/Form/validation';
import { Field } from 'react-final-form';
import Input from '../../../../components/Form/Input';
import DatePicker from '../../../../components/Form/DatePicker';
import Select, { Option } from '../../../../components/Form/Select';
import { useAppDispatch } from '../../../../redux/store';
import { updateMilestone } from '../../../../service/topics';
import { nanoid } from 'nanoid';
import styles from './styles.module.less';

interface Props {
  topic: Topic;
  version: TopicVersion;
  milestone: Partial<Milestone> | null;
  closeModal: () => void;
}

const validator = validateSchema(
  joi
    .object({
      title: joi.string().required(),
      deadline: joi.number().required(),
      status: joi.string().required(),
    })
    .unknown(),
);

export const MilestoneModal = ({ milestone, closeModal, topic, version }: Props) => {
  const dispatch = useAppDispatch();

  const submit = async (values: any) => {
    const updatedMilestone = {
      ...milestone,
      ...values,
      id: !milestone || milestone?.id === 'NEW' ? nanoid() : milestone?.id,
    };

    await dispatch(updateMilestone({ topic, version, milestone: updatedMilestone }));
    closeModal();
  };

  return (
    <Modal
      title="Milestone Details"
      visible={!!milestone}
      onCancel={closeModal}
      centered
      footer={null}
    >
      <Form validator={validator} onSubmit={submit} initialValues={milestone || {}}>
        {({ valid }) => (
          <>
            <Field id="title" name="title" component={Input} type="text" label="Title" />
            <Field
              id="deadline"
              name="deadline"
              component={DatePicker}
              type="text"
              label="Scheduled Deadline"
            />
            <Field id="status" name="status" component={Select} type="text" label="Current Status">
              <Option value="open">Open</Option>
              <Option value="inProgress">In Progress</Option>
              <Option value="finished">Finished</Option>
            </Field>
            <Space direction="horizontal" size={16} className={styles.footer}>
              <Button type="default" htmlType="submit" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" disabled={!valid}>
                Save
              </Button>
            </Space>
          </>
        )}
      </Form>
    </Modal>
  );
};
