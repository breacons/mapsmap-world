import { Space, Typography } from 'antd';
import * as React from 'react';
import { useState } from 'react';
import { Topic } from '../../../../interfaces/map';
import { updateTopic } from '../../../../service/topics';
import { useAppDispatch } from '../../../../redux/store';
import { useSelector } from 'react-redux';
import { getLevelIndex, getResearchAreaById, getTechnologyById } from '../../../../redux/selectors';
import styles from './style.module.less';
interface Props {
  topic: Topic;
}

export const EditableTopicTitle = ({ topic }: Props) => {
  const [editableStr, setEditableStr] = useState(topic.title);
  const dispatch = useAppDispatch();

  const technology = useSelector(getTechnologyById(topic.technologyId));
  const area = useSelector(getResearchAreaById(technology?.areaId));
  const levelIndex = useSelector(getLevelIndex(topic.levelId));

  return (
    <Space direction="vertical" size={6}>
      <Typography.Text strong className={styles.subTitle}>
        {area?.title} &nbsp;∙&nbsp; {technology?.title} &nbsp;∙&nbsp; Level #{(levelIndex || 0) + 1}
      </Typography.Text>
      <Typography.Title level={1}>{editableStr}</Typography.Title>
    </Space>
  );
};
