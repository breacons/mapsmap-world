import * as React from 'react';
import { Project, Topic, TopicVersion } from '../../../../interfaces/map';
import { useAppDispatch } from '../../../../redux/store';
import { nanoid } from 'nanoid';
import { updateMilestone, updateProject } from '../../../../service/topics';
import { Button, Modal, Space } from 'antd';
import { Form } from '../../../../components/Form';
import { Field } from 'react-final-form';
import Input, { TextArea } from '../../../../components/Form/Input';
import DatePicker from '../../../../components/Form/DatePicker';
import Select, { Option } from '../../../../components/Form/Select';
import { validateSchema } from '../../../../components/Form/validation';
import { joi } from '../../../../lib/joi';
import InputNumber from '../../../../components/Form/InputNumber';
import styles from '../TopicMilestones/styles.module.less';

interface Props {
  topic: Topic;
  version: TopicVersion;
  project: null | Partial<Project>;
  closeModal: () => void;
}

const validator = validateSchema(
  joi
    .object({
      title: joi.string().required(),
      organisation: joi.string().required(),
      content: joi.string().required(),
      requiredFunding: joi.number().required(),
    })
    .unknown(),
);

export const ProjectModal = ({ topic, version, project, closeModal }: Props) => {
  const dispatch = useAppDispatch();

  const submit = async (values: any) => {
    const updatedProject = {
      ...project,
      ...values,
      id: !project || project?.id === 'NEW' ? nanoid() : project?.id,
    };

    await dispatch(updateProject({ topic, version, project: updatedProject }));
    closeModal();
  };

  return (
    <Modal title="Project Details" visible={!!project} footer={null} onCancel={closeModal} centered>
      <Form validator={validator} onSubmit={submit} initialValues={project || {}}>
        {({ valid }) => (
          <>
            <Field id="title" name="title" component={Input} type="text" label="Project Title" />
            <Field
              id="title"
              name="organisation"
              component={Input}
              type="text"
              label="Organisation"
            />
            <Field
              id="title"
              name="coverImageUrl"
              component={Input}
              type="text"
              label="Cover Image (url)"
            />
            <Field
              id="title"
              name="content"
              component={TextArea}
              type="text"
              label="Description"
              style={{ height: 220 }}
            />
            <Field
              id="title"
              name="requiredFunding"
              component={InputNumber}
              type="text"
              label="Crowdfunding Goal"
              addonBefore="USD"
              style={{ width: '100%' }}
            />

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
