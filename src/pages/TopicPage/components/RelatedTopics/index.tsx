import { Button, List, Space, Tooltip, Typography } from 'antd';
import * as React from 'react';
import { Topic } from '../../../../interfaces/map';
import { useMemo, useState } from 'react';
import { TopicListItem } from './TopicListItem';
import { TopicSelectorModal } from './TopicSelectorModal';
import styles from './styles.module.less';
import { EditOutlined } from '@ant-design/icons';

interface Props {
  topic: Topic;
}

// TODO: link
export const RelatedTopics = ({ topic }: Props) => {
  const [showModal, setShowModal] = useState<null | string>(null);

  const [dependentOn, requiredBy] = useMemo(() => {
    return [Object.values(topic.dependentOn || {}), Object.values(topic.requiredBy || {})];
  }, [topic]);

  return (
    <>
      <Space direction="vertical" size={16}>
        <div>
          <div className={styles.titleRow}>
            <span>
              <Typography.Title level={5}>Dependencies</Typography.Title>
              <small>
                <Typography.Text type="secondary">
                  Required for the progress of this topic.
                </Typography.Text>
              </small>
            </span>
            <Tooltip title="Edit">
              <Button
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => setShowModal('dependentOn')}
              />
            </Tooltip>
          </div>

          {dependentOn.map((item) => (
            <TopicListItem key={item.id} topicId={item.id} boardId={topic.boardId} />
          ))}
        </div>
        <div>
          <div className={styles.titleRow}>
            <span>
              <Typography.Title level={5}>Consequences</Typography.Title>
              <small>
                <Typography.Text type="secondary">
                  Achieved with the progress of this topic.
                </Typography.Text>
              </small>
            </span>
            <Tooltip title="Edit">
              <Button
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => setShowModal('requiredBy')}
              />
            </Tooltip>
          </div>

          {requiredBy.map((item) => (
            <TopicListItem key={item.id} topicId={item.id} boardId={topic.boardId} />
          ))}
        </div>
      </Space>
      <TopicSelectorModal
        isOpen={showModal}
        close={() => setShowModal(null)}
        values={showModal === 'dependentOn' ? dependentOn : requiredBy}
        topic={topic}
      />
    </>
  );
};
