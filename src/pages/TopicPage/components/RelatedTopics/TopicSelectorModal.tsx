import * as React from 'react';
import { Button, Modal, Select, Space, Tag } from 'antd';
import { useCurrentBoard } from '../../../../hooks/use-boards';
import If from '../../../../components/If';
import { useEffect, useState } from 'react';
import { Topic } from '../../../../interfaces/map';
import { useAppDispatch } from '../../../../redux/store';
import { setDependenciesToTopic } from '../../../../service/topics';
import styles from '../TopicMilestones/styles.module.less';

const { Option } = Select;

interface Props {
  isOpen: null | string;
  close: () => void;
  values: { id: string }[];
  topic: Topic;
}

// TODO: add description
export const TopicSelectorModal = ({ isOpen, close, values, topic }: Props) => {
  const [dependencies, setDependencies] = useState(values.map((e) => e.id));
  const dispatch = useAppDispatch();

  useEffect(() => {
    setDependencies(values.map((e) => e.id));
  }, [values]);

  const { board } = useCurrentBoard();
  const handleSubmit = async () => {
    await dispatch(
      setDependenciesToTopic({ topic, dependencies, dependencyType: isOpen as string }),
    );

    close();
  };

  return (
    <Modal
      title={`Configure ${isOpen === 'dependentOn' ? 'Dependencies' : 'Consequences'}`}
      visible={!!isOpen}
      footer={null}
      centered
      onCancel={close}
    >
      <Select
        value={dependencies}
        style={{ width: '100%' }}
        onChange={setDependencies}
        mode="multiple"
        showArrow
        filterOption={(input, option: any) => {
          console.log({ input, option });
          if (!input || !option || option === undefined) {
            return false;
          }
          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }}
      >
        {Object.values(board?.topics || {})
          .filter((t) => t.id !== topic.id)
          .map((t) => (
            <Option value={t.id} key={t.id}>
              {t.title}
            </Option>
          ))}
      </Select>
      <br />
      <br />
      <Space direction="horizontal" size={16} className={styles.footer}>
        <Button type="default" htmlType="submit" onClick={close}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
          Save
        </Button>
      </Space>
    </Modal>
  );
};
