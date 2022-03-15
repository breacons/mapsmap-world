import * as React from 'react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCurrentTopicVersion } from '../../hooks/use-topics';
import { Button, Col, Divider, List, Progress, Row, Space, Typography } from 'antd';
import { Project, Topic, TopicVersion } from '../../interfaces/map';
import { ProjectModal } from '../TopicPage/components/TopicProjects/ProjectModal';
import { DonationModal } from './components/DonationModal';
import TopicLayout from '../../components/Layout/TopicLayout';
import styles from './style.module.less';
import { EditOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import _ from 'lodash';
import dayjs from 'dayjs';
import CommentsSection from '../../components/CommentsSection';
import Description from '../../components/Description';
import { SpinnerOverlay } from '../../components/SpinnerOverlay';
import If from '../../components/If';
import { PageTitle } from '../../components/Header';
import { useProfile } from '../../hooks/use-user';
import { useAppDispatch } from '../../redux/store';
import { followProject } from '../../service/topics';
interface Props {}

export const ProjectPage = (props: Props) => {
  const [selectedProject, setSelectedProject] = useState<null | Partial<Project>>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const profile = useProfile();
  const dispatch = useAppDispatch();

  const { boardId, projectId, versionId, topicId } = useParams();
  const { version, topic } = useCurrentTopicVersion() as { version: TopicVersion; topic: Topic };

  const project = useMemo(() => {
    if (!version || !version.projects || !projectId) {
      return null;
    }

    return version?.projects[projectId];
  }, [version]) as Project;

  const isFollowed = useMemo(() => {
    if (!project) {
      return false;
    }

    return Object.keys(profile.followedProjects || {}).includes(project.id);
  }, [profile.followedProjects, project]);

  const backings = useMemo(() => {
    if (!project) {
      return [];
    }

    return _.orderBy(Object.values(project.backings || {}), 'time')
      .reverse()
      .slice(0, 5);
  }, [project]);

  const onFollowClick = (follow: boolean) => {
    dispatch(followProject({ project, follow }));
  };

  return (
    <TopicLayout backTo="topic">
      <PageTitle title={project?.title} />
      <SpinnerOverlay spinning={!project || !version || !project} />
      <If
        condition={topic}
        then={() => (
          <>
            <div
              className={styles.cover}
              style={{
                backgroundImage: project.coverImageUrl
                  ? `url("${project.coverImageUrl}")`
                  : 'linear-gradient( 109.6deg,  rgba(61,245,167,1) 11.2%, rgba(9,111,224,1) 91.1% )',
              }}
            />
            <Space direction="vertical" size={6}>
              <Typography.Text strong className={styles.subTitle}>
                {project.organisation} &nbsp;∙&nbsp; {topic?.title}
              </Typography.Text>
              <Typography.Title level={1}>{project.title}</Typography.Title>
            </Space>
            <div className={styles.buttonsRow}>
              <Button onClick={() => setSelectedProject(project)} icon={<EditOutlined />}>
                Edit project
              </Button>
              <Button
                onClick={() => onFollowClick(!isFollowed)}
                icon={isFollowed ? <HeartFilled /> : <HeartOutlined />}
              >
                Follow project
              </Button>
            </div>
            <Divider />
            <Row gutter={24}>
              <Col span={15}>
                <Description text={project.content} fullHeight />
                <Divider />
                <CommentsSection
                  comments={project.comments}
                  startPath={`boards/${boardId}/topics/${topicId}/versions/${versionId}/projects/${projectId}/comments`}
                />
              </Col>
              <Col span={8} offset={1}>
                <Space direction="vertical" size={14} style={{ width: '100%' }}>
                  <div>
                    <Progress
                      strokeColor="#74FBFD"
                      showInfo={false}
                      percent={Math.round(
                        ((project.raisedFunding || 0) * 100) / (project.requiredFunding || 1),
                      )}
                    />
                    <Typography.Title level={1} className={styles.pledgedAmount}>
                      US$ {(project.raisedFunding || 0).toLocaleString()}
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      pledged of US$ {(project.requiredFunding || 0).toLocaleString()} goal
                    </Typography.Text>
                  </div>
                  <Row>
                    <Col span={12}>
                      <Typography.Title level={1} className={styles.count}>
                        {Object.keys(project.backings || {}).length}
                      </Typography.Title>
                      <Typography.Text type="secondary">backers</Typography.Text>
                    </Col>
                    <Col span={12}>
                      <Typography.Title level={1} className={styles.count}>
                        {26}
                      </Typography.Title>
                      <Typography.Text type="secondary">days to go</Typography.Text>
                    </Col>
                  </Row>

                  <Button
                    onClick={() => setShowDonationModal(true)}
                    block
                    type="primary"
                    size="large"
                    style={{ marginTop: 24 }}
                  >
                    Back this project
                  </Button>
                </Space>
                <Divider />
                <Typography.Title level={4}>Recent Supporters</Typography.Title>
                <List
                  itemLayout="horizontal"
                  dataSource={backings}
                  footer={<Button block>Show more</Button>}
                  renderItem={(backing) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <span>
                            <strong>${backing.amount}</strong> - {backing.userName}
                          </span>
                        }
                        description={dayjs.unix(backing.time).format('YYYY. MM. DD. HH:mm')}
                      />
                    </List.Item>
                  )}
                />
              </Col>
            </Row>

            <ProjectModal
              topic={topic}
              version={version}
              project={selectedProject}
              closeModal={() => setSelectedProject(null)}
            />
            <DonationModal
              show={showDonationModal}
              closeModal={() => setShowDonationModal(false)}
              topic={topic}
              version={version}
              project={project}
            />
          </>
        )}
      />
    </TopicLayout>
  );
};
