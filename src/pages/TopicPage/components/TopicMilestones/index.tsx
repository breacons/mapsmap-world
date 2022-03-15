import { Badge, Button, Timeline, Typography } from 'antd';
import * as React from 'react';
import { Milestone, Topic, TopicVersion } from '../../../../interfaces/map';
import { useMemo, useState } from 'react';
import _ from 'lodash';
import { MilestoneModal } from './MilestoneModal';
import dayjs from 'dayjs';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './styles.module.less';

interface Props {
  topic: Topic;
  version: TopicVersion;
}

const color = {
  open: 'red',
  inProgress: 'blue',
  finished: 'green',
} as Record<string, string>;

// TODO: empty state
export const TopicMilestones = ({ topic, version }: Props) => {
  const [selectedMilestone, setSelectedMilestone] = useState<null | Partial<Milestone>>(null);

  const milestones = useMemo(() => {
    return _.sortBy(Object.values(version.milestones || {}), 'deadline');
  }, [version.milestones]);

  const completedMilestonesCount = useMemo(() => {
    return milestones.filter((milestone) => milestone.status === 'finished').length;
  }, [milestones]);

  return (
    <>
      <div className={styles.titleRow}>
        <span>
          <Typography.Title level={5}>Milestones</Typography.Title>
          <small>
            <Typography.Text type="secondary">The progress of this topic.</Typography.Text>
          </small>
        </span>
        <Badge
          count={`${completedMilestonesCount} / ${milestones.length}`}
          style={{ backgroundColor: '#52c41a' }}
        />
      </div>
      <Timeline>
        {milestones.map((milestone) => (
          <Timeline.Item key={milestone.id} color={color[milestone.status]}>
            <div className={styles.milestoneItem}>
              <span>
                <Typography.Text>{milestone.title}</Typography.Text>
                <br />
                <small>
                  <Typography.Text type="secondary">
                    {dayjs.unix(milestone.deadline).format('YYYY. MM. DD.')}
                  </Typography.Text>
                </small>
              </span>
              <Button size="small" onClick={() => setSelectedMilestone(milestone)} shape="circle">
                <MoreOutlined />
              </Button>
            </div>
          </Timeline.Item>
        ))}
        <Timeline.Item>
          <Button onClick={() => setSelectedMilestone({ id: 'NEW' })}>
            <PlusOutlined /> New milestone
          </Button>
        </Timeline.Item>
      </Timeline>
      <MilestoneModal
        topic={topic}
        version={version}
        milestone={selectedMilestone}
        closeModal={() => setSelectedMilestone(null)}
      />
    </>
  );
};
