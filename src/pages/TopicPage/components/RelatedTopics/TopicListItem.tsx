import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useTopic } from '../../../../hooks/use-topics';
import If from '../../../../components/If';
import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import styles from './styles.module.less';

interface Props {
  boardId: string;
  topicId: string;
}

export const TopicListItem = ({ boardId, topicId }: Props) => {
  const { topic, isLoaded, isEmpty } = useTopic(boardId, topicId);
  return (
    <If
      condition={!isLoaded}
      then={() => <Skeleton />}
      else={() => (
        <Link to={`/boards/${boardId}/topics/${topicId}`}>
          <Tag className={styles.tag}>{topic.title || topic.id}</Tag>
        </Link>
      )}
    />
  );
};
