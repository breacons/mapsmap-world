import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCurrentTopicVersion, useTopic } from '../../hooks/use-topics';
import { TopicLayout } from '../../components/Layout/TopicLayout';
import { EditableTopicTitle } from './components/EditableTopicTitle';
import { EditableTopicContent } from './components/EditableTopicContent';
import { useMemo } from 'react';
import { TopicVersionSelector } from './components/TopicVersionSelector';
import { Col, Divider, Row, Space } from 'antd';
import { RelatedTopics } from './components/RelatedTopics';
import { TopicMilestones } from './components/TopicMilestones';
import { TopicProjects } from './components/TopicProjects';
import styles from './style.module.less';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CommentsSection from '../../components/CommentsSection';
import { SpinnerOverlay } from '../../components/SpinnerOverlay';
import If from '../../components/If';
import { Board } from '../../interfaces/map';
import { PageTitle } from '../../components/Header';

interface Props {}

export const TopicPage = (props: Props) => {
  const { topicId, boardId, versionId } = useParams();

  const { topic, isLoaded, isEmpty } = useTopic(boardId as string, topicId as string);
  const { version } = useCurrentTopicVersion();

  const currentVersionId = useMemo(() => {
    if (!topic) {
      return '';
    }

    return versionId || topic.mainVersionId;
  }, [topic, versionId]);

  if (!topic) {
    return <SpinnerOverlay spinning={true} />;
  }

  if (!version || !Object.keys(topic.versions || {}).includes(currentVersionId)) {
    return <div>Version not found</div>;
  }

  return (
    <TopicLayout backTo="map">
      <PageTitle title={topic?.title} />
      <SpinnerOverlay spinning={!topic} />
      <If
        condition={topic}
        then={() => (
          <>
            <div className={styles.cover} />
            <EditableTopicTitle topic={topic} />
            <TopicVersionSelector topic={topic} versionId={currentVersionId} />
            <Divider />

            <Row gutter={24}>
              <Col md={15} sm={24}>
                <EditableTopicContent topic={topic} versionId={currentVersionId} />
                <Divider />
                <TopicProjects topic={topic} version={version} />
                <Divider />
                <CommentsSection
                  comments={version.comments}
                  startPath={`boards/${boardId}/topics/${topicId}/versions/${currentVersionId}/comments`}
                />
              </Col>
              <Col md={8} offset={1} sm={24}>
                <RelatedTopics topic={topic} />
                <Divider />
                <TopicMilestones version={version} topic={topic} />
                <Divider />
              </Col>
            </Row>
          </>
        )}
      />
    </TopicLayout>
  );
};
